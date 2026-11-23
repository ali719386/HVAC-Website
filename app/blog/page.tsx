import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { PageHeader } from "@/components/ui/page-header";
import { PostCards } from "@/components/home/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: content.copy.posts.title,
    description: `Heating and cooling tips and guides from ${config.company.name}.`,
    path: "/blog",
  });
}

export default function BlogPage() {
  const { content } = getBrand();
  if (content.posts.length === 0) notFound();
  const c = content.copy.posts;
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Blog", href: "/blog" }]} />
      <div className="container-site section-y">
        <h2 className="sr-only">All articles</h2>
        <PostCards posts={content.posts} limit={100} />
      </div>
    </>
  );
}
