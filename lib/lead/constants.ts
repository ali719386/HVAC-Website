/** Lead form options and limits. Shared by client and server; keep free of heavy imports. */

export const serviceTypes = ["ac-repair", "ac-installation", "heating", "maintenance", "commercial", "duct-cleaning"] as const;
export type ServiceType = (typeof serviceTypes)[number];

export const serviceTypeLabels: Record<ServiceType, string> = {
  "ac-repair": "AC repair",
  "ac-installation": "AC installation",
  heating: "Heating",
  maintenance: "Maintenance",
  commercial: "Commercial HVAC",
  "duct-cleaning": "Duct cleaning & repair",
};

export const urgencies = ["emergency", "this-week", "flexible"] as const;
export const urgencyLabels: Record<(typeof urgencies)[number], string> = {
  emergency: "Emergency",
  "this-week": "This week",
  flexible: "Flexible",
};

export const preferredTimes = ["morning", "afternoon", "any"] as const;
export const preferredTimeLabels: Record<(typeof preferredTimes)[number], string> = {
  morning: "Morning (8 AM - 12 PM)",
  afternoon: "Afternoon (12 PM - 5 PM)",
  any: "Any time",
};

export const LIMITS = {
  name: 100,
  email: 254,
  address: 200,
  /** State and city select values. */
  place: 100,
  message: 2000,
  pageUrl: 500,
  /** Max accepted request body in bytes. */
  bodyBytes: 16 * 1024,
} as const;

/** Bump the version whenever the consent wording below changes. Stored with every lead. */
export const SMS_CONSENT_VERSION = "sms-consent-v1-2026-11";

export function smsConsentText(companyName: string): string {
  return (
    `I agree to receive text messages from ${companyName} at the phone number provided about my service request, ` +
    `including appointment confirmations, reminders and updates. Message frequency varies. Message and data rates may apply. ` +
    `Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.`
  );
}
