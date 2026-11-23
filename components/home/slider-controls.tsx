"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/** Prev/next buttons for a CSS scroll-snap track. The track stays usable without JS. */
export function SliderControls({ trackId, label }: { trackId: string; label: string }) {
  const scroll = (dir: 1 | -1) => {
    const track = document.getElementById(trackId);
    const first = track?.firstElementChild;
    if (!track || !(first instanceof HTMLElement)) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * (first.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  };
  const btn =
    "grid size-12 place-items-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-on-primary";
  return (
    <div className="flex gap-3">
      <button type="button" className={btn} onClick={() => scroll(-1)} aria-controls={trackId}>
        <ChevronLeft className="size-5" aria-hidden="true" />
        <span className="sr-only">Previous {label}</span>
      </button>
      <button type="button" className={btn} onClick={() => scroll(1)} aria-controls={trackId}>
        <ChevronRight className="size-5" aria-hidden="true" />
        <span className="sr-only">Next {label}</span>
      </button>
    </div>
  );
}
