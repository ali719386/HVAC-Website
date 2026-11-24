import { getBrand } from "@/lib/brand";
import type { BrandConfig, Climate, CoverageCity, CoverageState, Project, Service } from "@/lib/brand/schema";
import { getStateByAbbr, getStateBySlug } from "./states";

/** A covered city with its state resolved and its page URL. */
export type AreaCity = CoverageCity & {
  stateName: string;
  stateSlug: string;
  climate: Climate;
  label: string;
  href: string;
};

/** A covered state with its cities and page URL. */
export type AreaState = CoverageState & { name: string; slug: string; href: string; cities: AreaCity[] };

/** Serializable shape for client components (area checker, lead form selects, browsers). */
export type ClientArea = {
  abbr: string;
  name: string;
  climate: Climate;
  href: string;
  cities: { slug: string; name: string; href: string; primary: boolean; zips: string[] }[];
};

export const stateHref = (stateSlug: string) => `/service-areas/${stateSlug}`;
export const cityHref = (stateSlug: string, citySlug: string) => `/service-areas/${stateSlug}/${citySlug}`;

let cache: { states: AreaState[]; cities: AreaCity[] } | undefined;

/** Coverage from config with names, slugs and URLs resolved. Order follows config. */
export function getCoverage() {
  if (cache) return cache;
  const { coverage } = getBrand().config;
  const states: AreaState[] = coverage.states.map((s) => {
    const geo = getStateByAbbr(s.abbr);
    const name = geo?.name ?? s.abbr;
    const slug = geo?.slug ?? s.abbr.toLowerCase();
    const cities = coverage.cities
      .filter((c) => c.stateAbbr === s.abbr)
      .map((c) => ({ ...c, stateName: name, stateSlug: slug, climate: s.climate, label: `${c.name}, ${s.abbr}`, href: cityHref(slug, c.slug) }));
    return { ...s, name, slug, href: stateHref(slug), cities };
  });
  cache = { states, cities: states.flatMap((s) => s.cities) };
  return cache;
}

export const findState = (slug: string) => getCoverage().states.find((s) => s.slug === slug);

export function findCity(stateSlug: string, citySlug: string) {
  return findState(stateSlug)?.cities.find((c) => c.slug === citySlug);
}

/** Exact name + state match only, so a project never links to a city that is not configured. */
export function findCityByName(name: string, stateAbbr: string) {
  const n = name.trim().toLowerCase();
  return getCoverage().cities.find((c) => c.stateAbbr === stateAbbr && c.name.toLowerCase() === n);
}

/** Same state first, then same climate. */
export function nearbyCities(city: AreaCity, limit = 6) {
  const others = getCoverage().cities.filter((c) => c !== city);
  return [...others.filter((c) => c.stateAbbr === city.stateAbbr), ...others.filter((c) => c.stateAbbr !== city.stateAbbr && c.climate === city.climate)].slice(0, limit);
}

export const primaryCities = (limit = 8) => getCoverage().cities.filter((c) => c.primary).slice(0, limit);

/** Fills {cities} and {states} in a label such as "Serving {cities} cities in {states} states". */
export const coverageLabel = (template: string, counts: { cities: number; states: number }) =>
  template.replaceAll("{cities}", String(counts.cities)).replaceAll("{states}", String(counts.states));

export function coverageCounts() {
  const { states, cities } = getCoverage();
  return { states: states.length, cities: cities.length };
}

/**
 * License to display. With a state context: only that state's configured license.
 * Without one: only the default company.licenseNumber. Never implies licensing elsewhere.
 */
export function licenseFor(company: BrandConfig["company"], stateAbbr?: string): string | undefined {
  if (stateAbbr) return company.licenses.find((l) => l.stateAbbr === stateAbbr)?.number;
  return company.licenseNumber;
}

/** Replaces {city} and {state} tokens in climate templates. */
export const fillTokens = (template: string, values: { city?: string; state: string }) =>
  template.replaceAll("{city}", values.city ?? values.state).replaceAll("{state}", values.state);

/** Brand services reordered by the climate profile's emphasis (unlisted services keep their order at the end). */
export function emphasizedServices(services: Service[], climate: Climate) {
  const order = getBrand().content.climate[climate].services;
  const rank = (s: Service) => {
    const i = order.indexOf(s.slug);
    return i === -1 ? order.length : i;
  };
  return [...services].sort((a, b) => rank(a) - rank(b));
}

/** City page for a project's city, if that city is configured. */
export const projectCity = (p: Pick<Project, "city" | "state">) => findCityByName(p.city, p.state);

/** Serializable coverage for client components. */
export function clientAreas(): ClientArea[] {
  return getCoverage().states.map((s) => ({
    abbr: s.abbr,
    name: s.name,
    climate: s.climate,
    href: s.href,
    cities: s.cities.map((c) => ({ slug: c.slug, name: c.name, href: c.href, primary: c.primary, zips: c.zips })),
  }));
}

export { getStateBySlug };
