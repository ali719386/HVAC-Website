import type { CityInput } from "@/content/types";

/*
 * Service areas. A /service-areas/<slug> page is generated ONLY when `page` is present.
 * TODO: confirm ZIPs and replace local notes with the client's real local knowledge.
 */
export const cities: CityInput[] = [
  {
    slug: "columbus-oh",
    city: "Columbus",
    state: "OH",
    zips: ["43201", "43202", "43205", "43206", "43209", "43214", "43215", "43220", "43221"],
    page: {
      intro:
        "Columbus homes range from century-old brick in German Village to newer construction on the north side, and each comes with different heating and cooling challenges.",
      localNotes: [
        "Older homes often have undersized ductwork, which matters when sizing a new system.",
        "Humid summers make proper dehumidification a priority, not just temperature.",
        "Hard winters mean furnace safety checks every fall are worth scheduling early.",
      ],
      neighborhoods: ["Clintonville", "German Village", "Upper Arlington area", "Short North"],
    },
    placeholder: true,
  },
  {
    slug: "dublin-oh",
    city: "Dublin",
    state: "OH",
    zips: ["43016", "43017"],
    page: {
      intro:
        "Many Dublin homes are larger two-story layouts where the upstairs runs warmer than the main floor in summer.",
      localNotes: [
        "Zoning systems and properly balanced ductwork help even out upstairs temperatures.",
        "Homes built in the 1990s and 2000s may be due for original-equipment replacement.",
      ],
      neighborhoods: [],
    },
    placeholder: true,
  },
  {
    slug: "westerville-oh",
    city: "Westerville",
    state: "OH",
    zips: ["43081", "43082"],
    page: {
      intro: "Westerville's mix of established neighborhoods and newer subdivisions means we see every type of system.",
      localNotes: [
        "Mature tree cover can drop leaves and debris into outdoor units, so coil cleaning is important.",
        "Heat pumps paired with gas furnaces (dual fuel) are a common upgrade path here.",
      ],
      neighborhoods: [],
    },
    placeholder: true,
  },
  { slug: "hilliard-oh", city: "Hilliard", state: "OH", zips: ["43026"], placeholder: true },
  { slug: "grove-city-oh", city: "Grove City", state: "OH", zips: ["43123"], placeholder: true },
  { slug: "worthington-oh", city: "Worthington", state: "OH", zips: ["43085"], placeholder: true },
];
