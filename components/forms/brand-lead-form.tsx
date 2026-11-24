import type { ComponentProps } from "react";
import { getBrand } from "@/lib/brand";
import { clientAreas } from "@/lib/geo/coverage";
import { getTrustItems } from "@/components/layout/trust-list";
import { LeadForm } from "./lead-form";

type Injected = "companyName" | "phone" | "emergencyPhone" | "serviceOptions" | "areas" | "trustChips" | "privacy" | "nextSteps" | "variant";
type Props = Omit<ComponentProps<typeof LeadForm>, Injected> & {
  /** Short form (name, phone, service, ZIP, urgency) for CTA bands and sidebars. */
  compact?: boolean;
};

/** Everything the client LeadForm needs from the selected brand (also used by the client BookForm). */
export function brandLeadFormProps() {
  const { config, content } = getBrand();
  const { company, offerings } = config;
  const cp = content.copy.contactPage;
  return {
    companyName: company.name,
    phone: company.phone,
    // Emergency banner only when 24/7 service is offered and a dedicated line is configured.
    emergencyPhone: offerings.emergency24x7 ? company.emergencyPhone : undefined,
    serviceOptions: content.services.map((s) => s.slug),
    areas: clientAreas(),
    // Configured credentials only (no state context here, so only the default license).
    trustChips: getTrustItems(company)
      .filter((i) => i.key === "license" || i.key === "insured" || i.key.startsWith("cert-"))
      .map((i) => i.text),
    privacy: { text: cp.privacyNote, href: "/privacy" },
    nextSteps: cp.steps.items,
  };
}

/** LeadForm with the selected brand filled in (Server Component wrapper). */
export function BrandLeadForm({ compact = false, ...props }: Props) {
  return <LeadForm {...brandLeadFormProps()} variant={compact ? "compact" : "steps"} {...props} />;
}
