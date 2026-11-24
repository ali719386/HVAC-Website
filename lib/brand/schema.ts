import { z } from "zod";
import { serviceTypes } from "@/lib/lead/constants";
import { isStateAbbr } from "@/lib/geo/states";
import { contrastRatio, requiredPairs } from "./contrast";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Expected a 6-digit hex color like #0B3D91");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Expected a lowercase-hyphen slug");
const usState = z.string().regex(/^[A-Z]{2}$/, "Use a 2-letter US state abbreviation");
const zip = z.string().regex(/^\d{5}$/, "Use a 5-digit US ZIP code");
const nonEmpty = z.string().trim().min(1);
const url = z.url();
/** Path relative to /public/brands/<slug>/ ; no traversal, no absolute URLs (never hotlink). */
const assetPath = z
  .string()
  .regex(/^[a-z0-9][a-z0-9/_.-]*\.(jpg|jpeg|png|webp|avif|svg)$/, "Use a lowercase relative file path")
  .refine((v) => !v.includes(".."), "Path traversal is not allowed");

export const phoneSchema = z.object({
  display: nonEmpty,
  /** E.164 US number used in tel: links, e.g. +15555550100 */
  tel: z.string().regex(/^\+1\d{10}$/, "Use E.164 US format: +1XXXXXXXXXX"),
});

export const imageSchema = z.object({ src: assetPath, alt: nonEmpty });

/** Fonts available to brands. Keep in sync with lib/fonts.ts (4 to 6 fonts). */
export const fontKeys = ["inter", "manrope", "outfit", "dmSans", "plusJakarta", "barlow"] as const;
export const fontKeySchema = z.enum(fontKeys);

export const iconKeys = [
  "snowflake",
  "flame",
  "wrench",
  "fan",
  "building",
  "thermometer",
  "shield",
  "clock",
  "award",
  "badge-dollar",
  "users",
  "leaf",
  "home",
  "zap",
  "phone",
  "check",
  "calendar",
  "map-pin",
  "wind",
  "gauge",
  "message",
  "heart-handshake",
  "handshake",
  "scale",
  "badge-check",
  "volume",
  "clipboard",
] as const;
export const iconKeySchema = z.enum(iconKeys);

export const sectionKeys = [
  "hero",
  "emergency",
  "brandStrip",
  "services",
  "whyChooseUs",
  "expert",
  "stats",
  "testimonials",
  "plans",
  "financing",
  "serviceArea",
  "serviceAreas",
  "rebates",
  "faq",
  "posts",
  "ctaBand",
] as const;
export const sectionKeySchema = z.enum(sectionKeys);
export type SectionKey = z.infer<typeof sectionKeySchema>;

export const serviceTypeSchema = z.enum(serviceTypes);
export type ServiceType = z.infer<typeof serviceTypeSchema>;

/** /services page filter values. A service can belong to several of each. */
export const serviceCategories = ["cooling", "heating", "maintenance"] as const;
export type ServiceCategory = (typeof serviceCategories)[number];
export const serviceAudiences = ["residential", "commercial"] as const;
export type ServiceAudience = (typeof serviceAudiences)[number];

/** /services page sections, in render order when listed in config.servicesPage.sections. */
export const servicesSectionKeys = [
  "filters",
  "cards",
  "problemPicker",
  "emergency",
  "process",
  "plansFinancing",
  "serviceArea",
  "brands",
  "reviews",
  "faq",
  "cta",
] as const;
export type ServicesSectionKey = (typeof servicesSectionKeys)[number];

/** /projects category tabs. */
export const projectCategories = ["ac-installation", "heating", "repair", "maintenance", "commercial"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

/** /projects index sections (the hero always renders first). */
export const projectsSectionKeys = [
  "trust",
  "featured",
  "grid",
  "stats",
  "process",
  "testimonials",
  "cities",
  "faq",
  "cta",
] as const;
export type ProjectsSectionKey = (typeof projectsSectionKeys)[number];

/** /blog index sections. */
export const blogSectionKeys = ["featured", "seasonal", "grid", "cta"] as const;
export type BlogSectionKey = (typeof blogSectionKeys)[number];

const placeholder = z.boolean().optional();

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export const serviceSchema = z.object({
  slug: serviceTypeSchema,
  title: nonEmpty,
  summary: nonEmpty,
  icon: iconKeySchema,
  image: imageSchema,
  intro: nonEmpty,
  body: z.array(nonEmpty).min(1),
  features: z.array(nonEmpty).min(1),
  signs: z.array(nonEmpty).default([]),
  seoTitle: nonEmpty,
  seoDescription: nonEmpty,
  /** /services filters. */
  category: z.array(z.enum(serviceCategories)).min(1),
  audience: z.array(z.enum(serviceAudiences)).min(1),
  /** Shows a 24/7 badge, but only when offerings.emergency24x7 is also true. */
  emergency: z.boolean().default(false),
  /** Optional "Starting at" price in USD. Only from the client's real price list; never invent. */
  startingAt: z.number().positive().optional(),
  placeholder,
});

/** /services problem picker. action "service" links to the service page; "book" opens /book prefilled. */
export const symptomSchema = z.object({
  id: slug,
  label: nonEmpty,
  icon: iconKeySchema,
  service: serviceTypeSchema,
  action: z.enum(["service", "book"]).default("book"),
  /** Prefilled into the booking form message when action is "book". */
  message: nonEmpty,
  placeholder,
});

export const processStepSchema = z.object({ title: nonEmpty, body: nonEmpty, icon: iconKeySchema, placeholder });

export const whyItemSchema = z.object({ title: nonEmpty, body: nonEmpty, icon: iconKeySchema, placeholder });

export const testimonialSchema = z.object({
  /** Optional id so a project can link to this review (project.testimonialId). */
  id: slug.optional(),
  quote: nonEmpty,
  name: nonEmpty,
  location: nonEmpty,
  service: nonEmpty.optional(),
  /** Optional decorative card background (path in /public/brands/<slug>/). Keep the left side plain for text. */
  background: assetPath.optional(),
  /** Star rating from the real review (1 to 5). Stars render only when set. Never invent a rating. */
  rating: z.number().int().min(1).max(5).optional(),
  placeholder,
});

export const faqSchema = z.object({ question: nonEmpty, answer: nonEmpty, placeholder });

/* ------------------------------ Blog ------------------------------ */

export const seasons = ["spring", "summer", "fall", "winter"] as const;
export type Season = (typeof seasons)[number];

export const blogCategorySchema = z.object({ slug, name: nonEmpty, description: z.string().default(""), placeholder });

/** Blog author. Never invent credentials: role and bio describe the team, not certifications. */
export const authorSchema = z.object({
  id: slug,
  name: nonEmpty,
  role: nonEmpty,
  bio: nonEmpty,
  avatar: imageSchema.optional(),
  placeholder,
});

/** Typed post body blocks (no MDX). Heading ids, the table of contents and reading time are derived. */
export const postBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), text: nonEmpty, level: z.union([z.literal(2), z.literal(3)]).default(2) }),
  z.object({ type: z.literal("paragraph"), text: nonEmpty }),
  z.object({ type: z.literal("list"), items: z.array(nonEmpty).min(1), ordered: z.boolean().default(false) }),
  z.object({ type: z.literal("callout"), title: nonEmpty.optional(), text: nonEmpty, tone: z.enum(["info", "warning"]).default("info") }),
  z.object({ type: z.literal("image"), image: imageSchema, caption: z.string().default("") }),
  z.object({ type: z.literal("quote"), text: nonEmpty, cite: nonEmpty.optional() }),
]);

export const postSchema = z.object({
  slug,
  title: nonEmpty,
  excerpt: nonEmpty,
  /** Slug of an entry in content/blog-categories.ts. */
  category: slug,
  tags: z.array(nonEmpty).default([]),
  date: z.iso.date(),
  /** "Last reviewed" date. Defaults to `date` when omitted. */
  updated: z.iso.date().optional(),
  /** id of an entry in content/authors.ts. */
  authorId: slug,
  cover: imageSchema,
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  /** Shown in Seasonal picks during this season. */
  season: z.enum(seasons).optional(),
  /** Related service page (/services/<slug>). */
  serviceSlug: serviceTypeSchema.optional(),
  takeaways: z.array(nonEmpty).default([]),
  body: z.array(postBlockSchema).min(1),
  placeholder,
});

/** Project image: alt text plus an optional visible caption (gallery, before/after). */
export const projectImageSchema = imageSchema.extend({ caption: z.string().default("") });

/**
 * A completed job (/projects and /projects/<slug>). Only publish real jobs with customer permission.
 * results: real, measured outcomes only (hidden when empty). Never invent savings or performance claims.
 */
export const projectSchema = z.object({
  slug,
  title: nonEmpty,
  city: nonEmpty,
  state: usState,
  category: z.enum(projectCategories),
  /** Free text shown as a chip and used by the system filter, e.g. "Heat pump", "Gas furnace". */
  systemType: nonEmpty,
  buildingType: z.enum(serviceAudiences),
  /** Free text, e.g. "2,400 sq ft". */
  buildingSize: nonEmpty.optional(),
  completedYear: z.number().int().min(1950).max(2100),
  /** Free text, e.g. "2 days". */
  duration: nonEmpty.optional(),
  summary: nonEmpty,
  overview: nonEmpty,
  challenge: z.string().default(""),
  solution: z.string().default(""),
  equipment: z.array(z.object({ name: nonEmpty, type: nonEmpty, specs: z.string().default("") })).default([]),
  timeline: z.array(z.object({ title: nonEmpty, description: nonEmpty })).default([]),
  results: z.array(z.object({ label: nonEmpty, value: nonEmpty })).default([]),
  featured: z.boolean().default(false),
  cover: projectImageSchema,
  gallery: z.array(projectImageSchema).default([]),
  before: projectImageSchema.optional(),
  after: projectImageSchema.optional(),
  /** https embed URL (e.g. YouTube or Vimeo embed). Loaded only after the visitor clicks play. */
  videoUrl: url.optional(),
  /** id of a testimonial in content/testimonials.ts. */
  testimonialId: slug.optional(),
  placeholder,
});

export const planSchema = z.object({
  id: slug,
  name: nonEmpty,
  /** Price is optional: show "Call for pricing" when absent. Never invent prices. */
  priceUsd: z.number().nonnegative().optional(),
  interval: z.enum(["month", "year"]).optional(),
  description: nonEmpty,
  features: z.array(nonEmpty).min(1),
  featured: z.boolean().default(false),
  placeholder,
});

/* ------------------------------ Coverage (multi-state) ------------------------------ */

export const climates = ["cooling", "heating", "mixed"] as const;
export type Climate = (typeof climates)[number];

const stateAbbr = usState.refine(isStateAbbr, { error: (i) => `"${String(i.input)}" is not a US state or DC abbreviation` });

/** A covered state. placeholder: true pages render noindex and stay out of the sitemap. */
export const coverageStateSchema = z.object({
  abbr: stateAbbr,
  climate: z.enum(climates),
  /** State-specific intro. Falls back to the climate template. */
  intro: nonEmpty.optional(),
  placeholder,
});

/** A covered city. Never invent ZIP codes: leave zips empty until real data is provided (npm run geo:zips). */
export const coverageCitySchema = z.object({
  name: nonEmpty,
  stateAbbr,
  slug,
  primary: z.boolean().default(false),
  zips: z.array(zip).default([]),
  intro: nonEmpty.optional(),
  localNotes: z.array(nonEmpty).default([]),
  neighborhoods: z.array(nonEmpty).default([]),
  placeholder,
});

export const coverageSchema = z
  .object({
    /** Optional headquarters text for the top bar, e.g. "Headquartered in Columbus, OH". */
    headquarters: nonEmpty.optional(),
    states: z.array(coverageStateSchema).min(1),
    cities: z.array(coverageCitySchema),
  })
  .superRefine((c, ctx) => {
    const states = new Set<string>();
    c.states.forEach((s, i) => {
      if (states.has(s.abbr)) ctx.addIssue({ code: "custom", path: ["states", i, "abbr"], message: `State ${s.abbr} is listed twice in coverage.states` });
      states.add(s.abbr);
    });
    const slugs = new Set<string>();
    c.cities.forEach((city, i) => {
      if (!states.has(city.stateAbbr)) {
        ctx.addIssue({
          code: "custom",
          path: ["cities", i, "stateAbbr"],
          message: `City "${city.name}" uses state ${city.stateAbbr}, which is not in coverage.states. Add the state first.`,
        });
      }
      const key = `${city.stateAbbr}/${city.slug}`;
      if (slugs.has(key)) ctx.addIssue({ code: "custom", path: ["cities", i, "slug"], message: `City slug "${city.slug}" is used twice in ${city.stateAbbr}` });
      slugs.add(key);
    });
  });

/** Generic climate wording only (no local statistics, utilities, rebates or landmarks). {city} and {state} are replaced. */
export const climateProfileSchema = z.object({
  label: nonEmpty,
  /** Service slugs in the order they are emphasized on state and city pages. */
  services: z.array(serviceTypeSchema).min(1),
  headline: nonEmpty,
  promo: nonEmpty,
  intro: nonEmpty,
  faqs: z.array(faqSchema).min(1),
});
export const climateProfilesSchema = z.object({ cooling: climateProfileSchema, heating: climateProfileSchema, mixed: climateProfileSchema });

export const statSchema = z.object({
  value: z.number().nonnegative(),
  suffix: z.string().default(""),
  label: nonEmpty,
  placeholder,
});

const heroCopy = z.object({ eyebrow: nonEmpty, title: nonEmpty, subtitle: nonEmpty });
/** eyebrow may be "" to hide the small label above a heading. */
const sectionCopy = z.object({ eyebrow: z.string().default(""), title: nonEmpty, intro: z.string().default("") });
/** Icon + title (+ optional short line). Used for About page cards and values. */
const aboutItemSchema = z.object({ icon: iconKeySchema, title: nonEmpty, body: z.string().default("") });

/** Marketing copy. Every key has a default in /content/defaults.ts, brands override per section. */
export const copySchema = z.object({
  hero: z.object({ summer: heroCopy, winter: heroCopy, primaryCta: nonEmpty, badge: nonEmpty }),
  brandStrip: z.object({ title: nonEmpty }),
  services: sectionCopy,
  whyChooseUs: sectionCopy,
  expert: sectionCopy.extend({ bullets: z.array(nonEmpty), cta: nonEmpty }),
  stats: sectionCopy,
  testimonials: sectionCopy,
  plans: sectionCopy,
  financing: sectionCopy,
  serviceArea: sectionCopy,
  faq: sectionCopy.extend({ contactTitle: nonEmpty, contactBody: nonEmpty }),
  posts: sectionCopy,
  ctaBand: z.object({ title: nonEmpty, body: nonEmpty, cta: nonEmpty }),
  emergency: z.object({ title: nonEmpty, body: nonEmpty }),
  /** About page. Sections follow the page order; empty item lists fall back as noted. */
  about: z.object({
    title: nonEmpty,
    intro: nonEmpty,
    /** intro = the story paragraph; points = short supporting points with check marks. */
    story: sectionCopy.extend({ points: z.array(nonEmpty).default([]) }),
    /** Empty items: falls back to content.whyChooseUs. */
    why: sectionCopy.extend({ items: z.array(aboutItemSchema).default([]) }),
    /** Hidden when intro and values are both empty. */
    mission: sectionCopy.extend({ values: z.array(aboutItemSchema).default([]) }),
    /** Picks services by slug with optional wording overrides. Empty: first three services. */
    services: sectionCopy.extend({
      items: z
        .array(
          z.object({
            slug: serviceTypeSchema,
            title: nonEmpty.optional(),
            summary: nonEmpty.optional(),
            /** About-page-only photo; defaults to the service's own image. */
            image: imageSchema.optional(),
          }),
        )
        .default([]),
    }),
    testimonials: sectionCopy,
    /** cta links to /book; call is the label of the click-to-call button. */
    cta: z.object({ title: nonEmpty, body: nonEmpty, cta: nonEmpty, call: nonEmpty }),
  }),
  /**
   * /services page. The header reuses copy.services (eyebrow, title, intro); the emergency band reuses
   * copy.emergency and the area checker reuses copy.serviceArea.
   */
  servicesPage: z.object({
    hero: z.object({ primaryCta: nonEmpty, callCta: nonEmpty }),
    filters: z.object({
      categoryLabel: nonEmpty,
      all: nonEmpty,
      cooling: nonEmpty,
      heating: nonEmpty,
      maintenance: nonEmpty,
      audienceLabel: nonEmpty,
      anyAudience: nonEmpty,
      residential: nonEmpty,
      commercial: nonEmpty,
      empty: nonEmpty,
    }),
    cards: z.object({ learnMore: nonEmpty, startingAt: nonEmpty, emergencyBadge: nonEmpty }),
    problemPicker: sectionCopy,
    emergency: z.object({ callCta: nonEmpty }),
    process: sectionCopy,
    plans: z.object({ title: nonEmpty, body: nonEmpty, cta: nonEmpty }),
    financing: z.object({ title: nonEmpty, body: nonEmpty, cta: nonEmpty }),
    reviews: sectionCopy.extend({ googleLabel: nonEmpty }),
    faq: sectionCopy,
    cta: sectionCopy,
  }),
  /**
   * Multi-state coverage UI. Tokens: {cities} and {states} (counts), {city} and {state} (names), {number}.
   * The /service-areas header and checker headings reuse copy.serviceArea.
   */
  serviceAreas: z.object({
    topBar: nonEmpty,
    climates: z.object({ all: nonEmpty, cooling: nonEmpty, heating: nonEmpty, mixed: nonEmpty }),
    filterLabel: nonEmpty,
    searchLabel: nonEmpty,
    searchPlaceholder: nonEmpty,
    empty: nonEmpty,
    viewAll: nonEmpty,
    availableIn: nonEmpty,
    citiesCount: nonEmpty,
    statCities: nonEmpty,
    statStates: nonEmpty,
    checkTitle: nonEmpty,
    section: sectionCopy.extend({ cta: nonEmpty }),
    whereWeWork: sectionCopy,
    state: z.object({
      eyebrow: nonEmpty,
      title: nonEmpty,
      citiesTitle: nonEmpty,
      noCities: nonEmpty,
      servicesTitle: nonEmpty,
      faqTitle: nonEmpty,
      license: nonEmpty,
    }),
    city: z.object({
      eyebrow: nonEmpty,
      title: nonEmpty,
      notesTitle: nonEmpty,
      servicesTitle: nonEmpty,
      neighborhoodsTitle: nonEmpty,
      zipsTitle: nonEmpty,
      faqTitle: nonEmpty,
      nearbyTitle: nonEmpty,
      projectsTitle: nonEmpty,
      formTitle: nonEmpty,
    }),
    placeholderNotice: nonEmpty,
  }),
  /** Blog UI labels. The /blog header uses copy.posts. Tokens: {count}, {category}. */
  blog: z.object({
    searchLabel: nonEmpty,
    searchPlaceholder: nonEmpty,
    searchSubmit: nonEmpty,
    categoriesLabel: nonEmpty,
    all: nonEmpty,
    resultsOne: nonEmpty,
    resultsMany: nonEmpty,
    clear: nonEmpty,
    emptyTitle: nonEmpty,
    emptyBody: nonEmpty,
    emptyCta: nonEmpty,
    loadMore: nonEmpty,
    readArticle: nonEmpty,
    minRead: nonEmpty,
    by: nonEmpty,
    published: nonEmpty,
    lastReviewed: nonEmpty,
    featured: sectionCopy.extend({ badge: nonEmpty }),
    seasonal: sectionCopy.extend({ spring: nonEmpty, summer: nonEmpty, fall: nonEmpty, winter: nonEmpty }),
    grid: sectionCopy,
    categoryPage: z.object({ eyebrow: nonEmpty, title: nonEmpty }),
    popular: nonEmpty,
    categories: nonEmpty,
    techBox: z.object({ title: nonEmpty, body: nonEmpty, book: nonEmpty }),
    checklist: z.object({
      title: nonEmpty,
      body: nonEmpty,
      emailLabel: nonEmpty,
      consent: nonEmpty,
      submit: nonEmpty,
      success: nonEmpty,
    }),
    takeaways: nonEmpty,
    toc: nonEmpty,
    midCta: z.object({ title: nonEmpty, body: nonEmpty }),
    endCta: z.object({ title: nonEmpty, body: nonEmpty }),
    author: nonEmpty,
    tags: nonEmpty,
    share: nonEmpty,
    copyLink: nonEmpty,
    copied: nonEmpty,
    emailLink: nonEmpty,
    prev: nonEmpty,
    next: nonEmpty,
    related: nonEmpty,
    relatedLinks: z.object({ title: nonEmpty, service: nonEmpty, cities: nonEmpty }),
    areaTitle: nonEmpty,
    cta: sectionCopy,
  }),
  /** /projects header (eyebrow, title, intro). */
  projects: sectionCopy,
  /** /projects index and detail page labels. {count} is replaced with a number. */
  projectsPage: z.object({
    hero: z.object({
      primaryCta: nonEmpty,
      callCta: nonEmpty,
      projectsCompleted: nonEmpty,
      homesServed: nonEmpty,
      yearsInBusiness: nonEmpty,
    }),
    categories: z.object({
      all: nonEmpty,
      "ac-installation": nonEmpty,
      heating: nonEmpty,
      repair: nonEmpty,
      maintenance: nonEmpty,
      commercial: nonEmpty,
    }),
    featured: sectionCopy.extend({ badge: nonEmpty }),
    toolbar: z.object({
      categoryLabel: nonEmpty,
      cityLabel: nonEmpty,
      allCities: nonEmpty,
      systemLabel: nonEmpty,
      allSystems: nonEmpty,
      searchLabel: nonEmpty,
      searchPlaceholder: nonEmpty,
      sortLabel: nonEmpty,
      sortNewest: nonEmpty,
      sortOldest: nonEmpty,
      sortFeatured: nonEmpty,
      resultsOne: nonEmpty,
      resultsMany: nonEmpty,
      clear: nonEmpty,
      emptyTitle: nonEmpty,
      emptyBody: nonEmpty,
      emptyCta: nonEmpty,
      loadMore: nonEmpty,
    }),
    grid: sectionCopy,
    card: z.object({ view: nonEmpty, commercialBadge: nonEmpty, completed: nonEmpty }),
    stats: sectionCopy,
    process: sectionCopy,
    testimonials: sectionCopy,
    cities: sectionCopy,
    faq: sectionCopy,
    cta: sectionCopy,
    detail: z.object({
      location: nonEmpty,
      service: nonEmpty,
      system: nonEmpty,
      duration: nonEmpty,
      completed: nonEmpty,
      size: nonEmpty,
      overview: nonEmpty,
      challenge: nonEmpty,
      solution: nonEmpty,
      equipment: nonEmpty,
      timeline: nonEmpty,
      gallery: nonEmpty,
      galleryOpen: nonEmpty,
      galleryClose: nonEmpty,
      galleryPrev: nonEmpty,
      galleryNext: nonEmpty,
      beforeAfter: nonEmpty,
      before: nonEmpty,
      after: nonEmpty,
      beforeAfterControl: nonEmpty,
      video: nonEmpty,
      playVideo: nonEmpty,
      results: nonEmpty,
      testimonial: nonEmpty,
      share: nonEmpty,
      copyLink: nonEmpty,
      copied: nonEmpty,
      emailLink: nonEmpty,
      prev: nonEmpty,
      next: nonEmpty,
      related: nonEmpty,
      quoteTitle: nonEmpty,
      quoteIntro: nonEmpty,
      areaTitle: nonEmpty,
    }),
  }),
  contact: sectionCopy,
  book: sectionCopy,
});
export type Copy = z.infer<typeof copySchema>;

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const colorsSchema = z.object({
    primary: hex,
    primaryDark: hex,
    /** Text color on primary backgrounds. */
    onPrimary: hex,
    accent: hex,
    accentDark: hex,
    /** Text color on accent backgrounds. Must reach 4.5:1 against accent. */
    onAccent: hex,
    surface: hex,
    surfaceAlt: hex,
    surfaceDark: hex,
    text: hex,
    muted: hex,
    border: hex,
  });

export const tokensSchema = z.object({
  /** Validated for WCAG AA contrast on every text/background pair the components use. */
  colors: colorsSchema.superRefine((c, ctx) => {
    for (const [fg, bg] of requiredPairs) {
      const ratio = contrastRatio(c[fg], c[bg]);
      if (ratio < 4.5) {
        ctx.addIssue({
          code: "custom",
          path: [fg],
          message: `Contrast ${fg} on ${bg} is ${ratio.toFixed(2)}:1; WCAG AA needs 4.5:1`,
        });
      }
    }
  }),
  fonts: z.object({ heading: fontKeySchema, body: fontKeySchema }),
  /** Card/panel radius in px. */
  radius: z.number().int().min(0).max(32),
  buttonStyle: z.enum(["rounded", "pill", "square"]),
  shadow: z.enum(["none", "soft", "medium"]),
  /** Max container width in px. */
  containerWidth: z.number().int().min(960).max(1600),
  sectionSpacing: z.enum(["compact", "normal", "relaxed"]),
  /** Scroll-reveal motion. enabled:false disables every reveal and hero entrance animation. */
  motion: z
    .object({
      enabled: z.boolean().default(true),
      durationMs: z.number().int().min(0).max(3000).default(700),
      distancePx: z.number().int().min(0).max(120).default(24),
      staggerMs: z.number().int().min(0).max(1000).default(100),
    })
    .default({ enabled: true, durationMs: 700, distancePx: 24, staggerMs: 100 }),
});
export type Tokens = z.infer<typeof tokensSchema>;

export const brandConfigSchema = z.object({
  slug,
  company: z.object({
    name: nonEmpty,
    legalName: nonEmpty,
    tagline: nonEmpty,
    /** icon: square favicon (PNG ~512 x 512); appleIcon: 180 x 180 on a solid background. */
    logo: z.object({
      light: assetPath.optional(),
      dark: assetPath.optional(),
      icon: assetPath.optional(),
      appleIcon: assetPath.optional(),
    }),
    phone: phoneSchema,
    emergencyPhone: phoneSchema.optional(),
    email: z.email(),
    address: z.object({ street: nonEmpty, city: nonEmpty, state: usState, zip }),
    hours: z.array(z.object({ days: nonEmpty, hours: nonEmpty })).min(1),
    socials: z.array(z.object({ network: z.enum(["facebook", "instagram", "youtube", "linkedin", "x"]), url })),
    /** Default license shown on pages without a state context. Leave undefined unless it applies everywhere it is shown. */
    licenseNumber: nonEmpty.optional(),
    /** Per-state licenses. A license number shows only on pages for that state. Verify every number before publishing. */
    licenses: z.array(z.object({ stateAbbr, number: nonEmpty })).default([]),
    insured: z.boolean(),
    bonded: z.boolean(),
    certifications: z.array(nonEmpty),
    googleRating: z
      .object({ score: z.number().min(1).max(5), count: z.number().int().positive(), url })
      .optional(),
    yearsInBusiness: z.number().int().positive().optional(),
    foundedYear: z.number().int().min(1900).optional(),
    /** /projects hero stats. Real totals only; each is hidden while undefined. */
    projectsCompleted: z.number().int().positive().optional(),
    homesServed: z.number().int().positive().optional(),
    stats: z.array(statSchema),
  }),
  /** States and cities served (multi-state). Drives /service-areas, the area checker and lead form selects. */
  coverage: coverageSchema,
  offerings: z.object({
    financing: z.object({
      enabled: z.boolean(),
      provider: z.string().default(""),
      url: url.optional(),
      description: z.string().default(""),
    }),
    promoBar: z.object({
      enabled: z.boolean(),
      text: z.string().default(""),
      linkLabel: z.string().optional(),
      href: z.string().startsWith("/").optional(),
    }),
    /** Equipment brands serviced. `logo` is optional (path in /public/brands/<slug>/); a text wordmark shows until the file exists. */
    supportedBrands: z.array(z.object({ name: nonEmpty, logo: assetPath.optional() })),
    emergency24x7: z.boolean(),
    rebates: z.object({
      enabled: z.boolean().default(false),
      title: z.string().default(""),
      body: z.string().default(""),
      url: url.optional(),
    }),
  }),
  seo: z.object({
    siteUrl: url,
    defaultTitle: nonEmpty,
    titleTemplate: z.string().includes("%s"),
    description: nonEmpty,
    ogImage: assetPath.optional(),
    locale: z.string().default("en_US"),
  }),
  tokens: tokensSchema,
  /** Legal pages are DRAFT templates. A visible draft notice shows until reviewed is true. */
  legal: z
    .object({
      reviewed: z.boolean().default(false),
      effectiveDate: z.iso.date().optional(),
      /** State whose law governs the Terms, 2-letter code. Defaults to the business address state. */
      governingState: usState.optional(),
    })
    .default({ reviewed: false }),
  images: z.object({
    hero: imageSchema,
    about: imageSchema,
    services: imageSchema,
    expert: imageSchema,
    projects: imageSchema,
    promo: imageSchema,
    /** Optional. When set, the FAQ block shows questions left + this photo right (no call box). */
    faq: imageSchema.optional(),
    /** About page header background (wide, subject on the right; the left side is covered by navy). */
    aboutHero: imageSchema.optional(),
    /** About page "Our story" photo (portrait crop, e.g. technician at an indoor unit). Falls back to `about`. */
    aboutStory: imageSchema.optional(),
    /** Optional smaller photo overlapping the story photo on tablet and desktop. */
    aboutStoryInset: imageSchema.optional(),
    /** About page "Our mission" photo (technician with homeowner). Falls back to `about`. */
    aboutMission: imageSchema.optional(),
    /** About page final CTA background photo (wide, e.g. home exterior). */
    aboutCta: imageSchema.optional(),
  }),
  homepage: z.object({
    heroVariant: z.enum(["summer", "winter"]),
    sections: z
      .array(z.object({ key: sectionKeySchema, enabled: z.boolean() }))
      .min(1)
      .refine((s) => new Set(s.map((x) => x.key)).size === s.length, "Each homepage section key may appear only once"),
  }),
  /** /services page sections: order and visibility. Omitted: every section, in default order. */
  servicesPage: z
    .object({
      sections: z
        .array(z.object({ key: z.enum(servicesSectionKeys), enabled: z.boolean() }))
        .min(1)
        .refine((s) => new Set(s.map((x) => x.key)).size === s.length, "Each services page section key may appear only once"),
    })
    .default({ sections: servicesSectionKeys.map((key) => ({ key, enabled: true })) }),
  /** /blog index sections and an optional season override for Seasonal picks (otherwise from the current month). */
  blogPage: z
    .object({
      sections: z
        .array(z.object({ key: z.enum(blogSectionKeys), enabled: z.boolean() }))
        .min(1)
        .refine((s) => new Set(s.map((x) => x.key)).size === s.length, "Each blog page section key may appear only once"),
      season: z.enum(seasons).optional(),
    })
    .default({ sections: blogSectionKeys.map((key) => ({ key, enabled: true })) }),
  /** Footer text. blurb tokens: {cities}, {states} (coverage counts). Never hardcode a location in shared code. */
  footer: z.object({ blurb: nonEmpty }),
  /** /projects index sections: order and visibility. Omitted: every section, in default order. */
  projectsPage: z
    .object({
      sections: z
        .array(z.object({ key: z.enum(projectsSectionKeys), enabled: z.boolean() }))
        .min(1)
        .refine((s) => new Set(s.map((x) => x.key)).size === s.length, "Each projects page section key may appear only once"),
    })
    .default({ sections: projectsSectionKeys.map((key) => ({ key, enabled: true })) }),
  placeholder,
});

export const brandContentSchema = z.object({
  services: z.array(serviceSchema).min(1),
  whyChooseUs: z.array(whyItemSchema),
  testimonials: z.array(testimonialSchema),
  faqs: z.array(faqSchema),
  posts: z.array(postSchema),
  /** content/blog-categories.ts. Every post.category must match one slug. */
  blogCategories: z.array(blogCategorySchema).default([]),
  /** content/authors.ts. Every post.authorId must match one id. */
  authors: z.array(authorSchema).default([]),
  projects: z.array(projectSchema),
  plans: z.array(planSchema),
  /** Generic climate profiles; the loader fills these from content/climate.ts unless a brand overrides them. */
  climate: climateProfilesSchema,
  /** /services problem picker (content/symptoms.ts). Empty hides the section. */
  symptoms: z.array(symptomSchema).default([]),
  /** /services process steps (content/process.ts), 4 to 5 recommended. Empty hides the section. */
  process: z.array(processStepSchema).default([]),
  /** /projects FAQ (timeline, permits, warranty, financing). Empty hides the section. No FAQPage markup. */
  projectFaqs: z.array(faqSchema).default([]),
  copy: copySchema,
}).superRefine((content, ctx) => {
  const cats = new Set(content.blogCategories.map((c) => c.slug));
  const authors = new Set(content.authors.map((a) => a.id));
  content.posts.forEach((p, i) => {
    if (!cats.has(p.category)) {
      ctx.addIssue({ code: "custom", path: ["posts", i, "category"], message: `Post "${p.slug}" uses category "${p.category}", which is not in content/blog-categories.ts` });
    }
    if (!authors.has(p.authorId)) {
      ctx.addIssue({ code: "custom", path: ["posts", i, "authorId"], message: `Post "${p.slug}" uses author "${p.authorId}", which is not in content/authors.ts` });
    }
  });
});

export const brandSchema = z.object({ config: brandConfigSchema, content: brandContentSchema });

export type BrandConfig = z.infer<typeof brandConfigSchema>;
export type BrandContent = z.infer<typeof brandContentSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type Phone = z.infer<typeof phoneSchema>;
export type ImageAsset = z.infer<typeof imageSchema>;
export type IconKey = z.infer<typeof iconKeySchema>;
export type FontKey = z.infer<typeof fontKeySchema>;
export type Service = z.infer<typeof serviceSchema>;
export type WhyItem = z.infer<typeof whyItemSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostBlock = z.infer<typeof postBlockSchema>;
export type Author = z.infer<typeof authorSchema>;
export type BlogCategory = z.infer<typeof blogCategorySchema>;
export type Project = z.infer<typeof projectSchema>;
export type Plan = z.infer<typeof planSchema>;
export type CoverageState = z.infer<typeof coverageStateSchema>;
export type CoverageCity = z.infer<typeof coverageCitySchema>;
export type ClimateProfile = z.infer<typeof climateProfileSchema>;
export type Stat = z.infer<typeof statSchema>;
export type Symptom = z.infer<typeof symptomSchema>;
export type ProjectImage = z.infer<typeof projectImageSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;

/** Input shapes brands author against (defaults applied by the schema). */
export type BrandConfigInput = z.input<typeof brandConfigSchema>;
export type CopyInput = z.input<typeof copySchema>;
