import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { PageHeader } from "@/components/ui/page-header";
import { CtaBand, FaqAccordion, ServiceCards } from "@/components/home/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: "HVAC Services",
    description: `${content.services.map((s) => s.title).join(", ")} from ${config.company.name} in ${config.company.address.city}, ${config.company.address.state}.`,
    path: "/services",
  });
}

export default function ServicesPage() {
  const { config, content } = getBrand();
  const c = content.copy.services;
  return (
    <>
      <PageHeader image={config.images.services} eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Services", href: "/services" }]} />
      <ServiceCards services={content.services} copy={c} showHeading={false} />
      <FaqAccordion faqs={content.faqs} copy={content.copy.faq} phone={config.company.phone} />
      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
