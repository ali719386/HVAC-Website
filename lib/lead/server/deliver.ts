import { createHmac, randomUUID } from "node:crypto";
import { Resend } from "resend";
import { formatUsPhone } from "@/lib/format";
import {
  SMS_CONSENT_VERSION,
  preferredTimeLabels,
  serviceTypeLabels,
  smsConsentText,
  urgencyLabels,
} from "@/lib/lead/constants";
import type { LeadInput } from "@/lib/lead/schema";

export type LeadRecord = {
  id: string;
  receivedAt: string;
  brand: string;
  company: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  email: string | null;
  address: string;
  serviceType: string;
  serviceLabel: string;
  urgency: string;
  urgencyLabel: string;
  preferredTime: string | null;
  message: string | null;
  consent: { sms: boolean; textVersion: string; text: string; timestamp: string };
  pageUrl: string;
};

export function buildRecord(input: LeadInput, phoneE164: string, brand: { slug: string; name: string }): LeadRecord {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    receivedAt: now,
    brand: brand.slug,
    company: brand.name,
    name: input.name,
    phone: phoneE164,
    phoneDisplay: formatUsPhone(phoneE164),
    email: input.email || null,
    address: input.address,
    serviceType: input.serviceType,
    serviceLabel: serviceTypeLabels[input.serviceType],
    urgency: input.urgency,
    urgencyLabel: urgencyLabels[input.urgency],
    preferredTime: input.preferredTime ? preferredTimeLabels[input.preferredTime] : null,
    message: input.message.trim() || null,
    consent: {
      sms: input.smsConsent,
      textVersion: SMS_CONSENT_VERSION,
      text: smsConsentText(brand.name),
      timestamp: now,
    },
    pageUrl: input.pageUrl,
  };
}

/* ------------------------------ Channels ------------------------------ */

export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  const to = process.env.LEAD_TO_EMAIL?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return apiKey && from && to?.length ? { apiKey, from, to } : null;
}

export function webhookConfig() {
  const url = process.env.LEAD_WEBHOOK_URL;
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  // A webhook is only used when it can be signed.
  return url && secret ? { url, secret } : null;
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

function rows(r: LeadRecord): [string, string][] {
  return [
    ["Name", r.name],
    ["Phone", r.phoneDisplay],
    ["Email", r.email ?? "-"],
    ["Address / ZIP", r.address],
    ["Service", r.serviceLabel],
    ["Urgency", r.urgencyLabel],
    ["Preferred time", r.preferredTime ?? "No preference"],
    ["Message", r.message ?? "-"],
    ["SMS consent", r.consent.sms ? "YES" : "No"],
    ["Consent text version", r.consent.textVersion],
    ["Submitted at (UTC)", r.consent.timestamp],
    ["Page URL", r.pageUrl || "-"],
    ["Lead ID", r.id],
  ];
}

export function renderEmail(r: LeadRecord) {
  const subject = oneLine(`New lead (${r.urgencyLabel}): ${r.serviceLabel} - ${r.name}`).slice(0, 200);
  const tableRows = rows(r)
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</th>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const consentNote = r.consent.sms
    ? `<p style="font-size:13px;color:#4b5563">Consent text shown (${escapeHtml(r.consent.textVersion)}): ${escapeHtml(r.consent.text)}</p>`
    : "";
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111827">` +
    `<h2 style="margin:0 0 12px">New website lead for ${escapeHtml(r.company)}</h2>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">${tableRows}</table>` +
    `${consentNote}</div>`;
  const text = rows(r)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return { subject, html, text };
}

export async function sendEmail(r: LeadRecord, cfg: NonNullable<ReturnType<typeof emailConfig>>): Promise<void> {
  const resend = new Resend(cfg.apiKey);
  const { subject, html, text } = renderEmail(r);
  const { error } = await resend.emails.send({
    from: cfg.from,
    to: cfg.to,
    subject,
    html,
    text,
    replyTo: r.email ?? undefined,
    headers: { "X-Entity-Ref-ID": r.id },
  });
  if (error) throw new Error(`Resend: ${error.name}: ${error.message}`);
}

/**
 * POSTs the lead as JSON. Signature: HMAC-SHA256 (hex) of `${timestamp}.${rawBody}` using
 * LEAD_WEBHOOK_SECRET, sent as `X-Lead-Signature: sha256=<hex>` with `X-Lead-Timestamp`.
 */
export async function sendWebhook(r: LeadRecord, cfg: NonNullable<ReturnType<typeof webhookConfig>>): Promise<void> {
  const body = JSON.stringify({ event: "lead.created", lead: r });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", cfg.secret).update(`${timestamp}.${body}`).digest("hex");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Lead-Timestamp": timestamp,
      "X-Lead-Signature": `sha256=${signature}`,
      "X-Lead-Id": r.id,
    },
    body,
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}
