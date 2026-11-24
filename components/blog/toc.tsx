"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TocItem } from "@/lib/blog";

/**
 * Table of contents with the current section highlighted (IntersectionObserver).
 * Collapsible on mobile (<details>); always open on desktop where it sits in the sticky sidebar.
 */
export function TableOfContents({ items, title }: { items: TocItem[]; title: string }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0 || !("IntersectionObserver" in window)) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // The first heading (in document order) currently in the reading band wins.
        const first = headings.find((h) => visible.has(h.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-96px 0px -60% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  if (items.length === 0) return null;
  const list = (
    <ol className="mt-3 grid gap-1 border-l border-line">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            aria-current={active === i.id ? "location" : undefined}
            className={`-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors hover:text-primary ${i.level === 3 ? "pl-7" : "pl-4"} ${
              active === i.id ? "border-primary font-semibold text-primary" : "border-transparent text-muted"
            }`}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label={title} className="rounded-brand border border-line bg-surface p-5">
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between font-heading font-bold [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        {list}
      </details>
      <div className="hidden lg:block">
        <p className="font-heading font-bold">{title}</p>
        {list}
      </div>
    </nav>
  );
}
