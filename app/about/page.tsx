import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { BrandImage } from "@/components/ui/brand-image";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { TrustList } from "@/components/layout/trust-list";
import { CtaBand, StatsCounter } from "@/components/home/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: content.copy.about.title,
    description: `${content.copy.about.intro} Serving ${config.company.address.city}, ${config.company.address.state} and nearby communities.`,
    path: "/about",
  });
}

export default function AboutPage() {
  const { config, content } = getBrand();
  const about = content.copy.about;
  const values = about.values.length > 0 ? about.values : content.whyChooseUs;
  return (
    <>
      <PageHeader title={about.title} intro={about.intro} crumbs={[{ name: "About", href: "/about" }]} />
      <Section tone="light">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <BrandImage image={config.images.about} sizes="(min-width: 1024px) 560px, 100vw" aspect="aspect-[4/3]" />
          <div>
            <h2 className="text-3xl font-extrabold">{config.company.tagline}</h2>
            <div className="mt-5 grid gap-4 text-lg leading-relaxed text-muted">
              {about.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <TrustList company={config.company} className="mt-8 text-ink" />
          </div>
        </div>
      </Section>
      {values.length > 0 ? (
        <Section tone="alt" labelledBy="values-title">
          <SectionHeading id="values-title" eyebrow={content.copy.whyChooseUs.eyebrow} title={content.copy.whyChooseUs.title} align="center" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v.title} className="rounded-brand border border-line bg-surface p-7 shadow-brand-sm">
                <span className="grid size-12 place-items-center rounded-brand-sm bg-primary text-on-primary">
                  <Icon name={v.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      <StatsCounter stats={config.company.stats} copy={content.copy.stats} />
      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
