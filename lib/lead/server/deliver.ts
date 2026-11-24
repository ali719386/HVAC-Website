import { createHmac, randomBytes, randomUUID } from "node:crypto";
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
  /** Short reference shown to the customer and in the email subject. */
  reference: string;
  receivedAt: string;
  brand: string;
  company: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  email: string | null;
  zip: string;
  street: string | null;
  /** From the coverage selects; null when not chosen, "Not listed" for the other option. */
  serviceState: string | null;
  serviceCity: string | null;
  serviceType: string;
  serviceLabel: string;
  urgency: string;
  urgencyLabel: string;
  preferredTime: string | null;
  preferredDate: string | null;
  message: string | null;
  consent: { sms: boolean; textVersion: string; text: string; timestamp: string };
  pageUrl: string;
  attribution: { referrer: string | null; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; gclid: string | null };
};

/** Short, readable reference (no ambiguous characters), e.g. "R-7K3M9Q". */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function leadReference() {
  const bytes = randomBytes(6);
  return `R-${[...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}

/** "other" is the form's "Not listed" option. */
const placeLabel = (v: string | undefined) => (v === "other" ? "Not listed" : v || null);

export function buildRecord(input: LeadInput, phoneE164: string, brand: { slug: string; name: string }): LeadRecord {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    reference: leadReference(),
    receivedAt: now,
    brand: brand.slug,
    company: brand.name,
    name: input.name,
    phone: phoneE164,
    phoneDisplay: formatUsPhone(phoneE164),
    email: input.email || null,
    zip: input.zip,
    street: input.street.trim() || null,
    serviceState: placeLabel(input.serviceState),
    serviceCity: placeLabel(input.serviceCity),
    serviceType: input.serviceType,
    serviceLabel: serviceTypeLabels[input.serviceType],
    urgency: input.urgency,
    urgencyLabel: urgencyLabels[input.urgency],
    preferredTime: input.preferredTime ? preferredTimeLabels[input.preferredTime] : null,
    preferredDate: input.preferredDate || null,
    message: input.message.trim() || null,
    consent: {
      sms: input.smsConsent,
      textVersion: SMS_CONSENT_VERSION,
      text: smsConsentText(brand.name),
      timestamp: now,
    },
    pageUrl: input.pageUrl,
    attribution: {
      referrer: input.referrer?.trim() || null,
      utmSource: input.utmSource?.trim() || null,
      utmMedium: input.utmMedium?.trim() || null,
      utmCampaign: input.utmCampaign?.trim() || null,
      gclid: input.gclid?.trim() || null,
    },
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

/** What every channel sends: an email (subject + table rows) and a signed webhook event. */
export type Delivery = {
  id: string;
  company: string;
  subject: string;
  heading: string;
  rows: [string, string][];
  replyTo: string | null;
  /** Shown under the table when SMS consent was given. */
  note?: string;
  event: "lead.created" | "checklist.requested";
  /** Webhook payload body under `lead`. */
  data: unknown;
};

export function leadDelivery(r: LeadRecord): Delivery {
  return {
    id: r.id,
    company: r.company,
    subject: oneLine(`New lead ${r.reference} (${r.urgencyLabel}): ${r.serviceLabel} - ${r.name}`).slice(0, 200),
    heading: `New website lead for ${r.company}`,
    rows: [
      ["Name", r.name],
      ["Phone", r.phoneDisplay],
      ["Email", r.email ?? "-"],
      ["Reference", r.reference],
      ["ZIP", r.zip],
      ["Street", r.street ?? "-"],
      ["Service state", r.serviceState ?? "-"],
      ["Service city", r.serviceCity ?? "-"],
      ["Service", r.serviceLabel],
      ["Urgency", r.urgencyLabel],
      ["Preferred time", r.preferredTime ?? "No preference"],
      ["Preferred date", r.preferredDate ?? "-"],
      ["Message", r.message ?? "-"],
      ["SMS consent", r.consent.sms ? "YES" : "No"],
      ["Consent text version", r.consent.textVersion],
      ["Submitted at (UTC)", r.consent.timestamp],
      ["Page URL", r.pageUrl || "-"],
      ["Referrer", r.attribution.referrer ?? "-"],
      ["UTM source / medium / campaign", [r.attribution.utmSource, r.attribution.utmMedium, r.attribution.utmCampaign].map((v) => v ?? "-").join(" / ")],
      ["gclid", r.attribution.gclid ?? "-"],
      ["Lead ID", r.id],
    ],
    replyTo: r.email,
    note: r.consent.sms ? `Consent text shown (${r.consent.textVersion}): ${r.consent.text}` : undefined,
    event: "lead.created",
    data: r,
  };
}

/** Blog checklist request: email only, never SMS. */
export type ChecklistRecord = {
  id: string;
  receivedAt: string;
  brand: string;
  company: string;
  source: "checklist";
  email: string;
  consent: { email: boolean; text: string; timestamp: string };
  pageUrl: string;
};

export function buildChecklistRecord(
  input: { email: string; consentText: string; pageUrl: string },
  brand: { slug: string; name: string },
): ChecklistRecord {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    receivedAt: now,
    brand: brand.slug,
    company: brand.name,
    source: "checklist",
    email: input.email,
    consent: { email: true, text: input.consentText, timestamp: now },
    pageUrl: input.pageUrl,
  };
}

export function checklistDelivery(r: ChecklistRecord): Delivery {
  return {
    id: r.id,
    company: r.company,
    subject: oneLine(`Checklist request - ${r.email}`).slice(0, 200),
    heading: `New checklist request for ${r.company}`,
    rows: [
      ["Source", "Blog checklist signup"],
      ["Email", r.email],
      ["Email consent", r.consent.email ? "YES" : "No"],
      ["Consent text shown", r.consent.text],
      ["Submitted at (UTC)", r.consent.timestamp],
      ["Page URL", r.pageUrl || "-"],
      ["Request ID", r.id],
    ],
    replyTo: r.email,
    event: "checklist.requested",
    data: r,
  };
}

export function renderEmail(d: Delivery) {
  const tableRows = d.rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</th>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const note = d.note ? `<p style="font-size:13px;color:#4b5563">${escapeHtml(d.note)}</p>` : "";
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111827">` +
    `<h2 style="margin:0 0 12px">${escapeHtml(d.heading)}</h2>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">${tableRows}</table>` +
    `${note}</div>`;
  const text = d.rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { subject: d.subject, html, text };
}

export async function sendEmail(d: Delivery, cfg: NonNullable<ReturnType<typeof emailConfig>>): Promise<void> {
  const resend = new Resend(cfg.apiKey);
  const { subject, html, text } = renderEmail(d);
  const { error } = await resend.emails.send({
    from: cfg.from,
    to: cfg.to,
    subject,
    html,
    text,
    replyTo: d.replyTo ?? undefined,
    headers: { "X-Entity-Ref-ID": d.id },
  });
  if (error) throw new Error(`Resend: ${error.name}: ${error.message}`);
}

/**
 * POSTs the event as JSON. Signature: HMAC-SHA256 (hex) of `${timestamp}.${rawBody}` using
 * LEAD_WEBHOOK_SECRET, sent as `X-Lead-Signature: sha256=<hex>` with `X-Lead-Timestamp`.
 */
export async function sendWebhook(d: Delivery, cfg: NonNullable<ReturnType<typeof webhookConfig>>): Promise<void> {
  const body = JSON.stringify({ event: d.event, lead: d.data });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", cfg.secret).update(`${timestamp}.${body}`).digest("hex");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Lead-Timestamp": timestamp,
      "X-Lead-Signature": `sha256=${signature}`,
      "X-Lead-Id": d.id,
    },
    body,
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}