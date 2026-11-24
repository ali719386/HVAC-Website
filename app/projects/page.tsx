import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand";
import type { ProjectsSectionKey } from "@/lib/brand/schema";
import { formatNumber } from "@/lib/format";
import { cityLabel } from "@/lib/projects";
import { getCoverage, projectCity } from "@/lib/geo/coverage";
import { pageMetadata } from "@/lib/seo/meta";
import { FaqAccordion } from "@/components/home/sections";
import { TestimonialSlider } from "@/components/home/testimonials";
import { ProjectCard } from "@/components/projects/card";
import { ProjectExplorer, type ProjectMeta } from "@/components/projects/explorer";
import { CitiesServed, FeaturedProject, StatsBand, TrustStrip } from "@/components/projects/sections";
import { LeadCtaBand, ProcessSteps, type Tone } from "@/components/services/sections";
import { PageHero } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  const c = content.copy.projects;
  return pageMetadata({
    title: c.title,
    description: c.intro || `Recent heating and cooling projects completed by ${config.company.name}.`,
    path: "/projects",
    image: config.images.projects.src,
  });
}

/** Background per section: alternates and colors the angled dividers next to navy bands. */
const tones: Record<ProjectsSectionKey, Tone | undefined> = {
  trust: undefined,
  featured: "light",
  grid: "alt",
  stats: "primary",
  process: "light",
  testimonials: "alt",
  cities: "light",
  faq: "alt",
  cta: "primary",
};

export default function ProjectsPage() {
  const brand = getBrand();
  const { config, content } = brand;
  const { company } = config;
  const { projects } = content;
  if (projects.length === 0) notFound();
  const c = content.copy.projects;
  const pp = content.copy.projectsPage;

  const featured = projects.find((p) => p.featured);
  const linkedIds = new Set(projects.map((p) => p.testimonialId).filter(Boolean));
  const linkedReviews = content.testimonials.filter((t) => t.id && linkedIds.has(t.id));

  // Only real totals from config; each stat is hidden while its value is undefined.
  const heroStats = (
    [
      [company.projectsCompleted, pp.hero.projectsCompleted],
      [company.homesServed, pp.hero.homesServed],
      [company.yearsInBusiness, pp.hero.yearsInBusiness],
    ] as const
  ).flatMap(([value, label]) => (value ? [{ value: formatNumber(value), label }] : []));

  const hasContent: Record<ProjectsSectionKey, boolean> = {
    trust: true,
    featured: Boolean(featured),
    grid: true,
    stats: company.stats.length > 0,
    process: content.process.length > 0,
    testimonials: linkedReviews.length > 0,
    cities: getCoverage().cities.length > 0,
    faq: content.projectFaqs.length > 0,
    cta: true,
  };
  const order = config.projectsPage.sections.filter((s) => s.enabled && hasContent[s.key]).map((s) => s.key);
  // Neighbor tones for the navy bands' angled edges (the thin trust strip has none).
  const toneNear = (i: number, step: 1 | -1): Tone | undefined => {
    const k = order[i + step];
    return k ? (tones[k] ?? "light") : undefined;
  };

  const meta: ProjectMeta[] = projects.map((p) => ({
    slug: p.slug,
    category: p.category,
    // Only configured coverage cities appear in the city filter.
    city: projectCity(p)?.label ?? "",
    systemType: p.systemType,
    year: p.completedYear,
    featured: p.featured,
    haystack: [p.title, cityLabel(p), p.systemType, p.summary].join(" ").toLowerCase(),
  }));
  const cards = Object.fromEntries(projects.map((p) => [p.slug, <ProjectCard key={p.slug} project={p} copy={pp} />]));

  const render = (key: ProjectsSectionKey, i: number): ReactNode => {
    switch (key) {
      case "trust":
        return <TrustStrip company={company} />;
      case "featured":
        return featured ? <FeaturedProject project={featured} copy={pp} /> : null;
      case "grid":
        return (
          <Section tone="alt" labelledBy="projects-grid-title">
            <SectionHeading id="projects-grid-title" eyebrow={pp.grid.eyebrow} title={pp.grid.title} intro={pp.grid.intro} />
            <div className="mt-8">
              <ProjectExplorer items={meta} cards={cards} copy={pp} />
            </div>
          </Section>
        );
      case "stats":
        return <StatsBand stats={company.stats} copy={pp.stats} before={toneNear(i, -1)} after={toneNear(i, 1)} />;
      case "process":
        return <ProcessSteps steps={content.process} copy={pp.process} />;
      case "testimonials":
        return <TestimonialSlider items={linkedReviews} copy={pp.testimonials} />;
      case "cities":
        return <CitiesServed cities={getCoverage().cities} copy={pp.cities} />;
      case "faq":
        return <FaqAccordion faqs={content.projectFaqs} copy={{ ...content.copy.faq, ...pp.faq }} phone={company.phone} />;
      case "cta":
        return (
          <LeadCtaBand config={config} copy={pp.cta} before={toneNear(i, -1)} />
        );
    }
  };

  return (
    <>
      <PageHero
        image={config.images.projects}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro || undefined}
        crumbs={[{ name: "Projects", href: "/projects" }]}
        stats={heroStats}
        ctas={{ primary: { label: pp.hero.primaryCta, href: "/book" }, call: { label: pp.hero.callCta, phone: company.phone } }}
      />
      {order.map((key, i) => (
        <Fragment key={key}>{render(key, i)}</Fragment>
      ))}
    </>
  );
}
