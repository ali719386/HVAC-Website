import { hoursText } from "@/lib/hours";
import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Brand } from "@/lib/brand/schema";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { TrustList } from "@/components/layout/trust-list";
import { coverageCounts, coverageLabel } from "@/lib/geo/coverage";

/** Hero text entrance stagger: n x the brand motion stagger (CSS only; off when motion is disabled). */
const delay = (step: number) => ({ animationDelay: `calc(var(--motion-stagger) * ${step})` });

export function Hero({ brand }: { brand: Brand }) {
  const { config, content } = brand;
  const { company } = config;
  const variant = config.homepage.heroVariant;
  const copy = content.copy.hero;
  const text = copy[variant];
  const firstHours = company.hours[0];
  const counts = coverageCounts();

  const quick = [
    { icon: Phone, label: "Call us", value: company.phone.display, href: `tel:${company.phone.tel}` },
    firstHours && { icon: Clock, label: firstHours.label, value: hoursText(firstHours) },
    counts.cities + counts.states > 0 && {
      icon: MapPin,
      label: content.copy.serviceAreas.section.eyebrow,
      value: coverageLabel(content.copy.serviceAreas.topBar, counts),
      href: "/service-areas",
    },
  ].filter((q) => q !== undefined && q !== false);

  return (
    <section aria-labelledby="hero-title" data-tone="alt" className="relative overflow-hidden bg-surface-alt text-ink">
      <div className="container-site grid items-center gap-12 pt-10 pb-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-14 lg:pb-20">
        <div>
          <p
            className="animate-fade-up inline-flex items-center rounded-full bg-surface px-6 py-2.5 text-[0.95rem] font-semibold shadow-brand-sm"
            style={delay(0)}
          >
            {text.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="animate-fade-up mt-7 text-[2.25rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]"
            style={delay(1)}
          >
            {text.title}
          </h1>
          <p className="animate-fade-up mt-7 max-w-xl text-lg leading-[1.8] text-muted sm:text-xl" style={delay(2)}>
            {text.subtitle}
          </p>
          <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={delay(3)}>
            <LinkButton href="/book" variant="accent" size="lg">
              {copy.primaryCta}
            </LinkButton>
            <CallButton phone={company.phone} variant="outline" size="lg" label={<span>Call {company.phone.display}</span>} />
          </div>
          <div className="animate-fade-up" style={delay(4)}>
            <TrustList company={company} className="mt-8" />
          </div>
        </div>

        {/* Hero image is above the fold and never animates (LCP). */}
        <div className="relative">
          <BrandImage
            image={config.images.hero}
            preload
            sizes="(min-width: 1024px) 580px, 100vw"
            aspect="aspect-[4/3] lg:aspect-[5/4]"
            className="rounded-[calc(var(--brand-radius)*2)] shadow-brand-lg"
          />
          <div
            className="animate-fade-up absolute -bottom-5 left-4 flex items-center gap-3 rounded-brand bg-surface px-5 py-4 shadow-brand-lg sm:left-6"
            style={delay(5)}
          >
            <span className="grid size-11 place-items-center rounded-full bg-accent text-on-accent">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-base leading-tight font-bold">{copy.badge}</span>
          </div>
          {config.offerings.emergency24x7 ? (
            <p className="absolute top-5 right-5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold tracking-wide text-on-accent uppercase shadow-brand-md">
              24/7 Emergency
            </p>
          ) : null}
        </div>
      </div>

      <div className="animate-fade-up container-site relative z-10 pb-14 lg:pb-20" style={delay(5)}>
        <ul className="grid overflow-hidden rounded-brand bg-surface shadow-brand-md sm:grid-cols-3">
          {quick.map(({ icon: I, label, value, href }) => {
            const inner = (
              <>
                <span className="grid size-12 shrink-0 place-items-center rounded-brand-sm bg-primary text-on-primary">
                  <I className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="block font-heading text-lg font-bold">{value}</span>
                </span>
              </>
            );
            return (
              <li key={label} className="border-line not-last:border-b sm:not-last:border-r sm:not-last:border-b-0">
                {href ? (
                  <a href={href} className="flex items-center gap-4 p-5 transition-colors hover:bg-surface-alt lg:p-7">
                    {inner}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-5 lg:p-7">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
