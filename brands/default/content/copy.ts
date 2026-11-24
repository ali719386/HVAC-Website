import type { CopyOverrides } from "@/content/types";

// Brand-specific copy. Any section not listed falls back to content/defaults.ts.
// TODO: review all copy with the client.
export const copy: CopyOverrides = {
  hero: {
    summer: {
      eyebrow: "Welcome",
      title: "Complete HVAC Solutions Comfort Without Compromise",
      subtitle:
        "Expert AC repair, installation, and maintenance backed by skilled professionals. We deliver reliable climate control and lasting comfort for every space.",
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
  faq: { eyebrow: "", title: "Do You Have Any Questions?", intro: "" },
  about: {
    title: "About Coolwren Heating & Air",
    intro: "A Columbus heating and cooling company focused on honest recommendations and careful work.",
    story: {
      eyebrow: "Our story",
      title: "More Than Heating & Cooling. We're Here for Your Comfort.",
      intro:
        "At Coolwren Heating & Air, we believe indoor comfort starts with dependable service and thoughtful solutions. From air conditioning repairs to complete system installations, our focus is on helping homeowners enjoy a comfortable environment with confidence.",
      points: ["Personalized HVAC Solutions", "Quality-Focused Workmanship", "Customer-First Approach"],
    },
    why: {
      eyebrow: "Why Coolwren",
      title: "Why Homeowners Choose Coolwren",
      intro: "Comfort is personal. That's why we focus on delivering service built around your needs.",
      items: [
        { icon: "shield", title: "Trusted Service", body: "Dependable HVAC support with attention to your comfort and needs." },
        { icon: "award", title: "Quality Workmanship", body: "Every project receives careful attention and a focus on doing things right." },
        { icon: "message", title: "Honest Recommendations", body: "Clear communication and solutions that make sense for your space." },
        { icon: "heart-handshake", title: "Customer-First Approach", body: "A service experience designed around your comfort and satisfaction." },
      ],
    },
    mission: {
      eyebrow: "Our mission",
      title: "Making Indoor Comfort Simple, Reliable & Stress-Free.",
      intro:
        "Our mission is to provide thoughtful heating and cooling solutions that help create comfortable spaces. We value honest communication, quality service, and lasting customer relationships.",
      values: [
        { icon: "scale", title: "Integrity" },
        { icon: "badge-check", title: "Quality" },
        { icon: "handshake", title: "Commitment" },
      ],
    },
    services: {
      eyebrow: "What we do",
      title: "Complete Comfort. One Trusted Team.",
      items: [
        {
          slug: "ac-installation",
          summary: "Professional air conditioning installation designed around your property's cooling needs.",
          image: { src: "about-ac-installation.jpg", alt: "Technician setting up a new central air conditioner on a pad beside a home" },
        },
        {
          slug: "ac-repair",
          summary: "Reliable diagnostic and repair services to help restore your indoor comfort.",
          image: { src: "about-ac-repair.jpg", alt: "Technician reading refrigerant gauges and an airflow meter at an outdoor AC unit" },
        },
        {
          slug: "maintenance",
          title: "HVAC Maintenance",
          summary: "Routine system care to support performance, efficiency, and long-term reliability.",
          image: { src: "about-maintenance.jpg", alt: "Technician connecting gauge hoses to an outdoor AC unit during a tune-up" },
        },
      ],
    },
    testimonials: { eyebrow: "Reviews", title: "Comfort Speaks for Itself.", intro: "" },
    cta: {
      title: "Let's Make Your Comfort Our Priority.",
      body: "Whether you need a quick repair or a complete HVAC installation, we're ready to help.",
      cta: "Schedule a Service",
      call: "Call Now",
    },
  },
  // TODO: review /projects copy with the client.
  projects: {
    eyebrow: "Our projects",
    title: "Recent HVAC Projects in Central Ohio",
    intro: "A look at installations, repairs and maintenance work for homes and businesses around Columbus.",
  },
  projectsPage: {
    // TODO: keep "free estimate" only if the client really offers free estimates.
    hero: {
      primaryCta: "Get a free estimate",
      callCta: "Call now",
      projectsCompleted: "Projects completed",
      homesServed: "Homes served",
      yearsInBusiness: "Years in business",
    },
    featured: { eyebrow: "Featured project", title: "Inside a recent installation", intro: "What the homeowner needed and how we handled it.", badge: "Featured" },
    grid: { eyebrow: "Our work", title: "Browse our projects", intro: "Filter by service, city or system type." },
    process: { eyebrow: "Our process", title: "How we deliver every project", intro: "The same clear steps on every job, big or small." },
    testimonials: { eyebrow: "Reviews", title: "What project customers said", intro: "" },
    cities: { eyebrow: "Service area", title: "Cities we serve", intro: "Local pages with notes for each community." },
    faq: { eyebrow: "FAQ", title: "Questions about projects", intro: "Timelines, permits, warranties and payment." },
    cta: {
      eyebrow: "Start a project",
      title: "Planning a similar project?",
      intro: "Tell us about your home or building and our Columbus team will follow up to talk through options.",
    },
  },
  // TODO: review /services page copy with the client.
  servicesPage: {
    // TODO: keep "free estimate" only if the client really offers free estimates.
    hero: { primaryCta: "Get a free estimate", callCta: "Call now" },
    problemPicker: {
      eyebrow: "Not sure what you need?",
      title: "Tell us what your system is doing",
      intro: "Pick the closest match and we will point you to the right service.",
    },
    emergency: { callCta: "Call now" },
    process: { eyebrow: "How it works", title: "Simple from the first call", intro: "Clear steps, so you always know what happens next." },
    plans: { title: "Maintenance plans", body: "Seasonal tune-ups scheduled for you, so small issues get caught early.", cta: "View plans" },
    financing: { title: "Financing options", body: "Payment options for qualifying customers on new systems.", cta: "Financing details" },
    reviews: { eyebrow: "Reviews", title: "What Central Ohio homeowners say", intro: "", googleLabel: "on Google" },
    faq: { eyebrow: "FAQ", title: "Questions about our services", intro: "Quick answers before you book." },
    cta: {
      eyebrow: "Request service",
      title: "Tell us what you need",
      intro: "Send a quick request and our Columbus team will confirm a time. For emergencies, call us.",
    },
  },
  ctaBand: {
    title: "Too hot, too cold, or just not right?",
    body: "Call our Columbus team or book online. We will confirm your arrival window.",
    cta: "Book online",
  },
  // TODO: review blog copy with the client.
  posts: {
    eyebrow: "HVAC tips",
    title: "Heating and Cooling Advice",
    intro: "Practical guides on repairs, maintenance and choosing equipment, written for homeowners.",
  },
  blog: {
    featured: { eyebrow: "Featured guide", title: "Start with this one", intro: "Our most useful guide for homeowners planning ahead.", badge: "Featured" },
    grid: { eyebrow: "All articles", title: "Browse the blog", intro: "Search by topic or pick a category." },
    cta: { eyebrow: "Request service", title: "Have a question about your system?", intro: "Send a quick request and our team will follow up." },
  },
  // TODO: review contact page copy with the client.
  contact: {
    eyebrow: "Contact us",
    title: "Contact Coolwren Heating & Air",
    intro: "Call, email or send a request online. Tell us what is going on and we will follow up to confirm the details.",
  },
  contactPage: {
    // TODO: must match the privacy policy (legal review).
    privacyNote: "We never sell your information",
    form: { title: "Request service", intro: "Three short steps. It only takes a minute or two." },
    hero: {
      call: "Call now",
      book: "Book online",
      asideTitle: "Talk to a real person",
      asideBody: "Our office team can answer questions and set up a visit.",
      openNow: "Open now",
      closedNow: "Closed now",
    },
    cta: { title: "Rather talk to someone?", body: "Call our team and we will help you figure out the next step." },
  },};
