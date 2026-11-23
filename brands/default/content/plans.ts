import type { PlanInput } from "@/content/types";

/*
 * TODO: confirm plan names, inclusions and prices with the client.
 * Prices are intentionally omitted ("Call for pricing") until confirmed. Never invent prices.
 */
export const plans: PlanInput[] = [
  {
    id: "essential",
    name: "Essential",
    description: "One annual tune-up for a single system.",
    features: ["1 tune-up per year", "Written condition report", "Filter check"],
    placeholder: true,
  },
  {
    id: "comfort",
    name: "Comfort",
    description: "Spring cooling and fall heating tune-ups for one home.",
    features: ["2 tune-ups per year", "Priority scheduling", "Reminder calls before each season", "Written condition reports"],
    featured: true,
    placeholder: true,
  },
  {
    id: "comfort-plus",
    name: "Comfort Plus",
    description: "Seasonal tune-ups for homes with two systems.",
    features: ["Up to 2 systems", "2 tune-ups per system per year", "Priority scheduling", "Written condition reports"],
    placeholder: true,
  },
];
