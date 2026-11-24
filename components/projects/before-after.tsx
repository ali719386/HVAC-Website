"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import type { GalleryImage } from "./gallery";

/**
 * Comparison slider. The control is a native range input over the image, so arrow keys, Home/End and
 * touch work out of the box; the handle shows a visible focus ring. Only render when both files exist.
 */
export function BeforeAfter({
  before,
  after,
  labels,
}: {
  before: GalleryImage;
  after: GalleryImage;
  labels: { before: string; after: string; control: string };
}) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure>
      <div className="relative aspect-[16/10] overflow-hidden rounded-brand bg-surface-alt select-none">
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-surface-dark/80 px-3 py-1 text-xs font-bold text-on-primary">{labels.before}</span>
        <span className="absolute top-3 right-3 rounded-full bg-surface-dark/80 px-3 py-1 text-xs font-bold text-on-primary">{labels.after}</span>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={labels.control}
          aria-valuetext={`${labels.before} ${pos}%, ${labels.after} ${100 - pos}%`}
          className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-surface peer-focus-visible:*:ring-4" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-1/2 place-items-center rounded-full bg-surface text-primary shadow-brand-md ring-accent">
            <MoveHorizontal className="size-5" />
          </span>
        </div>
      </div>
      {before.caption || after.caption ? (
        <figcaption className="mt-3 text-sm text-muted">
          {[before.caption, after.caption].filter(Boolean).join(" / ")}
        </figcaption>
      ) : null}
    </figure>
  );
}
