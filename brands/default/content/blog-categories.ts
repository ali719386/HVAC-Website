import type { BlogCategoryInput } from "@/content/types";

// TODO: review category names and descriptions with the client.
export const blogCategories: BlogCategoryInput[] = [
  {
    slug: "heating",
    name: "Heating",
    description: "Practical guidance for keeping furnaces, heat pumps and other heating systems running safely.",
    placeholder: true,
  },
  {
    slug: "cooling",
    name: "Cooling",
    description: "Tips for keeping your air conditioner comfortable and dependable through the warm months.",
    placeholder: true,
  },
  {
    slug: "buying-guide",
    name: "Buying guide",
    description: "Plain-language help for choosing, sizing and planning new heating and cooling equipment.",
    placeholder: true,
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    description: "Simple homeowner checks and what to expect from professional maintenance visits.",
    placeholder: true,
  },
  {
    slug: "energy-savings",
    name: "Energy savings",
    description: "Everyday habits and settings that help your system run efficiently.",
    placeholder: true,
  },
  {
    slug: "indoor-air-quality",
    name: "Indoor air quality",
    description: "Basics of filtration, humidity and ventilation for a more comfortable home.",
    placeholder: true,
  },
];
