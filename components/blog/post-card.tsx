import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Author, BlogCategory, Copy, Post } from "@/lib/brand/schema";
import { categoryHref, postHref, readingMinutes } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { BrandImage } from "@/components/ui/brand-image";

type Labels = Pick<Copy["blog"], "readArticle" | "minRead" | "by">;

/** Initials avatar used until an author photo exists (no layout shift either way). */
export function AuthorAvatar({ author, size = "size-9" }: { author?: Author; size?: string }) {
  const initials = (author?.name ?? "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (author?.avatar) {
    return <BrandImage image={author.avatar} sizes="48px" aspect="aspect-square" className={`${size} shrink-0 rounded-full`} rounded={false} />;
  }
  return (
    <span aria-hidden="true" className={`grid ${size} shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary`}>
      {initials}
    </span>
  );
}

/** Blog grid card: 3:2 image, category, date, read time, clamped title and excerpt, author. */
export function PostCard({
  post: p,
  category,
  author,
  labels,
  headingLevel = "h3",
}: {
  post: Post;
  category?: BlogCategory;
  author?: Author;
  labels: Labels;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-brand border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-brand-md motion-reduce:hover:translate-y-0">
      <BrandImage
        image={p.cover}
        rounded={false}
        aspect="aspect-[3/2]"
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
      />
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          {category ? (
            // Above the stretched title link so the chip stays its own link.
            <Link href={categoryHref(category.slug)} className="relative z-10 rounded-full bg-primary/8 px-3 py-1 font-semibold text-primary hover:bg-primary/15">
              {category.name}
            </Link>
          ) : null}
          <time dateTime={p.date}>{formatDate(p.date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {labels.minRead.replace("{count}", String(readingMinutes(p)))}
          </span>
        </p>
        <H className="mt-4 line-clamp-2 text-xl leading-snug font-bold transition-colors group-hover:text-primary">
          <Link href={postHref(p.slug)} className="after:absolute after:inset-0 after:content-['']">
            {p.title}
          </Link>
        </H>
        <p className="mt-2 line-clamp-3 text-base leading-relaxed text-muted">{p.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          {author ? (
            <span className="flex min-w-0 items-center gap-2.5 text-sm">
              <AuthorAvatar author={author} />
              <span className="truncate">
                <span className="sr-only">{labels.by} </span>
                {author.name}
              </span>
            </span>
          ) : (
            <span />
          )}
          <span aria-hidden="true" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-accent-dark">
            {labels.readArticle} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
