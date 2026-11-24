"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Search, SearchX, X } from "lucide-react";
import { projectCategories, type Copy, type ProjectCategory } from "@/lib/brand/schema";
import { RevealGroup } from "@/components/motion/reveal";
import { useQueryState } from "@/components/motion/query-state";
import { tabKeyTarget } from "@/components/motion/tabs";
import { buttonClass } from "@/components/ui/button";

type Pp = Copy["projectsPage"];
type Cat = "all" | ProjectCategory;
type Sort = "newest" | "oldest" | "featured";

/** Serializable facts about a project; the card itself is server-rendered and passed in `cards`. */
export type ProjectMeta = {
  slug: string;
  category: ProjectCategory;
  city: string;
  systemType: string;
  year: number;
  featured: boolean;
  /** Lowercased title, city, system and summary for search. */
  haystack: string;
};

const cats: Cat[] = ["all", ...projectCategories];
const sorts: Sort[] = ["newest", "oldest", "featured"];
const PAGE = 6;
const isCat = (v: string | null): v is Cat => cats.some((c) => c === v);
const isSort = (v: string | null): v is Sort => sorts.some((s) => s === v);

export function ProjectExplorer({
  items,
  cards,
  copy,
}: {
  items: ProjectMeta[];
  /** Server-rendered card per slug. */
  cards: Record<string, ReactNode>;
  copy: Pick<Pp, "toolbar" | "categories">;
}) {
  const t = copy.toolbar;
  const { params, update } = useQueryState();
  const uid = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const cities = [...new Set(items.map((i) => i.city))].sort();
  const systems = [...new Set(items.map((i) => i.systemType))].sort();
  const pc = params.get("cat");
  const cat: Cat = isCat(pc) ? pc : "all";
  const pCity = params.get("city");
  const city = pCity && cities.includes(pCity) ? pCity : "";
  const pSys = params.get("system");
  const system = pSys && systems.includes(pSys) ? pSys : "";
  const q = (params.get("q") ?? "").slice(0, 80);
  const ps = params.get("sort");
  const sort: Sort = isSort(ps) ? ps : "newest";
  const active = cat !== "all" || city !== "" || system !== "" || q !== "" || sort !== "newest";

  // Everything except the category, so each tab can show how many results it would give.
  const needle = q.trim().toLowerCase();
  const base = items.filter(
    (i) => (!city || i.city === city) && (!system || i.systemType === system) && (!needle || i.haystack.includes(needle)),
  );
  const countFor = (c: Cat) => (c === "all" ? base.length : base.filter((i) => i.category === c).length);
  const order = (a: ProjectMeta, b: ProjectMeta) =>
    sort === "oldest" ? a.year - b.year
    : sort === "featured" ? Number(b.featured) - Number(a.featured) || b.year - a.year
    : b.year - a.year;
  const results = base.filter((i) => cat === "all" || i.category === cat).sort(order);

  // "Load more" resets whenever the filter combination changes.
  const signature = [cat, city, system, needle, sort].join("|");
  const [shown, setShown] = useState({ signature, count: PAGE });
  const limit = shown.signature === signature ? shown.count : PAGE;
  const visible = results.slice(0, limit);

  function loadMore() {
    const firstNew = limit;
    setShown({ signature, count: limit + PAGE });
    // Move focus to the first newly shown card so keyboard users continue from there.
    requestAnimationFrame(() => panelRef.current?.querySelectorAll<HTMLElement>("li a")[firstNew]?.focus());
  }

  const tabId = (c: Cat) => `${uid}-tab-${c}`;
  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    const target = cats[tabKeyTarget(e.key, cats.indexOf(cat), cats.length)];
    if (!target) return;
    e.preventDefault();
    update({ cat: target === "all" ? undefined : target });
    document.getElementById(tabId(target))?.focus();
  }

  const clear = () => update({ cat: undefined, city: undefined, system: undefined, q: undefined, sort: undefined });
  const field = "h-11 w-full rounded-btn border border-line bg-surface px-3 text-[0.95rem] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";
  const label = "mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase";
  const resultText = results.length === 1 ? t.resultsOne : t.resultsMany.replace("{count}", String(results.length));

  return (
    <div>
      {/* Sticky below the header from md up (on phones it would cover too much of the screen). */}
      <div className="z-30 -mx-4 border-y border-line bg-surface/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 md:sticky md:top-[4.5rem] lg:top-20">
        <div role="tablist" aria-label={t.categoryLabel} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {cats.map((c) => {
            const selected = c === cat;
            return (
              <button
                key={c}
                id={tabId(c)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => update({ cat: c === "all" ? undefined : c })}
                onKeyDown={onTabKey}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  selected ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink hover:border-primary hover:text-primary"
                }`}
              >
                {copy.categories[c]}
                <span className={`rounded-full px-1.5 text-xs ${selected ? "bg-on-primary/20" : "bg-primary/8 text-primary"}`}>{countFor(c)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_1fr_auto] lg:items-end">
          <div>
            <label htmlFor={`${uid}-city`} className={label}>{t.cityLabel}</label>
            <select id={`${uid}-city`} value={city} onChange={(e) => update({ city: e.target.value })} className={field}>
              <option value="">{t.allCities}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-system`} className={label}>{t.systemLabel}</label>
            <select id={`${uid}-system`} value={system} onChange={(e) => update({ system: e.target.value })} className={field}>
              <option value="">{t.allSystems}</option>
              {systems.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-q`} className={label}>{t.searchLabel}</label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id={`${uid}-q`}
                type="search"
                value={q}
                maxLength={80}
                placeholder={t.searchPlaceholder}
                onChange={(e) => update({ q: e.target.value })}
                className={`${field} pl-9`}
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-sort`} className={label}>{t.sortLabel}</label>
            <select
              id={`${uid}-sort`}
              value={sort}
              onChange={(e) => update({ sort: e.target.value === "newest" ? undefined : e.target.value })}
              className={field}
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="oldest">{t.sortOldest}</option>
              <option value="featured">{t.sortFeatured}</option>
            </select>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={!active}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-btn px-3 text-sm font-bold text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="size-4" aria-hidden="true" />
            {t.clear}
          </button>
        </div>
        <p aria-live="polite" aria-atomic="true" className="mt-3 text-sm font-semibold text-muted">
          {resultText}
        </p>
      </div>

      <div ref={panelRef} id={`${uid}-panel`} role="tabpanel" aria-labelledby={tabId(cat)} className="mt-10">
        {visible.length > 0 ? (
          <RevealGroup as="ul" variant="fade-up" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((i) => (
              <li key={i.slug}>{cards[i.slug]}</li>
            ))}
          </RevealGroup>
        ) : (
          <div className="rounded-brand border border-dashed border-line bg-surface p-10 text-center">
            <SearchX className="mx-auto size-10 text-primary" aria-hidden="true" />
            <p className="mt-4 font-heading text-xl font-bold">{t.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-muted">{t.emptyBody}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={clear} className={buttonClass("outline")}>
                {t.clear}
              </button>
              <Link href="/book" className={buttonClass("accent")}>
                {t.emptyCta}
              </Link>
            </div>
          </div>
        )}
        {results.length > limit ? (
          <div className="mt-10 text-center">
            <button type="button" onClick={loadMore} className={buttonClass("outline", "lg")}>
              {t.loadMore}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
