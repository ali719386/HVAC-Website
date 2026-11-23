import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBrand, getPost } from "@/lib/brand";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/meta";
import { BrandImage } from "@/components/ui/brand-image";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand, PostCards } from "@/components/home/sections";

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
    path: `/blog/${post.slug}`,
    image: post.image.src,
    type: "article",
  });
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { config, content } = getBrand();
  const related = content.posts.filter((p) => p.slug !== post.slug);

  return (
    <>
      <PageHeader
        eyebrow={post.category}
        title={post.title}
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      >
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-primary/85">
          <span>By {post.author}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readMinutes} min read</span>
        </p>
      </PageHeader>

      <article className="container-site section-y">
        <div className="mx-auto max-w-3xl">
          <BrandImage image={post.image} sizes="(min-width: 768px) 768px, 100vw" aspect="aspect-[16/9]" />
          <div className="prose-site mt-10 text-lg">
            {post.body.map((block, i) => (
              <section key={block.heading ?? i}>
                {block.heading ? <h2>{block.heading}</h2> : null}
                {block.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ))}
          </div>
          <Link href="/blog" className="mt-10 inline-flex items-center gap-2 font-bold text-primary hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All articles
          </Link>
        </div>
      </article>

      {related.length > 0 ? (
        <Section tone="alt" labelledBy="related-title">
          <h2 id="related-title" className="mb-10 text-3xl font-extrabold">
            More articles
          </h2>
          <PostCards posts={related} limit={3} />
        </Section>
      ) : null}
      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
