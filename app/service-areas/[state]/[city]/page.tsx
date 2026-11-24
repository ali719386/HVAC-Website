import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { getBrand } from "@/lib/brand";
import { fillTokens, findCity, getCoverage, nearbyCities, projectCity } from "@/lib/geo/coverage";
import { cityLd, JsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { BrandLeadForm } from "@/components/forms/brand-lead-form";
import { CityLinks, EmphasizedServices, PromoNote } from "@/components/geo/area-page";
import { PlaceholderNotice } from "@/components/geo/sections";
import { CtaBand, FaqAccordion } from "@/components/home/sections";
import { TrustList } from "@/components/layout/trust-list";
import { RevealGroup } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/projects/card";
import { CallButton } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";

type Props = { params: Promise<{ state: string; city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCoverage().cities.map((c) => ({ state: c.stateSlug, city: c.slug }));
}

function load(stateSlug: string, citySlug: string) {
  const city = findCity(stateSlug, citySlug);
  if (!city) return undefined;
  const brand = getBrand();
  const profile = brand.content.climate[city.climate];
  const sa = brand.content.copy.serviceAreas;
  const title = fillTokens(sa.city.title, { city: city.name, state: city.stateAbbr });
  // City-specific intro when written; otherwise the climate template with this city's name.
  const intro = city.intro ?? fillTokens(profile.intro, { city: city.name, state: city.stateName });
  return { brand, city, profile, sa, title, intro };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const d = load(p.state, p.city);
  if (!d) return {};
  return pageMetadata({
    title: d.title,
    description: d.intro.slice(0, 300),
    path: d.city.href,
    // Placeholder pages stay out of search until real local content is written.
    noindex: Boolean(d.city.placeholder),
  });
}

export default async function CityPage({ params }: Props) {
  const p = await params;
  const d = load(p.state, p.city);
  if (!d) notFound();
  const { brand, city, profile, sa, title, intro } = d;
  const { config, content } = brand;
  const fill = (t: string) => fillTokens(t, { city: city.name, state: city.stateName });
  const bookHref = `/book?state=${city.stateAbbr}&city=${encodeURIComponent(city.name)}`;
  const nearby = nearbyCities(city);
  const projects = content.projects.filter((pr) => projectCity(pr) === city).slice(0, 3);
  const state = getCoverage().states.find((s) => s.abbr === city.stateAbbr);

  return (
    <>
      <JsonLd data={cityLd(city, title)} />
      <PlaceholderNotice show={Boolean(city.placeholder)} text={sa.placeholderNotice} />
      <PageHero
        image={config.images.serviceAreas}
        eyebrow={`${sa.city.eyebrow} · ${profile.label}`}
        title={title}
        intro={intro}
        crumbs={[
          { name: "Service Areas", href: "/service-areas" },
          { name: city.stateName, href: state?.href ?? "/service-areas" },
          { name: city.name, href: city.href },
        ]}
        ctas={{ primary: { label: content.copy.hero.primaryCta, href: bookHref }, call: { label: content.copy.servicesPage.hero.callCta, phone: config.company.phone } }}
      >
        <TrustList company={config.company} stateAbbr={city.stateAbbr} onDark variant="chips" />
      </PageHero>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        <div className="grid min-w-0 content-start gap-12">
          {city.localNotes.length > 0 ? (
            <section aria-labelledby="notes-title">
              <h2 id="notes-title" className="text-2xl font-extrabold sm:text-3xl">{sa.city.notesTitle}</h2>
              <ul className="mt-6 grid gap-3">
                {city.localNotes.map((n) => (
                  <li key={n} className="flex items-start gap-3 rounded-brand-sm border border-line bg-surface-alt p-5">
                    <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="leading-relaxed">{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="city-services-title">
            <h2 id="city-services-title" className="text-2xl font-extrabold sm:text-3xl">{fill(sa.city.servicesTitle)}</h2>
            <div className="mt-6 grid gap-5">
              <PromoNote text={profile.promo} href={bookHref} cta={content.copy.hero.primaryCta} />
              <EmphasizedServices services={content.services} climate={city.climate} />
            </div>
          </section>

          {city.neighborhoods.length > 0 ? (
            <section aria-labelledby="neighborhoods-title">
              <h2 id="neighborhoods-title" className="text-2xl font-extrabold">{sa.city.neighborhoodsTitle}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {city.neighborhoods.map((n) => (
                  <li key={n} className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold">
                    {n}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {city.zips.length > 0 ? (
            <section aria-labelledby="zips-title">
              <h2 id="zips-title" className="text-2xl font-extrabold">{sa.city.zipsTitle}</h2>
              <p className="mt-3 leading-relaxed text-muted">{city.zips.join(", ")}</p>
            </section>
          ) : null}
        </div>

        {/* Sticky on desktop; on phones it stacks below (the sticky mobile call bar stays). */}
        <aside aria-label={fill(sa.city.formTitle)} className="grid content-start gap-5 lg:sticky lg:top-28 lg:self-start">
          <CallButton phone={config.company.phone} variant="primary" size="lg" className="w-full" />
          <div className="text-ink">
            <BrandLeadForm compact title={fill(sa.city.formTitle)} defaultState={city.stateAbbr} defaultCity={city.name} />
          </div>
        </aside>
      </div>

      <FaqAccordion
        faqs={profile.faqs}
        copy={{ ...content.copy.faq, title: fill(sa.city.faqTitle), intro: "" }}
        phone={config.company.phone}
      />

      {projects.length > 0 ? (
        <Section tone="light" labelledBy="city-projects-title">
          <SectionHeading id="city-projects-title" title={fill(sa.city.projectsTitle)} />
          <RevealGroup as="ul" variant="fade-up" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((pr) => (
              <li key={pr.slug}>
                <ProjectCard project={pr} copy={content.copy.projectsPage} />
              </li>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {nearby.length > 0 ? (
        <Section tone={projects.length > 0 ? "alt" : "light"} labelledBy="nearby-title">
          <SectionHeading id="nearby-title" title={sa.city.nearbyTitle} />
          <div className="mt-8">
            <CityLinks cities={nearby} showState />
          </div>
        </Section>
      ) : null}

      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
