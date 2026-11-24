import type { CopyOverrides } from "@/content/types";

// TODO: placeholder content for the example brand.
export const copy: CopyOverrides = {
  hero: {
    summer: {
      eyebrow: "Front Range comfort",
      title: "Cooling that keeps up with Colorado sun",
      subtitle: "Central air, heat pumps and ductless systems installed and serviced by a local team.",
    },
    winter: {
      eyebrow: "Front Range comfort",
      title: "Warm, safe heat for mountain-country winters",
      subtitle: "Furnace and cold-climate heat pump service, set up for the altitude you live at.",
    },
    primaryCta: "Schedule a visit",
    badge: "Altitude-aware setup",
  },
  services: { eyebrow: "Services", title: "Heating, cooling and indoor air", intro: "" },
  whyChooseUs: { eyebrow: "The Summit Ridge way", title: "Built for Front Range homes", intro: "" },
  expert: {
    eyebrow: "Comfort advice",
    title: "Thinking about a heat pump?",
    intro: "Tell us about your home and we will walk you through the options.",
    bullets: ["Ducted and ductless options", "Dual-fuel comparisons", "Written proposal"],
    cta: "Ask for a proposal",
  },
  plans: { eyebrow: "Care plans", title: "Seasonal care, scheduled for you", intro: "" },
  about: {
    title: "About Summit Ridge Comfort Co.",
    intro: "A Front Range heating and cooling contractor.",
    story: {
      eyebrow: "Our story",
      title: "Front Range comfort, done carefully",
      intro: "TODO: Replace with the client's real story.",
      points: [],
    },
  },
  ctaBand: { title: "Ready for a more comfortable home?", body: "Book online or call during business hours.", cta: "Schedule a visit" },
  // TODO: placeholder /projects copy for the example brand.
  projects: {
    eyebrow: "Project gallery",
    title: "Front Range Heating & Cooling Projects",
    intro: "Heat pumps, furnaces and ductless systems we have set up across the Denver metro.",
  },
  projectsPage: {
    hero: {
      primaryCta: "Schedule a visit",
      callCta: "Call us",
      projectsCompleted: "Projects completed",
      homesServed: "Homes served",
      yearsInBusiness: "Years in business",
    },
    featured: { eyebrow: "Spotlight", title: "Project spotlight", intro: "", badge: "Spotlight" },
    grid: { eyebrow: "All projects", title: "Find a project like yours", intro: "Filter by category, city or system." },
    process: { eyebrow: "Our process", title: "How every project runs", intro: "" },
    testimonials: { eyebrow: "Reviews", title: "In our customers' words", intro: "" },
    cities: { eyebrow: "Where we work", title: "Front Range communities", intro: "" },
    faq: { eyebrow: "FAQ", title: "Before you start a project", intro: "" },
    cta: { eyebrow: "Next step", title: "Thinking about a project?", intro: "Tell us about your home and we will reply during business hours." },
  },
  // TODO: review /services page copy with the client.
  servicesPage: {
    hero: { primaryCta: "Schedule a visit", callCta: "Call us" },
    problemPicker: { eyebrow: "Start here", title: "What is your system doing?", intro: "Choose the closest match and we will take it from there." },
    process: { eyebrow: "Our process", title: "From first call to finished job", intro: "" },
    plans: { title: "Seasonal care plans", body: "Spring and fall visits, scheduled for you.", cta: "See care plans" },
    reviews: { eyebrow: "Reviews", title: "Front Range homeowners on our work", intro: "", googleLabel: "on Google" },
    faq: { eyebrow: "FAQ", title: "Questions about service", intro: "" },
    cta: { eyebrow: "Request a visit", title: "Tell us about your home", intro: "Send a request and we will confirm a time during business hours." },
  },
};
