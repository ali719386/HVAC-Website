import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone, Siren } from "lucide-react";
import type { Brand, BrandConfig, Copy, ImageAsset, Post, Service, Stat, WhyItem } from "@/lib/brand/schema";
import { formatDate } from "@/lib/format";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { assetExists, BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/ui/section";
import { TrustList } from "@/components/layout/trust-list";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { AvailableIn } from "@/components/geo/sections";
import { clientAreas } from "@/lib/geo/coverage";

/* ------------------------------ Emergency ------------------------------ */

export function EmergencyBanner({ config, copy }: { config: BrandConfig; copy: Copy["emergency"] }) {
  if (!config.offerings.emergency24x7) return null;
  const phone = config.company.emergencyPhone ?? config.company.phone;
  return (
    <aside aria-label="Emergency service" className="bg-surface pt-10">
      <div className="container-site">
        <div className="flex flex-col gap-5 rounded-brand border border-accent/30 bg-accent/8 p-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
              <Siren className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-xl font-extrabold">{copy.title}</p>
              <p className="mt-1 text-muted">{copy.body}</p>
            </div>
          </div>
          <CallButton phone={phone} variant="accent" size="lg" className="shrink-0" />
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ Brand strip ------------------------------ */

export function BrandStrip({
  brands,
  title,
}: {
  brands: BrandConfig["offerings"]["supportedBrands"];
  title: string;
}) {
  if (brands.length === 0) return null;
  return (
    <section aria-labelledby="brands-title" data-tone="alt" className="bg-surface-alt py-14 lg:py-20">
      <div className="container-site">
        <h2 id="brands-title" className="mx-auto max-w-3xl text-center text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 lg:mt-14 lg:gap-x-16">
          {brands.map((b) => (
            <li key={b.name} className="flex h-16 w-[calc(50%-1.25rem)] items-center justify-center sm:h-20 sm:w-48 lg:w-52">
              {assetExists(b.logo) ? (
                <span className="relative block h-full w-full max-w-[13rem]">
                  <Image src={b.logo} alt={b.name} fill sizes="(min-width: 1024px) 208px, 45vw" className="object-contain" />
                </span>
              ) : (
                <span className="font-heading text-2xl font-extrabold tracking-wide text-primary uppercase sm:text-3xl">
                  {b.name}
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-xs text-muted">
          Brand names and logos are trademarks of their respective owners. Listing does not imply endorsement or dealer status.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ Service cards ------------------------------ */

function spanFor(index: number, total: number) {
  const rem = total % 3;
  if (rem === 2 && index < 2) return "lg:col-span-3";
  if (rem === 1 && index < 4) return "lg:col-span-3";
  return "lg:col-span-2";
}

export function ServiceCards({
  services,
  copy,
  showHeading = true,
}: {
  services: Service[];
  copy: Copy["services"];
  /** false on /services where the page header already shows the title. */
  showHeading?: boolean;
}) {
  return (
    <Section tone="light" labelledBy="services-title">
      {showHeading ? (
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="services-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
          <LinkButton href="/services" variant="outline" className="self-start md:self-auto">
            All services
          </LinkButton>
        </div>
      ) : (
        <h2 id="services-title" className="sr-only">
          {copy.title}
        </h2>
      )}
      <RevealGroup as="ul" variant="fade-up" className="grid gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-6">
        {services.map((s, i) => (
          <li key={s.slug} className={`group relative flex flex-col overflow-hidden rounded-brand border border-line bg-surface shadow-brand-sm transition-shadow hover:shadow-brand-md ${spanFor(i, services.length)}`}>
            <BrandImage image={s.image} rounded={false} aspect="aspect-[16/9]" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" imgClassName="transition-transform duration-500 group-hover:scale-105" />
            <div className="relative flex flex-1 flex-col p-6 pt-9">
              <span className="absolute -top-7 left-6 grid size-14 place-items-center rounded-brand-sm bg-primary text-on-primary shadow-brand-md">
                <Icon name={s.icon} className="size-6" />
              </span>
              <h3 className="text-xl font-bold">
                <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {s.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 leading-relaxed text-muted">{s.summary}</p>
              <span aria-hidden="true" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ------------------------------ Why choose us ------------------------------ */

export function WhyChooseUs({ brand }: { brand: Brand }) {
  const { config, content } = brand;
  const copy = content.copy.whyChooseUs;
  const items: WhyItem[] = content.whyChooseUs;
  const years = config.company.yearsInBusiness;
  return (
    <Section tone="alt" labelledBy="why-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-last lg:order-first">
          <BrandImage image={config.images.about} sizes="(min-width: 1024px) 560px, 100vw" aspect="aspect-[4/3.4]" />
          {years ? (
            <div className="absolute -right-2 -bottom-6 rounded-brand bg-primary px-6 py-5 text-on-primary shadow-brand-lg sm:right-6">
              <p className="font-heading text-4xl font-extrabold">{years}+</p>
              <p className="text-sm font-semibold text-on-primary/85">Years in business</p>
            </div>
          ) : null}
        </div>
        <div>
          <SectionHeading id="why-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
          <RevealGroup as="ul" variant="fade-up" className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {items.map((it) => (
              <li key={it.title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-brand-sm bg-surface text-accent shadow-brand-sm">
                  <Icon name={it.icon} className="size-6" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{it.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{it.body}</p>
                </div>
              </li>
            ))}
          </RevealGroup>
          <TrustList company={config.company} className="mt-10 border-t border-line pt-8 text-ink" />
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------ Expert block ------------------------------ */

export function ExpertBlock({ config, copy }: { config: BrandConfig; copy: Copy["expert"] }) {
  return (
    <section aria-labelledby="expert-title" data-tone="light" className="bg-surface section-y">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-brand bg-primary text-on-primary shadow-brand-lg lg:grid-cols-[0.9fr_1.1fr]">
          <BrandImage
            image={config.images.expert}
            rounded={false}
            aspect="aspect-[16/11] lg:aspect-auto lg:h-full"
            imgClassName="object-[50%_25%]"
            sizes="(min-width: 1024px) 520px, 100vw"
            reveal="mask-up"
          />
          <Reveal variant="slide-right" delay={150} className="p-8 sm:p-10 lg:p-14">
            <SectionHeading id="expert-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} onDark />
            {copy.bullets.length > 0 ? (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {copy.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/book" variant="accent" size="lg">
                {copy.cta}
              </LinkButton>
              <CallButton phone={config.company.phone} variant="ghost" size="lg" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Stats ------------------------------ */

export function StatsCounter({ stats, copy }: { stats: Stat[]; copy: Copy["stats"] }) {
  if (stats.length === 0) return null;
  return (
    <section aria-labelledby="stats-title" data-tone="light" className="bg-surface py-14 lg:py-16">
      <div className="container-site">
        <h2 id="stats-title" className="sr-only">
          {copy.title}
        </h2>
        <RevealGroup
          as="dl"
          variant="fade-in"
          className={`grid grid-cols-2 gap-y-10 ${stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col px-4 text-center not-first:border-line lg:not-first:border-l">
              <dt className="order-last mt-1 text-sm font-semibold text-muted sm:text-base">{s.label}</dt>
              <dd className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
                <span className="text-accent" aria-hidden="true">
                  {s.suffix}
                </span>
              </dd>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ------------------------------ */

export function FaqAccordion({
  faqs,
  copy,
  phone,
  image,
  headingLevel = "h2",
}: {
  faqs: Brand["content"]["faqs"];
  copy: Copy["faq"];
  phone: BrandConfig["company"]["phone"];
  /** When set: heading on top, photo left, questions right (photo below questions on mobile), no call box. */
  image?: ImageAsset;
  headingLevel?: "h1" | "h2";
}) {
  if (faqs.length === 0) return null;
  const heading = <SectionHeading id="faq-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} as={headingLevel} />;
  const list = (
    <Reveal variant="fade-up" className="grid content-start gap-3">
      {faqs.map((f, i) => (
        <details key={f.question} className="group rounded-brand border border-line bg-surface open:shadow-brand-md" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-heading text-lg font-bold marker:content-none [&::-webkit-details-marker]:hidden sm:p-6">
            {f.question}
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-alt text-primary transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="px-5 pb-6 leading-relaxed text-muted sm:px-6">{f.answer}</p>
        </details>
      ))}
    </Reveal>
  );

  if (image) {
    return (
      <Section tone="alt" labelledBy="faq-title">
        {heading}
        <div className="mt-10 grid items-start gap-10 lg:mt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <BrandImage
            image={image}
            sizes="(min-width: 1024px) 520px, 100vw"
            aspect="aspect-[4/3]"
            className="order-last shadow-brand-lg lg:order-first lg:sticky lg:top-28"
          />
          {list}
        </div>
      </Section>
    );
  }

  return (
    <Section tone="alt" labelledBy="faq-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          {heading}
          <div className="mt-8 rounded-brand bg-primary p-7 text-on-primary">
            <p className="font-heading text-lg font-bold">{copy.contactTitle}</p>
            <p className="mt-1 text-on-primary/85">{copy.contactBody}</p>
            <a href={`tel:${phone.tel}`} className="mt-4 inline-flex items-center gap-2 font-heading text-2xl font-extrabold">
              <Phone className="size-5 text-accent" aria-hidden="true" />
              {phone.display}
            </a>
          </div>
        </div>
        {list}
      </div>
    </Section>
  );
}

/* ------------------------------ Posts ------------------------------ */

export function PostCards({ posts, copy, limit = 3 }: { posts: Post[]; copy?: Copy["posts"]; limit?: number }) {
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
  if (latest.length === 0) return null;
  const grid = (
    <RevealGroup as="ul" variant="fade-up" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {latest.map((p) => (
        <li key={p.slug} className="group relative flex flex-col overflow-hidden rounded-brand border border-line bg-surface shadow-brand-sm transition-shadow hover:shadow-brand-md">
          <BrandImage image={p.image} rounded={false} aspect="aspect-[16/10]" sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" />
          <div className="flex flex-1 flex-col p-6">
            <p className="flex items-center gap-3 text-sm text-muted">
              <span className="rounded-full bg-surface-alt px-3 py-1 font-semibold text-primary">{p.category}</span>
              <time dateTime={p.date}>{formatDate(p.date)}</time>
            </p>
            <h3 className="mt-4 text-xl leading-snug font-bold">
              <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary">
                {p.title}
              </Link>
            </h3>
            <p className="mt-2 flex-1 leading-relaxed text-muted">{p.excerpt}</p>
            <span aria-hidden="true" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              Read article <ArrowRight className="size-4" />
            </span>
          </div>
        </li>
      ))}
    </RevealGroup>
  );
  if (!copy) return grid;
  return (
    <Section tone="light" labelledBy="posts-title">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading id="posts-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
        <LinkButton href="/blog" variant="outline" className="self-start md:self-auto">
          View all articles
        </LinkButton>
      </div>
      {grid}
    </Section>
  );
}

/* ------------------------------ CTA band ------------------------------ */

export function CtaBand({ config, copy }: { config: BrandConfig; copy: Copy["ctaBand"] }) {
  return (
    <section aria-labelledby="cta-title" className="bg-surface pb-[var(--brand-section-y)]">
      <div className="container-site">
        <Reveal variant="zoom-in" className="flex flex-col gap-8 rounded-brand bg-accent px-6 py-10 text-on-accent sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div className="max-w-2xl">
            <h2 id="cta-title" className="text-3xl leading-tight font-extrabold sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 text-lg opacity-90">{copy.body}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <LinkButton href="/book" variant="light" size="lg">
              {copy.cta}
            </LinkButton>
            <CallButton phone={config.company.phone} variant="ghost" size="lg" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Service area ------------------------------ */

/** Heading + primary cities + inline area checker (no external API). */
export function ServiceAreaBlock({ brand, tone = "light" }: { brand: Brand; tone?: "light" | "alt" }) {
  const c = brand.content.copy.serviceArea;
  return (
    <Section tone={tone} labelledBy="area-title">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="fade-up">
          <SectionHeading id="area-title" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
          <div className="mt-6">
            <AvailableIn copy={brand.content.copy.serviceAreas} />
          </div>
        </Reveal>
        <ServiceAreaChecker areas={clientAreas()} phone={brand.config.company.phone} />
      </div>
    </Section>
  );
}

/* ------------------------------ Financing + rebates ------------------------------ */

export function FinancingBlock({ config, copy }: { config: BrandConfig; copy: Copy["financing"] }) {
  const f = config.offerings.financing;
  if (!f.enabled) return null;
  return (
    <Section tone="light" labelledBy="financing-title">
      <div className="grid items-center gap-10 rounded-brand border border-line bg-surface-alt p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div>
          <SectionHeading id="financing-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
          {f.description ? <p className="mt-4 leading-relaxed text-muted">{f.description}</p> : null}
          {f.provider ? <p className="mt-4 text-sm font-semibold">Provider: {f.provider}</p> : null}
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <LinkButton href="/financing" variant="primary" size="lg">
            Financing details
          </LinkButton>
          <p className="text-sm text-muted">Subject to credit approval. Terms set by the lender.</p>
        </div>
      </div>
    </Section>
  );
}

export function RebatesBlock({ rebates }: { rebates: BrandConfig["offerings"]["rebates"] }) {
  if (!rebates.enabled || !rebates.title) return null;
  return (
    <Section tone="alt" labelledBy="rebates-title">
      <div className="max-w-3xl">
        <h2 id="rebates-title" className="text-3xl font-extrabold">
          {rebates.title}
        </h2>
        {rebates.body ? <p className="mt-4 text-lg leading-relaxed text-muted">{rebates.body}</p> : null}
        {rebates.url ? (
          <a href={rebates.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-primary underline underline-offset-4">
            Check current programs <ArrowRight className="size-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </Section>
  );
}
