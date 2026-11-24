import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CalendarCheck, Check, Phone, Siren } from "lucide-react";
import type { Brand, BrandConfig, Copy, ProcessStep, Service, Symptom } from "@/lib/brand/schema";
import { formatUsd } from "@/lib/format";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { LeadForm } from "@/components/forms/lead-form";
import { TrustList } from "@/components/layout/trust-list";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/ui/section";

type Sp = Copy["servicesPage"];
export type Tone = "light" | "alt" | "primary" | "dark";

const toneBg: Record<Tone, string> = {
  light: "bg-surface",
  alt: "bg-surface-alt",
  primary: "bg-primary",
  dark: "bg-surface-dark",
};

/**
 * Angled divider: the header's diagonal cut, drawn in the NEIGHBOR's background color over the edge
 * of a navy band so the band appears to start or end on a slant. Decorative only.
 */
function Angle({ edge, tone }: { edge: "top" | "bottom"; tone?: Tone }) {
  if (!tone || tone === "primary") return null;
  const shape = edge === "top" ? "[clip-path:polygon(0_0,100%_0,0_100%)] top-0" : "[clip-path:polygon(100%_0,100%_100%,0_100%)] bottom-0";
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 h-8 sm:h-12 lg:h-16 ${toneBg[tone]} ${shape}`} />;
}

/** The header's right-side diagonal panel, reused as a quiet motif in navy bands. */
function DiagonalPanel() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-primary-dark opacity-60 [clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)] lg:block"
    />
  );
}

/* ------------------------------ Service cards ------------------------------ */

export function ServiceGrid({
  services,
  copy,
  emergency24x7,
}: {
  services: Service[];
  copy: Sp["cards"];
  emergency24x7: boolean;
}) {
  return (
    <RevealGroup as="ul" variant="fade-up" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        // data-* lists drive the CSS filter; the lift sits on the inner card so it never fights the reveal.
        <li key={s.slug} data-category={s.category.join(" ")} data-audience={s.audience.join(" ")} className="flex">
          <article className="group relative flex w-full flex-col overflow-hidden rounded-brand border border-line bg-surface shadow-brand-sm transition duration-300 hover:-translate-y-1 hover:shadow-brand-md motion-reduce:hover:translate-y-0">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1 bg-primary/20 transition-colors duration-300 group-hover:bg-accent" />
            <div className="relative">
              <BrandImage
                image={s.image}
                rounded={false}
                aspect="aspect-[16/10]"
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
              />
              {emergency24x7 && s.emergency ? (
                <span className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-extrabold tracking-wide text-on-accent shadow-brand-sm">
                  {copy.emergencyBadge}
                </span>
              ) : null}
            </div>
            <div className="relative flex flex-1 flex-col p-6 pt-9">
              <span className="absolute -top-7 left-6 grid size-14 place-items-center rounded-brand-sm bg-primary text-on-primary shadow-brand-md">
                <Icon name={s.icon} className="size-6" />
              </span>
              <h3 className="text-xl font-bold">
                <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0 after:z-20 after:content-['']">
                  {s.title}
                </Link>
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{s.summary}</p>
              <ul className="mt-4 grid gap-2 text-sm">
                {s.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {copy.learnMore} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
                {s.startingAt ? (
                  <p className="text-right text-sm leading-tight text-muted">
                    {copy.startingAt}
                    <span className="block font-heading text-lg font-extrabold text-ink">{formatUsd(s.startingAt)}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        </li>
      ))}
    </RevealGroup>
  );
}

/* ------------------------------ Problem picker ------------------------------ */

export function ProblemPicker({ symptoms, services, copy }: { symptoms: Symptom[]; services: Service[]; copy: Sp["problemPicker"] }) {
  if (symptoms.length === 0) return null;
  const has = (slug: string) => services.some((s) => s.slug === slug);
  return (
    <Section tone="alt" labelledBy="picker-title">
      <Reveal variant="fade-up">
        <SectionHeading id="picker-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} align="center" />
      </Reveal>
      <RevealGroup as="ul" variant="fade-up" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {symptoms.map((s) => {
          // Only link to a service page that exists; otherwise open the prefilled booking form.
          const href = s.action === "service" && has(s.service) ? `/services/${s.service}` : `/book?issue=${encodeURIComponent(s.id)}`;
          return (
            <li key={s.id} className="flex">
              <Link
                href={href}
                className="group flex w-full items-center gap-4 rounded-brand border border-line bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-brand-md motion-reduce:hover:translate-y-0 lg:flex-col lg:items-start"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span className="flex-1 font-heading text-lg leading-snug font-bold">{s.label}</span>
                <ArrowRight className="size-5 shrink-0 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

/* ------------------------------ Emergency band ------------------------------ */

export function EmergencyBand({
  config,
  copy,
  callCta,
  before,
  after,
}: {
  config: BrandConfig;
  copy: Copy["emergency"];
  callCta: string;
  before?: Tone;
  after?: Tone;
}) {
  if (!config.offerings.emergency24x7) return null;
  const phone = config.company.emergencyPhone ?? config.company.phone;
  return (
    <Section tone="primary" labelledBy="emergency-band-title" className="relative overflow-hidden">
      <Angle edge="top" tone={before} />
      <DiagonalPanel />
      <Reveal variant="fade-up" className="relative flex flex-col items-start gap-8 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
            <Siren className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h2 id="emergency-band-title" className="text-3xl leading-tight font-extrabold sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-2 text-lg text-on-primary/85">{copy.body}</p>
          </div>
        </div>
        <CallButton
          phone={phone}
          variant="accent"
          size="lg"
          className="h-16 w-full px-8 text-xl sm:w-auto"
          label={
            <span>
              {callCta} <span className="font-extrabold">{phone.display}</span>
            </span>
          }
        />
      </Reveal>
      <Angle edge="bottom" tone={after} />
    </Section>
  );
}

/* ------------------------------ Process steps ------------------------------ */

export function ProcessSteps({ steps, copy }: { steps: ProcessStep[]; copy: Sp["process"] }) {
  if (steps.length === 0) return null;
  const cols = steps.length >= 5 ? "lg:grid-cols-5" : steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <Section tone="light" labelledBy="process-title">
      <Reveal variant="fade-up">
        <SectionHeading id="process-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} align="center" />
      </Reveal>
      <RevealGroup as="ol" variant="fade-up" className={`mt-14 grid gap-10 sm:grid-cols-2 lg:gap-6 ${cols}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <div className="flex items-center gap-4">
              <span className="relative grid size-14 shrink-0 place-items-center rounded-full bg-primary text-on-primary shadow-brand-md">
                <Icon name={s.icon} className="size-6" />
                <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-accent text-xs font-extrabold text-on-accent">
                  {i + 1}
                </span>
              </span>
              {/* Connector to the next step (desktop row only). */}
              {i < steps.length - 1 ? <span aria-hidden="true" className="hidden h-px flex-1 bg-line lg:block" /> : null}
            </div>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-1.5 leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ------------------------------ Plans + financing ------------------------------ */

export function PlanFinancingStrip({ brand, copy }: { brand: Brand; copy: Pick<Sp, "plans" | "financing"> }) {
  const banners = [
    brand.content.plans.length > 0 && { href: "/plans", icon: CalendarCheck, ...copy.plans },
    brand.config.offerings.financing.enabled && { href: "/financing", icon: BadgeDollarSign, ...copy.financing },
  ].filter((b) => b !== false);
  if (banners.length === 0) return null;
  return (
    <Section tone="alt" labelledBy={undefined} className="py-14! lg:py-16!">
      <RevealGroup as="ul" variant="fade-up" className={`grid gap-5 ${banners.length > 1 ? "md:grid-cols-2" : ""}`}>
        {banners.map(({ href, icon: I, title, body, cta }) => (
          <li key={href} className="flex">
            <Link
              href={href}
              className="group relative flex w-full items-center gap-5 overflow-hidden rounded-brand border border-line bg-surface p-6 shadow-brand-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-brand-md motion-reduce:hover:translate-y-0 sm:p-7"
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-primary/20 transition-colors group-hover:bg-accent" />
              <span className="grid size-14 shrink-0 place-items-center rounded-brand-sm bg-primary text-on-primary">
                <I className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-xl font-bold">{title}</span>
                <span className="mt-1 block text-muted">{body}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ------------------------------ CTA band with compact lead form ------------------------------ */

export function LeadCtaBand({
  config,
  copy,
  serviceOptions,
  before,
}: {
  config: BrandConfig;
  copy: Sp["cta"];
  serviceOptions: Service["slug"][];
  before?: Tone;
}) {
  const { company } = config;
  return (
    <Section tone="primary" labelledBy="lead-cta-title" className="relative overflow-hidden">
      <Angle edge="top" tone={before} />
      <DiagonalPanel />
      <div className="relative grid items-center gap-12 pt-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal variant="fade-up">
          <SectionHeading id="lead-cta-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} onDark />
          <a href={`tel:${company.phone.tel}`} className="mt-8 inline-flex items-center gap-3 font-heading text-2xl font-extrabold sm:text-3xl">
            <span className="grid size-12 place-items-center rounded-full bg-accent text-on-accent">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            {company.phone.display}
          </a>
          <TrustList company={company} onDark variant="chips" className="mt-8" />
        </Reveal>
        <Reveal variant="fade-up" delay={120} className="text-ink">
          <LeadForm companyName={company.name} phone={company.phone} serviceOptions={serviceOptions} compact />
        </Reveal>
      </div>
    </Section>
  );
}
