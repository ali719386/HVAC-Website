import type { MetadataRoute } from "next";
import { absoluteUrl, getBrand, getCityPages } from "@/lib/brand";

/** Lists only routes that exist for the active brand. */
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
    ...getCityPages().map((c) => entry(`/service-areas/${c.slug}`, 0.8)),
    ...content.posts.map((p) => entry(`/blog/${p.slug}`, 0.5, p.date)),
    ...["/privacy", "/terms", "/sms-consent"].map((p) => entry(p, 0.2)),
  ];
}
