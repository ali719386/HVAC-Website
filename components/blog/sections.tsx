import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { Brand, Post, Season } from "@/lib/brand/schema";
import { byNewest, categoryCounts, categoryHref, postHref, readingMinutes } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { ChecklistSignup } from "./checklist-signup";
import { BlogExplorer } from "./explorer";
import { AuthorAvatar, PostCard } from "./post-card";

/** Looks up a post's category and author (both validated to exist by the schema). */
export function postRefs(brand: Brand, p: Post) {
  return {
    category: brand.content.blogCategories.find((c) => c.slug === p.category),
    author: brand.content.authors.find((a) => a.id === p.authorId),
  };
}

export function cardFor(brand: Brand, p: Post, headingLevel: "h2" | "h3" = "h3") {
  return <PostCard key={p.slug} post={p} {...postRefs(brand, p)} labels={brand.content.copy.blog} headingLevel={headingLevel} />;
}

/* ------------------------------ Featured ------------------------------ */

export function FeaturedPost({ brand, post: p }: { brand: Brand; post: Post }) {
  const b = brand.content.copy.blog;
  const { category, author } = postRefs(brand, p);
  return (
    <Section tone="light" labelledBy="featured-post-title">
      <Reveal variant="fade-up">
        <SectionHeading id="featured-post-title" eyebrow={b.featured.eyebrow} title={b.featured.title} intro={b.featured.intro} />
      </Reveal>
      <Reveal variant="fade-up" className="mt-10">
        <article className="group relative grid overflow-hidden rounded-brand border border-line bg-surface transition-shadow duration-300 hover:shadow-brand-md lg:grid-cols-[1.15fr_1fr]">
          <BrandImage
            image={p.cover}
            rounded={false}
            aspect="aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[24rem]"
            sizes="(min-width: 1024px) 640px, 100vw"
            imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-accent px-3 py-1 text-on-accent">{b.featured.badge}</span>
              {category ? <span className="rounded-full bg-primary/8 px-3 py-1 text-primary">{category.name}</span> : null}
            </p>
            <h3 className="mt-5 text-2xl leading-tight font-extrabold transition-colors group-hover:text-primary sm:text-3xl">
              <Link href={postHref(p.slug)} className="after:absolute after:inset-0 after:content-['']">
                {p.title}
              </Link>
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-muted">{p.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              {author ? (
                <span className="flex items-center gap-2 font-semibold text-ink">
                  <AuthorAvatar author={author} size="size-8" />
                  {author.name}
                </span>
              ) : null}
              <time dateTime={p.date}>{formatDate(p.date)}</time>
              <span>{b.minRead.replace("{count}", String(readingMinutes(p)))}</span>
            </p>
            <span aria-hidden="true" className="mt-7 inline-flex items-center gap-1.5 font-bold text-accent-dark">
              {b.readArticle} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}

/* ------------------------------ Seasonal picks ------------------------------ */

export function SeasonalPicks({ brand, season, posts }: { brand: Brand; season: Season; posts: Post[] }) {
  const b = brand.content.copy.blog;
  const picks = posts.filter((p) => p.season === season).sort(byNewest).slice(0, 3);
  if (picks.length === 0) return null;
  return (
    <Section tone="alt" labelledBy="seasonal-title">
      <Reveal variant="fade-up">
        <SectionHeading id="seasonal-title" eyebrow={`${b.seasonal.eyebrow} · ${b.seasonal[season]}`} title={b.seasonal.title} intro={b.seasonal.intro} />
      </Reveal>
      <RevealGroup as="ul" variant="fade-up" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p) => (
          <li key={p.slug}>{cardFor(brand, p)}</li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ------------------------------ Sidebar blocks ------------------------------ */

const box = "rounded-brand border border-line bg-surface p-6";

export function PopularPosts({ brand, exclude }: { brand: Brand; exclude?: string }) {
  const b = brand.content.copy.blog;
  const popular = brand.content.posts.filter((p) => p.popular && p.slug !== exclude).sort(byNewest).slice(0, 5);
  if (popular.length === 0) return null;
  return (
    <nav aria-label={b.popular} className={box}>
      <p className="font-heading text-lg font-bold">{b.popular}</p>
      <ol className="mt-4 grid gap-4">
        {popular.map((p, i) => (
          <li key={p.slug} className="flex gap-3">
            <span aria-hidden="true" className="font-heading text-2xl leading-none font-extrabold text-primary/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Link href={postHref(p.slug)} className="leading-snug font-semibold hover:text-primary">
              {p.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CategoryList({ brand, active }: { brand: Brand; active?: string }) {
  const b = brand.content.copy.blog;
  const cats = categoryCounts(brand.content.posts, brand.content.blogCategories).filter((c) => c.count > 0);
  if (cats.length === 0) return null;
  return (
    <nav aria-label={b.categories} className={box}>
      <p className="font-heading text-lg font-bold">{b.categories}</p>
      <ul className="mt-3 grid gap-1">
        {cats.map((c) => (
          <li key={c.slug}>
            <Link
              href={categoryHref(c.slug)}
              aria-current={active === c.slug ? "page" : undefined}
              className="flex items-center justify-between rounded-brand-sm px-3 py-2 font-medium hover:bg-surface-alt hover:text-primary aria-[current=page]:bg-primary/8 aria-[current=page]:text-primary"
            >
              {c.name}
              <span className="text-sm text-muted">{c.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function TechBox({ brand }: { brand: Brand }) {
  const b = brand.content.copy.blog;
  const { phone } = brand.config.company;
  return (
    <div className="rounded-brand bg-primary p-6 text-on-primary">
      <Phone className="size-6 text-accent" aria-hidden="true" />
      <p className="mt-3 font-heading text-lg font-bold">{b.techBox.title}</p>
      <p className="mt-1 text-on-primary/85">{b.techBox.body}</p>
      <CallButton phone={phone} variant="accent" className="mt-5 w-full" />
      <LinkButton href="/book" variant="ghost" className="mt-3 w-full">
        {b.techBox.book}
      </LinkButton>
    </div>
  );
}

/** Grid filler card: photo grows to the row height set by the neighbouring post cards. */
function GridPromo({ brand }: { brand: Brand }) {
  const p = brand.content.copy.blog.gridPromo;
  const { images, company } = brand.config;
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-brand border border-line bg-surface">
      <BrandImage image={images.blogPromo ?? images.expert} rounded={false} aspect="" className="min-h-44 flex-1" sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw" />
      <div className="p-6">
        <p className="text-xs font-bold tracking-wide text-accent-dark uppercase">{p.eyebrow}</p>
        <p className="mt-2 font-heading text-xl leading-snug font-bold">{p.title}</p>
        <p className="mt-2 text-muted">{p.body}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CallButton phone={company.phone} variant="accent" />
          <LinkButton href="/book" variant="outline">
            {p.book}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Grid with toolbar and sidebar ------------------------------ */

/** Toolbar + post grid (client filtering) + sticky sidebar. Used by /blog and category pages. */
export function BlogGrid({ brand, posts, activeCategory, heading }: { brand: Brand; posts: Post[]; activeCategory?: string; heading?: boolean }) {
  const b = brand.content.copy.blog;
  const sorted = [...posts].sort(byNewest);
  const chips = categoryCounts(brand.content.posts, brand.content.blogCategories)
    .filter((c) => c.count > 0)
    .map((c) => ({ slug: c.slug, name: c.name, count: c.count, href: categoryHref(c.slug) }));
  const meta = sorted.map((p) => ({
    slug: p.slug,
    haystack: [p.title, p.excerpt, ...p.tags, postRefs(brand, p).category?.name ?? ""].join(" ").toLowerCase(),
  }));
  const cards = Object.fromEntries(sorted.map((p) => [p.slug, cardFor(brand, p)]));
  return (
    <Section id="articles" tone="light" labelledBy="blog-grid-title" className="scroll-mt-16">
      {heading === false ? (
        <h2 id="blog-grid-title" className="sr-only">
          {b.grid.title}
        </h2>
      ) : (
        <Reveal variant="fade-up" className="mb-8">
          <SectionHeading id="blog-grid-title" eyebrow={b.grid.eyebrow} title={b.grid.title} intro={b.grid.intro} />
        </Reveal>
      )}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <BlogExplorer
          items={meta}
          cards={cards}
          chips={chips}
          allHref="/blog"
          allCount={brand.content.posts.length}
          activeCategory={activeCategory}
          labels={b}
          promo={<GridPromo brand={brand} />}
        />
        <aside className="grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <PopularPosts brand={brand} />
          <CategoryList brand={brand} active={activeCategory} />
          <TechBox brand={brand} />
          <ChecklistSignup copy={b.checklist} />
        </aside>
      </div>
    </Section>
  );
}
