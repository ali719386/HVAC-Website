import { Fragment, type ReactNode } from "react";
import type { Brand, SectionKey } from "@/lib/brand/schema";
import { PlanCards } from "@/components/plans/plan-cards";
import { Section, SectionHeading } from "@/components/ui/section";
import { Hero } from "./hero";
import {
  BrandStrip,
  CtaBand,
  EmergencyBanner,
  ExpertBlock,
  FaqAccordion,
  FinancingBlock,
  PostCards,
  RebatesBlock,
  ServiceAreaBlock,
  ServiceCards,
  StatsCounter,
  WhyChooseUs,
} from "./sections";
import { TestimonialSlider } from "./testimonials";
import { ServiceAreasSection } from "@/components/geo/sections";

type Render = (brand: Brand) => ReactNode;

/**
 * Homepage section registry. Order and visibility come from config.homepage.sections.
 * Add a new section: add its key to sectionKeys in lib/brand/schema.ts and a renderer here.
 */
const registry: Record<SectionKey, Render> = {
  hero: (b) => <Hero brand={b} />,
  emergency: (b) => <EmergencyBanner config={b.config} copy={b.content.copy.emergency} />,
  brandStrip: (b) => <BrandStrip brands={b.config.offerings.supportedBrands} title={b.content.copy.brandStrip.title} />,
  services: (b) => <ServiceCards services={b.content.services} copy={b.content.copy.services} />,
  whyChooseUs: (b) => <WhyChooseUs brand={b} />,
  expert: (b) => <ExpertBlock config={b.config} copy={b.content.copy.expert} />,
  stats: (b) => <StatsCounter stats={b.config.company.stats} copy={b.content.copy.stats} />,
  testimonials: (b) => <TestimonialSlider items={b.content.testimonials} copy={b.content.copy.testimonials} />,
  plans: (b) => {
    if (b.content.plans.length === 0) return null;
    const c = b.content.copy.plans;
    return (
      <Section tone="light" labelledBy="plans-title">
        <SectionHeading id="plans-title" eyebrow={c.eyebrow} title={c.title} intro={c.intro} align="center" />
        <div className="mt-14 flex justify-center">
          <PlanCards plans={b.content.plans} />
        </div>
      </Section>
    );
  },
  financing: (b) => <FinancingBlock config={b.config} copy={b.content.copy.financing} />,
  serviceArea: (b) => <ServiceAreaBlock brand={b} />,
  serviceAreas: (b) => <ServiceAreasSection brand={b} />,
  rebates: (b) => <RebatesBlock rebates={b.config.offerings.rebates} />,
  faq: (b) => <FaqAccordion faqs={b.content.faqs} copy={b.content.copy.faq} phone={b.config.company.phone} image={b.config.images.faq} />,
  posts: (b) => <PostCards brand={b} copy={b.content.copy.posts} />,
  ctaBand: (b) => <CtaBand config={b.config} copy={b.content.copy.ctaBand} />,
};

export function HomeSections({ brand }: { brand: Brand }) {
  return brand.config.homepage.sections
    .filter((s) => s.enabled)
    .map((s) => <Fragment key={s.key}>{registry[s.key](brand)}</Fragment>);
}
