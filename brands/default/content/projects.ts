import type { ProjectInput } from "@/content/types";

// TODO: replace with real completed jobs and photos (with customer permission).
export const projects: ProjectInput[] = [
  {
    slug: "two-story-heat-pump",
    title: "Heat pump replacement, two-story home",
    location: "Dublin, OH",
    service: "ac-installation",
    summary: "Replaced an aging split system with a variable-speed heat pump and new line set.",
    image: { src: "projects/two-story-heat-pump.jpg", alt: "Outdoor heat pump beside a two-story house" },
    placeholder: true,
  },
  {
    slug: "furnace-upgrade",
    title: "High-efficiency furnace upgrade",
    location: "Westerville, OH",
    service: "heating",
    summary: "Swapped a standard-efficiency furnace for a condensing model with new PVC venting.",
    image: { src: "projects/furnace-upgrade.jpg", alt: "New furnace installed in a basement" },
    placeholder: true,
  },
  {
    slug: "retail-rooftop-units",
    title: "Rooftop unit service, retail plaza",
    location: "Columbus, OH",
    service: "commercial",
    summary: "Seasonal maintenance and belt replacement on four rooftop units.",
    image: { src: "projects/retail-rooftop-units.jpg", alt: "Row of rooftop HVAC units" },
    placeholder: true,
  },
];
