import type { TestimonialInput } from "@/content/types";

/*
 * SAMPLE testimonials for layout only. They are rendered with a visible "Sample" label.
 * TODO: replace with real, verifiable customer reviews (with permission) before launch.
 * Publishing invented reviews is prohibited by the FTC.
 */
export const testimonials: TestimonialInput[] = [
  {
    quote: "Sample review text. Replace with a real customer's words about an AC repair visit.",
    name: "Customer name",
    location: "Columbus, OH",
    service: "AC Repair",
    background: "testimonials/columbus-ac-repair.jpg",
    placeholder: true,
  },
  {
    quote: "Sample review text. Replace with a real customer's words about a furnace replacement.",
    name: "Customer name",
    location: "Dublin, OH",
    service: "Heating",
    background: "testimonials/dublin-heating.jpg",
    placeholder: true,
  },
  {
    quote: "Sample review text. Replace with a real customer's words about a maintenance plan.",
    name: "Customer name",
    location: "Westerville, OH",
    service: "Maintenance",
    background: "testimonials/westerville-maintenance.jpg",
    placeholder: true,
  },
  {
    quote: "Sample review text. Replace with a real customer's words about a commercial service call.",
    name: "Customer name",
    location: "Hilliard, OH",
    service: "Commercial HVAC",
    background: "testimonials/hilliard-commercial.jpg",
    placeholder: true,
  },
];
