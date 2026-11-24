import { Check } from "lucide-react";
import type { BrandConfig, Copy, ImageAsset, Phone } from "@/lib/brand/schema";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { TrustList } from "@/components/layout/trust-list";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/ui/section";

type About = Copy["about"];
type Item = About["why"]["items"][number];

/* ------------------------------ Our story ------------------------------ */

export function AboutStory({
  copy,
  image,
  inset,
  company,
}: {
  copy: About["story"];
  image: ImageAsset;
  /** Smaller overlapping photo, shown from sm up. */
  inset?: ImageAsset;
  company: BrandConfig["company"];
}) {
  return (
    <Section tone="light" labelledBy="story-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={`relative ${inset ? "sm:pr-14 sm:pb-14" : ""}`}>
          <BrandImage
            image={image}
            aspect="aspect-[4/3] lg:aspect-[4/5]"
            sizes="(min-width: 1024px) 540px, 100vw"
            className="shadow-brand-md"
            reveal="mask-up"
          />
          {inset ? (
            <div className="absolute right-0 bottom-0 hidden w-[46%] rounded-brand border-[6px] border-surface bg-surface shadow-brand-lg sm:block">
              <BrandImage image={inset} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 250px, 45vw" className="rounded-brand-sm" />
            </div>
          ) : null}
        </div>

        <div>
          <SectionHeading id="story-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
          {copy.points.length > 0 ? (
            <RevealGroup as="ul" variant="fade-up" className="mt-8 grid gap-3">
              {copy.points.map((p) => (
                <li key={p} className="flex items-center gap-4 rounded-brand-sm border border-line bg-surface-alt px-5 py-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-lg font-bold">{p}</span>
                </li>
              ))}
            </RevealGroup>
          ) : null}
          <TrustList company={company} className="mt-8 text-ink" />
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------ Why choose (feature cards) ------------------------------ */

export function AboutWhy({ copy, items }: { copy: About["why"]; items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <Section tone="alt" labelledBy="about-why-title">
      <SectionHeading id="about-why-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} align="center" />
      <RevealGroup
        as="ul"
        variant="fade-up"
        className={`mt-12 grid gap-6 sm:grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      >
        {items.map((it) => (
          // The hover lift sits on an inner element so it never fights the reveal transition on the <li>.
          <li key={it.title} className="flex">
            <div className="group flex w-full flex-col rounded-brand border border-line bg-surface p-7 shadow-brand-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-brand-md motion-reduce:hover:translate-y-0">
              <span className="grid size-14 place-items-center rounded-brand-sm bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                <Icon name={it.icon} className="size-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold">{it.title}</h3>
              {it.body ? <p className="mt-2 leading-relaxed text-muted">{it.body}</p> : null}
            </div>
          </li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ------------------------------ Mission & values ------------------------------ */

export function AboutMission({ copy, image }: { copy: About["mission"]; image: ImageAsset }) {
  if (!copy.intro && copy.values.length === 0) return null;
  return (
    <Section tone="primary" labelledBy="mission-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <SectionHeading id="mission-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} onDark />
          {copy.values.length > 0 ? (
            <RevealGroup as="ul" variant="fade-up" className="mt-10 grid gap-4 sm:grid-cols-3">
              {copy.values.map((v) => (
                <li key={v.title} className="rounded-brand-sm border border-on-primary/15 bg-on-primary/5 p-5">
                  <span className="grid size-11 place-items-center rounded-full bg-accent text-on-accent">
                    <Icon name={v.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                  {v.body ? <p className="mt-1 text-sm leading-relaxed text-on-primary/80">{v.body}</p> : null}
                </li>
              ))}
            </RevealGroup>
          ) : null}
        </div>
        <BrandImage
          image={image}
          aspect="aspect-[4/3]"
          sizes="(min-width: 1024px) 520px, 100vw"
          className="shadow-brand-lg"
          reveal="mask-up"
        />
      </div>
    </Section>
  );
}

/* ------------------------------ Photo CTA ------------------------------ */

export function PhotoCta({
  copy,
  image,
  phone,
}: {
  copy: About["cta"];
  /** Background photo. Without it the band renders on the dark surface color. */
  image?: ImageAsset;
  phone: Phone;
}) {
  return (
    <section aria-labelledby="photo-cta-title" data-tone="light" className="bg-surface section-y">
      <div className="container-site">
        <div className="relative isolate overflow-hidden rounded-brand bg-surface-dark text-on-primary shadow-brand-lg">
          {image ? (
            <div className="absolute inset-0 -z-10">
              <BrandImage image={image} aspect="" rounded={false} className="size-full" sizes="(min-width: 1280px) 1240px, 100vw" />
            </div>
          ) : null}
          {/* Keeps text contrast AA over any photo: solid on the text side, lighter toward the right. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-b from-surface-dark/95 to-surface-dark/80 md:bg-linear-to-r md:from-surface-dark md:via-surface-dark/85 md:to-surface-dark/30"
          />
          <Reveal variant="fade-up" className="max-w-2xl px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <h2 id="photo-cta-title" className="text-3xl leading-tight font-extrabold sm:text-4xl lg:text-[2.75rem]">
              {copy.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-on-primary/85">{copy.body}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/book" variant="accent" size="lg">
                {copy.cta}
              </LinkButton>
              <CallButton
                phone={phone}
                variant="ghost"
                size="lg"
                label={
                  <span>
                    {copy.call}
                    <span className="sr-only"> {phone.display}</span>
                  </span>
                }
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
