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
              className={`flex w-[88%] shrink-0 snap-start overflow-hidden rounded-brand border border-line bg-surface shadow-brand-sm transition-shadow hover:shadow-brand-md sm:w-[calc(50%-0.75rem)] ${
                bg ? "flex-col md:flex-row" : "flex-col lg:w-[calc(33.333%-1rem)]"
              }`}
            >
              {bg ? (
                // Decorative photo panel: top on phones, right side from md up. Cropped toward the subject.
                <div className="relative aspect-[16/9] w-full shrink-0 md:order-last md:aspect-auto md:w-[42%]">
                  <Image src={bg} alt="" fill sizes="(min-width: 768px) 22vw, 88vw" className="object-cover" />
                </div>
              ) : null}
              <figure className="flex flex-1 flex-col p-7 sm:p-8">
                <div className="flex items-center justify-between gap-3">
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
