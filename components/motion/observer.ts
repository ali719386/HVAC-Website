/*
 * One shared IntersectionObserver for every Reveal, RevealGroup and CountUp on the page.
 * Browser-only module: import it from client components and call it inside effects.
 */

type Entry = { onChange: (visible: boolean) => void; once: boolean };

declare global {
  interface Window {
    /** Set when the first reveal mounts; the inline head script uses it as a no-hang fallback. */
    __revealReady?: boolean;
  }
}

const entries = new Map<Element, Entry>();
let io: IntersectionObserver | undefined;

function getObserver(): IntersectionObserver {
  io ??= new IntersectionObserver(
    (records) => {
      for (const r of records) {
        const entry = entries.get(r.target);
        if (!entry) continue;
        if (r.isIntersecting) {
          entry.onChange(true);
          if (entry.once) {
            io?.unobserve(r.target);
            entries.delete(r.target);
          }
        } else if (!entry.once) {
          entry.onChange(false);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );
  return io;
}

/** True when the brand enables motion and the visitor has not asked for reduced motion. */
export function motionAllowed(): boolean {
  return (
    document.documentElement.dataset.motion === "on" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Watches `el`; calls onChange(true) when it enters the viewport. Returns a cleanup function. */
export function observe(el: Element, onChange: (visible: boolean) => void, once = true): () => void {
  window.__revealReady = true;
  if (typeof IntersectionObserver === "undefined" || !motionAllowed()) {
    onChange(true);
    return () => {};
  }
  entries.set(el, { onChange, once });
  getObserver().observe(el);
  return () => {
    io?.unobserve(el);
    entries.delete(el);
  };
}
