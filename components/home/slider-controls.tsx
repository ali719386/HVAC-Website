"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motionAllowed } from "@/components/motion/observer";

/**
 * Prev/next buttons + optional autoplay for a CSS scroll-snap track. The track stays usable without JS.
 * Autoplay advances one card every `autoplayMs`, loops to the start, and pauses while the pointer is
 * over the cards, during keyboard focus inside the track, in a hidden tab, and briefly after the user
 * scrolls/clicks. It never runs with reduced motion or when the
 * brand disables motion, and a Pause/Play button lets anyone stop it (WCAG 2.2.2).
 */
export function SliderControls({ trackId, label, autoplayMs = 5000 }: { trackId: string; label: string; autoplayMs?: number }) {
  const [playing, setPlaying] = useState(true);
  const paused = useRef(false);
  const lastInteraction = useRef(0);

  const scroll = (dir: 1 | -1, fromUser = true) => {
    const track = document.getElementById(trackId);
    const first = track?.firstElementChild;
    if (!track || !(first instanceof HTMLElement)) return;
    if (fromUser) lastInteraction.current = Date.now();
    const behavior = motionAllowed() ? "smooth" : "auto";
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (dir === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior });
      return;
    }
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: dir * (first.offsetWidth + gap), behavior });
  };

  useEffect(() => {
    if (!playing || autoplayMs <= 0) return;
    const track = document.getElementById(trackId);
    if (!track) return;
    // Pause only while the pointer is over the cards, or keyboard focus is inside the track.
    // (Mouse clicks on the arrow buttons must not pause it.)
    let hovered = false;
    let keyboardFocus = false;
    const sync = () => (paused.current = hovered || keyboardFocus);
    const onEnter = () => {
      hovered = true;
      sync();
    };
    const onLeave = () => {
      hovered = false;
      sync();
    };
    const onFocusIn = (e: FocusEvent) => {
      keyboardFocus = e.target instanceof Element && e.target.matches(":focus-visible");
      sync();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!(e.relatedTarget instanceof Node) || !track.contains(e.relatedTarget)) keyboardFocus = false;
      sync();
    };
    const touched = () => (lastInteraction.current = Date.now());
    track.addEventListener("pointerenter", onEnter);
    track.addEventListener("pointerleave", onLeave);
    track.addEventListener("focusin", onFocusIn);
    track.addEventListener("focusout", onFocusOut);
    track.addEventListener("pointerdown", touched);
    track.addEventListener("wheel", touched, { passive: true });
    track.addEventListener("touchstart", touched, { passive: true });

    const id = window.setInterval(() => {
      if (paused.current || document.hidden || !motionAllowed()) return;
      if (Date.now() - lastInteraction.current < autoplayMs) return;
      scroll(1, false);
    }, autoplayMs);

    return () => {
      window.clearInterval(id);
      paused.current = false;
      track.removeEventListener("pointerenter", onEnter);
      track.removeEventListener("pointerleave", onLeave);
      track.removeEventListener("focusin", onFocusIn);
      track.removeEventListener("focusout", onFocusOut);
      track.removeEventListener("pointerdown", touched);
      track.removeEventListener("wheel", touched);
      track.removeEventListener("touchstart", touched);
    };
    // scroll only reads the DOM and refs; it does not need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, autoplayMs, trackId]);

  const btn =
    "grid size-12 place-items-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-on-primary";
  return (
    <div className="flex gap-3">
      {autoplayMs > 0 ? (
        <button
          type="button"
          className={`autoplay-toggle ${btn} motion-reduce:hidden`}
          onClick={() => setPlaying((p) => !p)}
          aria-controls={trackId}
        >
          {playing ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
          <span className="sr-only">{playing ? `Pause automatic ${label} slideshow` : `Play automatic ${label} slideshow`}</span>
        </button>
      ) : null}
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
