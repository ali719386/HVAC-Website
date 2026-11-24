"use client";

import { useId, type KeyboardEvent, type ReactNode } from "react";
import { useQueryState } from "@/components/motion/query-state";
import { tabKeyTarget } from "@/components/motion/tabs";
import {
  serviceAudiences,
  serviceCategories,
  type Copy,
  type ServiceAudience,
  type ServiceCategory,
} from "@/lib/brand/schema";

type Cat = "all" | ServiceCategory;
type Aud = "all" | ServiceAudience;
type Item = { category: ServiceCategory[]; audience: ServiceAudience[] };

const cats: Cat[] = ["all", ...serviceCategories];
const auds: Aud[] = ["all", ...serviceAudiences];
const isCat = (v: string | null): v is Cat => cats.some((c) => c === v);
const isAud = (v: string | null): v is Aud => auds.some((a) => a === v);

/**
 * Category tabs + property-type toggle for the server-rendered service grid passed as children.
 * Filtering is pure CSS on data attributes (see .svc-filter in globals.css), so cards stay server
 * components. State lives in ?type=&for= (replaceState: shareable, no navigation).
 */
export function ServiceFilters({
  copy,
  items,
  children,
}: {
  copy: Copy["servicesPage"]["filters"];
  items: Item[];
  children: ReactNode;
}) {
  const { params, update } = useQueryState();
  const t = params.get("type");
  const f = params.get("for");
  const cat: Cat = isCat(t) ? t : "all";
  const aud: Aud = isAud(f) ? f : "all";
  const uid = useId();
  const panelId = `${uid}-panel`;
  const tabId = (c: Cat) => `${uid}-tab-${c}`;

  const select = (nextCat: Cat, nextAud: Aud) =>
    update({ type: nextCat === "all" ? undefined : nextCat, for: nextAud === "all" ? undefined : nextAud });

  function selectCat(c: Cat, focus = false) {
    select(c, aud);
    if (focus) document.getElementById(tabId(c))?.focus();
  }

  const selectAud = (a: Aud) => select(cat, a);

  // WAI-ARIA tabs: arrows move and select, Home/End jump to the ends.
  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    const target = cats[tabKeyTarget(e.key, cats.indexOf(cat), cats.length)];
    if (!target) return;
    e.preventDefault();
    selectCat(target, true);
  }

  const label: Record<Cat | Aud, string> = {
    all: copy.all,
    cooling: copy.cooling,
    heating: copy.heating,
    maintenance: copy.maintenance,
    residential: copy.residential,
    commercial: copy.commercial,
  };
  const count = items.filter(
    (it) => (cat === "all" || it.category.includes(cat)) && (aud === "all" || it.audience.includes(aud)),
  ).length;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label={copy.categoryLabel}
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {cats.map((c) => {
            const selected = c === cat;
            return (
              <button
                key={c}
                id={tabId(c)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectCat(c)}
                onKeyDown={onTabKey}
                className={`h-11 shrink-0 rounded-full border px-5 text-[0.95rem] font-semibold transition-colors ${
                  selected ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink hover:border-primary hover:text-primary"
                }`}
              >
                {label[c]}
              </button>
            );
          })}
        </div>

        <div role="group" aria-label={copy.audienceLabel} className="inline-flex self-start rounded-full border border-line bg-surface-alt p-1">
          {auds.map((a) => {
            const pressed = a === aud;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={pressed}
                onClick={() => selectAud(a)}
                className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                  pressed ? "bg-surface text-primary shadow-brand-sm" : "text-muted hover:text-ink"
                }`}
              >
                {a === "all" ? copy.anyAudience : label[a]}
              </button>
            );
          })}
        </div>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(cat)} className="svc-filter" data-cat={cat} data-aud={aud}>
        {children}
      </div>
      <p aria-live="polite" className={count === 0 ? "rounded-brand border border-line bg-surface-alt p-6 text-center font-medium" : "sr-only"}>
        {count === 0 ? copy.empty : ""}
      </p>
    </div>
  );
}
