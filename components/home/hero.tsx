import { Clock, Flame, MapPin, Phone, ShieldCheck, Snowflake } from "lucide-react";
import type { Brand } from "@/lib/brand/schema";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { TrustList } from "@/components/layout/trust-list";

export function Hero({ brand }: { brand: Brand }) {
  const { config, content } = brand;
  const { company } = config;
  const variant = config.homepage.heroVariant;
  const copy = content.copy.hero;
  const text = copy[variant];
  const SeasonIcon = variant === "winter" ? Flame : Snowflake;
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
    <section aria-labelledby="hero-title" className="relative bg-primary-dark text-on-primary">
      <div className="container-site grid items-center gap-12 pt-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-on-primary/10 px-4 py-1.5 text-sm font-semibold">
            <SeasonIcon className="size-4 text-accent" aria-hidden="true" />
            {text.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-5 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
            {text.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-on-primary/85 sm:text-xl">{text.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/book" variant="accent" size="lg">
              {copy.primaryCta}
            </LinkButton>
            <CallButton phone={company.phone} variant="ghost" size="lg" label={<span>Call {company.phone.display}</span>} />
          </div>
          <TrustList company={company} onDark className="mt-8 text-on-primary/90" />
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-3 translate-x-5 translate-y-5 rounded-brand border-2 border-accent/60" />
          <BrandImage
            image={config.images.hero}
            preload
            sizes="(min-width: 1024px) 560px, 100vw"
            aspect="aspect-[4/3] lg:aspect-[5/5.2]"
            className="shadow-brand-lg"
          />
          <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-brand bg-surface px-5 py-4 text-ink shadow-brand-lg sm:left-6">
            <span className="grid size-11 place-items-center rounded-full bg-accent text-on-accent">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-base leading-tight font-bold">{copy.badge}</span>
          </div>
          {config.offerings.emergency24x7 ? (
            <p className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold tracking-wide text-on-accent uppercase">
              24/7 Emergency
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 bg-[linear-gradient(to_bottom,transparent_50%,var(--brand-surface)_50%)]">
        <div className="container-site">
          <ul className="grid overflow-hidden rounded-brand bg-surface text-ink shadow-brand-lg sm:grid-cols-3">
            {quick.map(({ icon: I, label, value, href }) => {
              const inner = (
                <>
                  <span className="grid size-12 shrink-0 place-items-center rounded-brand-sm bg-surface-alt text-primary">
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
      </div>
    </section>
  );
}
