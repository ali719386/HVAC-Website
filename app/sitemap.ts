import type { MetadataRoute } from "next";
import { absoluteUrl, getBrand } from "@/lib/brand";
import { getCoverage } from "@/lib/geo/coverage";

/** Lists only routes that exist for the active brand (and are indexable). */
export default function sitemap(): MetadataRoute.Sitemap {
  const { config, content } = getBrand();
  const entry = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    priority,
    ...(lastModified ? { lastModified } : {}),
  });

  const pages: (string | false)[] = [
    "/about",
    "/services",
    "/book",
    "/contact",
    "/service-areas",
    content.plans.length > 0 && "/plans",
    config.offerings.financing.enabled && "/financing",
    content.projects.length > 0 && "/projects",
    content.posts.length > 0 && "/blog",
  ];

  return [
    entry("/", 1),
    ...pages.filter((p): p is string => p !== false).map((p) => entry(p, 0.7)),
    ...content.services.map((s) => entry(`/services/${s.slug}`, 0.9)),
    // Placeholder state and city pages are noindex, so they stay out of the sitemap.
    ...getCoverage().states.filter((s) => !s.placeholder).map((s) => entry(s.href, 0.8)),
    ...getCoverage().cities.filter((c) => !c.placeholder).map((c) => entry(c.href, 0.8)),
    // Placeholder posts are noindex, so they (and categories with only placeholder posts) stay out.
    ...content.posts.filter((p) => !p.placeholder).map((p) => entry(`/blog/${p.slug}`, 0.5, p.updated ?? p.date)),
    ...content.blogCategories
      .filter((c) => !c.placeholder && content.posts.some((p) => p.category === c.slug && !p.placeholder))
      .map((c) => entry(`/blog/category/${c.slug}`, 0.4)),
    ...content.projects.map((p) => entry(`/projects/${p.slug}`, 0.5)),
    ...["/privacy", "/terms", "/sms-consent"].map((p) => entry(p, 0.2)),
  ];
}
