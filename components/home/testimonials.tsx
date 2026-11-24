import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { assetExists } from "@/components/ui/brand-image";
import type { BrandConfig, Copy, Testimonial } from "@/lib/brand/schema";
import { formatNumber } from "@/lib/format";
import { Section, SectionHeading } from "@/components/ui/section";
import { SliderControls } from "./slider-controls";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

/** Stars from the review's real rating. Not color alone: the text label carries the value. */
function Stars({ rating, className = "mt-5" }: { rating: number; className?: string }) {
  return (
    <p className={`flex items-center gap-0.5 ${className}`} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`size-5 ${i < rating ? "fill-accent text-accent" : "fill-transparent text-line"}`}
        />
      ))}
    </p>
  );
}

export function TestimonialSlider({
  items,
  copy,
  tone = "alt",
}: {
  items: Testimonial[];
  copy: Copy["testimonials"];
  tone?: "light" | "alt";
}) {
  if (items.length === 0) return null;
  const trackId = "testimonial-track";
  return (
    <Section tone={tone} labelledBy="reviews-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading id="reviews-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
        {items.length > 1 ? <SliderControls trackId={trackId} label="reviews" /> : null}
      </div>
      <Reveal variant="fade-in">
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
              <TestimonialFigure t={t} />
            </li>
          );
        })}
      </ul>
      </Reveal>
    </Section>
  );
}

/** One review: quote, optional real star rating, name and location. "Sample" label on placeholders. */
export function TestimonialFigure({ t }: { t: Testimonial }) {
  return (
    <figure className="flex flex-1 flex-col p-7 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <Quote className="size-9 text-accent" aria-hidden="true" />
        {t.placeholder ? (
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">Sample</span>
        ) : null}
      </div>
      {t.rating ? <Stars rating={t.rating} /> : null}
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
  );
}

/**
 * Static strip: Google rating badge (only when configured) plus up to three reviews.
 * No review or rating structured data is emitted.
 */
export function ReviewsStrip({
  items,
  copy,
  rating,
  tone = "light",
}: {
  items: Testimonial[];
  copy: Copy["servicesPage"]["reviews"];
  rating?: BrandConfig["company"]["googleRating"];
  tone?: "light" | "alt";
}) {
  const shown = items.slice(0, 3);
  if (shown.length === 0 && !rating) return null;
  return (
    <Section tone={tone} labelledBy="reviews-strip-title">
      <Reveal variant="fade-up" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading id="reviews-strip-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
        {rating ? (
          <a
            href={rating.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 self-start rounded-brand border border-line bg-surface px-5 py-3 shadow-brand-sm transition-shadow hover:shadow-brand-md md:self-auto"
          >
            <span className="font-heading text-3xl font-extrabold text-primary">{rating.score.toFixed(1)}</span>
            <span className="leading-tight">
              <Stars rating={Math.round(rating.score)} className="mt-0" />
              <span className="mt-1 block text-sm text-muted">
                {formatNumber(rating.count)} reviews {copy.googleLabel}
              </span>
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </Reveal>
      {shown.length > 0 ? (
        <RevealGroup as="ul" variant="fade-up" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((t, i) => (
            <li key={`${t.name}-${i}`} className="flex">
              <div className="flex w-full rounded-brand border border-line bg-surface shadow-brand-sm transition-shadow hover:shadow-brand-md">
                <TestimonialFigure t={t} />
              </div>
            </li>
          ))}
        </RevealGroup>
      ) : null}
    </Section>
  );
}
