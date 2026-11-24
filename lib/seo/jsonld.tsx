import type { Brand, Service } from "@/lib/brand/schema";
import { getCoverage, type AreaCity, type AreaState } from "@/lib/geo/coverage";
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

const statePlace = (s: Pick<AreaState, "name">) => ({ "@type": "State", name: s.name });
const cityPlace = (c: Pick<AreaCity, "name" | "stateName">) => ({
  "@type": "City",
  name: c.name,
  containedInPlace: { "@type": "State", name: c.stateName },
});

/** Every configured state and city. No per-city addresses or phone numbers are ever emitted. */
const coverageAreas = () => {
  const { states, cities } = getCoverage();
  return [...states.map(statePlace), ...cities.map(cityPlace)];
};

/**
 * HVACBusiness (a LocalBusiness subtype). Built only from config.
 * Deliberately no aggregateRating/review markup and no FAQPage markup.
 */
export function businessLd({ config }: Brand): Ld {
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
    areaServed: coverageAreas(),
    currenciesAccepted: "USD",
  };
  if (assetExists(company.logo.light)) ld.logo = absoluteUrl(company.logo.light);
  if (assetExists(seo.ogImage)) ld.image = absoluteUrl(seo.ogImage);
  if (company.socials.length) ld.sameAs = company.socials.map((s) => s.url);
  if (company.foundedYear) ld.foundingDate = String(company.foundedYear);
  return ld;
}

export function serviceLd(service: Service): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.seoDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": businessId() },
    areaServed: coverageAreas(),
  };
}

/** City page: references the business and narrows areaServed to that city (inside its state). */
export function cityLd(city: AreaCity, name: string): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: "Heating and air conditioning services",
    url: absoluteUrl(city.href),
    provider: { "@id": businessId() },
    areaServed: cityPlace(city),
  };
}

/** State page: same, narrowed to the state. */
export function stateLd(state: AreaState, name: string): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: "Heating and air conditioning services",
    url: absoluteUrl(state.href),
    provider: { "@id": businessId() },
    areaServed: statePlace(state),
  };
}