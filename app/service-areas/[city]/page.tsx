import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { getBrand, getCityPages, getServiceZips } from "@/lib/brand";
import { cityLd, JsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { CallButton, LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/home/sections";

type Props = { params: Promise<{ city: string }> };

export const dynamicParams = false;

/** Only cities with real local content (config `page`) get a page. No thin duplicates. */
export function generateStaticParams() {
  return getCityPages().map((c) => ({ city: c.slug }));
}

const findCity = (slug: string) => getCityPages().find((c) => c.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = findCity((await params).city);
  if (!city?.page) return {};
  const { config } = getBrand();
  return pageMetadata({
    title: `Heating & AC Service in ${city.city}, ${city.state}`,
    description: `${city.page.intro} ${config.company.name} serves ZIP codes ${city.zips.slice(0, 4).join(", ")}${city.zips.length > 4 ? " and more" : ""}.`.slice(0, 300),
    path: `/service-areas/${city.slug}`,
  });
}

export default async function CityPage({ params }: Props) {
  const city = findCity((await params).city);
  if (!city?.page) notFound();
  const brand = getBrand();
  const { config, content } = brand;
  const { page } = city;

  return (
    <>
      <JsonLd data={cityLd(city)} />
      <PageHeader
        eyebrow="Service area"
        title={`Heating & cooling in ${city.city}, ${city.state}`}
        intro={page.intro}
        crumbs={[
          { name: "Service Areas", href: "/service-areas" },
          { name: `${city.city}, ${city.state}`, href: `/service-areas/${city.slug}` },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/book" variant="accent" size="lg">
            {content.copy.hero.primaryCta}
          </LinkButton>
          <CallButton phone={config.company.phone} variant="ghost" size="lg" />
        </div>
      </PageHeader>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[1fr_26rem] lg:gap-16">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">What we see in {city.city} homes</h2>
          <ul className="mt-6 grid gap-4">
            {page.localNotes.map((n) => (
              <li key={n} className="flex items-start gap-3 rounded-brand-sm border border-line bg-surface-alt p-5">
                <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="leading-relaxed">{n}</span>
              </li>
            ))}
          </ul>
          {page.neighborhoods.length > 0 ? (
            <>
              <h2 className="mt-12 text-2xl font-extrabold">Neighborhoods we serve</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {page.neighborhoods.map((n) => (
                  <li key={n} className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold">
                    {n}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <h2 className="mt-12 text-2xl font-extrabold">ZIP codes</h2>
          <p className="mt-3 text-muted">{city.zips.join(", ")}</p>
        </div>
        <aside>
          <h2 className="mb-5 text-xl font-extrabold">Confirm your address is covered</h2>
          <ServiceAreaChecker areas={getServiceZips()} phone={config.company.phone} />
        </aside>
      </div>

      <Section tone="alt" labelledBy="city-services">
        <h2 id="city-services" className="text-3xl font-extrabold">
          Services in {city.city}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group flex h-full items-start gap-4 rounded-brand border border-line bg-surface p-5 transition-shadow hover:shadow-brand-md">
                <span className="grid size-11 shrink-0 place-items-center rounded-brand-sm bg-primary text-on-primary">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 font-heading font-bold group-hover:text-primary">
                    {s.title} <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-sm text-muted">{s.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
