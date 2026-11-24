import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { Phone } from "lucide-react";
import { getBrand } from "@/lib/brand";
import type { ContactSectionKey } from "@/lib/brand/schema";
import { clientAreas } from "@/lib/geo/coverage";
import { pageMetadata } from "@/lib/seo/meta";
import { MapBlock } from "@/components/contact/map-block";
import { OpenNowBadge } from "@/components/contact/open-badge";
import { NextSteps, QuickContactCards, SafetyStrip } from "@/components/contact/sections";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { BrandLeadForm } from "@/components/forms/brand-lead-form";
import { WhereWeWork } from "@/components/geo/sections";
import { CtaBand, FaqAccordion } from "@/components/home/sections";
import { ContactCard } from "@/components/layout/contact-card";
import { PageHero } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  const { company } = config;
  return pageMetadata({
    title: content.copy.contact.title,
    description: `Contact ${company.name}. Call ${company.phone.display}, email us or send a service request online.`,
    path: "/contact",
  });
}

export default function ContactPage() {
  const { config, content } = getBrand();
  const { company } = config;
  const c = content.copy.contact;
  const cp = content.copy.contactPage;
  const badge = { open: cp.hero.openNow, closed: cp.hero.closedNow };
  const address = `${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zip}`;
  const directions = config.contact.mapLink ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const render = (key: ContactSectionKey): ReactNode => {
    switch (key) {
      case "quick":
        return <QuickContactCards config={config} copy={cp.quick} />;
      case "main":
        return (
          <Section tone="alt" labelledBy="contact-form-title">
            <h2 id="contact-form-title" className="sr-only">
              {cp.form.title}
            </h2>
            <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
              <aside aria-label={cp.info.title} className="lg:sticky lg:top-28 lg:self-start">
                <ContactCard config={config} copy={cp.info} badge={badge} />
              </aside>
              <BrandLeadForm simple title={cp.form.title} />
            </div>
          </Section>
        );
      case "safety":
        return <SafetyStrip title={cp.safety.title} text={config.contact.safetyNotice} />;
      case "steps":
        return <NextSteps copy={cp.steps} responseTimeText={config.contact.responseTimeText} />;
      case "map":
        return (
          <Section tone="light" labelledBy="map-title">
            <SectionHeading id="map-title" eyebrow={cp.map.eyebrow} title={cp.map.title} intro={cp.map.intro} />
            <div className="mt-8">
              <MapBlock
                query={address}
                directionsUrl={directions}
                addressLines={[company.address.street, `${company.address.city}, ${company.address.state} ${company.address.zip}`]}
                labels={cp.map}
              />
            </div>
          </Section>
        );
      case "areas":
        return (
          <>
            <WhereWeWork copy={content.copy.serviceAreas} />
            <Section tone="alt" labelledBy="contact-check-title" className="pt-0!">
              <div className="mx-auto max-w-3xl">
                <h2 id="contact-check-title" className="mb-5 text-2xl font-extrabold">
                  {content.copy.serviceAreas.checkTitle}
                </h2>
                <ServiceAreaChecker areas={clientAreas()} phone={company.phone} />
              </div>
            </Section>
          </>
        );
      case "faq":
        return config.contact.faqs.length > 0 ? (
          <FaqAccordion faqs={config.contact.faqs} copy={{ ...content.copy.faq, ...cp.faq }} phone={company.phone} />
        ) : null;
      case "cta":
        return (
          <div className="pt-[var(--brand-section-y)]">
            <CtaBand config={config} copy={cp.cta} callOnly />
          </div>
        );
    }
  };

  return (
    <>
      <PageHero
        compact
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro || undefined}
        crumbs={[{ name: "Contact", href: "/contact" }]}
        ctas={{ primary: { label: cp.hero.book, href: "/book" }, call: { label: cp.hero.call, phone: company.phone } }}
        aside={
          <div className="rounded-brand bg-surface p-6 text-ink shadow-brand-lg">
            <div className="flex items-center justify-between gap-3">
              <p className="font-heading text-lg font-bold">{cp.hero.asideTitle}</p>
              <OpenNowBadge hours={company.hours} timeZone={company.timezone} labels={badge} />
            </div>
            <p className="mt-1 text-sm text-muted">{cp.hero.asideBody}</p>
            <a href={`tel:${company.phone.tel}`} className="mt-4 flex items-center gap-3 font-heading text-2xl font-extrabold text-primary hover:underline">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              {company.phone.display}
            </a>
          </div>
        }
      />
      {config.contactPage.sections
        .filter((s) => s.enabled)
        .map((s) => (
          <Fragment key={s.key}>{render(s.key)}</Fragment>
        ))}
    </>
  );
}
