import { absoluteUrl, getBrand } from "@/lib/brand";
import { byNewest, postHref } from "@/lib/blog";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();

/** RSS 2.0 of published (non-placeholder) posts. A valid, empty channel when none are published yet. */
export function GET() {
  const { config, content } = getBrand();
  const posts = content.posts.filter((p) => !p.placeholder).sort(byNewest);
  const items = posts
    .map((p) => {
      const url = absoluteUrl(postHref(p.slug));
      const category = content.blogCategories.find((c) => c.slug === p.category)?.name;
      return [
        "<item>",
        `<title>${esc(p.title)}</title>`,
        `<link>${esc(url)}</link>`,
        `<guid isPermaLink="true">${esc(url)}</guid>`,
        `<description>${esc(p.excerpt)}</description>`,
        `<pubDate>${rfc822(p.date)}</pubDate>`,
        category ? `<category>${esc(category)}</category>` : "",
        "</item>",
      ].join("");
    })
    .join("");
  const latest = posts[0];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>${esc(`${config.company.name} ${content.copy.posts.title}`)}</title>` +
    `<link>${esc(absoluteUrl("/blog"))}</link>` +
    `<atom:link href="${esc(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>` +
    `<description>${esc(content.copy.posts.intro || config.seo.description)}</description>` +
    `<language>en-us</language>` +
    (latest ? `<lastBuildDate>${rfc822(latest.updated ?? latest.date)}</lastBuildDate>` : "") +
    items +
    `</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
