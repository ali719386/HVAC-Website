import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getBrand, getServiceZips } from "@/lib/brand";
import type { ServicesSectionKey } from "@/lib/brand/schema";
import { pageMetadata } from "@/lib/seo/meta";
import { TrustList } from "@/components/layout/trust-list";
import { BrandStrip, FaqAccordion, ServiceAreaBlock } from "@/components/home/sections";
import { ReviewsStrip } from "@/components/home/testimonials";
import { ServiceFilters } from "@/components/services/filters";
import {
  EmergencyBand,
  LeadCtaBand,
  PlanFinancingStrip,
  ProblemPicker,
  ProcessSteps,
  ServiceGrid,
  type Tone,
} from "@/components/services/sections";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: "HVAC Services",
    description: `${content.services.map((s) => s.title).join(", ")} from ${config.company.name} in ${config.company.address.city}, ${config.company.address.state}.`,
    path: "/services",
  });
}

/** Background of each section, used to alternate tones and to color the angled dividers. */
const tones: Record<Exclude<ServicesSectionKey, "filters">, Tone> = {
  cards: "light",
  problemPicker: "alt",
  emergency: "primary",
  process: "light",
  plansFinancing: "alt",
  serviceArea: "light",
  brands: "alt",
  reviews: "light",
  faq: "alt",
  cta: "primary",
};

export default function ServicesPage() {
  const brand = getBrand();
  const { config, content } = brand;
  const { company, offerings } = config;
  const c = content.copy.services;
  const sp = content.copy.servicesPage;
  const enabled = config.servicesPage.sections.filter((s) => s.enabled).map((s) => s.key);
  const filtersOn = enabled.includes("filters");

  // Which sections actually have something to show (so dividers match real neighbors).
  const hasContent: Record<Exclude<ServicesSectionKey, "filters">, boolean> = {
    cards: content.services.length > 0,
    problemPicker: content.symptoms.length > 0,
    emergency: offerings.emergency24x7,
    process: content.process.length > 0,
    plansFinancing: content.plans.length > 0 || offerings.financing.enabled,
    serviceArea: true,
    brands: offerings.supportedBrands.length > 0,
    reviews: content.testimonials.length > 0 || Boolean(company.googleRating),
    faq: content.faqs.length > 0,
    cta: true,
  };
  const order = enabled.filter((k): k is Exclude<ServicesSectionKey, "filters"> => k !== "filters" && hasContent[k]);
  const toneAt = (i: number): Tone | undefined => {
    const k = order[i];
    return k ? tones[k] : undefined;
  };

  const grid = <ServiceGrid services={content.services} copy={sp.cards} emergency24x7={offerings.emergency24x7} />;

  const render = (key: (typeof order)[number], i: number): ReactNode => {
    switch (key) {
      case "cards":
        return (
          <Section tone="light" labelledBy="services-list-title">
            <h2 id="services-list-title" className="sr-only">
              {c.title}
            </h2>
            {filtersOn ? (
              <ServiceFilters copy={sp.filters} items={content.services.map((s) => ({ category: s.category, audience: s.audience }))}>
                {grid}
              </ServiceFilters>
            ) : (
              grid
            )}
          </Section>
        );
      case "problemPicker":
        return <ProblemPicker symptoms={content.symptoms} services={content.services} copy={sp.problemPicker} />;
      case "emergency":
        return <EmergencyBand config={config} copy={content.copy.emergency} callCta={sp.emergency.callCta} before={toneAt(i - 1)} after={toneAt(i + 1)} />;
      case "process":
        return <ProcessSteps steps={content.process} copy={sp.process} />;
      case "plansFinancing":
        return <PlanFinancingStrip brand={brand} copy={sp} />;
      case "serviceArea":
        return <ServiceAreaBlock brand={brand} areas={getServiceZips()} />;
      case "brands":
        return <BrandStrip brands={offerings.supportedBrands} title={content.copy.brandStrip.title} />;
      case "reviews":
        return <ReviewsStrip items={content.testimonials} copy={sp.reviews} rating={company.googleRating} />;
      case "faq":
        return (
          <FaqAccordion
            faqs={content.faqs.slice(0, 5)}
            copy={{ ...content.copy.faq, ...sp.faq }}
            phone={company.phone}
            image={config.images.faq}
          />
        );
      case "cta":
        return (
          <LeadCtaBand config={config} copy={sp.cta} serviceOptions={content.services.map((s) => s.slug)} before={toneAt(i - 1)} />
        );
    }
  };

  return (
    <>
      <PageHeader
        compact
        image={config.images.services}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro || undefined}
        crumbs={[{ name: "Services", href: "/services" }]}
        ctas={{ primary: { label: sp.hero.primaryCta, href: "/book" }, call: { label: sp.hero.callCta, phone: company.phone } }}
      >
        <TrustList company={company} onDark variant="chips" only={["license", "insured", "rating", "years"]} />
      </PageHeader>
      {order.map((key, i) => (
        <Fragment key={key}>{render(key, i)}</Fragment>
      ))}
    </>
  );
}
