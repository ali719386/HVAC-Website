import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { getBrand, getService } from "@/lib/brand";
import { JsonLd, serviceLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { CtaBand } from "@/components/home/sections";
import { AvailableIn } from "@/components/geo/sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrand().content.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    image: service.image.src,
  });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const brand = getBrand();
  const { config, content } = brand;
  const others = content.services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd data={serviceLd(service)} />
      <PageHeader
        eyebrow="Services"
        title={service.title}
        intro={service.intro}
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href={`/book?service=${service.slug}`} variant="accent" size="lg">
            {content.copy.hero.primaryCta}
          </LinkButton>
          <CallButton phone={config.company.phone} variant="ghost" size="lg" />
        </div>
      </PageHeader>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <article>
          <BrandImage image={service.image} sizes="(min-width: 1024px) 760px, 100vw" aspect="aspect-[16/9]" />
          <div className="mt-10 grid gap-5 text-lg leading-relaxed text-muted">
            {service.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-extrabold sm:text-3xl">What&apos;s included</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-3 rounded-brand-sm border border-line bg-surface-alt p-4 font-medium">
                <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>

          {service.signs.length > 0 ? (
            <>
              <h2 className="mt-12 text-2xl font-extrabold sm:text-3xl">Signs you may need service</h2>
              <ul className="mt-6 grid gap-3">
                {service.signs.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className="mt-12 rounded-brand border border-line p-6">
            <AvailableIn copy={content.copy.serviceAreas} />
          </div>
        </article>

        <aside className="grid content-start gap-6 lg:sticky lg:top-28">
          <div className="rounded-brand bg-primary p-7 text-on-primary">
            <span className="grid size-12 place-items-center rounded-brand-sm bg-on-primary/10">
              <Icon name={service.icon} className="size-6" />
            </span>
            <p className="mt-4 font-heading text-xl font-bold">{content.copy.expert.title}</p>
            <p className="mt-2 text-on-primary/85">{content.copy.expert.intro}</p>
            <CallButton phone={config.company.phone} className="mt-6 w-full" />
          </div>
          <nav aria-label="Other services" className="rounded-brand border border-line p-6">
            <h2 className="font-heading text-lg font-bold">Other services</h2>
            <ul className="mt-4 grid gap-1">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/services/${o.slug}`}
                    className="flex items-center justify-between rounded-brand-sm px-3 py-2.5 font-medium hover:bg-surface-alt hover:text-primary"
                  >
                    {o.title}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <CtaBand config={config} copy={content.copy.ctaBand} />
    </>
  );
}
