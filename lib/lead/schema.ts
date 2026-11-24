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
  address: z.string().check(
    z.trim(),
    z.minLength(5, "Please enter your street address or 5-digit ZIP code."),
    z.maxLength(LIMITS.address, "Address is too long."),
  ),
  /** Service location from the coverage selects. "Not listed" submits as "other". Optional. */
  serviceState: z.optional(z.string().check(z.trim(), z.maxLength(LIMITS.place, "Please choose a state from the list."))),
  serviceCity: z.optional(z.string().check(z.trim(), z.maxLength(LIMITS.place, "Please choose a city from the list."))),
  serviceType: z.enum(serviceTypes, "Please choose a service."),
  urgency: z.enum(urgencies, "Please choose how soon you need service."),
  preferredTime: z.union([z.literal(""), z.enum(preferredTimes)]),
  message: z.string().check(z.maxLength(LIMITS.message, `Please keep your message under ${LIMITS.message} characters.`)),
  smsConsent: z.boolean(),
  /** Honeypot: must be empty. Real users never see this field. */
  website: z.string().check(z.maxLength(200)),
  pageUrl: z.string().check(z.maxLength(LIMITS.pageUrl)),
  turnstileToken: z.optional(z.string().check(z.maxLength(4096))),
});

export type LeadInput = z.infer<typeof leadSchema>;
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
  | { ok: true; mode: "delivered" }
  | { ok: true; mode: "dev"; message: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };
