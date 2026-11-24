import * as z from "zod/mini";
import { getBrand } from "@/lib/brand";
import { aiEnabled, askAi } from "@/lib/chat-ai";
import { checkRateLimit, clientIp } from "@/lib/lead/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Reply shape. ok:false means "use the scripted assistant instead" (the browser falls back silently). */
export type ChatApiResponse = { ok: true; text: string; links: { label: string; href: string }[]; handoff: boolean } | { ok: false };

const MAX_BODY = 8_000;
const CHAT_LIMIT = { prefix: "chat", max: 30 };

const turn = z.object({ role: z.enum(["user", "bot"]), text: z.string().check(z.maxLength(1500)) });
const bodySchema = z.object({
  question: z.string().check(z.trim(), z.minLength(1), z.maxLength(300)),
  history: z.array(turn).check(z.maxLength(12)),
});

function json(body: ChatApiResponse, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(req: Request) {
  const brand = getBrand();
  if (!brand.config.chatbot.enabled || !aiEnabled()) return json({ ok: false }, 503);

  // Same-origin only: the endpoint spends the site's AI quota.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  let originHost = "";
  try {
    originHost = origin ? new URL(origin).host : "";
  } catch {
    /* invalid origin header */
  }
  if (!origin || !host || originHost !== host) return json({ ok: false }, 403);

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return json({ ok: false }, 413);
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ ok: false }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false }, 400);
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return json({ ok: false }, 400);

  const limit = await checkRateLimit(clientIp(req.headers), CHAT_LIMIT);
  if (!limit.allowed) return json({ ok: false }, 429, { "Retry-After": String(limit.retryAfterSec) });

  const reply = await askAi(brand, parsed.data.history.slice(-8), parsed.data.question);
  return reply ? json({ ok: true, ...reply }, 200) : json({ ok: false }, 502);
}
