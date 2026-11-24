import { z } from "zod";
import defaultBrand from "@/brands/default";
import exampleTwo from "@/brands/example-two";
import { defaultClimate } from "@/content/climate";
import { defaultCopy, defaultFaqs, defaultWhyChooseUs } from "@/content/defaults";
import type { BrandInput } from "@/content/types";
import { brandSchema, type Brand, type ImageAsset } from "./schema";

/**
 * Static brand registry. To onboard a client: add /brands/<slug>/ and one line here.
 * This is the ONLY module that selects a brand. Components receive data via props.
 */
const registry = {
  default: defaultBrand,
  "example-two": exampleTwo,
} satisfies Record<string, BrandInput>;

export type BrandSlug = keyof typeof registry;
export const brandSlugs = Object.keys(registry);

function isBrandSlug(value: string): value is BrandSlug {
  return Object.hasOwn(registry, value);
}

function mergeCopy(input: BrandInput): Record<string, unknown> {
  const overrides: Record<string, object | undefined> = { ...input.content.copy };
  return Object.fromEntries(Object.entries(defaultCopy).map(([key, base]) => [key, { ...base, ...overrides[key] }]));
}

function resolveAssets(brand: Brand): Brand {
  // Every brand image lives in ONE folder: public/brands/<slug>/images/
  const base = `/brands/${brand.config.slug}/images/`;
  const img = <T extends ImageAsset>(i: T): T => ({ ...i, src: base + i.src });
  const path = (p: string | undefined) => (p ? base + p : undefined);
  const { config, content } = brand;
  const im = config.images;
  return {
    config: {
      ...config,
      company: {
        ...config.company,
        logo: {
          light: path(config.company.logo.light),
          dark: path(config.company.logo.dark),
          icon: path(config.company.logo.icon),
          appleIcon: path(config.company.logo.appleIcon),
        },
      },
      seo: { ...config.seo, ogImage: path(config.seo.ogImage) },
      offerings: {
        ...config.offerings,
        supportedBrands: config.offerings.supportedBrands.map((b) => ({ ...b, logo: path(b.logo) })),
      },
      images: {
        hero: img(im.hero),
        about: img(im.about),
        services: img(im.services),
        expert: img(im.expert),
        projects: img(im.projects),
        promo: img(im.promo),
        aboutHero: im.aboutHero ? img(im.aboutHero) : undefined,
        aboutStory: im.aboutStory ? img(im.aboutStory) : undefined,
        aboutStoryInset: im.aboutStoryInset ? img(im.aboutStoryInset) : undefined,
        aboutMission: im.aboutMission ? img(im.aboutMission) : undefined,
        aboutCta: im.aboutCta ? img(im.aboutCta) : undefined,
        faq: im.faq ? img(im.faq) : undefined,
      },
    },
    content: {
      ...content,
      copy: {
        ...content.copy,
        about: {
          ...content.copy.about,
          services: {
            ...content.copy.about.services,
            items: content.copy.about.services.items.map((i) => ({ ...i, image: i.image ? img(i.image) : undefined })),
          },
        },
      },
      services: content.services.map((s) => ({ ...s, image: img(s.image) })),
      posts: content.posts.map((p) => ({ ...p, cover: img(p.cover) })),
      authors: content.authors.map((a) => ({ ...a, avatar: a.avatar ? img(a.avatar) : undefined })),
      projects: content.projects.map((p) => ({
        ...p,
        cover: img(p.cover),
        gallery: p.gallery.map(img),
        before: p.before ? img(p.before) : undefined,
        after: p.after ? img(p.after) : undefined,
      })),
      testimonials: content.testimonials.map((t) => ({ ...t, background: path(t.background) })),
    },
  };
}

function loadBrand(): Brand {
  const selected = process.env.NEXT_PUBLIC_BRAND?.trim();
  const available = brandSlugs.join(", ");
  if (!selected) {
    throw new Error(
      `NEXT_PUBLIC_BRAND is not set. Add NEXT_PUBLIC_BRAND=<slug> to .env.local (available: ${available}).`,
    );
  }
  if (!isBrandSlug(selected)) {
    throw new Error(
      `Unknown brand "${selected}" in NEXT_PUBLIC_BRAND. Available: ${available}. ` +
        `Add /brands/${selected}/ and register it in lib/brand/index.ts.`,
    );
  }
  const input = registry[selected];
  const parsed = brandSchema.safeParse({
    config: input.config,
    content: {
      ...input.content,
      whyChooseUs: input.content.whyChooseUs ?? defaultWhyChooseUs,
      faqs: input.content.faqs ?? defaultFaqs,
      climate: input.content.climate ?? defaultClimate,
      copy: mergeCopy(input),
    },
  });
  if (!parsed.success) {
    throw new Error(`Brand "${selected}" failed validation:\n${z.prettifyError(parsed.error)}`);
  }
  if (parsed.data.config.slug !== selected) {
    throw new Error(`Brand folder "${selected}" declares config.slug "${parsed.data.config.slug}". They must match.`);
  }
  return resolveAssets(parsed.data);
}

let cached: Brand | undefined;

/** Returns the validated, asset-resolved brand selected by NEXT_PUBLIC_BRAND. */
export function getBrand(): Brand {
  cached ??= loadBrand();
  return cached;
}

/** Canonical origin without trailing slash. NEXT_PUBLIC_SITE_URL overrides the brand config. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (fromEnv || getBrand().config.seo.siteUrl).replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  return `${getSiteUrl()}${path === "/" ? "" : path}`;
}

export function getService(slug: string) {
  return getBrand().content.services.find((s) => s.slug === slug);
}

export function getProject(slug: string) {
  return getBrand().content.projects.find((p) => p.slug === slug);
}

export function getPost(slug: string) {
  return getBrand().content.posts.find((p) => p.slug === slug);
}

export type { Brand };
