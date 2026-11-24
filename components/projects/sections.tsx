import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import type { BrandConfig, City, Copy, Project, Stat } from "@/lib/brand/schema";
import { cityLabel } from "@/lib/projects";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getTrustItems, TrustList } from "@/components/layout/trust-list";
import { BrandImage } from "@/components/ui/brand-image";
import { LinkButton } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Angle, DiagonalPanel, type Tone } from "@/components/services/sections";

type Pp = Copy["projectsPage"];

/* ------------------------------ Trust strip ------------------------------ */

/** License, insured/bonded, certifications, Google rating. Renders nothing until one is configured. */
export function TrustStrip({ company }: { company: BrandConfig["company"] }) {
  const has = getTrustItems(company).some((i) => i.key !== "years");
  if (!has) return null;
  return (
    <div className="border-b border-line bg-surface py-6">
      <div className="container-site">
        <TrustList company={company} variant="chips" only={["license", "insured", "cert", "rating"]} className="justify-center" />
      </div>
    </div>
  );
}

/* ------------------------------ Featured project ------------------------------ */

export function FeaturedProject({ project: p, copy }: { project: Project; copy: Pick<Pp, "featured" | "categories" | "card"> }) {
  return (
    <Section tone="light" labelledBy="featured-title">
      <Reveal variant="fade-up">
        <SectionHeading id="featured-title" eyebrow={copy.featured.eyebrow} title={copy.featured.title} intro={copy.featured.intro} />
      </Reveal>
      <Reveal variant="fade-up" className="mt-10">
        <article className="group grid overflow-hidden rounded-brand border border-line bg-surface transition-shadow duration-300 hover:shadow-brand-md lg:grid-cols-[1.15fr_1fr]">
          <BrandImage
            image={p.cover}
            rounded={false}
            aspect="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[26rem]"
            sizes="(min-width: 1024px) 640px, 100vw"
            imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-accent px-3 py-1 text-on-accent">{copy.featured.badge}</span>
              <span className="rounded-full bg-primary/8 px-3 py-1 text-primary">{copy.categories[p.category]}</span>
            </p>
            <h3 className="mt-5 text-2xl leading-tight font-extrabold sm:text-3xl">{p.title}</h3>
            <p className="mt-3 text-lg leading-relaxed text-muted">{p.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {cityLabel(p)}
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="size-4 text-accent" aria-hidden="true" />
                {copy.card.completed} {p.completedYear}
              </li>
              {p.duration ? (
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-accent" aria-hidden="true" />
                  {p.duration}
                </li>
              ) : null}
            </ul>
            <div className="mt-8">
              <LinkButton href={`/projects/${p.slug}`} variant="primary" size="lg">
                {copy.card.view}
                <ArrowRight className="size-4" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}

/* ------------------------------ Stats band ------------------------------ */

export function StatsBand({ stats, copy, before, after }: { stats: Stat[]; copy: Pp["stats"]; before?: Tone; after?: Tone }) {
  if (stats.length === 0) return null;
  return (
    <Section tone="primary" labelledBy="projects-stats-title" className="relative overflow-hidden">
      <Angle edge="top" tone={before} />
      <DiagonalPanel />
      <div className="relative py-4">
        <Reveal variant="fade-up">
          <SectionHeading id="projects-stats-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} align="center" onDark />
        </Reveal>
        <RevealGroup as="dl" variant="fade-in" className={`mt-12 grid grid-cols-2 gap-y-10 ${stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col px-4 text-center not-first:border-on-primary/15 lg:not-first:border-l">
              <dt className="order-last mt-1 text-sm font-semibold text-on-primary/80 sm:text-base">{s.label}</dt>
              <dd className="font-heading text-4xl font-extrabold sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
                <span className="text-accent" aria-hidden="true">
                  {s.suffix}
                </span>
              </dd>
            </div>
          ))}
        </RevealGroup>
      </div>
      <Angle edge="bottom" tone={after} />
    </Section>
  );
}

/* ------------------------------ Cities served ------------------------------ */

/** Chips for cities that have a real /service-areas page (no thin pages). */
export function CitiesServed({ cities, copy }: { cities: City[]; copy: Pp["cities"] }) {
  const withPages = cities.filter((c) => c.page);
  if (withPages.length === 0) return null;
  return (
    <Section tone="light" labelledBy="cities-title">
      <Reveal variant="fade-up">
        <SectionHeading id="cities-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} align="center" />
      </Reveal>
      <RevealGroup as="ul" variant="fade-up" className="mt-10 flex flex-wrap justify-center gap-3">
        {withPages.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/service-areas/${c.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-semibold transition-colors hover:border-primary hover:bg-primary/8 hover:text-primary"
            >
              <MapPin className="size-4 text-accent" aria-hidden="true" />
              {c.city}, {c.state}
            </Link>
          </li>
        ))}
      </RevealGroup>
    </Section>
  );
}
