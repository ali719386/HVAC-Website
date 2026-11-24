import type { BlogCategoryInput } from "@/content/types";

// TODO: placeholder blog categories for the example brand. Review wording before publishing.
export const blogCategories: BlogCategoryInput[] = [
  {
    slug: "heating",
    name: "Heating",
    description: "Keeping furnaces, heat pumps and boilers steady through long, cold winters.",
    placeholder: true,
  },
  {
    slug: "cooling",
    name: "Cooling",
    description: "Practical ways to stay comfortable when warm, dry summer days arrive.",
    placeholder: true,
  },
  {
    slug: "buying-guide",
    name: "Buying guide",
    description: "Plain questions to ask before you replace or add heating and cooling equipment.",
    placeholder: true,
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    description: "Small, regular habits that help your system run quietly season after season.",
    placeholder: true,
  },
  {
    slug: "energy-savings",
    name: "Energy savings",
    description: "Sensible settings and upkeep that help you use less energy without giving up comfort.",
    placeholder: true,
  },
  {
    slug: "indoor-air-quality",
    name: "Indoor air quality",
    description: "Humidity, filtration and fresh air for homes in a dry, high-country climate.",
    placeholder: true,
  },
];
