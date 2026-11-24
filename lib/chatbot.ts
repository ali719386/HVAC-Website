import type { Brand, ServiceType } from "@/lib/brand/schema";
import { getCoverage } from "@/lib/geo/coverage";
import { hoursText } from "@/lib/hours";
import { formatUsd } from "@/lib/format";
import { getTrustItems } from "@/components/layout/trust-list";

/**
 * Website assistant knowledge base, built on the server from the brand's own content only.
 * The client matches questions against these entries; nothing is sent to any external service.
 * Answers never go beyond what the site already says (no prices, promises or claims are added).
 */
export type ChatLink = { label: string; href: string };
export type ChatEntry = {
  id: string;
  /** Lowercase phrases; a phrase found in the question scores by its length. */
  keywords: string[];
  answer: string;
  links: ChatLink[];
  /** Minimum score to answer with this entry (FAQs need two matching words). */
  min?: number;
  /** Show the call, WhatsApp and book buttons under the answer. */
  handoff?: boolean;
};
/** quick: question shortcuts shown once under the welcome message. */
/** A passage of site text for the search fallback (shown verbatim, never rewritten). */
export type ChatDoc = { title: string; text: string; href: string };

export type ChatData = {
  entries: ChatEntry[];
  /** Every piece of site text, searched when no topic matches. */
  docs: ChatDoc[];
  quick: { id: string; label: string }[];
  /** Configured ZIP codes -> city label and page (empty until real ZIP data is added). */
  zips: Record<string, { label: string; href: string }>;
};

const STOP = new Set(
  "a an the and or of to in on for with is are was do does did can could should would will my your our you we i me it this that what when where how why which who have has get my there their them be am at by from as if any about need".split(" "),
);

/** Significant words from a sentence (for FAQ matching). */
const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

/** Extra phrases people use for each service type (generic HVAC wording). */
const serviceSynonyms: Record<ServiceType, string[]> = {
  "ac-repair": ["ac repair", "air conditioner", "ac not cooling", "not cooling", "warm air", "ac broken", "cooling repair", "ac problem", "aircon"],
  "ac-installation": ["install", "installation", "new ac", "replace", "replacement", "new system", "central air", "new air conditioner"],
  heating: ["furnace", "heating", "heater", "heat pump", "no heat", "boiler", "heat"],
  maintenance: ["maintenance", "tune-up", "tune up", "tuneup", "checkup", "check up", "inspection", "service plan"],
  commercial: ["commercial", "business", "office", "rooftop", "restaurant", "store", "building"],
  "duct-cleaning": ["duct", "ducts", "ductwork", "duct cleaning", "air ducts", "vents", "airflow"],
};

export function buildChatData(brand: Brand): ChatData {
  const { config, content } = brand;
  const { company, offerings } = config;
  const entries: ChatEntry[] = [];
  const book = { label: content.copy.hero.primaryCta, href: "/book" };
  const call = { label: `Call ${company.phone.display}`, href: `tel:${company.phone.tel}` };

  // Small talk (low weight in the matcher, so a real topic in the same message always wins).
  const talk = content.copy.chatbot.smallTalk;
  const fill = (s: string) => s.replaceAll("{company}", company.name).replaceAll("{name}", config.chatbot.name);
  entries.push(
    {
      id: "talk-greeting",
      keywords: ["hi", "hello", "hey", "hiya", "howdy", "greetings", "good morning", "good afternoon", "good evening", "salam", "salaam", "assalam", "assalamualaikum", "assalam o alaikum", "aoa", "help"],
      answer: fill(talk.greeting),
      links: [],
    },
    {
      id: "talk-how",
      keywords: ["how are you", "how are u", "how r u", "how is it going", "hows it going", "how do you do", "how is your day", "kaise ho", "kaisay ho", "kya haal", "kia haal", "kya hal"],
      answer: fill(talk.howAreYou),
      links: [],
    },
    {
      id: "talk-thanks",
      keywords: ["thanks", "thank", "thank you", "thx", "appreciate", "appreciated", "shukriya", "shukria", "jazak allah", "great thanks"],
      answer: fill(talk.thanks),
      links: [],
    },
    {
      id: "talk-bye",
      keywords: ["bye", "goodbye", "good bye", "bye bye", "see you", "see ya", "have a nice day", "have a good day", "have a great day", "take care", "good night", "allah hafiz", "khuda hafiz", "that is all", "thats all"],
      answer: fill(talk.goodbye),
      links: [],
    },
    {
      id: "talk-name",
      keywords: ["your name", "who are you", "what are you", "are you a bot", "are you a robot", "are you human", "are you real"],
      answer: fill(talk.name),
      links: [],
    },
  );

  // Services
  entries.push({
    id: "services",
    keywords: ["services", "service", "what do you do", "what do you offer", "offer", "options"],
    answer: `We offer: ${content.services.map((s) => s.title).join(", ")}.`,
    links: [{ label: "All services", href: "/services" }, book],
  });
  for (const s of content.services) {
    entries.push({
      id: `service-${s.slug}`,
      // Title, common phrases, and the "signs you may need service" listed on the service page.
      keywords: [s.title.toLowerCase(), ...serviceSynonyms[s.slug], ...s.signs.map((x) => x.toLowerCase())],
      answer: `${s.title}: ${s.summary}${s.features.length ? ` It includes ${s.features.slice(0, 3).join(", ").toLowerCase()}.` : ""}${
        s.startingAt ? ` Starting at ${formatUsd(s.startingAt)}.` : ""
      }`,
      links: [{ label: `About ${s.title}`, href: `/services/${s.slug}` }, { label: book.label, href: `/book?service=${s.slug}` }],
    });
  }

  // Booking, contact, hours
  entries.push({
    id: "book",
    keywords: ["book", "booking", "appointment", "schedule", "visit", "estimate", "quote", "technician", "come out", "send someone"],
    answer: `You can request a visit online in a few steps, or call ${company.phone.display}. Our team confirms the details and a time with you.`,
    links: [book, call],
  });
  entries.push({
    id: "contact",
    keywords: ["contact", "phone", "number", "call", "email", "reach", "talk", "address", "office", "located", "location"],
    answer: `Phone: ${company.phone.display}. Email: ${company.email}. Office: ${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zip}.`,
    links: [call, { label: "Contact page", href: "/contact" }],
  });
  entries.push({
    id: "hours",
    keywords: ["hours", "open", "opening", "close", "closing", "closed", "what time", "weekend", "saturday", "sunday", "working hours", "business hours"],
    answer: `Our hours: ${company.hours.map((h) => `${h.label} ${hoursText(h)}`).join("; ")}.`,
    links: [call],
  });
  if (offerings.emergency24x7) {
    const em = company.emergencyPhone ?? company.phone;
    entries.push({
      id: "emergency",
      keywords: ["emergency", "urgent", "24/7", "24 7", "after hours", "night", "right now", "asap", "no heat", "no ac", "broke down"],
      answer: `For an emergency, call our 24/7 line at ${em.display}. If you smell gas or a carbon monoxide alarm sounds, leave the home first and call 911 or your gas utility.`,
      links: [{ label: `Call ${em.display}`, href: `tel:${em.tel}` }],
    });
  }
  if (company.whatsapp) {
    entries.push({
      id: "whatsapp",
      keywords: ["whatsapp", "text", "message", "chat with", "real person", "human", "agent"],
      answer: `You can message our team on WhatsApp or call ${company.phone.display}.`,
      links: [{ label: company.whatsapp.label, href: `https://wa.me/${company.whatsapp.number}` }, call],
    });
  }

  // Coverage
  const { states, cities } = getCoverage();
  entries.push({
    id: "areas",
    keywords: ["area", "areas", "serve", "service area", "coverage", "cities", "states", "near me", "where", "location", "zip"],
    answer: `We serve ${cities.length} cities in ${states.length} states. Open the service areas page or the checker to look up your city.`,
    links: [{ label: "Service areas", href: "/service-areas" }],
  });
  for (const st of states) {
    entries.push({
      id: `state-${st.abbr}`,
      keywords: [st.name.toLowerCase()],
      answer: `Yes, ${st.name} is in our service area${st.cities.length ? `, including ${st.cities.map((c) => c.name).join(", ")}` : ". Call us to confirm your town"}.`,
      links: [{ label: st.name, href: st.href }],
    });
  }
  for (const c of cities) {
    entries.push({
      id: `city-${c.stateAbbr}-${c.slug}`,
      keywords: [c.name.toLowerCase(), `${c.name.toLowerCase()} ${c.stateAbbr.toLowerCase()}`],
      answer: `Yes, ${c.label} is in our service area.`,
      links: [{ label: c.label, href: c.href }, { label: book.label, href: `/book?state=${c.stateAbbr}&city=${encodeURIComponent(c.name)}` }],
    });
  }

  // Equipment brands serviced (from config; no dealer or certification claims).
  const makes = offerings.supportedBrands.map((b) => b.name);
  if (makes.length > 0) {
    entries.push({
      id: "brands",
      keywords: [
        "brands",
        "brand",
        "make",
        "makes",
        "manufacturer",
        "manufacturers",
        "which brands",
        "what brands",
        "ac brands",
        "equipment",
        "models",
        ...makes.map((m) => m.toLowerCase()),
      ],
      answer: `We service these equipment brands: ${makes.join(", ")}. Listing a brand does not mean we are a dealer for it. Have a different make? Our team can confirm, just use the buttons below.`,
      links: [{ label: "Our services", href: "/services" }],
      handoff: true,
    });
    // Other common makes not in the list: never claim we service them; hand off to the team.
    const listed = new Set(makes.map((m) => m.toLowerCase()));
    const otherMakes = [
      "trane", "goodman", "rheem", "ruud", "york", "daikin", "amana", "mitsubishi", "fujitsu", "gree", "heil", "tempstar",
      "payne", "coleman", "luxaire", "bosch", "frigidaire", "maytag", "armstrong", "ducane", "comfortmaker", "lg", "samsung",
      "carrier", "lennox", "bryant", "american standard", "different make", "other brand", "another brand",
    ].filter((m) => !listed.has(m));
    entries.push({
      id: "brands-other",
      keywords: otherMakes,
      answer: `That make is not on our listed brands (${makes.join(", ")}). Our team can tell you whether we can work on it. Reach us with the buttons below.`,
      links: [],
      handoff: true,
    });
  }

  // Financing, plans, credentials
  if (offerings.financing.enabled) {
    entries.push({
      id: "financing",
      keywords: ["financing", "finance", "payment", "payments", "pay monthly", "loan", "credit", "afford"],
      answer: offerings.financing.description || "Financing may be available for qualifying customers, subject to credit approval.",
      links: [{ label: "Financing", href: "/financing" }],
    });
  }
  if (content.plans.length > 0) {
    entries.push({
      id: "plans",
      keywords: ["plan", "plans", "membership", "maintenance plan", "agreement", "subscription"],
      // Prices only when the plan content lists one (never invented).
      answer: `Our maintenance plans: ${content.plans
        .map((p) => (p.priceUsd !== undefined ? `${p.name} (${formatUsd(p.priceUsd)}${p.interval ? ` per ${p.interval}` : ""})` : p.name))
        .join(", ")}.`,
      links: [{ label: "Maintenance plans", href: "/plans" }],
    });
  }
  const trust = getTrustItems(company).filter((t) => t.key === "license" || t.key === "insured" || t.key.startsWith("cert-"));
  if (trust.length > 0) {
    entries.push({
      id: "credentials",
      keywords: ["license", "licensed", "insured", "insurance", "bonded", "certified", "certification"],
      answer: trust.map((t) => t.text).join(". ") + ".",
      links: [],
    });
  }

  if (company.yearsInBusiness) {
    entries.push({
      id: "experience",
      keywords: ["how long", "years", "experience", "established", "since when"],
      answer: `We have been in business for ${company.yearsInBusiness}+ years.`,
      links: [{ label: "About us", href: "/about" }],
    });
  }
  if (company.googleRating) {
    const r = company.googleRating;
    entries.push({
      id: "reviews",
      keywords: ["reviews", "review", "rating", "ratings", "testimonials", "google"],
      answer: `We are rated ${r.score.toFixed(1)} on Google from ${r.count} reviews.`,
      links: [{ label: "Google reviews", href: r.url }],
    });
  }

  // About page: story, why choose us, mission and values.
  const about = content.copy.about;
  entries.push({
    id: "about",
    keywords: ["about", "company", "your team", "history", "this website", "website", "story", "who owns"],
    answer: `${company.name}: ${company.tagline}. ${about.story.intro}`,
    links: [{ label: "About us", href: "/about" }],
  });
  const why = about.why.items.length > 0 ? about.why.items : content.whyChooseUs;
  if (why.length > 0) {
    entries.push({
      id: "why",
      keywords: ["why choose", "why you", "why should", "different", "better", "trust you", "reasons"],
      answer: `Why homeowners choose us: ${why.map((w) => w.title).join(", ")}.`,
      links: [{ label: "About us", href: "/about" }],
    });
  }
  if (about.mission.intro || about.mission.values.length > 0) {
    entries.push({
      id: "mission",
      keywords: ["mission", "values", "goal", "vision", "believe"],
      answer: `${about.mission.intro}${about.mission.values.length ? ` Our values: ${about.mission.values.map((v) => v.title).join(", ")}.` : ""}`.trim(),
      links: [{ label: "About us", href: "/about" }],
    });
  }

  // How a job works (process steps).
  if (content.process.length > 0) {
    entries.push({
      id: "process",
      keywords: ["process", "how it works", "how does it work", "steps", "next steps", "your process"],
      answer: content.process.map((p, i) => `${i + 1}. ${p.title}: ${p.body}`).join(" "),
      links: [book],
    });
  }

  // Problem picker symptoms (e.g. strange noises, thermostat issue).
  for (const sym of content.symptoms) {
    const target = content.services.find((s) => s.slug === sym.service);
    entries.push({
      id: `symptom-${sym.id}`,
      keywords: [sym.label.toLowerCase(), ...words(sym.label).filter((w) => w.length > 4)],
      answer: `${sym.label}: ${target ? `that is usually a job for our ${target.title} service.` : "our team can take a look."} You can send the details and we will follow up.`,
      links: [
        ...(target ? [{ label: target.title, href: `/services/${target.slug}` }] : []),
        { label: book.label, href: `/book?issue=${encodeURIComponent(sym.id)}` },
      ],
    });
  }

  // Safety (gas smell, carbon monoxide): always point to the safety notice first.
  entries.push({
    id: "safety",
    keywords: ["gas smell", "smell gas", "gas leak", "carbon monoxide", "co alarm", "co detector", "dangerous", "unsafe", "safety"],
    answer: config.contact.safetyNotice,
    links: [{ label: "Call 911", href: "tel:911" }],
  });

  // Pricing: only what the site states (startingAt and plan prices); otherwise ask for an estimate.
  const priced = content.services.filter((s) => s.startingAt);
  entries.push({
    id: "pricing",
    keywords: ["price", "prices", "pricing", "cost", "costs", "how much", "charge", "fee", "fees", "rates", "cheap", "expensive"],
    answer: priced.length
      ? `Listed prices: ${priced.map((s) => `${s.title} starting at ${formatUsd(s.startingAt ?? 0)}`).join(", ")}. Other work depends on your system; contact us for an estimate.`
      : "Pricing depends on your system and the work needed. Contact us and we will explain the options and the cost.",
    links: [book, call],
  });

  // Promotions and rebates, only when enabled in config.
  if (offerings.promoBar.enabled && offerings.promoBar.text) {
    entries.push({
      id: "promo",
      keywords: ["promo", "promotion", "deal", "deals", "discount", "coupon", "special", "offer this month"],
      answer: offerings.promoBar.text,
      links: offerings.promoBar.href ? [{ label: offerings.promoBar.linkLabel ?? "Details", href: offerings.promoBar.href }] : [],
    });
  }
  if (offerings.rebates.enabled && offerings.rebates.title) {
    entries.push({
      id: "rebates",
      keywords: ["rebate", "rebates", "incentive", "incentives", "tax credit", "credits"],
      answer: `${offerings.rebates.title}. ${offerings.rebates.body}`.trim(),
      links: offerings.rebates.url ? [{ label: "Current programs", href: offerings.rebates.url }] : [],
    });
  }

  // Projects: overview plus each project (title, city, system).
  if (content.projects.length > 0) {
    entries.push({
      id: "projects",
      keywords: ["projects", "portfolio", "past work", "examples", "jobs", "recent work"],
      answer: `See ${content.projects.length} recent jobs on our projects page, filtered by service, city and system type.`,
      links: [{ label: "Projects", href: "/projects" }],
    });
    for (const p of content.projects) {
      entries.push({
        id: `project-${p.slug}`,
        // Title and system words plus "project"; two must match so a single word never steals a service question.
        keywords: [...new Set(["project", "job", ...words(p.title), ...words(p.systemType), p.city.toLowerCase()])],
        min: 2,
        answer: `${p.title} (${p.city}, ${p.state}): ${p.summary}`,
        links: [{ label: "View project", href: `/projects/${p.slug}` }],
      });
    }
  }

  // Blog: overview plus each article (title words and tags).
  if (content.posts.length > 0) {
    entries.push({
      id: "blog",
      keywords: ["blog", "tips", "articles", "guide", "guides", "advice", "read"],
      answer: `Our blog has ${content.posts.length} homeowner guides on repairs, maintenance and choosing equipment.`,
      links: [{ label: "Blog", href: "/blog" }],
    });
    content.posts.forEach((p) =>
      entries.push({
        id: `post-${p.slug}`,
        keywords: [...new Set([...words(p.title), ...p.tags.map((t) => t.toLowerCase())])],
        answer: `${p.title}: ${p.excerpt}`,
        links: [{ label: "Read article", href: `/blog/${p.slug}` }],
        min: 2,
      }),
    );
  }

  // Social profiles and legal pages.
  if (company.socials.length > 0) {
    entries.push({
      id: "socials",
      keywords: ["facebook", "instagram", "youtube", "linkedin", "social", "social media", "follow"],
      answer: "You can follow us here:",
      links: company.socials.map((s) => ({ label: s.network.charAt(0).toUpperCase() + s.network.slice(1), href: s.url })),
    });
  }
  entries.push({
    id: "legal",
    keywords: ["privacy", "privacy policy", "terms", "terms of service", "sms", "text messages", "data", "personal information"],
    answer: "Our privacy policy, terms of service and SMS terms are linked below.",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "SMS Terms", href: "/sms-consent" },
    ],
  });

  // FAQs (site, projects, contact, climate): need two significant words in common.
  const climateFaqs = [...config.coverage.states.map((s) => s.climate)]
    .filter((c, i, all) => all.indexOf(c) === i)
    .flatMap((c) => content.climate[c].faqs);
  const faqs = [...content.faqs, ...content.projectFaqs, ...config.contact.faqs, ...climateFaqs];
  const seenQ = new Set<string>();
  faqs.forEach((f, i) => {
    if (seenQ.has(f.question)) return;
    seenQ.add(f.question);
    entries.push({ id: `faq-${i}`, keywords: [...new Set(words(f.question))], answer: f.answer, links: [], min: 2 });
  });

  // Quick questions from copy, only for topics this brand actually has.
  const ids = new Set(entries.map((e) => e.id));
  const quick = content.copy.chatbot.quickQuestions.filter((q) => ids.has(q.topic)).map((q) => ({ id: q.topic, label: q.label }));
  const zips = Object.fromEntries(cities.flatMap((c) => c.zips.map((z) => [z, { label: c.label, href: c.href }])));
  return { entries, quick, zips, docs: buildDocs(brand) };
}

/** Keeps passages short enough to read in a chat bubble. */
const clip = (s: string, max = 420) => (s.length > max ? `${s.slice(0, s.lastIndexOf(" ", max)).trim()}...` : s);

/**
 * Every readable passage on the site, for the search fallback: service pages, blog articles, projects,
 * about, plans, financing, process, FAQs and real (non-template) city and state intros.
 */
export function buildDocs(brand: Brand): ChatDoc[] {
  const { config, content } = brand;
  const docs: ChatDoc[] = [];
  const add = (title: string, text: string | undefined, href: string) => {
    const t = text?.trim();
    if (t) docs.push({ title, text: clip(t), href });
  };

  for (const s of content.services) {
    const href = `/services/${s.slug}`;
    add(s.title, s.intro, href);
    s.body.forEach((p) => add(s.title, p, href));
    if (s.features.length) add(`${s.title}: what's included`, s.features.join(". ") + ".", href);
    if (s.signs.length) add(`${s.title}: signs you may need it`, s.signs.join(". ") + ".", href);
  }

  for (const p of content.posts) {
    const href = `/blog/${p.slug}`;
    add(p.title, p.excerpt, href);
    if (p.takeaways.length) add(`${p.title}: key takeaways`, p.takeaways.join(". ") + ".", href);
    for (const b of p.body) {
      if (b.type === "paragraph" || b.type === "quote") add(p.title, b.text, href);
      else if (b.type === "list") add(p.title, b.items.join(". ") + ".", href);
      else if (b.type === "callout") add(p.title, `${b.title ? `${b.title}. ` : ""}${b.text}`, href);
    }
  }

  for (const p of content.projects) {
    const href = `/projects/${p.slug}`;
    add(p.title, p.overview, href);
    add(`${p.title}: the challenge`, p.challenge, href);
    add(`${p.title}: our solution`, p.solution, href);
    if (p.equipment.length) add(`${p.title}: equipment`, p.equipment.map((e) => `${e.name} (${e.type}${e.specs ? `, ${e.specs}` : ""})`).join(". ") + ".", href);
    if (p.timeline.length) add(`${p.title}: how the work went`, p.timeline.map((t) => `${t.title}: ${t.description}`).join(" "), href);
  }

  const about = content.copy.about;
  add("About us", about.story.intro, "/about");
  add("Our mission", about.mission.intro, "/about");
  for (const w of [...about.why.items, ...content.whyChooseUs]) add(w.title, w.body, "/about");

  for (const p of content.plans) add(p.name, `${p.description}${p.features.length ? ` ${p.features.join(". ")}.` : ""}`, "/plans");
  if (config.offerings.financing.enabled) add("Financing", config.offerings.financing.description, "/financing");
  for (const step of content.process) add(`How it works: ${step.title}`, step.body, "/services");
  add("Safety", config.contact.safetyNotice, "/contact");

  for (const f of [...content.faqs, ...content.projectFaqs, ...config.contact.faqs]) add(f.question, f.answer, "/contact");

  // Only written (not template) area intros, so search never repeats boilerplate.
  for (const st of getCoverage().states) {
    add(st.name, st.intro, st.href);
    for (const c of st.cities) {
      add(c.label, c.intro, c.href);
      c.localNotes.forEach((n) => add(c.label, n, c.href));
    }
  }
  return docs;
}