import type { Brand, City, Service } from "@/lib/brand/schema";
import { absoluteUrl } from "@/lib/brand";
import { assetExists } from "@/components/ui/brand-image";

type Ld = Record<string, unknown>;

/** Renders JSON-LD safely (escapes "<" so content can never close the script tag). */
export function JsonLd({ data }: { data: Ld }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbLd(trail: { name: string; href: string }[]): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

const businessId = () => `${absoluteUrl("/")}#business`;

const place = (c: Pick<City, "city" | "state">) => ({
  "@type": "City",
  name: `${c.city}, ${c.state}`,
});

/**
 * HVACBusiness (a LocalBusiness subtype). Built only from config.
 * Deliberately no aggregateRating/review markup and no FAQPage markup.
 */
export function businessLd({ config, content }: Brand): Ld {
  const { company, seo } = config;
  const ld: Ld = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": businessId(),
    name: company.name,
    legalName: company.legalName,
    description: seo.description,
    slogan: company.tagline,
    url: absoluteUrl("/"),
    telephone: company.phone.tel,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.zip,
      addressCountry: "US",
    },
    areaServed: content.cities.map(place),
    currenciesAccepted: "USD",
  };
  if (assetExists(company.logo.light)) ld.logo = absoluteUrl(company.logo.light);
  if (assetExists(seo.ogImage)) ld.image = absoluteUrl(seo.ogImage);
  if (company.socials.length) ld.sameAs = company.socials.map((s) => s.url);
  if (company.foundedYear) ld.foundingDate = String(company.foundedYear);
  return ld;
}

export function serviceLd(service: Service, brand: Brand): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.seoDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": businessId() },
    areaServed: brand.content.cities.map(place),
  };
}

/** City page: references the business and narrows areaServed to that city. */
export function cityLd(city: City): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `HVAC services in ${city.city}, ${city.state}`,
    serviceType: "Heating and air conditioning services",
    url: absoluteUrl(`/service-areas/${city.slug}`),
    provider: { "@id": businessId() },
    areaServed: { ...place(city), containedInPlace: { "@type": "State", name: city.state } },
  };
}
