import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { getBrand } from "@/lib/brand";
import type { BlogSectionKey } from "@/lib/brand/schema";
import { categoryCounts, categoryHref, currentSeason } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo/meta";
import { BlogGrid, FeaturedPost, SeasonalPicks } from "@/components/blog/sections";
import { LeadCtaBand } from "@/components/services/sections";
import { PageHero } from "@/components/ui/page-header";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  const c = content.copy.posts;
  return pageMetadata({
    title: c.title,
    description: c.intro || `Heating and cooling tips and guides from ${config.company.name}.`,
    path: "/blog",
  });
}

export default function BlogPage() {
  const brand = getBrand();
  const { config, content } = brand;
  const { posts } = content;
  if (posts.length === 0) notFound();
  const c = content.copy.posts;
  const b = content.copy.blog;
  const featured = posts.find((p) => p.featured);
  const season = currentSeason(config.blogPage.season);
  const chips = categoryCounts(posts, content.blogCategories).filter((x) => x.count > 0);

  const render = (key: BlogSectionKey): ReactNode => {
    switch (key) {
      case "featured":
        return featured ? <FeaturedPost brand={brand} post={featured} /> : null;
      case "seasonal":
        return <SeasonalPicks brand={brand} season={season} posts={posts} />;
      case "grid":
        return <BlogGrid brand={brand} posts={posts} />;
      case "cta":
        return <LeadCtaBand config={config} copy={b.cta} before="light" />;
    }
  };

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Blog", href: "/blog" }]} compact>
        {/* Plain GET form: reloads /blog?q=… and jumps to the grid, which reads ?q= and filters (client-side). */}
        <form action="/blog#articles" method="get" role="search" className="flex max-w-xl gap-2">
          <label htmlFor="blog-hero-q" className="sr-only">
            {b.searchLabel}
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="blog-hero-q"
              name="q"
              type="search"
              maxLength={80}
              placeholder={b.searchPlaceholder}
              className="h-12 w-full rounded-btn border border-on-primary/20 bg-surface pr-3 pl-9 text-ink outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button type="submit" className="h-12 shrink-0 rounded-btn bg-accent px-5 font-bold text-on-accent transition-colors hover:bg-accent-dark">
            {b.searchSubmit}
          </button>
        </form>
        {chips.length > 0 ? (
          <nav aria-label={b.categoriesLabel} className="mt-5">
            <ul className="flex flex-wrap gap-2">
              {chips.map((x) => (
                <li key={x.slug}>
                  <Link
                    href={categoryHref(x.slug)}
                    className="inline-flex rounded-full border border-on-primary/25 bg-on-primary/8 px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-on-primary/15"
                  >
                    {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </PageHero>
      {config.blogPage.sections
        .filter((s) => s.enabled)
        .map((s) => (
          <Fragment key={s.key}>{render(s.key)}</Fragment>
        ))}
    </>
  );
}
