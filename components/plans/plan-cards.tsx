import { Check } from "lucide-react";
import type { Plan } from "@/lib/brand/schema";
import { formatUsd } from "@/lib/format";
import { LinkButton } from "@/components/ui/button";
import { RevealGroup } from "@/components/motion/reveal";

/** Maintenance plan cards. Price shows only when configured; otherwise "Call for pricing". */
export function PlanCards({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) return null;
  const cols = plans.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2 lg:max-w-4xl";
  return (
    <RevealGroup as="ul" variant="fade-up" className={`grid gap-6 ${cols}`}>
      {plans.map((p) => (
        <li
          key={p.id}
          className={`relative flex flex-col rounded-brand border p-8 ${
            p.featured ? "border-primary bg-primary text-on-primary shadow-brand-lg" : "border-line bg-surface shadow-brand-sm"
          }`}
        >
          {p.featured ? (
            <p className="absolute -top-3.5 left-8 rounded-full bg-accent px-3 py-1 text-xs font-bold tracking-wide text-on-accent uppercase">
              Most popular
            </p>
          ) : null}
          <h3 className="text-2xl font-extrabold">{p.name}</h3>
          <p className={`mt-2 ${p.featured ? "text-on-primary/85" : "text-muted"}`}>{p.description}</p>
          <p className="mt-6 font-heading">
            {p.priceUsd !== undefined ? (
              <>
                <span className="text-4xl font-extrabold">{formatUsd(p.priceUsd)}</span>
                {p.interval ? <span className="ml-1 text-base opacity-80">/ {p.interval}</span> : null}
              </>
            ) : (
              <span className="text-2xl font-bold">Call for pricing</span>
            )}
          </p>
          <ul className="mt-6 grid flex-1 gap-3">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <Check className={`mt-0.5 size-5 shrink-0 ${p.featured ? "text-on-primary" : "text-accent"}`} aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <LinkButton
            href="/book?service=maintenance"
            variant={p.featured ? "accent" : "outline"}
            className="mt-8 w-full"
            aria-label={`Ask about the ${p.name} plan`}
          >
            Ask about this plan
          </LinkButton>
        </li>
      ))}
    </RevealGroup>
  );
}
