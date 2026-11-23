import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getBrand } from "@/lib/brand";
import { serviceTypeLabels } from "@/lib/lead/constants";
import { pageMetadata } from "@/lib/seo/meta";
import { BrandImage } from "@/components/ui/brand-image";
import { PageHeader } from "@/components/ui/page-header";
import { CtaBand } from "@/components/home/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: content.copy.projects.title,
    description: `Recent heating and cooling projects completed by ${config.company.name}.`,
    path: "/projects",
  });
}

export default function ProjectsPage() {
  const { config, content } = getBrand();
  if (content.projects.length === 0) notFound();
  const c = content.copy.projects;
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Projects", href: "/projects" }]} />
      <div className="container-site section-y">
        <ul className="grid gap-8 md:grid-cols-2">
          {content.projects.map((p, i) => (
            <li key={p.slug} className={`overflow-hidden rounded-brand border border-line bg-surface shadow-brand-sm ${i === 0 && content.projects.length % 2 === 1 ? "md:col-span-2" : ""}`}>
              <BrandImage
                image={p.image}
                rounded={false}
                aspect={i === 0 && content.projects.length % 2 === 1 ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]"}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="p-6 sm:p-8">
                <p className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-surface-alt px-3 py-1 font-semibold text-primary">{serviceTypeLabels[p.service]}</span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <MapPin className="size-4" aria-hidden="true" />
                    {p.location}
                  </span>
                </p>
                <h2 className="mt-4 text-2xl font-bold">{p.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{p.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <CtaBand config={config} copy={content.copy.ctaBand} />
    </>
  );
}
