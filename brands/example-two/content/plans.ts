import type { PlanInput } from "@/content/types";

// TODO: placeholder content for the example brand.
// TODO: confirm pricing with the client before showing prices.
export const plans: PlanInput[] = [
  {
    id: "basecamp",
    name: "Basecamp",
    description: "Fall furnace safety check and tune-up.",
    features: ["1 heating tune-up", "CO safety test", "Filter check"],
    placeholder: true,
  },
  {
    id: "summit",
    name: "Summit",
    description: "Heating and cooling tune-ups every year.",
    features: ["Fall heating tune-up", "Spring cooling tune-up", "Priority booking", "Humidifier check"],
    featured: true,
    placeholder: true,
  },
];
