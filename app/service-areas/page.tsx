import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { clientAreas, coverageCounts } from "@/lib/geo/coverage";
import { pageMetadata } from "@/lib/seo/meta";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { CoverageBrowser } from "@/components/geo/coverage-browser";
import { CtaBand } from "@/components/home/sections";
import { PageHero } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  const { cities, states } = coverageCounts();
  return pageMetadata({
    title: content.copy.serviceArea.title,
    description: `${config.company.name} service areas: ${cities} cities in ${states} states. Check your city or ZIP code.`,
    path: "/service-areas",
  });
}

export default function ServiceAreasPage() {
  const { config, content } = getBrand();
  const c = content.copy.serviceArea;
  const sa = content.copy.serviceAreas;
  const counts = coverageCounts();
  const areas = clientAreas();
  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro || undefined}
        crumbs={[{ name: "Service Areas", href: "/service-areas" }]}
        stats={[
          { value: String(counts.cities), label: sa.statCities },
          { value: String(counts.states), label: sa.statStates },
        ]}
        ctas={{ primary: { label: content.copy.hero.primaryCta, href: "/book" }, call: { label: content.copy.servicesPage.hero.callCta, phone: config.company.phone } }}
      />
      <Section tone="light" labelledBy="areas-list-title">
        <SectionHeading id="areas-list-title" eyebrow={sa.section.eyebrow} title={sa.section.title} intro={sa.section.intro} />
        <div className="mt-8">
          <CoverageBrowser areas={areas} labels={sa} variant="full" phone={config.company.phone} />
        </div>
      </Section>
      <Section tone="alt" labelledBy="areas-check-title">
        <div className="mx-auto max-w-3xl">
          <h2 id="areas-check-title" className="mb-6 text-2xl font-extrabold sm:text-3xl">
            {sa.checkTitle}
          </h2>
          <ServiceAreaChecker areas={areas} phone={config.company.phone} />
        </div>
      </Section>
      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
