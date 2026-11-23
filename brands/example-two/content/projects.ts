import type { ProjectInput } from "@/content/types";

// TODO: placeholder content for the example brand.
export const projects: ProjectInput[] = [
  {
    slug: "mini-split-bungalow",
    title: "Ductless mini-split, 1950s bungalow",
    location: "Lakewood, CO",
    service: "ac-installation",
    summary: "Added cooling to a home without ductwork using a three-zone ductless system.",
    image: { src: "project-mini-split-bungalow.jpg", alt: "Indoor mini-split unit above a window" },
    placeholder: true,
  },
  {
    slug: "dual-fuel-upgrade",
    title: "Dual-fuel upgrade",
    location: "Arvada, CO",
    service: "heating",
    summary: "Paired a cold-climate heat pump with a new furnace for year-round comfort.",
    image: { src: "project-dual-fuel-upgrade.jpg", alt: "Heat pump and furnace installation" },
    placeholder: true,
  },
];
