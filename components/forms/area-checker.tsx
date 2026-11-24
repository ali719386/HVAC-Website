"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, MapPin } from "lucide-react";
import type { Phone } from "@/lib/brand/schema";
import type { ClientArea } from "@/lib/geo/coverage";

const OTHER = "__other";

type Served = { city: string; abbr: string; href: string; zip?: string };
type Result =
  | { kind: "invalid" }
  | { kind: "served"; area: Served }
  | { kind: "zip-unknown"; zip: string; definitive: boolean }
  | { kind: "unlisted"; place: string }
  | null;

/**
 * Coverage checker, entirely in the browser (no external API).
 * ZIP mode appears only when ZIPs are configured. The state/city picker always works, so cities
 * without ZIP data can still be confirmed. An unlisted place is never described as covered.
 */
export function ServiceAreaChecker({ areas, phone }: { areas: ClientArea[]; phone: Phone }) {
  const [zip, setZip] = useState("");
  const [stateAbbr, setStateAbbr] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<Result>(null);
  const uid = useId();
  const msgId = `${uid}-msg`;

  const zipIndex = areas.flatMap((s) => s.cities.flatMap((c) => c.zips.map((z) => ({ zip: z, city: c.name, abbr: s.abbr, href: c.href }))));
  const hasZips = zipIndex.length > 0;
  // A "not served" answer is only definitive when every listed city has ZIP data.
  const allCitiesHaveZips = areas.every((s) => s.cities.every((c) => c.zips.length > 0));
  const chosenState = areas.find((s) => s.abbr === stateAbbr);

  function onZip(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = zip.trim();
    if (!/^\d{5}$/.test(value)) return setResult({ kind: "invalid" });
    const hit = zipIndex.find((z) => z.zip === value);
    setResult(hit ? { kind: "served", area: hit } : { kind: "zip-unknown", zip: value, definitive: allCitiesHaveZips });
  }

  function onCity(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stateAbbr) return;
    if (stateAbbr === OTHER) return setResult({ kind: "unlisted", place: "your state" });
    if (!chosenState) return;
    if (!city || city === OTHER) return setResult({ kind: "unlisted", place: `your city in ${chosenState.name}` });
    const c = chosenState.cities.find((x) => x.slug === city);
    if (c) setResult({ kind: "served", area: { city: c.name, abbr: chosenState.abbr, href: c.href } });
  }

  const field =
    "h-13 w-full rounded-btn border border-line bg-surface px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";
  const button = "h-13 shrink-0 rounded-btn bg-primary px-7 font-semibold text-on-primary transition-colors hover:bg-primary-dark";
  const callLink = (
    <a href={`tel:${phone.tel}`} className="font-bold text-primary underline underline-offset-4">
      {phone.display}
    </a>
  );

  return (
    <div className="rounded-brand border border-line bg-surface p-6 text-ink shadow-brand-md sm:p-8">
      {hasZips ? (
        <form onSubmit={onZip} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor={`${uid}-zip`} className="mb-2 block text-sm font-semibold">
              ZIP code
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id={`${uid}-zip`}
                name="zip"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="e.g. 12345"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                aria-invalid={result?.kind === "invalid"}
                aria-describedby={result ? msgId : undefined}
                className={`${field} pl-12 text-lg aria-[invalid=true]:border-accent`}
              />
            </div>
          </div>
          <button type="submit" className={button}>
            Check ZIP
          </button>
        </form>
      ) : null}

      <form onSubmit={onCity} noValidate className={hasZips ? "mt-6 border-t border-line pt-6" : ""}>
        <p className="mb-3 text-sm font-semibold">{hasZips ? "Or choose your city" : "Choose your state and city"}</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor={`${uid}-state`} className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
              State
            </label>
            <select
              id={`${uid}-state`}
              value={stateAbbr}
              onChange={(e) => {
                setStateAbbr(e.target.value);
                setCity("");
                setResult(null);
              }}
              className={field}
            >
              <option value="">Select a state</option>
              {areas.map((s) => (
                <option key={s.abbr} value={s.abbr}>
                  {s.name}
                </option>
              ))}
              <option value={OTHER}>My state is not listed</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-city`} className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
              City
            </label>
            <select
              id={`${uid}-city`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!chosenState}
              className={`${field} disabled:opacity-50`}
            >
              <option value="">{chosenState ? "Select a city" : "Select a state first"}</option>
              {chosenState?.cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
              {chosenState ? <option value={OTHER}>My city is not listed</option> : null}
            </select>
          </div>
          <button type="submit" className={button} disabled={!stateAbbr}>
            Check
          </button>
        </div>
      </form>

      <div id={msgId} aria-live="polite" className="mt-4 min-h-6">
        {result?.kind === "invalid" ? (
          <p className="flex items-start gap-2 font-medium text-accent-dark">
            <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            Please enter a valid 5-digit ZIP code.
          </p>
        ) : null}
        {result?.kind === "served" ? (
          <div className="flex flex-col gap-3 rounded-brand-sm bg-surface-alt p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 font-medium">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Yes, {result.area.city}, {result.area.abbr} is in our service area{result.area.zip ? ` (${result.area.zip})` : ""}.
              </span>
            </p>
            <span className="flex shrink-0 gap-4">
              <Link href={result.area.href} className="font-bold text-primary underline underline-offset-4">
                Area details
              </Link>
              <Link href="/book" className="font-bold text-primary underline underline-offset-4">
                Book a visit
              </Link>
            </span>
          </div>
        ) : null}
        {result?.kind === "zip-unknown" ? (
          <p className="flex items-start gap-2 rounded-brand-sm bg-surface-alt p-4 font-medium">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
            <span>
              {result.definitive
                ? `${result.zip} is not in our listed service area.`
                : `We could not match ${result.zip} to a listed ZIP code. Choose your city above to check.`}{" "}
              You can also call {callLink} to ask.
            </span>
          </p>
        ) : null}
        {result?.kind === "unlisted" ? (
          <p className="flex items-start gap-2 rounded-brand-sm bg-surface-alt p-4 font-medium">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
            <span>
              We have not listed {result.place} as a service area. Call {callLink} to ask whether we can help.
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
