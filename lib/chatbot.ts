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
};
export type ChatData = { entries: ChatEntry[] };

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
      keywords: [s.title.toLowerCase(), ...serviceSynonyms[s.slug]],
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
    keywords: ["hours", "open", "opening", "close", "closing", "closed", "time", "weekend", "saturday", "sunday", "today"],
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
      answer: `Our maintenance plans: ${content.plans.map((p) => p.name).join(", ")}.`,
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

  // Site sections
  entries.push({
    id: "about",
    keywords: ["about", "company", "your team", "history", "this website", "website"],
    answer: `${company.name}: ${company.tagline}.`,
    links: [{ label: "About us", href: "/about" }],
  });
  if (content.projects.length > 0) {
    entries.push({ id: "projects", keywords: ["projects", "portfolio", "past work", "examples", "jobs"], answer: "See photos and details of recent jobs on our projects page.", links: [{ label: "Projects", href: "/projects" }] });
  }
  if (content.posts.length > 0) {
    entries.push({ id: "blog", keywords: ["blog", "tips", "articles", "guide", "guides", "advice"], answer: "Our blog has homeowner guides on repairs, maintenance and choosing equipment.", links: [{ label: "Blog", href: "/blog" }] });
  }

  // FAQs (site, projects, contact): need two significant words in common.
  const faqs = [...content.faqs, ...content.projectFaqs, ...config.contact.faqs];
  faqs.forEach((f, i) => entries.push({ id: `faq-${i}`, keywords: [...new Set(words(f.question))], answer: f.answer, links: [], min: 2 }));

  return { entries };
}
