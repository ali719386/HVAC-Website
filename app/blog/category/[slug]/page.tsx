import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { categoryHref } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo/meta";
import { BlogGrid } from "@/components/blog/sections";
import { PlaceholderNotice } from "@/components/geo/sections";
import { LeadCtaBand } from "@/components/services/sections";
import { PageHero } from "@/components/ui/page-header";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

/** Only categories that have posts get a page. */
export function generateStaticParams() {
  const { content } = getBrand();
  return content.blogCategories.filter((c) => content.posts.some((p) => p.category === c.slug)).map((c) => ({ slug: c.slug }));
}

function load(slug: string) {
  const brand = getBrand();
  const category = brand.content.blogCategories.find((c) => c.slug === slug);
  if (!category) return undefined;
  const posts = brand.content.posts.filter((p) => p.category === slug);
  // Indexable only when the category is final and at least one of its posts is.
  const placeholder = Boolean(category.placeholder) || posts.every((p) => p.placeholder);
  return { brand, category, posts, placeholder };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = load((await params).slug);
  if (!d) return {};
  const title = d.brand.content.copy.blog.categoryPage.title.replace("{category}", d.category.name);
  return pageMetadata({
    title,
    description: d.category.description || `${d.category.name} articles from ${d.brand.config.company.name}.`,
    path: categoryHref(d.category.slug),
    noindex: d.placeholder,
  });
}

export default async function CategoryPage({ params }: Props) {
  const d = load((await params).slug);
  if (!d || d.posts.length === 0) notFound();
  const { brand, category, posts, placeholder } = d;
  const b = brand.content.copy.blog;
  return (
    <>
      <PlaceholderNotice show={placeholder} text={brand.content.copy.serviceAreas.placeholderNotice} />
      <PageHero
        compact
        eyebrow={b.categoryPage.eyebrow}
        title={b.categoryPage.title.replace("{category}", category.name)}
        intro={category.description || undefined}
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name: category.name, href: categoryHref(category.slug) },
        ]}
      />
      <BlogGrid brand={brand} posts={posts} activeCategory={category.slug} heading={false} />
      <LeadCtaBand config={brand.config} copy={b.cta} before="light" />
    </>
  );
}
