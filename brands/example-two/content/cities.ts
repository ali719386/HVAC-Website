import type { CityInput } from "@/content/types";

// TODO: placeholder content for the example brand.
export const cities: CityInput[] = [
  {
    slug: "lakewood-co",
    city: "Lakewood",
    state: "CO",
    zips: ["80214", "80215", "80226", "80227", "80228", "80232"],
    page: {
      intro: "Lakewood sits right against the foothills, with homes from post-war ranches to new builds near the hogback.",
      localNotes: [
        "Many mid-century homes were built without central air, which makes ductless systems a popular choice.",
        "Large day-to-night temperature swings put extra cycling load on heating equipment.",
      ],
      neighborhoods: ["Belmar area", "Green Mountain"],
    },
    placeholder: true,
  },
  {
    slug: "arvada-co",
    city: "Arvada",
    state: "CO",
    zips: ["80002", "80003", "80004", "80005"],
    page: {
      intro: "Arvada homeowners often ask about upgrading aging furnaces and adding efficient cooling at the same time.",
      localNotes: ["Dual-fuel systems are a common upgrade path when both furnace and AC are near end of life."],
      neighborhoods: ["Olde Town Arvada area"],
    },
    placeholder: true,
  },
  { slug: "denver-co", city: "Denver", state: "CO", zips: ["80202", "80203", "80204", "80205", "80206"], placeholder: true },
  { slug: "golden-co", city: "Golden", state: "CO", zips: ["80401"], placeholder: true },
  { slug: "wheat-ridge-co", city: "Wheat Ridge", state: "CO", zips: ["80033"], placeholder: true },
];
