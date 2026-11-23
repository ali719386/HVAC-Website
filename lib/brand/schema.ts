import { z } from "zod";
import { serviceTypes } from "@/lib/lead/constants";
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
  "rebates",
  "faq",
  "posts",
  "ctaBand",
] as const;
export const sectionKeySchema = z.enum(sectionKeys);
export type SectionKey = z.infer<typeof sectionKeySchema>;

export const serviceTypeSchema = z.enum(serviceTypes);
export type ServiceType = z.infer<typeof serviceTypeSchema>;

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
  placeholder,
});

export const whyItemSchema = z.object({ title: nonEmpty, body: nonEmpty, icon: iconKeySchema, placeholder });

export const testimonialSchema = z.object({
  quote: nonEmpty,
  name: nonEmpty,
  location: nonEmpty,
  service: nonEmpty.optional(),
  /** Optional decorative card background (path in /public/brands/<slug>/). Keep the left side plain for text. */
  background: assetPath.optional(),
  placeholder,
});

export const faqSchema = z.object({ question: nonEmpty, answer: nonEmpty, placeholder });

export const postSchema = z.object({
  slug,
  title: nonEmpty,
  excerpt: nonEmpty,
  date: z.iso.date(),
  author: nonEmpty,
  category: nonEmpty,
  readMinutes: z.number().int().positive(),
  image: imageSchema,
  body: z.array(z.object({ heading: nonEmpty.optional(), paragraphs: z.array(nonEmpty).min(1) })).min(1),
  placeholder,
});

export const projectSchema = z.object({
  slug,
  title: nonEmpty,
  location: nonEmpty,
  service: serviceTypeSchema,
  summary: nonEmpty,
  image: imageSchema,
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

export const citySchema = z.object({
  slug,
  city: nonEmpty,
  state: usState,
  zips: z.array(zip).min(1),
  /** City pages are generated ONLY when intro and localNotes are both present (no thin pages). */
  page: z
    .object({
      intro: nonEmpty,
      localNotes: z.array(nonEmpty).min(1),
      neighborhoods: z.array(nonEmpty).default([]),
    })
    .optional(),
  placeholder,
});

export const statSchema = z.object({
  value: z.number().nonnegative(),
  suffix: z.string().default(""),
  label: nonEmpty,
  placeholder,
});

const heroCopy = z.object({ eyebrow: nonEmpty, title: nonEmpty, subtitle: nonEmpty });
/** eyebrow may be "" to hide the small label above a heading. */
const sectionCopy = z.object({ eyebrow: z.string().default(""), title: nonEmpty, intro: z.string().default("") });

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
  about: z.object({ title: nonEmpty, intro: nonEmpty, body: z.array(nonEmpty).min(1), values: z.array(whyItemSchema) }),
  projects: sectionCopy,
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
    logo: z.object({ light: assetPath.optional(), dark: assetPath.optional() }),
    phone: phoneSchema,
    emergencyPhone: phoneSchema.optional(),
    email: z.email(),
    address: z.object({ street: nonEmpty, city: nonEmpty, state: usState, zip }),
    hours: z.array(z.object({ days: nonEmpty, hours: nonEmpty })).min(1),
    socials: z.array(z.object({ network: z.enum(["facebook", "instagram", "youtube", "linkedin", "x"]), url })),
    licenseNumber: nonEmpty.optional(),
    insured: z.boolean(),
    bonded: z.boolean(),
    certifications: z.array(nonEmpty),
    googleRating: z
      .object({ score: z.number().min(1).max(5), count: z.number().int().positive(), url })
      .optional(),
    yearsInBusiness: z.number().int().positive().optional(),
    foundedYear: z.number().int().min(1900).optional(),
    stats: z.array(statSchema),
  }),
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
  }),
  homepage: z.object({
    heroVariant: z.enum(["summer", "winter"]),
    sections: z
      .array(z.object({ key: sectionKeySchema, enabled: z.boolean() }))
      .min(1)
      .refine((s) => new Set(s.map((x) => x.key)).size === s.length, "Each homepage section key may appear only once"),
  }),
  placeholder,
});

export const brandContentSchema = z.object({
  services: z.array(serviceSchema).min(1),
  whyChooseUs: z.array(whyItemSchema),
  testimonials: z.array(testimonialSchema),
  faqs: z.array(faqSchema),
  posts: z.array(postSchema),
  projects: z.array(projectSchema),
  plans: z.array(planSchema),
  cities: z.array(citySchema).min(1),
  copy: copySchema,
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
export type Project = z.infer<typeof projectSchema>;
export type Plan = z.infer<typeof planSchema>;
export type City = z.infer<typeof citySchema>;
export type Stat = z.infer<typeof statSchema>;

/** Input shapes brands author against (defaults applied by the schema). */
export type BrandConfigInput = z.input<typeof brandConfigSchema>;
export type CopyInput = z.input<typeof copySchema>;
