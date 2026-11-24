import type { ComponentProps } from "react";
import { getBrand } from "@/lib/brand";
import { clientAreas } from "@/lib/geo/coverage";
import { LeadForm } from "./lead-form";

type Props = Omit<ComponentProps<typeof LeadForm>, "companyName" | "phone" | "serviceOptions" | "areas">;

/** LeadForm with the selected brand's company, services and coverage filled in (Server Component wrapper). */
export function BrandLeadForm(props: Props) {
  const { config, content } = getBrand();
  return (
    <LeadForm
      companyName={config.company.name}
      phone={config.company.phone}
      serviceOptions={content.services.map((s) => s.slug)}
      areas={clientAreas()}
      {...props}
    />
  );
}

/** Same props for client wrappers (e.g. BookForm). */
export function brandLeadFormProps() {
  const { config, content } = getBrand();
  return {
    companyName: config.company.name,
    phone: config.company.phone,
    serviceOptions: content.services.map((s) => s.slug),
    areas: clientAreas(),
  };
}
