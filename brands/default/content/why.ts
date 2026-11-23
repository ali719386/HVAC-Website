import type { WhyItemInput } from "@/content/types";

// TODO: confirm each promise is something the client actually guarantees.
export const whyChooseUs: WhyItemInput[] = [
  {
    icon: "badge-dollar",
    title: "Upfront, written estimates",
    body: "You see the price and approve it before any work begins.",
    placeholder: true,
  },
  {
    icon: "clock",
    title: "Arrival windows that mean something",
    body: "We give a two-hour window and call ahead when the technician is on the way.",
    placeholder: true,
  },
  {
    icon: "wrench",
    title: "Repair first, replace when it makes sense",
    body: "We explain when a repair is the better value and when it is not.",
    placeholder: true,
  },
  {
    icon: "home",
    title: "Clean, careful work",
    body: "Shoe covers, drop cloths and a tidy work area every visit.",
    placeholder: true,
  },
];
