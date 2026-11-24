import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { emphasizedServices, fillTokens, findState, getCoverage, licenseFor } from "@/lib/geo/coverage";
import { JsonLd, stateLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { CityLinks, EmphasizedServices, PromoNote } from "@/components/geo/area-page";
import { PlaceholderNotice } from "@/components/geo/sections";
import { CtaBand, FaqAccordion } from "@/components/home/sections";
import { TrustList } from "@/components/layout/trust-list";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/ui/page-header";
import { BrandImage } from "@/components/ui/brand-image";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/ui/section";

type Props = { params: Promise<{ state: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCoverage().states.map((s) => ({ state: s.slug }));
}

function load(slug: string) {
  const state = findState(slug);
  if (!state) return undefined;
  const brand = getBrand();
  const profile = brand.content.climate[state.climate];
  const sa = brand.content.copy.serviceAreas;
  const title = fillTokens(sa.state.title, { state: state.name });
  const intro = state.intro ?? fillTokens(profile.intro, { state: state.name });
  return { brand, state, profile, sa, title, intro };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = load((await params).state);
  if (!d) return {};
  return pageMetadata({
    title: d.title,
    description: d.intro.slice(0, 300),
    path: d.state.href,
    // Placeholder pages stay out of search until real local content is written.
    noindex: Boolean(d.state.placeholder),
  });
}

export default async function StatePage({ params }: Props) {
  const d = load((await params).state);
  if (!d) notFound();
  const { brand, state, profile, sa, title, intro } = d;
  const { config, content } = brand;
  const license = licenseFor(config.company, state.abbr);
  const topService = emphasizedServices(content.services, state.climate)[0];

  return (
    <>
      <JsonLd data={stateLd(state, title)} />
      <PlaceholderNotice show={Boolean(state.placeholder)} text={sa.placeholderNotice} />
      <PageHero
        image={config.images.serviceAreas}
        eyebrow={`${sa.state.eyebrow} · ${profile.label}`}
        title={title}
        intro={intro}
        crumbs={[
          { name: "Service Areas", href: "/service-areas" },
          { name: state.name, href: state.href },
        ]}
        ctas={{ primary: { label: content.copy.hero.primaryCta, href: `/book?state=${state.abbr}` }, call: { label: content.copy.servicesPage.hero.callCta, phone: config.company.phone } }}
      >
        <TrustList company={config.company} stateAbbr={state.abbr} onDark variant="chips" />
      </PageHero>

      <Section tone="light" labelledBy="state-cities-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="fade-up">
            <SectionHeading id="state-cities-title" title={fillTokens(sa.state.citiesTitle, { state: state.name })} />
            <div className="mt-6">
              {state.cities.length > 0 ? (
                <CityLinks cities={state.cities} />
              ) : (
                <p className="rounded-brand border border-line bg-surface-alt p-5 text-muted">{fillTokens(sa.state.noCities, { state: state.name })}</p>
              )}
            </div>
            {license ? (
              <p className="mt-6 text-sm font-semibold">{sa.state.license.replace("{state}", state.name).replace("{number}", license)}</p>
            ) : null}
            {/* Photo of the service this climate leans on most (from the brand's own service images). */}
            {topService ? (
              <BrandImage
                image={topService.image}
                aspect="aspect-[4/3]"
                sizes="(min-width: 1024px) 560px, 100vw"
                className="mt-8 shadow-brand-md"
                reveal="mask-up"
              />
            ) : null}
            {content.whyChooseUs.length > 0 ? (
              <div className="mt-8 rounded-brand border border-line bg-surface-alt p-6">
                <h3 className="text-xl font-bold">{fillTokens(sa.state.whyTitle, { state: state.name })}</h3>
                <ul className="mt-5 grid gap-4">
                  {content.whyChooseUs.map((it) => (
                    <li key={it.title} className="flex gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-brand-sm bg-surface text-accent shadow-brand-sm">
                        <Icon name={it.icon} className="size-5" />
                      </span>
                      <span>
                        <span className="block font-semibold">{it.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-muted">{it.body}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">{fillTokens(sa.state.servicesTitle, { state: state.name })}</h2>
            <div className="mt-6 grid gap-5">
              <PromoNote text={profile.promo} href={`/book?state=${state.abbr}`} cta={content.copy.hero.primaryCta} />
              <EmphasizedServices services={content.services} climate={state.climate} />
            </div>
          </div>
        </div>
      </Section>

      <FaqAccordion
        faqs={profile.faqs}
        copy={{ ...content.copy.faq, eyebrow: content.copy.faq.eyebrow, title: fillTokens(sa.state.faqTitle, { state: state.name }), intro: "" }}
        phone={config.company.phone}
      />

      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
