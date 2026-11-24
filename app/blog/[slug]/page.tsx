import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Wrench } from "lucide-react";
import { absoluteUrl, getBrand, getPost } from "@/lib/brand";
import { byNewest, categoryHref, postHref, readingMinutes, relatedPosts, tableOfContents } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { clientAreas, getCoverage } from "@/lib/geo/coverage";
import type { Climate } from "@/lib/brand/schema";
import { blogPostingLd, JsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { ArticleBody } from "@/components/blog/article";
import { ChecklistSignup } from "@/components/blog/checklist-signup";
import { AuthorAvatar } from "@/components/blog/post-card";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { cardFor, postRefs, TechBox } from "@/components/blog/sections";
import { TableOfContents } from "@/components/blog/toc";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { PlaceholderNotice } from "@/components/geo/sections";
import { CtaBand } from "@/components/home/sections";
import { RevealGroup } from "@/components/motion/reveal";
import { ShareRow } from "@/components/projects/share";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrand().content.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: postHref(post.slug),
    image: post.cover.src,
    type: "article",
    // Placeholder posts stay out of search until reviewed.
    noindex: Boolean(post.placeholder),
  });
}

/** Climate implied by the post (seasons and categories), used to pick relevant city pages. */
function climateFor(category: string, season?: string): Climate {
  if (category === "heating" || season === "winter" || season === "fall") return "heating";
  if (category === "cooling" || season === "summer" || season === "spring") return "cooling";
  return "mixed";
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const brand = getBrand();
  const { config, content } = brand;
  const b = content.copy.blog;
  const { category, author } = postRefs(brand, post);
  const toc = tableOfContents(post.body);
  const minutes = readingMinutes(post);
  const updated = post.updated ?? post.date;
  const sorted = [...content.posts].sort(byNewest);
  const i = sorted.findIndex((p) => p.slug === post.slug);
  const newer = sorted[i - 1];
  const older = sorted[i + 1];
  const related = relatedPosts(content.posts, post);
  const service = post.serviceSlug ? content.services.find((s) => s.slug === post.serviceSlug) : undefined;
  // Up to 3 city pages in the matching climate (every configured city has a page).
  const climate = climateFor(post.category, post.season);
  const cities = getCoverage().cities.filter((c) => c.climate === climate).sort((a, c) => Number(c.primary) - Number(a.primary)).slice(0, 3);
  const { phone } = config.company;

  const cta = (title: string, body: string) => (
    <div className="flex flex-col gap-5 rounded-brand bg-primary p-6 text-on-primary sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <p className="font-heading text-xl font-bold">{title}</p>
        <p className="mt-1 text-on-primary/85">{body}</p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
        <CallButton phone={phone} variant="accent" />
        <LinkButton href={post.serviceSlug ? `/book?service=${post.serviceSlug}` : "/book"} variant="ghost">
          {b.techBox.book}
        </LinkButton>
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={blogPostingLd(post, author, brand)} />
      <ReadingProgress targetId="post-body" />
      <PlaceholderNotice show={Boolean(post.placeholder)} text={content.copy.serviceAreas.placeholderNotice} />
      <PageHero
        compact
        eyebrow={category?.name}
        title={post.title}
        intro={post.excerpt}
        crumbs={[
          { name: "Blog", href: "/blog" },
          ...(category ? [{ name: category.name, href: categoryHref(category.slug) }] : []),
          { name: post.title, href: postHref(post.slug) },
        ]}
      >
        <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-on-primary/85">
          {author ? (
            <span className="flex items-center gap-2 font-semibold text-on-primary">
              <AuthorAvatar author={author} size="size-8" />
              {b.by} {author.name}
            </span>
          ) : null}
          <span>
            {b.published} <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span>
            {b.lastReviewed} <time dateTime={updated}>{formatDate(updated)}</time>
          </span>
          <span>{b.minRead.replace("{count}", String(minutes))}</span>
        </p>
      </PageHero>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <article id="post-body" className="min-w-0">
          <BrandImage image={post.cover} sizes="(min-width: 1024px) 760px, 100vw" aspect="aspect-[3/2]" preload />

          {post.takeaways.length > 0 ? (
            <section aria-labelledby="takeaways-title" className="mt-10 rounded-brand border border-line bg-surface-alt p-6">
              <h2 id="takeaways-title" className="font-heading text-lg font-bold">
                {b.takeaways}
              </h2>
              <ul className="mt-3 grid gap-2">
                {post.takeaways.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-8 lg:hidden">
            <TableOfContents items={toc} title={b.toc} />
          </div>

          <div className="mt-10">
            <ArticleBody blocks={post.body} afterSecondHeading={cta(b.midCta.title, b.midCta.body)} />
          </div>

          <div className="mt-12">{cta(b.endCta.title, b.endCta.body)}</div>

          {service || cities.length > 0 ? (
            <section aria-labelledby="related-links-title" className="mt-12">
              <h2 id="related-links-title" className="font-heading text-xl font-bold">
                {b.relatedLinks.title}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {service ? (
                  <Link href={`/services/${service.slug}`} className="group flex items-start gap-3 rounded-brand border border-line p-5 transition-colors hover:border-primary">
                    <Wrench className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block text-xs font-bold tracking-wide text-muted uppercase">{b.relatedLinks.service}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 font-heading font-bold group-hover:text-primary">
                        {service.title} <ArrowRight className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                ) : null}
                {cities.length > 0 ? (
                  <div className="flex items-start gap-3 rounded-brand border border-line p-5">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold tracking-wide text-muted uppercase">{b.relatedLinks.cities}</p>
                      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        {cities.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="font-semibold text-primary hover:underline">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {author ? (
            <section aria-labelledby="author-title" className="mt-12 flex gap-4 rounded-brand border border-line p-6">
              <AuthorAvatar author={author} size="size-14" />
              <div>
                <h2 id="author-title" className="text-xs font-bold tracking-wide text-muted uppercase">
                  {b.author}
                </h2>
                <p className="mt-1 font-heading text-lg font-bold">{author.name}</p>
                <p className="text-sm text-muted">{author.role}</p>
                <p className="mt-2 leading-relaxed">{author.bio}</p>
              </div>
            </section>
          ) : null}

          <div className="mt-10 grid gap-6 border-t border-line pt-8">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <p className="mr-2 font-heading font-bold">{b.tags}</p>
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog?q=${encodeURIComponent(t)}`}
                    className="rounded-full bg-primary/8 px-3 py-1 text-sm font-semibold text-primary hover:bg-primary/15"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            ) : null}
            <ShareRow url={absoluteUrl(postHref(post.slug))} title={post.title} labels={{ share: b.share, copy: b.copyLink, copied: b.copied, email: b.emailLink }} />
            {newer || older ? (
              <nav aria-label={`${b.prev} / ${b.next}`} className="flex flex-col gap-4 sm:flex-row">
                {older ? (
                  <Link href={postHref(older.slug)} rel="prev" className="group flex flex-1 flex-col gap-1 rounded-brand border border-line p-5 hover:border-primary">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      {b.prev}
                    </span>
                    <span className="font-heading font-bold">{older.title}</span>
                  </Link>
                ) : (
                  <span className="hidden flex-1 sm:block" />
                )}
                {newer ? (
                  <Link href={postHref(newer.slug)} rel="next" className="group flex flex-1 flex-col gap-1 rounded-brand border border-line p-5 hover:border-primary sm:text-right">
                    <span className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary sm:self-end">
                      {b.next}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-heading font-bold">{newer.title}</span>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </article>

        <aside className="grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="hidden lg:block">
            <TableOfContents items={toc} title={b.toc} />
          </div>
          <TechBox brand={brand} />
          <ChecklistSignup copy={b.checklist} />
          <div>
            <p className="mb-3 font-heading text-lg font-bold">{b.areaTitle}</p>
            <ServiceAreaChecker areas={clientAreas()} phone={phone} />
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <Section tone="alt" labelledBy="related-posts-title">
          <SectionHeading id="related-posts-title" eyebrow={category?.name} title={b.related} />
          <RevealGroup as="ul" variant="fade-up" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>{cardFor(brand, p)}</li>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
