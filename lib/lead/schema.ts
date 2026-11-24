import * as z from "zod/mini";
import { normalizeUsPhone } from "@/lib/format";
import { LIMITS, preferredTimes, serviceTypes, urgencies } from "./constants";

/**
 * Single lead schema used by the browser form (instant feedback) and the API (authoritative).
 * zod/mini keeps the client bundle small.
 */
export const leadSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(2, "Please enter your full name."),
    z.maxLength(LIMITS.name, "Name is too long."),
  ),
  phone: z.string().check(
    z.trim(),
    z.refine((v) => normalizeUsPhone(v) !== null, "Please enter a valid 10-digit US phone number."),
  ),
  email: z.union([
    z.literal(""),
    z.string().check(z.trim(), z.maxLength(LIMITS.email, "Email is too long."), z.email("Please enter a valid email address.")),
  ]),
  zip: z.string().check(z.trim(), z.regex(/^\d{5}$/, "Please enter a 5-digit ZIP code.")),
  street: z.string().check(z.trim(), z.maxLength(LIMITS.address, "Street address is too long.")),
  /** Service location from the coverage selects. "Not listed" submits as "other". Optional. */
  serviceState: z.optional(z.string().check(z.trim(), z.maxLength(LIMITS.place, "Please choose a state from the list."))),
  serviceCity: z.optional(z.string().check(z.trim(), z.maxLength(LIMITS.place, "Please choose a city from the list."))),
  serviceType: z.enum(serviceTypes, "Please choose a service."),
  urgency: z.enum(urgencies, "Please choose how soon you need service."),
  preferredTime: z.union([z.literal(""), z.enum(preferredTimes)]),
  /** Optional preferred date, YYYY-MM-DD from a native date input. */
  preferredDate: z.union([z.literal(""), z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date."))]),
  message: z.string().check(z.maxLength(LIMITS.message, `Please keep your message under ${LIMITS.message} characters.`)),
  smsConsent: z.boolean(),
  /** Honeypot: must be empty. Real users never see this field. */
  website: z.string().check(z.maxLength(200)),
  pageUrl: z.string().check(z.maxLength(LIMITS.pageUrl)),
  /** Attribution (optional): document.referrer and URL params. */
  referrer: z.optional(z.string().check(z.maxLength(LIMITS.tracking))),
  utmSource: z.optional(z.string().check(z.maxLength(LIMITS.tracking))),
  utmMedium: z.optional(z.string().check(z.maxLength(LIMITS.tracking))),
  utmCampaign: z.optional(z.string().check(z.maxLength(LIMITS.tracking))),
  gclid: z.optional(z.string().check(z.maxLength(LIMITS.tracking))),
  turnstileToken: z.optional(z.string().check(z.maxLength(4096))),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Blog checklist signup (POST /api/lead with source "checklist"). Email only, never SMS. */
export const checklistSchema = z.object({
  source: z.literal("checklist"),
  email: z.string().check(z.trim(), z.maxLength(LIMITS.email, "Email is too long."), z.email("Please enter a valid email address.")),
  consent: z.literal(true, "Please confirm you agree to receive the checklist."),
  website: z.string().check(z.maxLength(200)),
  pageUrl: z.string().check(z.maxLength(LIMITS.pageUrl)),
  turnstileToken: z.optional(z.string().check(z.maxLength(4096))),
});
export type ChecklistInput = z.infer<typeof checklistSchema>;
export type ChecklistErrors = Partial<Record<"email" | "consent", string>>;
export type LeadField = keyof LeadInput;
export type FieldErrors = Partial<Record<LeadField, string>>;

const isLeadField = (key: PropertyKey | undefined): key is LeadField =>
  typeof key === "string" && Object.hasOwn(leadSchema.shape, key);

export function fieldErrors(error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] }): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (isLeadField(key)) out[key] ??= issue.message;
  }
  return out;
}

/** Response contract of POST /api/lead. */
export type LeadResponse =
  | { ok: true; mode: "delivered"; reference?: string }
  | { ok: true; mode: "dev"; message: string; reference?: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors; checklistErrors?: ChecklistErrors };
