"use client";

import Link from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";
import { Search, SearchX, X } from "lucide-react";
import type { Copy } from "@/lib/brand/schema";
import { RevealGroup } from "@/components/motion/reveal";
import { useQueryState } from "@/components/motion/query-state";
import { buttonClass } from "@/components/ui/button";

type Labels = Pick<
  Copy["blog"],
  "searchLabel" | "searchPlaceholder" | "categoriesLabel" | "all" | "resultsOne" | "resultsMany" | "clear" | "emptyTitle" | "emptyBody" | "emptyCta" | "loadMore"
>;

export type PostMeta = { slug: string; haystack: string };
export type CategoryChip = { slug: string; name: string; count: number; href: string };

const PAGE = 9;

/**
 * Category links (real pages) + client-side search over title, excerpt and tags. The query lives in
 * ?q= so the hero search form (a plain GET to this page) works with and without JavaScript.
 */
export function BlogExplorer({
  items,
  cards,
  chips,
  allHref,
  allCount,
  activeCategory,
  labels,
  promo,
}: {
  /** Optional card shown after the last post when the final row has an empty cell. */
  promo?: ReactNode;
  items: PostMeta[];
  cards: Record<string, ReactNode>;
  chips: CategoryChip[];
  allHref: string;
  allCount: number;
  /** Current category slug on a category page. */
  activeCategory?: string;
  labels: Labels;
}) {
  const { params, update } = useQueryState();
  const uid = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const q = (params.get("q") ?? "").slice(0, 80);
  const needle = q.trim().toLowerCase();
  const results = needle ? items.filter((i) => i.haystack.includes(needle)) : items;

  const [shown, setShown] = useState({ key: needle, count: PAGE });
  const limit = shown.key === needle ? shown.count : PAGE;
  const visible = results.slice(0, limit);

  function loadMore() {
    const firstNew = limit;
    setShown({ key: needle, count: limit + PAGE });
    requestAnimationFrame(() => panelRef.current?.querySelectorAll<HTMLElement>("h2 a, h3 a")[firstNew]?.focus());
  }

  const count = results.length === 1 ? labels.resultsOne : labels.resultsMany.replace("{count}", String(results.length));
  const chip = (active: boolean) =>
    `inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
      active ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink hover:border-primary hover:text-primary"
    }`;

  const countPill = (active: boolean) => `rounded-full px-1.5 text-xs ${active ? "bg-on-primary/20" : "bg-primary/8 text-primary"}`;

  return (
    <div>
      <div className="rounded-brand border border-line bg-surface p-4 sm:p-5">
        <nav aria-label={labels.categoriesLabel}>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href={allHref} aria-current={!activeCategory ? "page" : undefined} className={chip(!activeCategory)}>
                {labels.all}
                <span className={countPill(!activeCategory)}>{allCount}</span>
              </Link>
            </li>
            {chips.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} aria-current={activeCategory === c.slug ? "page" : undefined} className={chip(activeCategory === c.slug)}>
                  {c.name}
                  <span className={countPill(activeCategory === c.slug)}>{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor={`${uid}-q`} className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
              {labels.searchLabel}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id={`${uid}-q`}
                type="search"
                value={q}
                maxLength={80}
                placeholder={labels.searchPlaceholder}
                onChange={(e) => update({ q: e.target.value })}
                className="h-11 w-full rounded-btn border border-line bg-surface pr-3 pl-9 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => update({ q: undefined })}
            disabled={!q}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-btn px-3 text-sm font-bold text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="size-4" aria-hidden="true" />
            {labels.clear}
          </button>
        </div>
        <p aria-live="polite" aria-atomic="true" className="mt-3 text-sm font-semibold text-muted">
          {count}
        </p>
      </div>

      <div ref={panelRef} className="mt-8">
        {visible.length > 0 ? (
          <RevealGroup as="ul" variant="fade-up" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((i) => (
              <li key={i.slug}>{cards[i.slug]}</li>
            ))}
            {/* Fills the gap in an incomplete last row only: hidden on one column, on a full 2-col row
                (odd position) and on a full 3-col row (3n+1); spans two cells when one card is alone at xl. */}
            {promo ? (
              <li className="hidden sm:flex sm:max-xl:[&:nth-child(odd)]:hidden xl:[&:nth-child(3n+1)]:hidden xl:[&:nth-child(3n+2)]:col-span-2">
                {promo}
              </li>
            ) : null}
          </RevealGroup>
        ) : (
          <div className="rounded-brand border border-dashed border-line bg-surface p-10 text-center">
            <SearchX className="mx-auto size-10 text-primary" aria-hidden="true" />
            <p className="mt-4 font-heading text-xl font-bold">{labels.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-muted">{labels.emptyBody}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => update({ q: undefined })} className={buttonClass("outline")}>
                {labels.clear}
              </button>
              <Link href="/contact" className={buttonClass("accent")}>
                {labels.emptyCta}
              </Link>
            </div>
          </div>
        )}
        {results.length > limit ? (
          <div className="mt-10 text-center">
            <button type="button" onClick={loadMore} className={buttonClass("outline", "lg")}>
              {labels.loadMore}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
