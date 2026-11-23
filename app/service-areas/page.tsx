import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getBrand, getServiceZips } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { PageHeader } from "@/components/ui/page-header";
import { CtaBand } from "@/components/home/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  const names = content.cities.map((c) => c.city).join(", ");
  return pageMetadata({
    title: "Service Areas",
    description: `${config.company.name} provides heating and cooling service in ${names}.`,
    path: "/service-areas",
  });
}

export default function ServiceAreasPage() {
  const { config, content } = getBrand();
  const c = content.copy.serviceArea;
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Service Areas", href: "/service-areas" }]} />
      <div className="container-site section-y grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl font-extrabold">Communities we serve</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {content.cities.map((city) => (
              <li key={city.slug}>
                {city.page ? (
                  <Link
                    href={`/service-areas/${city.slug}`}
                    className="flex items-center justify-between gap-3 rounded-brand-sm border border-line bg-surface p-4 font-semibold transition-colors hover:border-primary hover:text-primary"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="size-4 text-accent" aria-hidden="true" />
                      {city.city}, {city.state}
                    </span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 rounded-brand-sm border border-line bg-surface-alt p-4 font-semibold">
                    <MapPin className="size-4 text-accent" aria-hidden="true" />
                    {city.city}, {city.state}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-6 text-2xl font-extrabold">Check your ZIP code</h2>
          <ServiceAreaChecker areas={getServiceZips()} phone={config.company.phone} />
        </div>
      </div>
      <CtaBand config={config} copy={content.copy.ctaBand} />
    </>
  );
}
