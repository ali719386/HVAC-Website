import type { CoverageInput } from "@/content/types";

/*
 * Coverage: states and cities served (imported into config.coverage).
 * Every entry is placeholder: true, so its page is noindex and left out of the sitemap until real
 * local content is written and the entry is switched to placeholder: false.
 * TODO: confirm every state and city with the client, add real intros and local notes, and verify
 * licensing and insurance requirements in each state before advertising it.
 * Never invent ZIP codes: keep zips empty until real data is provided (npm run geo:zips).
 * Keep one entry per line (scripts/check-placeholders.mjs reads this file).
 */
export const coverage: CoverageInput = {
  headquarters: "Headquartered in Columbus, OH", // TODO: confirm or remove
  states: [
    // Cooling
    { abbr: "TX", climate: "cooling", placeholder: true },
    { abbr: "FL", climate: "cooling", placeholder: true },
    { abbr: "AZ", climate: "cooling", placeholder: true },
    { abbr: "GA", climate: "cooling", placeholder: true },
    { abbr: "NV", climate: "cooling", placeholder: true },
    { abbr: "NC", climate: "cooling", placeholder: true },
    { abbr: "LA", climate: "cooling", placeholder: true },
    { abbr: "TN", climate: "cooling", placeholder: true },
    // Heating
    { abbr: "OH", climate: "heating", placeholder: true },
    { abbr: "MI", climate: "heating", placeholder: true },
    { abbr: "IL", climate: "heating", placeholder: true },
    { abbr: "MN", climate: "heating", placeholder: true },
    { abbr: "PA", climate: "heating", placeholder: true },
    { abbr: "NY", climate: "heating", placeholder: true },
    { abbr: "MA", climate: "heating", placeholder: true },
    { abbr: "CO", climate: "heating", placeholder: true },
    { abbr: "WI", climate: "heating", placeholder: true },
    // Mixed
    { abbr: "CA", climate: "mixed", placeholder: true },
    { abbr: "WA", climate: "mixed", placeholder: true },
    { abbr: "VA", climate: "mixed", placeholder: true },
    { abbr: "MD", climate: "mixed", placeholder: true },
    { abbr: "MO", climate: "mixed", placeholder: true },
    { abbr: "IN", climate: "mixed", placeholder: true },
  ],
  cities: [
    // Cooling
    { name: "Houston", stateAbbr: "TX", slug: "houston", primary: true, zips: [], placeholder: true },
    { name: "Dallas", stateAbbr: "TX", slug: "dallas", zips: [], placeholder: true },
    { name: "Austin", stateAbbr: "TX", slug: "austin", zips: [], placeholder: true },
    { name: "Miami", stateAbbr: "FL", slug: "miami", primary: true, zips: [], placeholder: true },
    { name: "Tampa", stateAbbr: "FL", slug: "tampa", zips: [], placeholder: true },
    { name: "Orlando", stateAbbr: "FL", slug: "orlando", zips: [], placeholder: true },
    { name: "Phoenix", stateAbbr: "AZ", slug: "phoenix", primary: true, zips: [], placeholder: true },
    { name: "Las Vegas", stateAbbr: "NV", slug: "las-vegas", zips: [], placeholder: true },
    { name: "Atlanta", stateAbbr: "GA", slug: "atlanta", primary: true, zips: [], placeholder: true },
    { name: "Charlotte", stateAbbr: "NC", slug: "charlotte", zips: [], placeholder: true },
    { name: "Nashville", stateAbbr: "TN", slug: "nashville", zips: [], placeholder: true },
    // Heating
    { name: "Columbus", stateAbbr: "OH", slug: "columbus", primary: true, zips: [], placeholder: true },
    { name: "Cleveland", stateAbbr: "OH", slug: "cleveland", zips: [], placeholder: true },
    { name: "Detroit", stateAbbr: "MI", slug: "detroit", zips: [], placeholder: true },
    { name: "Chicago", stateAbbr: "IL", slug: "chicago", primary: true, zips: [], placeholder: true },
    { name: "Minneapolis", stateAbbr: "MN", slug: "minneapolis", zips: [], placeholder: true },
    { name: "Pittsburgh", stateAbbr: "PA", slug: "pittsburgh", zips: [], placeholder: true },
    { name: "Boston", stateAbbr: "MA", slug: "boston", zips: [], placeholder: true },
    { name: "Denver", stateAbbr: "CO", slug: "denver", primary: true, zips: [], placeholder: true },
    // Mixed
    { name: "Sacramento", stateAbbr: "CA", slug: "sacramento", zips: [], placeholder: true },
    { name: "San Diego", stateAbbr: "CA", slug: "san-diego", zips: [], placeholder: true },
    { name: "Seattle", stateAbbr: "WA", slug: "seattle", primary: true, zips: [], placeholder: true },
    { name: "Richmond", stateAbbr: "VA", slug: "richmond", zips: [], placeholder: true },
    { name: "St. Louis", stateAbbr: "MO", slug: "st-louis", zips: [], placeholder: true },
    { name: "Indianapolis", stateAbbr: "IN", slug: "indianapolis", zips: [], placeholder: true },
  ],
};
