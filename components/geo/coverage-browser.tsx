"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import type { Climate, Copy } from "@/lib/brand/schema";
import type { ClientArea } from "@/lib/geo/coverage";
import { tabKeyTarget } from "@/components/motion/tabs";

type Tab = "all" | Climate;
type Labels = Pick<Copy["serviceAreas"], "climates" | "filterLabel" | "searchLabel" | "searchPlaceholder" | "empty" | "citiesCount">;

/**
 * Climate tabs over the configured coverage.
 * chips: compact city chips (homepage). full: tabs incl. "All", search, and cards grouped by state.
 */
export function CoverageBrowser({ areas, labels, variant }: { areas: ClientArea[]; labels: Labels; variant: "chips" | "full" }) {
  const present = (["cooling", "heating", "mixed"] as const).filter((c) => areas.some((a) => a.climate === c));
  const tabs: Tab[] = variant === "full" ? ["all", ...present] : present;
  const [tab, setTab] = useState<Tab>(tabs[0] ?? "all");
  const [q, setQ] = useState("");
  const uid = useId();
  const tabId = (t: Tab) => `${uid}-tab-${t}`;

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    const target = tabs[tabKeyTarget(e.key, tabs.indexOf(tab), tabs.length)];
    if (!target) return;
    e.preventDefault();
    setTab(target);
    document.getElementById(tabId(target))?.focus();
  }

  const needle = q.trim().toLowerCase();
  const shown = areas
    .filter((a) => tab === "all" || a.climate === tab)
    .map((a) => {
      const stateHit = !needle || a.name.toLowerCase().includes(needle) || a.abbr.toLowerCase() === needle;
      return { ...a, cities: stateHit ? a.cities : a.cities.filter((c) => c.name.toLowerCase().includes(needle)) };
    })
    .filter((a) => !needle || a.cities.length > 0 || a.name.toLowerCase().includes(needle) || a.abbr.toLowerCase() === needle);

  if (tabs.length === 0) return null;

  return (
    <div>
      <div className={`flex flex-col gap-4 ${variant === "full" ? "lg:flex-row lg:items-end lg:justify-between" : ""}`}>
        <div role="tablist" aria-label={labels.filterLabel} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {tabs.map((t) => {
            const selected = t === tab;
            return (
              <button
                key={t}
                id={tabId(t)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t)}
                onKeyDown={onKey}
                className={`h-11 shrink-0 rounded-full border px-5 text-[0.95rem] font-semibold transition-colors ${
                  selected ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink hover:border-primary hover:text-primary"
                }`}
              >
                {labels.climates[t]}
              </button>
            );
          })}
        </div>
        {variant === "full" ? (
          <div className="w-full lg:max-w-xs">
            <label htmlFor={`${uid}-q`} className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
              {labels.searchLabel}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id={`${uid}-q`}
                type="search"
                value={q}
                maxLength={60}
                onChange={(e) => setQ(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="h-11 w-full rounded-btn border border-line bg-surface pr-3 pl-9 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={tabId(tab)} className="mt-8">
        {variant === "chips" ? (
          <ul className="flex flex-wrap gap-2.5">
            {shown.flatMap((a) =>
              a.cities.map((c) => (
                <li key={`${a.abbr}-${c.slug}`}>
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-semibold transition-colors hover:border-primary hover:bg-primary/8 hover:text-primary"
                  >
                    <MapPin className="size-4 text-accent" aria-hidden="true" />
                    {c.name}, {a.abbr}
                  </Link>
                </li>
              )),
            )}
            {/* States without listed cities link to their state page. */}
            {shown
              .filter((a) => a.cities.length === 0)
              .map((a) => (
                <li key={a.abbr}>
                  <Link
                    href={a.href}
                    className="inline-flex items-center gap-2 rounded-full border border-dashed border-line bg-surface px-4 py-2 font-semibold transition-colors hover:border-primary hover:text-primary"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
          </ul>
        ) : shown.length === 0 ? (
          <p aria-live="polite" className="rounded-brand border border-line bg-surface-alt p-6 text-center font-medium">
            {labels.empty}
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((a) => (
              <li key={a.abbr} className="flex flex-col rounded-brand border border-line bg-surface p-6">
                <div className="flex items-start justify-between gap-3">
                  <Link href={a.href} className="group inline-flex items-center gap-2 font-heading text-xl font-bold hover:text-primary">
                    {a.name}
                    <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <span className="shrink-0 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-bold text-primary">{labels.climates[a.climate]}</span>
                </div>
                {a.cities.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {a.cities.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={c.href}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                        >
                          <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-auto pt-4 text-sm text-muted">{labels.citiesCount.replace("{cities}", String(a.cities.length))}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
