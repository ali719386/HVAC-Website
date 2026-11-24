import { getBrand } from "@/lib/brand";
import { normalizeUsPhone } from "@/lib/format";
import { LIMITS } from "@/lib/lead/constants";
import { checklistSchema, fieldErrors, leadSchema, type LeadResponse } from "@/lib/lead/schema";
import {
  buildChecklistRecord,
  buildRecord,
  checklistDelivery,
  emailConfig,
  leadDelivery,
  sendEmail,
  sendWebhook,
  webhookConfig,
  type Delivery,
} from "@/lib/lead/server/deliver";
import { checkRateLimit, clientIp } from "@/lib/lead/server/rate-limit";
import { turnstileEnabled, verifyTurnstile } from "@/lib/lead/server/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_FAIL = "We could not send your request right now. Please call us instead.";

function json(body: LeadResponse, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** Reads the body as text, aborting once it exceeds `max` bytes (works without Content-Length). */
async function readLimited(req: Request, max: number): Promise<string | null> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function POST(req: Request) {
  // Same-origin check: browsers always send Origin on cross-site POSTs.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      /* invalid origin header */
    }
    if (originHost !== host) return json({ ok: false, error: "Forbidden." }, 403);
  }

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "Unsupported content type." }, 415);
  }
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > LIMITS.bodyBytes) return json({ ok: false, error: "Request is too large." }, 413);

  const raw = await readLimited(req, LIMITS.bodyBytes);
  if (raw === null) return json({ ok: false, error: "Request is too large." }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const ip = clientIp(req.headers);
  const limit = await checkRateLimit(ip);
  if (!limit.allowed) {
    return json(
      { ok: false, error: "Too many requests. Please wait a few minutes or call us." },
      429,
      { "Retry-After": String(limit.retryAfterSec) },
    );
  }

  if (typeof payload === "object" && payload !== null && "source" in payload && payload.source === "checklist") {
    return handleChecklist(payload, ip);
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors: fieldErrors(parsed.error) }, 422);
  }
  const input = parsed.data;

  // Honeypot filled: almost certainly a bot. Reject without delivering (no fake success).
  if (input.website.trim() !== "") {
    return json({ ok: false, error: "Your request could not be processed. Please call us." }, 400);
  }

  if (turnstileEnabled() && !(await verifyTurnstile(input.turnstileToken, ip))) {
    return json({ ok: false, error: "Verification failed. Please try again or call us." }, 403);
  }

  const phone = normalizeUsPhone(input.phone);
  if (!phone) {
    return json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors: { phone: "Please enter a valid 10-digit US phone number." } }, 422);
  }

  const { config } = getBrand();
  const record = buildRecord(input, phone, { slug: config.slug, name: config.company.name });
  return deliver(leadDelivery(record), "lead");
}

/** Blog checklist signup: same rate limit, honeypot, Turnstile and delivery rules as a lead. No SMS. */
async function handleChecklist(payload: unknown, ip: string) {
  const parsed = checklistSchema.safeParse(payload);
  if (!parsed.success) {
    const errs: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "email" || key === "consent") && !errs[key]) errs[key] = issue.message;
    }
    return json({ ok: false, error: "Please correct the highlighted fields.", checklistErrors: errs }, 422);
  }
  const input = parsed.data;
  if (input.website.trim() !== "") return json({ ok: false, error: "Your request could not be processed." }, 400);
  if (turnstileEnabled() && !(await verifyTurnstile(input.turnstileToken, ip))) {
    return json({ ok: false, error: "Verification failed. Please try again." }, 403);
  }
  const { config, content } = getBrand();
  // The consent text is taken from brand copy on the server, not trusted from the browser.
  const record = buildChecklistRecord(
    { email: input.email, consentText: content.copy.blog.checklist.consent, pageUrl: input.pageUrl },
    { slug: config.slug, name: config.company.name },
  );
  return deliver(checklistDelivery(record), "checklist");
}

/** Success only if at least one configured channel succeeds; 503 when none is configured (DEV MODE logs instead). */
async function deliver(delivery: Delivery, kind: "lead" | "checklist") {
  const email = emailConfig();
  const webhook = webhookConfig();
  const channels: { name: string; run: () => Promise<void> }[] = [];
  if (email) channels.push({ name: "email", run: () => sendEmail(delivery, email) });
  if (webhook) channels.push({ name: "webhook", run: () => sendWebhook(delivery, webhook) });

  if (channels.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[${kind}] DEV MODE, not delivered. No delivery channel configured. Data:\n` + JSON.stringify(delivery.data, null, 2));
      return json(
        {
          ok: true,
          mode: "dev",
          message: "No delivery channel is configured. The request was logged to the server console only. Set Resend or webhook env vars to deliver it.",
        },
        200,
      );
    }
    console.error(`[${kind}] No delivery channel configured (RESEND_* / LEAD_WEBHOOK_*). Request was NOT delivered.`);
    return json({ ok: false, error: GENERIC_FAIL }, 503);
  }

  const results = await Promise.allSettled(channels.map((c) => c.run()));
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[${kind}] ${channels[i]?.name} delivery failed for ${delivery.id}:`, r.reason instanceof Error ? r.reason.message : r.reason);
    }
  });

  if (results.some((r) => r.status === "fulfilled")) return json({ ok: true, mode: "delivered" }, 200);
  return json({ ok: false, error: GENERIC_FAIL }, 502);
}