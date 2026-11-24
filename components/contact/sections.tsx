import Link from "next/link";
import { ArrowRight, CalendarCheck, Mail, Phone, ShieldAlert, Siren, type LucideIcon } from "lucide-react";
import type { BrandConfig, Copy } from "@/lib/brand/schema";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

type Cp = Copy["contactPage"];

/** Call, 24/7 emergency (only when offered), email and book online. Each card is one link. */
export function QuickContactCards({ config, copy }: { config: BrandConfig; copy: Cp["quick"] }) {
  const { company, offerings } = config;
  const emergency = offerings.emergency24x7 ? (company.emergencyPhone ?? company.phone) : undefined;
  const cards: { href: string; icon: LucideIcon; title: string; body: string; value: string; accent?: boolean; external?: boolean }[] = [
    { href: `tel:${company.phone.tel}`, icon: Phone, ...copy.call, value: company.phone.display, external: true },
    ...(emergency ? [{ href: `tel:${emergency.tel}`, icon: Siren, ...copy.emergency, value: emergency.display, accent: true, external: true }] : []),
    { href: `mailto:${company.email}`, icon: Mail, ...copy.email, value: company.email, external: true },
    { href: "/book", icon: CalendarCheck, ...copy.book, value: "" },
  ];
  return (
    <Section tone="light" className="py-10! lg:py-12!">
      <RevealGroup as="ul" variant="fade-up" className={`grid gap-4 sm:grid-cols-2 ${cards.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {cards.map(({ href, icon: I, title, body, value, accent, external }) => {
          const inner = (
            <>
              <span className={`grid size-12 shrink-0 place-items-center rounded-brand-sm ${accent ? "bg-accent text-on-accent" : "bg-primary/8 text-primary"}`}>
                <I className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 font-heading text-lg font-bold group-hover:text-primary">
                  {title}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
                <span className="mt-0.5 block text-sm text-muted">{body}</span>
                {value ? <span className="mt-2 block font-semibold break-all text-ink">{value}</span> : null}
              </span>
            </>
          );
          const cls =
            "group flex h-full items-start gap-4 rounded-brand border border-line bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-brand-md motion-reduce:hover:translate-y-0";
          return (
            <li key={title} className="flex">
              {external ? (
                <a href={href} className={`${cls} w-full`}>
                  {inner}
                </a>
              ) : (
                <Link href={href} className={`${cls} w-full`}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

/** Safety notice from config (gas smell or carbon monoxide). Always shown when the section is enabled. */
export function SafetyStrip({ title, text }: { title: string; text: string }) {
  return (
    <aside aria-label={title} className="border-y border-accent/30 bg-accent/8">
      <div className="container-site flex items-start gap-4 py-6">
        <ShieldAlert className="mt-0.5 size-7 shrink-0 text-accent-dark" aria-hidden="true" />
        <p className="leading-relaxed">
          <span className="font-heading font-bold">{title}: </span>
          {text}
        </p>
      </div>
    </aside>
  );
}

/** Three steps after a request. A response time appears only when configured. */
export function NextSteps({ copy, responseTimeText }: { copy: Cp["steps"]; responseTimeText?: string }) {
  return (
    <Section tone="alt" labelledBy="next-steps-title">
      <Reveal variant="fade-up">
        <SectionHeading id="next-steps-title" eyebrow={copy.eyebrow} title={copy.title} intro={responseTimeText ?? copy.intro} align="center" />
      </Reveal>
      <RevealGroup as="ol" variant="fade-up" className="mt-12 grid gap-6 md:grid-cols-3">
        {copy.items.map((s, i) => (
          <li key={s.title} className="rounded-brand border border-line bg-surface p-6">
            <span className="grid size-11 place-items-center rounded-full bg-primary font-heading font-extrabold text-on-primary">{i + 1}</span>
            <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
            <p className="mt-1.5 leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </RevealGroup>
    </Section>
  );
}
