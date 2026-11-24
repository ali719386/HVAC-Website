import Link from "next/link";
import { ArrowRight, MapPin, TriangleAlert } from "lucide-react";
import type { Brand, Copy } from "@/lib/brand/schema";
import { clientAreas, getCoverage, primaryCities } from "@/lib/geo/coverage";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { CoverageBrowser } from "./coverage-browser";

type Sa = Copy["serviceAreas"];

/**
 * Optional reminder banner on pages whose data is still placeholder (those pages stay noindex either way).
 * Hidden by default; set SHOW_PLACEHOLDER_NOTICE=true in .env.local (development only) to see it.
 */
export function PlaceholderNotice({ show, text }: { show: boolean; text: string }) {
  if (!show || process.env.NODE_ENV !== "development" || process.env.SHOW_PLACEHOLDER_NOTICE !== "true") return null;
  return (
    <div role="note" className="border-b border-accent/40 bg-accent/10">
      <p className="container-site flex items-start gap-2 py-3 text-sm font-semibold">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-accent-dark" aria-hidden="true" />
        {text}
      </p>
    </div>
  );
}

const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary";

/** "Available in" chips: primary cities (or all when none are primary) plus a link to every area. */
export function AvailableIn({ copy, limit = 8 }: { copy: Sa; limit?: number }) {
  const primary = primaryCities(limit);
  const cities = primary.length > 0 ? primary : getCoverage().cities.slice(0, limit);
  if (cities.length === 0) return null;
  return (
    <div>
      <p className="font-heading text-lg font-bold">{copy.availableIn}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {cities.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className={chip}>
              <MapPin className="size-3.5 text-accent" aria-hidden="true" />
              {c.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/service-areas" className={`${chip} text-primary`}>
            {copy.viewAll} <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

/** States and their cities, compact (Contact and About pages). */
export function WhereWeWork({ copy, tone = "alt" }: { copy: Sa; tone?: "light" | "alt" }) {
  const { states } = getCoverage();
  return (
    <Section tone={tone} labelledBy="where-we-work-title">
      <Reveal variant="fade-up" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading id="where-we-work-title" eyebrow={copy.whereWeWork.eyebrow} title={copy.whereWeWork.title} intro={copy.whereWeWork.intro} />
        <LinkButton href="/service-areas" variant="outline" className="self-start md:self-auto">
          {copy.viewAll}
        </LinkButton>
      </Reveal>
      <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {states.map((s) => (
          <li key={s.abbr}>
            <Link href={s.href} className="font-heading font-bold hover:text-primary">
              {s.name}
            </Link>
            {s.cities.length > 0 ? (
              <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                {s.cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={c.href} className="hover:text-primary hover:underline">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Homepage section: climate tabs with city chips, the area checker and a CTA. */
export function ServiceAreasSection({ brand, tone = "light" }: { brand: Brand; tone?: "light" | "alt" }) {
  const sa = brand.content.copy.serviceAreas;
  const areas = clientAreas();
  return (
    <Section tone={tone} labelledBy="service-areas-title">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <Reveal variant="fade-up">
            <SectionHeading id="service-areas-title" eyebrow={sa.section.eyebrow} title={sa.section.title} intro={sa.section.intro} />
          </Reveal>
          <div className="mt-8">
            <CoverageBrowser areas={areas} labels={sa} variant="chips" phone={brand.config.company.phone} />
          </div>
          <LinkButton href="/service-areas" variant="primary" className="mt-8">
            {sa.section.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>
        <div className="lg:pt-2">
          <p className="mb-4 font-heading text-xl font-bold">{brand.content.copy.serviceArea.title}</p>
          <ServiceAreaChecker areas={areas} phone={brand.config.company.phone} />
        </div>
      </div>
    </Section>
  );
}
