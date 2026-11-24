import type { BlogCategory, Post, PostBlock, Season } from "@/lib/brand/schema";

const WORDS_PER_MINUTE = 200;

const blockText = (b: PostBlock): string => {
  switch (b.type) {
    case "heading":
    case "paragraph":
    case "quote":
      return b.text;
    case "list":
      return b.items.join(" ");
    case "callout":
      return `${b.title ?? ""} ${b.text}`;
    case "image":
      return b.caption;
  }
};

/** Reading time in whole minutes (at least 1), from the body blocks. */
export function readingMinutes(post: Pick<Post, "body" | "takeaways">) {
  const words = [...post.body.map(blockText), ...post.takeaways].join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";

/** Stable, unique ids for every heading block, in order (index in body -> id). */
export function headingIds(body: PostBlock[]): Map<number, string> {
  const ids = new Map<number, string>();
  const used = new Map<string, number>();
  body.forEach((b, i) => {
    if (b.type !== "heading") return;
    const base = slugify(b.text);
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    ids.set(i, n === 0 ? base : `${base}-${n + 1}`);
  });
  return ids;
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function tableOfContents(body: PostBlock[]): TocItem[] {
  const ids = headingIds(body);
  return body.flatMap((b, i) => (b.type === "heading" ? [{ id: ids.get(i) ?? "", text: b.text, level: b.level }] : []));
}

/** Northern-hemisphere meteorological season for a month (0 = January). */
export function seasonForMonth(month: number): Season {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

/** Config override wins; otherwise the current month at build or request time. */
export const currentSeason = (override?: Season) => override ?? seasonForMonth(new Date().getMonth());

export const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date);

export function categoryCounts(posts: Post[], categories: BlogCategory[]) {
  return categories.map((c) => ({ ...c, count: posts.filter((p) => p.category === c.slug).length }));
}

/** Same category first (newest), then newest overall, excluding the post itself. */
export function relatedPosts(all: Post[], post: Post, limit = 3) {
  const others = all.filter((p) => p.slug !== post.slug).sort(byNewest);
  return [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}

export const categoryHref = (slug: string) => `/blog/category/${slug}`;
export const postHref = (slug: string) => `/blog/${slug}`;
