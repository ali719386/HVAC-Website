"use client";

import { useEffect, useRef } from "react";
import { motionAllowed, observe } from "./observer";

const fmt = new Intl.NumberFormat("en-US");

/**
 * Counts from 0 to `value` once when scrolled into view. Server HTML contains the final value
 * (no-JS, SEO, reduced motion). Updates text directly (no React state) to avoid re-renders.
 * Screen readers get the final value only.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    const base = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--motion-duration")) || 700;
    const total = Math.max(base * 2, 800);
    let raf = 0;
    el.textContent = fmt.format(0);
    const stop = observe(el, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / total);
        el.textContent = fmt.format(Math.round(value * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      stop();
      cancelAnimationFrame(raf);
      el.textContent = fmt.format(value);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {fmt.format(value)}
      </span>
      <span className="sr-only">
        {fmt.format(value)}
        {suffix}
      </span>
    </>
  );
}
