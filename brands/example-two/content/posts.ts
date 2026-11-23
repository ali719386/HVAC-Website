import type { PostInput } from "@/content/types";

// TODO: placeholder content for the example brand.
export const posts: PostInput[] = [
  {
    slug: "heat-pumps-at-altitude",
    title: "Heat Pumps on the Front Range: What to Know",
    excerpt: "How cold-climate heat pumps handle Colorado winters, and when a dual-fuel setup makes sense.",
    date: "2026-10-05",
    author: "Summit Ridge Team",
    category: "Heating",
    readMinutes: 5,
    image: { src: "posts/heat-pumps-at-altitude.jpg", alt: "Heat pump with snow on the ground" },
    body: [
      { paragraphs: ["Heat pump technology has improved a lot. Cold-climate models are designed to keep heating at low outdoor temperatures."] },
      { heading: "Dual fuel", paragraphs: ["Pairing a heat pump with a gas furnace lets the system switch to gas on the coldest nights."] },
    ],
    placeholder: true,
  },
  {
    slug: "dry-air-and-your-hvac",
    title: "Dry Air and Your HVAC System",
    excerpt: "Why humidity control matters in a semi-arid climate.",
    date: "2026-08-12",
    author: "Summit Ridge Team",
    category: "Indoor air",
    readMinutes: 3,
    image: { src: "posts/dry-air-and-your-hvac.jpg", alt: "Whole-home humidifier on a furnace" },
    body: [{ paragraphs: ["Very dry indoor air can be uncomfortable. A whole-home humidifier connected to your furnace is one option."] }],
    placeholder: true,
  },
];
