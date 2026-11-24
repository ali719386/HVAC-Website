import type { BrandConfigInput } from "@/lib/brand/schema";

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
    tagline: "Heating and cooling for Central Ohio homes",
    // Official logo supplied by the client. dark = navy parts lightened for the footer; icon = emblem only (favicon).
    logo: { light: "logo.png", dark: "logo-dark.png", icon: "icon.png", appleIcon: "apple-icon.png" },
    phone: { display: "(555) 555-0123", tel: "+15555550123" }, // TODO: real phone
    emergencyPhone: { display: "(555) 555-0199", tel: "+15555550199" }, // TODO: real emergency line
    email: "service@example.com", // TODO: real inbox
    address: { street: "100 Example Ave, Suite 200", city: "Columbus", state: "OH", zip: "43215" }, // TODO
    hours: [
      { days: "Mon - Fri", hours: "7:00 AM - 6:00 PM" },
      { days: "Sat", hours: "8:00 AM - 2:00 PM" },
      { days: "Sun", hours: "Emergency calls only" },
    ], // TODO: confirm hours
    socials: [], // TODO: add real profile URLs, e.g. { network: "facebook", url: "https://..." }
    licenseNumber: undefined, // TODO: add state HVAC license number. Hidden while undefined.
    insured: false, // TODO: set true only if verified
    bonded: false, // TODO: set true only if verified
    certifications: [], // TODO: e.g. "NATE-certified technicians" only if true
    googleRating: undefined, // TODO: { score, count, url } from the real Google Business Profile
    yearsInBusiness: undefined, // TODO: real number. Hidden while undefined.
    stats: [
      { value: 2500, suffix: "+", label: "Service calls completed", placeholder: true }, // TODO
      { value: 15, suffix: "", label: "Technicians on staff", placeholder: true }, // TODO
      { value: 24, suffix: "/7", label: "Emergency availability", placeholder: true }, // TODO
      { value: 6, suffix: "", label: "Communities served", placeholder: true }, // TODO
    ],
  },
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
    services: { src: "services.jpg", alt: "Technician checking refrigerant pressure with gauges" },
    expert: { src: "expert-caller.jpg", alt: "Technician on the phone taking notes at the service van, with refrigerant gauges hanging inside" },
    projects: { src: "projects.jpg", alt: "Newly installed high-efficiency furnace" },
    faq: { src: "faq-thermostat.jpg", alt: "Homeowner pointing out the thermostat to a technician in her hallway" },
    promo: { src: "promo.jpg", alt: "Thermostat set to a comfortable temperature" },
    aboutHero: { src: "about-hero.jpg", alt: "Technician servicing a rooftop air conditioning unit at dusk" },
    aboutStory: { src: "about-story-furnace.jpg", alt: "Technician testing the controls of an indoor furnace with a multimeter" },
    aboutStoryInset: { src: "about-story-condenser.jpg", alt: "Technician kneeling beside an outdoor AC condenser with the service panel open" },
    aboutMission: { src: "about-mission-consult.jpg", alt: "Technician showing a homeowner service details on a tablet in her living room" },
    aboutCta: { src: "about-cta-home.jpg", alt: "Modern two-story home with a stone and wood facade and a green front lawn" },
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
      { key: "serviceArea", enabled: true },
      { key: "rebates", enabled: false },
      { key: "faq", enabled: true },
      { key: "posts", enabled: true },
      { key: "ctaBand", enabled: true },
    ],
  },
};
