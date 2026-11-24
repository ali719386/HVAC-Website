import type { TestimonialInput } from "@/content/types";

/*
 * SAMPLE testimonials for layout only. They are rendered with a visible "Sample" label.
 * TODO: replace with real, verifiable customer reviews (with permission) before launch.
 * Publishing invented reviews is prohibited by the FTC.
 */
export const testimonials: TestimonialInput[] = [
  {
    id: "dallas-ac-repair",
    quote: "Sample review text. Replace with a real customer's words about an AC repair visit.",
    name: "Customer name",
    location: "Dallas, TX",
    service: "AC Repair",
    background: "review-columbus-ac-repair.jpg",
    placeholder: true,
  },
  {
    id: "columbus-heating",
    quote: "Sample review text. Replace with a real customer's words about a furnace replacement.",
    name: "Customer name",
    location: "Columbus, OH",
    service: "Heating",
    background: "review-dublin-heating.jpg",
    placeholder: true,
  },
  {
    id: "chicago-maintenance",
    quote: "Sample review text. Replace with a real customer's words about a maintenance plan.",
    name: "Customer name",
    location: "Chicago, IL",
    service: "Maintenance",
    background: "review-westerville-maintenance.jpg",
    placeholder: true,
  },
  {
    id: "phoenix-commercial",
    quote: "Sample review text. Replace with a real customer's words about a commercial service call.",
    name: "Customer name",
    location: "Phoenix, AZ",
    service: "Commercial HVAC",
    background: "review-hilliard-commercial.jpg",
    placeholder: true,
  },
];
