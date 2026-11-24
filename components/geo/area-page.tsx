import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin } from "lucide-react";
import type { Climate, Service } from "@/lib/brand/schema";
import { emphasizedServices, type AreaCity } from "@/lib/geo/coverage";
import { RevealGroup } from "@/components/motion/reveal";
import { Icon } from "@/components/ui/icon";

/** Brand services in the climate's emphasis order. The first card is highlighted. */
export function EmphasizedServices({ services, climate, query = "" }: { services: Service[]; climate: Climate; query?: string }) {
  const ordered = emphasizedServices(services, climate);
  return (
    <RevealGroup as="ul" variant="fade-up" className="grid gap-4 sm:grid-cols-2">
      {ordered.map((s, i) => (
        <li key={s.slug} className="flex">
          <Link
            href={`/services/${s.slug}${query}`}
            className={`group flex w-full items-start gap-4 rounded-brand border p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-brand-md motion-reduce:hover:translate-y-0 ${
              i === 0 ? "border-primary bg-primary/5" : "border-line bg-surface"
            }`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-brand-sm bg-primary text-on-primary">
              <Icon name={s.icon} className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-heading font-bold group-hover:text-primary">
                {s.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{s.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </RevealGroup>
  );
}

/** City links as chips (state lists, nearby cities). */
export function CityLinks({ cities, showState = false }: { cities: AreaCity[]; showState?: boolean }) {
  return (
    <RevealGroup as="ul" variant="fade-up" className="flex flex-wrap gap-2.5">
      {cities.map((c) => (
        <li key={c.href}>
          <Link
            href={c.href}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-semibold transition-colors hover:border-primary hover:bg-primary/8 hover:text-primary"
          >
            <MapPin className="size-4 text-accent" aria-hidden="true" />
            {showState ? c.label : c.name}
          </Link>
        </li>
      ))}
    </RevealGroup>
  );
}

/** Seasonal suggestion from the climate profile (generic wording, no offers or amounts). */
export function PromoNote({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-brand border border-accent/30 bg-accent/8 p-4 font-medium">
      <CalendarCheck className="size-5 shrink-0 text-accent-dark" aria-hidden="true" />
      <span className="flex-1">{text}</span>
      <Link href={href} className="font-bold text-primary underline underline-offset-4">
        {cta}
      </Link>
    </p>
  );
}
