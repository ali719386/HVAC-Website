import type { CoverageInput } from "@/content/types";

/*
 * Coverage for the example brand: a small subset (3 cities in 2 states) so brand switching is easy to verify.
 * TODO: placeholder coverage. Add real local content, verify licensing per state, then set placeholder: false.
 * Never invent ZIP codes: keep zips empty until real data is provided (npm run geo:zips).
 * Keep one entry per line (scripts/check-placeholders.mjs reads this file).
 */
export const coverage: CoverageInput = {
  states: [
    { abbr: "CO", climate: "heating", placeholder: true },
    { abbr: "WY", climate: "heating", placeholder: true },
  ],
  cities: [
    { name: "Lakewood", stateAbbr: "CO", slug: "lakewood", primary: true, zips: [], neighborhoods: ["Belmar area", "Green Mountain"], placeholder: true },
    { name: "Arvada", stateAbbr: "CO", slug: "arvada", primary: true, zips: [], placeholder: true },
    { name: "Cheyenne", stateAbbr: "WY", slug: "cheyenne", primary: true, zips: [], placeholder: true },
  ],
};
