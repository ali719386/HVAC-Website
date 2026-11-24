import type { BrandConfigInput } from "@/lib/brand/schema";
import { coverage } from "./content/cities";

/**
 * Default brand. Everything here is PLACEHOLDER data for the template.
 * TODO: replace every value marked TODO with verified client information before launch.
 */
export const config: BrandConfigInput = {
  slug: "default",
  placeholder: true, // TODO: set to false once all fields below are verified
  company: {
    name: "Coolwren Heating & Air",
    legalName: "Coolwren Heating & Air LLC", // TODO: confirm legal entity name
    tagline: "Heating and cooling service you can count on", // TODO: confirm with the client
    // Official logo supplied by the client. dark = navy parts lightened for the footer; icon = emblem only (favicon).
    logo: { light: "logo.png", dark: "logo-dark.png", icon: "icon.png", appleIcon: "apple-icon.png" },
    phone: { display: "(555) 555-0123", tel: "+15555550123" }, // TODO: real phone
    emergencyPhone: { display: "(555) 555-0199", tel: "+15555550199" }, // TODO: real emergency line
    email: "service@example.com", // TODO: real inbox
    address: { street: "100 Example Ave, Suite 200", city: "Columbus", state: "OH", zip: "43215" }, // TODO
    // TODO: confirm real hours. days: 0 = Sun ... 6 = Sat; times are 24h in `timezone`.
    hours: [
      { days: [1, 2, 3, 4, 5], open: "07:00", close: "18:00", label: "Mon - Fri" },
      { days: [6], open: "08:00", close: "14:00", label: "Sat" },
      { days: [0], label: "Sun", note: "Emergency calls only" },
    ],
    timezone: "America/New_York", // TODO: headquarters timezone
    socials: [], // TODO: add real profile URLs, e.g. { network: "facebook", url: "https://..." }
    licenseNumber: undefined, // TODO: add state HVAC license number. Hidden while undefined.
    licenses: [], // TODO: add { stateAbbr, number } for each state where a license is held. Shown only on that state's pages.
    insured: false, // TODO: set true only if verified
    bonded: false, // TODO: set true only if verified
    certifications: [], // TODO: e.g. "NATE-certified technicians" only if true
    googleRating: undefined, // TODO: { score, count, url } from the real Google Business Profile
    yearsInBusiness: undefined, // TODO: real number. Hidden while undefined.
    projectsCompleted: undefined, // TODO: real total for the /projects hero. Hidden while undefined.
    homesServed: undefined, // TODO: real total. Hidden while undefined.
    stats: [
      { value: 2500, suffix: "+", label: "Service calls completed", placeholder: true }, // TODO
      { value: 15, suffix: "", label: "Technicians on staff", placeholder: true }, // TODO
      { value: 24, suffix: "/7", label: "Emergency availability", placeholder: true }, // TODO
      { value: 6, suffix: "", label: "Communities served", placeholder: true }, // TODO
    ],
  },
  coverage, // states and cities: see content/cities.ts
  offerings: {
    financing: {
      enabled: true,
      provider: "Financing partner name", // TODO: real provider
      url: undefined, // TODO: provider application URL. Apply button hidden while undefined.
      description:
        "Financing may be available for qualifying customers on new system installations, subject to credit approval. Ask our team for current terms.", // TODO: confirm wording with provider
    },
    promoBar: {
      enabled: false, // hidden at client request; set true to show it again
      text: "Schedule your seasonal tune-up early and lock in a convenient time.", // TODO: real promotion
      linkLabel: "Book now",
      href: "/book",
    },
    // Logos: official files supplied by the client (cleaned to transparent PNG). TODO: confirm usage permission.
    supportedBrands: [
      { name: "Carrier", logo: "logo-carrier.png" },
      { name: "Lennox", logo: "logo-lennox.png" },
      { name: "Bryant", logo: "logo-bryant.png" },
      { name: "American Standard", logo: "logo-american-standard.png" },
    ],
    emergency24x7: true, // TODO: set false if the client does not offer 24/7 service
    rebates: { enabled: false, title: "", body: "" },
  },
  seo: {
    siteUrl: "https://www.example.com", // TODO: production domain
    defaultTitle: "Coolwren Heating & Air | AC & Heating Service in Columbus, OH",
    titleTemplate: "%s | Coolwren Heating & Air",
    description:
      "AC repair, AC installation, heating service and maintenance plans for homes and businesses in Columbus and Central Ohio.",
    ogImage: "og.jpg",
    locale: "en_US",
  },
  tokens: {
    colors: {
      primary: "#0B3D91",
      primaryDark: "#072A66",
      onPrimary: "#FFFFFF",
      accent: "#C8430B",
      accentDark: "#A3360A",
      onAccent: "#FFFFFF",
      surface: "#FFFFFF",
      surfaceAlt: "#F2F5FA",
      surfaceDark: "#081C3F",
      text: "#0F172A",
      muted: "#4B5568",
      border: "#DDE3EC",
    },
    fonts: { heading: "plusJakarta", body: "inter" },
    radius: 14,
    buttonStyle: "rounded",
    shadow: "soft",
    containerWidth: 1240,
    sectionSpacing: "normal",
    motion: { enabled: true, durationMs: 700, distancePx: 24, staggerMs: 100 },
  },
  images: {
    hero: { src: "hero.png", alt: "HVAC technician inspecting an outdoor air conditioning condenser with a flashlight" },
    about: { src: "about-estimate.jpg", alt: "Technician in shoe covers reviewing a written estimate with a homeowner beside the furnace" },
    services: { src: "services-hero.jpg", alt: "Technician kneeling beside an outdoor AC unit, working on the refrigerant line valves" },
    expert: { src: "expert-caller.jpg", alt: "Technician on the phone taking notes at the service van, with refrigerant gauges hanging inside" },
    // TODO: replace with a real project photo.
    projects: { src: "about-ac-installation.jpg", alt: "Technician setting up a new central air conditioner beside a home" },
    faq: { src: "faq-thermostat.jpg", alt: "Homeowner pointing out the thermostat to a technician in her hallway" },
    // Plans and financing page header. TODO: replace with a dedicated photo if available.
    promo: { src: "about-maintenance.jpg", alt: "Technician connecting gauge hoses to an outdoor AC unit during a seasonal tune-up" },
    aboutHero: { src: "about-hero.jpg", alt: "Technician servicing a rooftop air conditioning unit at dusk" },
    aboutStory: { src: "about-story-furnace.jpg", alt: "Technician testing the controls of an indoor furnace with a multimeter" },
    aboutStoryInset: { src: "about-story-condenser.jpg", alt: "Technician kneeling beside an outdoor AC condenser with the service panel open" },
    aboutMission: { src: "about-mission-consult.jpg", alt: "Technician showing a homeowner service details on a tablet in her living room" },
    aboutCta: { src: "about-cta-home.jpg", alt: "Modern two-story home with a stone and wood facade and a green front lawn" },
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
    blurb: "Heating, cooling and indoor air service for homes and businesses in {cities} cities across {states} states.", // TODO: confirm wording with the client
    cta: { title: "Get a free estimate", body: "Call us or book online." }, // TODO: keep "free" only if estimates are free
  },
  // /blog sections; season overrides the month-based Seasonal picks (optional).
  blogPage: {
    sections: [
      { key: "featured", enabled: true },
      { key: "seasonal", enabled: false }, // hidden at client request
      { key: "grid", enabled: true },
      { key: "cta", enabled: true },
    ],
  },
  // Contact page data. TODO: review every line with the client.
  contact: {
    responseTimeText: undefined, // TODO: only if the client confirms a real response time
    mapLink: undefined, // TODO: Google Maps place URL for the office; falls back to an address search
    // TODO: review the safety wording with the client.
    safetyNotice:
      "Smell gas or think there may be carbon monoxide? Leave the home right away, then call 911 or your gas utility from outside. Call us after you are safe.",
    faqs: [
      { question: "What should I include in my request?", answer: "Tell us the type of system, what it is doing and when the problem started. Photos of the equipment label help when you have them.", placeholder: true },
      { question: "Do I need to be home for the visit?", answer: "Someone over 18 should be home to give access to the equipment and to talk through what the technician finds.", placeholder: true },
      { question: "Will I get a price before work starts?", answer: "Yes. The technician explains the options and the cost before any work begins.", placeholder: true },
      { question: "Can I reach someone after hours?", answer: "For an emergency, use the emergency line listed on this page. For anything else, send a request and our team will follow up during business hours.", placeholder: true },
      { question: "Which areas do you serve?", answer: "See our service areas page, or use the checker on this page to look up your city.", placeholder: true },
    ],
  },
  // /contact sections: reorder or set enabled: false to hide.
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
    heroVariant: "summer",
    sections: [
      { key: "hero", enabled: true },
      { key: "brandStrip", enabled: true },
      { key: "emergency", enabled: true },
      { key: "services", enabled: true },
      { key: "whyChooseUs", enabled: true },
      { key: "expert", enabled: true },
      { key: "stats", enabled: true },
      { key: "testimonials", enabled: true },
      { key: "plans", enabled: false },
      { key: "financing", enabled: false },
      { key: "serviceAreas", enabled: true },
      { key: "rebates", enabled: false },
      { key: "faq", enabled: true },
      { key: "posts", enabled: true },
      { key: "ctaBand", enabled: true },
    ],
  },
};
