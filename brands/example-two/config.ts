import type { BrandConfigInput } from "@/lib/brand/schema";
import { coverage } from "./content/cities";

/**
 * Second example brand used to verify white-labeling. All data is PLACEHOLDER.
 * TODO: replace or delete this brand before production.
 */
export const config: BrandConfigInput = {
  slug: "example-two",
  placeholder: true, // TODO
  company: {
    name: "Summit Ridge Comfort Co.",
    legalName: "Summit Ridge Comfort Company Inc.", // TODO
    tagline: "Front Range heating, cooling and indoor air",
    logo: { light: "logo.svg", dark: "logo-dark.svg" }, // TODO: add logo files
    phone: { display: "(555) 555-0147", tel: "+15555550147" }, // TODO
    emergencyPhone: undefined,
    email: "hello@example.org", // TODO
    address: { street: "250 Sample Blvd", city: "Lakewood", state: "CO", zip: "80226" }, // TODO
    // TODO: confirm real hours. days: 0 = Sun ... 6 = Sat; times are 24h in `timezone`.
    hours: [
      { days: [1, 2, 3, 4, 5], open: "08:00", close: "17:00", label: "Mon - Fri" },
      { days: [0, 6], label: "Sat - Sun", note: "Closed" },
    ],
    timezone: "America/Denver",
    socials: [],
    licenseNumber: undefined, // TODO: Colorado jurisdictions license HVAC contractors locally; add if applicable
    licenses: [], // TODO: add { stateAbbr, number } for each state where a license is held. Shown only on that state's pages.
    insured: false, // TODO
    bonded: false, // TODO
    certifications: [], // TODO
    googleRating: undefined, // TODO
    yearsInBusiness: undefined, // TODO
    projectsCompleted: undefined, // TODO: real total for the /projects hero. Hidden while undefined.
    homesServed: undefined, // TODO: real total. Hidden while undefined.
    stats: [
      { value: 900, suffix: "+", label: "Furnaces serviced", placeholder: true }, // TODO
      { value: 8, suffix: "", label: "Front Range cities", placeholder: true }, // TODO
      { value: 100, suffix: "%", label: "Written estimates", placeholder: true }, // TODO
    ],
  },
  coverage, // states and cities: see content/cities.ts
  offerings: {
    financing: { enabled: false, provider: "", description: "" },
    promoBar: {
      enabled: true,
      text: "Furnace safety checks are booking now for the heating season.", // TODO
      linkLabel: "Reserve a time",
      href: "/book",
    },
    supportedBrands: [
      { name: "Lennox" },
      { name: "Carrier" },
      { name: "Bosch" },
      { name: "Mitsubishi Electric" },
      { name: "Rheem" },
    ], // TODO
    emergency24x7: false,
    rebates: { enabled: false, title: "", body: "" },
  },
  seo: {
    siteUrl: "https://www.example.org", // TODO
    defaultTitle: "Summit Ridge Comfort Co. | Heating & Cooling in Lakewood and Denver, CO",
    titleTemplate: "%s | Summit Ridge Comfort Co.",
    description: "Furnace, heat pump and air conditioning service for homes along the Colorado Front Range.",
    ogImage: "og.jpg",
    locale: "en_US",
  },
  tokens: {
    colors: {
      primary: "#0E4D5C",
      primaryDark: "#08333D",
      onPrimary: "#FFFFFF",
      accent: "#B45309",
      accentDark: "#8F4207",
      onAccent: "#FFFFFF",
      surface: "#FFFFFF",
      surfaceAlt: "#F5F3EE",
      surfaceDark: "#0B2A31",
      text: "#1C1917",
      muted: "#57534E",
      border: "#E4DFD6",
    },
    fonts: { heading: "barlow", body: "dmSans" },
    radius: 8,
    buttonStyle: "pill",
    shadow: "medium",
    containerWidth: 1180,
    sectionSpacing: "compact",
    motion: { enabled: true, durationMs: 550, distancePx: 16, staggerMs: 80 },
  },
  images: {
    hero: { src: "hero.jpg", alt: "Technician servicing a furnace in a mountain-area home" },
    about: { src: "about.jpg", alt: "Summit Ridge team at the shop" },
    services: { src: "services.jpg", alt: "Heat pump installed outside a home" },
    expert: { src: "expert.jpg", alt: "Comfort advisor reviewing options with a homeowner" },
    projects: { src: "projects.jpg", alt: "Completed ductless mini-split installation" },
    promo: { src: "promo.jpg", alt: "Furnace filter being replaced" },
  },
  // /services page sections: reorder or set enabled: false to hide.
  servicesPage: {
    sections: [
      { key: "filters", enabled: true },
      { key: "cards", enabled: true },
      { key: "problemPicker", enabled: true },
      { key: "emergency", enabled: true }, // also needs offerings.emergency24x7
      { key: "process", enabled: true },
      { key: "plansFinancing", enabled: true },
      { key: "serviceArea", enabled: true },
      { key: "brands", enabled: true },
      { key: "reviews", enabled: true },
      { key: "faq", enabled: true },
      { key: "cta", enabled: true },
    ],
  },
  // /projects index sections (the hero always shows first): reorder or set enabled: false to hide.
  projectsPage: {
    sections: [
      { key: "trust", enabled: true },
      { key: "featured", enabled: true },
      { key: "grid", enabled: true },
      { key: "stats", enabled: true },
      { key: "process", enabled: true },
      { key: "testimonials", enabled: true },
      { key: "cities", enabled: true },
      { key: "faq", enabled: true },
      { key: "cta", enabled: true },
    ],
  },
  // Footer text. {cities} and {states} are filled from coverage.
  footer: {
    blurb: "Furnaces, heat pumps and cooling for homes in {cities} communities across Colorado and Wyoming.", // TODO: confirm wording with the client
    cta: { title: "Schedule a visit", body: "Call during business hours or book online." },
  },
  // /blog sections; season overrides the month-based Seasonal picks (optional).
  blogPage: {
    sections: [
      { key: "featured", enabled: true },
      { key: "seasonal", enabled: true },
      { key: "grid", enabled: true },
      { key: "cta", enabled: true },
    ],
  },
  // Contact page data. TODO: placeholder for the example brand.
  contact: {
    responseTimeText: undefined,
    mapLink: undefined,
    safetyNotice:
      "If you smell gas or a carbon monoxide alarm sounds, get everyone outside first. Then call 911 or your gas utility from a safe place before calling us.",
    faqs: [
      { question: "What happens after I send a request?", answer: "Our team reads it during business hours and contacts you to confirm the details and a visit time.", placeholder: true },
      { question: "Do you work weekends?", answer: "Our listed hours are on this page. Ask us about scheduling when you send your request.", placeholder: true },
      { question: "Will the technician explain the cost first?", answer: "Yes. You get the options and the cost before any work starts.", placeholder: true },
      { question: "How do I know if you serve my town?", answer: "Use the area checker on this page or call us to ask.", placeholder: true },
    ],
  },
  contactPage: {
    sections: [
      { key: "quick", enabled: true },
      { key: "main", enabled: true },
      { key: "safety", enabled: true },
      { key: "steps", enabled: true },
      { key: "map", enabled: true },
      { key: "areas", enabled: true },
      { key: "faq", enabled: true },
      { key: "cta", enabled: true },
    ],
  },
  homepage: {
    heroVariant: "winter",
    sections: [
      { key: "hero", enabled: true },
      { key: "services", enabled: true },
      { key: "stats", enabled: true },
      { key: "whyChooseUs", enabled: true },
      { key: "plans", enabled: true },
      { key: "serviceAreas", enabled: true },
      { key: "testimonials", enabled: true },
      { key: "expert", enabled: true },
      { key: "brandStrip", enabled: false },
      { key: "faq", enabled: true },
      { key: "posts", enabled: false },
      { key: "emergency", enabled: false },
      { key: "financing", enabled: false },
      { key: "rebates", enabled: false },
      { key: "ctaBand", enabled: true },
    ],
  },
};
