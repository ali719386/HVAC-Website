import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, CalendarDays, Clock, Gauge, MapPin, Ruler, Wrench } from "lucide-react";
import type { Copy, Project } from "@/lib/brand/schema";
import { cityLabel } from "@/lib/projects";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

type Detail = Copy["projectsPage"]["detail"];

/** Small section heading inside the project main column (accent line + H2). */
export function DetailHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
      <span aria-hidden="true" className="h-0.5 w-6 bg-accent" />
      {children}
    </h2>
  );
}

/** Facts that exist on the project, nothing else. */
export function FactsBar({ project: p, serviceLabel, labels }: { project: Project; serviceLabel: string; labels: Detail }) {
  const facts = [
    { icon: MapPin, label: labels.location, value: cityLabel(p) },
    { icon: Wrench, label: labels.service, value: serviceLabel },
    { icon: Gauge, label: labels.system, value: p.systemType },
    p.duration ? { icon: Clock, label: labels.duration, value: p.duration } : null,
    { icon: CalendarDays, label: labels.completed, value: String(p.completedYear) },
    p.buildingSize ? { icon: p.buildingType === "commercial" ? Building2 : Ruler, label: labels.size, value: p.buildingSize } : null,
  ].filter((f) => f !== null);
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-brand border border-line bg-line sm:grid-cols-3">
      {facts.map(({ icon: I, label, value }) => (
        <div key={label} className="flex items-start gap-3 bg-surface p-4 sm:p-5">
          <I className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0">
            <dt className="text-xs font-bold tracking-wide text-muted uppercase">{label}</dt>
            <dd className="mt-0.5 font-semibold break-words">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function ChallengeSolution({ project: p, labels }: { project: Project; labels: Detail }) {
  if (!p.challenge && !p.solution) return null;
  return (
    <RevealGroup as="div" variant="fade-up" className="grid gap-5 md:grid-cols-2">
      {p.challenge ? (
        <section aria-labelledby="challenge-title" className="rounded-brand border-t-4 border-accent bg-surface-alt p-6">
          <h2 id="challenge-title" className="text-sm font-bold tracking-[0.12em] text-accent-dark uppercase">
            {labels.challenge}
          </h2>
          <p className="mt-3 text-lg leading-relaxed">{p.challenge}</p>
        </section>
      ) : null}
      {p.solution ? (
        <section aria-labelledby="solution-title" className="rounded-brand border-t-4 border-primary bg-surface-alt p-6">
          <h2 id="solution-title" className="text-sm font-bold tracking-[0.12em] text-primary uppercase">
            {labels.solution}
          </h2>
          <p className="mt-3 text-lg leading-relaxed">{p.solution}</p>
        </section>
      ) : null}
    </RevealGroup>
  );
}

/** Equipment as text only (no manufacturer logos). */
export function EquipmentList({ items, label }: { items: Project["equipment"]; label: string }) {
  if (items.length === 0) return null;
  return (
    <Reveal as="section" variant="fade-up" aria-labelledby="equipment-title">
      <DetailHeading id="equipment-title">{label}</DetailHeading>
      <ul className="mt-6 divide-y divide-line rounded-brand border border-line">
        {items.map((e) => (
          <li key={`${e.name}-${e.type}`} className="grid gap-1 p-5 sm:grid-cols-[1.2fr_1fr_1.2fr] sm:items-center sm:gap-4">
            <span className="font-heading font-bold">{e.name}</span>
            <span>
              <span className="rounded-full bg-primary/8 px-3 py-1 text-sm font-semibold text-primary">{e.type}</span>
            </span>
            <span className="text-sm text-muted">{e.specs}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function WorkTimeline({ steps, label }: { steps: Project["timeline"]; label: string }) {
  if (steps.length === 0) return null;
  return (
    <Reveal as="section" variant="fade-up" aria-labelledby="timeline-title">
      <DetailHeading id="timeline-title">{label}</DetailHeading>
      <ol className="mt-6 grid gap-0">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
            {i < steps.length - 1 ? <span aria-hidden="true" className="absolute top-11 bottom-0 left-[1.3rem] w-px bg-line" /> : null}
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-heading font-extrabold text-on-primary">{i + 1}</span>
            <div className="pt-2">
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-1 leading-relaxed text-muted">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/** Real, measured outcomes only. Hidden when the project has none. */
export function ResultsBlock({ results, label }: { results: Project["results"]; label: string }) {
  if (results.length === 0) return null;
  return (
    <Reveal as="section" variant="fade-up" aria-labelledby="results-title">
      <DetailHeading id="results-title">{label}</DetailHeading>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {results.map((r) => (
          <div key={r.label} className="flex flex-col rounded-brand bg-primary p-6 text-on-primary">
            <dt className="order-last mt-1 text-sm text-on-primary/80">{r.label}</dt>
            <dd className="font-heading text-3xl font-extrabold">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export function PrevNext({ prev, next, labels }: { prev?: Project; next?: Project; labels: Detail }) {
  if (!prev && !next) return null;
  const card =
    "group flex flex-1 flex-col gap-1 rounded-brand border border-line p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-brand-md motion-reduce:hover:translate-y-0";
  return (
    <nav aria-label={`${labels.prev} / ${labels.next}`} className="flex flex-col gap-4 sm:flex-row">
      {prev ? (
        <Link href={`/projects/${prev.slug}`} className={card} rel="prev">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            {labels.prev}
          </span>
          <span className="font-heading font-bold">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link href={`/projects/${next.slug}`} className={`${card} sm:text-right`} rel="next">
          <span className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary sm:self-end">
            {labels.next}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <span className="font-heading font-bold">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
