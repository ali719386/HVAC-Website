import type { CopyInput } from "@/lib/brand/schema";
import type { FaqInput, WhyItemInput } from "./types";

/**
 * Generic, brand-neutral fallback copy. Brands override any section in
 * /brands/<slug>/content/copy.ts. No company names, numbers or claims here.
 */
export const defaultCopy: CopyInput = {
  hero: {
    summer: {
      eyebrow: "Heating & cooling services",
      title: "Stay cool all summer with reliable AC service",
      subtitle: "Repairs, replacements and tune-ups from licensed local technicians. Clear pricing before any work begins.",
    },
    winter: {
      eyebrow: "Heating & cooling services",
      title: "Keep your home warm with dependable heating service",
      subtitle: "Furnace and heat pump repair, installation and maintenance from local technicians you can reach.",
    },
    primaryCta: "Book a service",
    badge: "Upfront estimates",
  },
  brandStrip: { title: "We service most major equipment brands" },
  services: { eyebrow: "What we do", title: "Heating and cooling services", intro: "" },
  whyChooseUs: { eyebrow: "Why choose us", title: "Local service you can count on", intro: "" },
  expert: {
    eyebrow: "Talk to a technician",
    title: "Not sure what your system needs?",
    intro: "Tell us what is going on and we will recommend the right next step.",
    bullets: ["Written estimate before work starts", "Repair-first recommendations", "Clean, respectful technicians"],
    cta: "Request a quote",
  },
  stats: { eyebrow: "By the numbers", title: "Experience you can measure", intro: "" },
  testimonials: { eyebrow: "Reviews", title: "What our customers say", intro: "" },
  plans: { eyebrow: "Maintenance plans", title: "Keep your system running longer", intro: "" },
  financing: { eyebrow: "Financing", title: "Flexible ways to pay", intro: "" },
  serviceArea: { eyebrow: "Service area", title: "Check if we serve your area", intro: "Enter your 5-digit ZIP code." },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    intro: "",
    contactTitle: "Still have questions?",
    contactBody: "Call and talk to someone on our team.",
  },
  posts: { eyebrow: "From the blog", title: "Tips and guides", intro: "" },
  ctaBand: {
    title: "Need heating or cooling help today?",
    body: "Call now or book online and we will confirm your appointment.",
    cta: "Book online",
  },
  emergency: { title: "24/7 emergency service", body: "No heat or no cooling? Call now, day or night." },
  about: {
    title: "About us",
    intro: "A local heating and cooling contractor.",
    story: { eyebrow: "Our story", title: "Local heating and cooling service", intro: "Tell your story here.", points: [] },
    why: { eyebrow: "Why choose us", title: "Why homeowners choose us", intro: "", items: [] },
    mission: { eyebrow: "Our mission", title: "Comfort you can count on", intro: "", values: [] },
    services: { eyebrow: "What we do", title: "Our services", intro: "", items: [] },
    testimonials: { eyebrow: "Reviews", title: "What our customers say", intro: "" },
    cta: { title: "Ready to get started?", body: "Call now or book online and we will confirm your appointment.", cta: "Book a service", call: "Call now" },
  },
  projects: { eyebrow: "Recent work", title: "Projects", intro: "" },
  contact: { eyebrow: "Contact", title: "Get in touch", intro: "" },
  book: { eyebrow: "Book a service", title: "Schedule your visit", intro: "Tell us what you need and we will confirm a time." },
};

export const defaultWhyChooseUs: WhyItemInput[] = [
  { icon: "shield", title: "Licensed technicians", body: "TODO: describe your team's qualifications.", placeholder: true },
  { icon: "clock", title: "On-time arrivals", body: "TODO: describe your scheduling promise.", placeholder: true },
  { icon: "badge-dollar", title: "Upfront estimates", body: "TODO: describe how you quote work.", placeholder: true },
  { icon: "home", title: "Respect for your home", body: "TODO: describe your jobsite standards.", placeholder: true },
];

export const defaultFaqs: FaqInput[] = [
  {
    question: "How often should I service my HVAC system?",
    answer: "Most manufacturers recommend a professional tune-up once a year for each system, typically cooling in spring and heating in fall.",
    placeholder: true,
  },
];
