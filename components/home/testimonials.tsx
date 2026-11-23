import Image from "next/image";
import { Quote } from "lucide-react";
import { assetExists } from "@/components/ui/brand-image";
import type { Copy, Testimonial } from "@/lib/brand/schema";
import { Section, SectionHeading } from "@/components/ui/section";
import { SliderControls } from "./slider-controls";

export function TestimonialSlider({ items, copy }: { items: Testimonial[]; copy: Copy["testimonials"] }) {
  if (items.length === 0) return null;
  const trackId = "testimonial-track";
  return (
    <Section tone="alt" labelledBy="reviews-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading id="reviews-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
        {items.length > 1 ? <SliderControls trackId={trackId} label="reviews" /> : null}
      </div>
      <ul
        id={trackId}
        tabIndex={0}
        aria-label="Customer reviews, scroll horizontally"
        className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 sm:mx-0 sm:px-0"
      >
        {items.map((t, i) => {
          const bg = assetExists(t.background) ? t.background : undefined;
          return (
          <li
            key={`${t.name}-${i}`}
            className={`relative flex w-[88%] shrink-0 snap-start flex-col overflow-hidden rounded-brand border border-line bg-surface p-7 shadow-brand-sm sm:w-[calc(50%-0.75rem)] ${
              bg ? "min-h-[22rem] sm:p-9" : "lg:w-[calc(33.333%-1rem)]"
            }`}
          >
            {bg ? (
              <>
                {/* Decorative scene; text sits on the plain left side of the photo. */}
                <Image src={bg} alt="" fill sizes="(min-width: 640px) 50vw, 88vw" className="object-cover object-right" />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,var(--brand-surface)_0%,color-mix(in_srgb,var(--brand-surface)_88%,transparent)_45%,transparent_80%)]" />
              </>
            ) : null}
            <figure className={`relative flex h-full flex-col ${bg ? "max-w-[62%] sm:max-w-[58%]" : ""}`}>
              <div className="flex items-center justify-between">
                <Quote className="size-9 text-accent" aria-hidden="true" />
                {t.placeholder ? (
                  <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">Sample</span>
                ) : null}
              </div>
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed">
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-5">
                <span className="block font-heading font-bold">{t.name}</span>
                <span className="block text-sm text-muted">
                  {t.location}
                  {t.service ? ` · ${t.service}` : ""}
                </span>
              </figcaption>
            </figure>
          </li>
          );
        })}
      </ul>
    </Section>
  );
}
