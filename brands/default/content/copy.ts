import type { CopyOverrides } from "@/content/types";

// Brand-specific copy. Any section not listed falls back to content/defaults.ts.
// TODO: review all copy with the client.
export const copy: CopyOverrides = {
  hero: {
    summer: {
      eyebrow: "Welcome",
      title: "Air Conditioning Service, Repair & Installation",
      // TODO: "years of experience" and "certified professionals" are claims; keep only if true for the client.
      subtitle:
        "We specialize in providing top-notch heating, ventilation, and air conditioning solutions tailored to meet the unique needs of our clients. With years of experience serving the vibrant and diverse clients, our team of certified professionals is dedicated to ensuring your comfort.",
    },
    winter: {
      eyebrow: "Columbus heating & cooling",
      title: "Reliable heat for Central Ohio winters",
      subtitle: "Furnace and heat pump repair, replacement and safety checks from local technicians.",
    },
    primaryCta: "Book a service",
    badge: "Written estimates up front",
  },
  brandStrip: { title: "We Service the Leading Air Conditioning Brands" },
  services: {
    eyebrow: "Our services",
    title: "Heating and cooling, handled start to finish",
    intro: "From a quick repair to a full system replacement, one local team takes care of it.",
  },
  whyChooseUs: {
    eyebrow: "Why Coolwren",
    title: "The service experience you would want for your own home",
    intro: "Straight answers, clean work and technicians who explain what they find.",
  },
  testimonials: { eyebrow: "Reviews", title: "What Central Ohio homeowners say", intro: "" },
  about: {
    title: "About Coolwren Heating & Air",
    intro: "A Columbus heating and cooling company focused on honest recommendations and careful work.",
    body: [
      "TODO: Replace with the client's real story: when and why the company started, who leads it, and what makes the team different.",
      "TODO: Describe the service area, the types of homes and businesses served, and any community involvement.",
    ],
    values: [
      { icon: "check", title: "Honest recommendations", body: "TODO: describe in the client's words.", placeholder: true },
      { icon: "users", title: "Trained technicians", body: "TODO: describe training and qualifications.", placeholder: true },
      { icon: "home", title: "Respect for your home", body: "TODO: describe jobsite standards.", placeholder: true },
    ],
  },
  ctaBand: {
    title: "Too hot, too cold, or just not right?",
    body: "Call our Columbus team or book online. We will confirm your arrival window.",
    cta: "Book online",
  },
};
