import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { Copy, Project } from "@/lib/brand/schema";
import { cityLabel } from "@/lib/projects";
import { projectCity } from "@/lib/geo/coverage";
import { BrandImage } from "@/components/ui/brand-image";

type Pp = Copy["projectsPage"];

/** Grid card. Border only at rest; lift, shadow and image zoom on hover. Fixed 4:3 image box (no layout shift). */
export function ProjectCard({ project: p, copy, headingLevel = "h3" }: { project: Project; copy: Pick<Pp, "categories" | "card" | "featured">; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const city = projectCity(p);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-brand border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-brand-md motion-reduce:hover:translate-y-0">
      <div className="relative">
        <BrandImage
          image={p.cover}
          rounded={false}
          aspect="aspect-[4/3]"
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary-dark/85 to-transparent" />
        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-2">
          <span className="rounded-full bg-surface/95 px-3 py-1 text-xs font-bold text-primary">{copy.categories[p.category]}</span>
          <span className="flex flex-wrap gap-1.5">
            {p.featured ? (
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-on-accent">{copy.featured.badge}</span>
            ) : null}
            {p.buildingType === "commercial" ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-on-primary">{copy.card.commercialBadge}</span>
            ) : null}
          </span>
        </div>
        {/* Links to the city page only when the city is configured; sits above the card's stretched link. */}
        {city ? (
          <Link
            href={city.href}
            className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-sm font-semibold text-on-primary underline-offset-4 hover:underline"
          >
            <MapPin className="size-4" aria-hidden="true" />
            {city.label}
          </Link>
        ) : (
          <p className="absolute bottom-4 left-4 flex items-center gap-1.5 text-sm font-semibold text-on-primary">
            <MapPin className="size-4" aria-hidden="true" />
            {cityLabel(p)}
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <H className="text-xl leading-snug font-bold">
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary">
            {p.title}
          </Link>
        </H>
        <p className="mt-2 line-clamp-2 leading-relaxed text-muted">{p.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <span className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-primary/8 px-3 py-1 font-semibold text-primary">{p.systemType}</span>
            <span className="inline-flex items-center gap-1 text-muted">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span className="sr-only">{copy.card.completed} </span>
              {p.completedYear}
            </span>
          </span>
          <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            {copy.card.view} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
