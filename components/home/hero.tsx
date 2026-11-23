import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Brand } from "@/lib/brand/schema";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { TrustList } from "@/components/layout/trust-list";

/** Staggered entrance delay for hero items (CSS only; disabled by prefers-reduced-motion). */
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero({ brand }: { brand: Brand }) {
  const { config, content } = brand;
  const { company } = config;
  const variant = config.homepage.heroVariant;
  const copy = content.copy.hero;
  const text = copy[variant];
  const firstHours = company.hours[0];
  const mainCity = content.cities[0];

  const quick = [
    { icon: Phone, label: "Call us", value: company.phone.display, href: `tel:${company.phone.tel}` },
    firstHours && { icon: Clock, label: firstHours.days, value: firstHours.hours },
    mainCity && {
      icon: MapPin,
      label: "Serving",
      value: `${mainCity.city}, ${mainCity.state} & nearby`,
      href: "/service-areas",
    },
  ].filter((q) => q !== undefined);

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-surface-alt text-ink">
      <div className="container-site grid items-center gap-12 pt-14 pb-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-24 lg:pb-20">
        <div>
          <p
            className="animate-fade-up inline-flex items-center rounded-full bg-surface px-6 py-2.5 text-[0.95rem] font-semibold shadow-brand-sm"
            style={delay(0)}
          >
            {text.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="animate-fade-up mt-7 text-[2.6rem] leading-[1.04] font-extrabold tracking-[-0.03em] sm:text-6xl lg:text-[4.5rem]"
            style={delay(120)}
          >
            {text.title}
          </h1>
          <p className="animate-fade-up mt-7 max-w-xl text-lg leading-[1.8] text-muted sm:text-xl" style={delay(240)}>
            {text.subtitle}
          </p>
          <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={delay(360)}>
            <LinkButton href="/book" variant="accent" size="lg">
              {copy.primaryCta}
            </LinkButton>
            <CallButton phone={company.phone} variant="outline" size="lg" label={<span>Call {company.phone.display}</span>} />
          </div>
          <div className="animate-fade-up" style={delay(480)}>
            <TrustList company={company} className="mt-8" />
          </div>
        </div>

        <div className="animate-slide-in relative" style={delay(150)}>
          <div className="animate-float">
            <BrandImage
              image={config.images.hero}
              preload
              sizes="(min-width: 1024px) 580px, 100vw"
              aspect="aspect-[4/3] lg:aspect-square"
              className="rounded-[calc(var(--brand-radius)*2)] shadow-brand-lg"
            />
          </div>
          <div
            className="animate-fade-up absolute -bottom-5 left-4 flex items-center gap-3 rounded-brand bg-surface px-5 py-4 shadow-brand-lg sm:left-6"
            style={delay(700)}
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

      <div className="animate-fade-up container-site relative z-10 pb-14 lg:pb-20" style={delay(600)}>
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
