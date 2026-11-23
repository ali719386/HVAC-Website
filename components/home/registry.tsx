import { Fragment, type ReactNode } from "react";
import type { Brand, SectionKey } from "@/lib/brand/schema";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
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
  ServiceCards,
  StatsCounter,
  WhyChooseUs,
} from "./sections";
import { TestimonialSlider } from "./testimonials";

type Render = (brand: Brand, areas: { zip: string; city: string; state: string }[]) => ReactNode;

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
  serviceArea: (b, areas) => {
    const c = b.content.copy.serviceArea;
    return (
      <Section tone="light" labelledBy="area-title">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading id="area-title" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
            <ul className="mt-6 flex flex-wrap gap-2">
              {b.content.cities.map((city) => (
                <li key={city.slug} className="rounded-full border border-line bg-surface-alt px-3.5 py-1.5 text-sm font-semibold">
                  {city.city}, {city.state}
                </li>
              ))}
            </ul>
          </div>
          <ServiceAreaChecker areas={areas} phone={b.config.company.phone} />
        </div>
      </Section>
    );
  },
  rebates: (b) => <RebatesBlock rebates={b.config.offerings.rebates} />,
  faq: (b) => <FaqAccordion faqs={b.content.faqs} copy={b.content.copy.faq} phone={b.config.company.phone} image={b.config.images.faq} />,
  posts: (b) => <PostCards posts={b.content.posts} copy={b.content.copy.posts} />,
  ctaBand: (b) => <CtaBand config={b.config} copy={b.content.copy.ctaBand} />,
};

export function HomeSections({ brand, areas }: { brand: Brand; areas: { zip: string; city: string; state: string }[] }) {
  return brand.config.homepage.sections
    .filter((s) => s.enabled)
    .map((s) => <Fragment key={s.key}>{registry[s.key](brand, areas)}</Fragment>);
}
