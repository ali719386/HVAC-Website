"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, MapPin } from "lucide-react";
import type { Phone } from "@/lib/brand/schema";

type Area = { zip: string; city: string; state: string };
type Result = { kind: "invalid" } | { kind: "served"; area: Area } | { kind: "unserved"; zip: string } | null;

/** Checks a ZIP against the brand's configured ZIPs. Runs entirely in the browser, no external API. */
export function ServiceAreaChecker({ areas, phone }: { areas: Area[]; phone: Phone }) {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<Result>(null);
  const inputId = useId();
  const msgId = useId();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = zip.trim();
    if (!/^\d{5}$/.test(value)) {
      setResult({ kind: "invalid" });
      return;
    }
    const area = areas.find((a) => a.zip === value);
    setResult(area ? { kind: "served", area } : { kind: "unserved", zip: value });
  }

  return (
    <div className="rounded-brand border border-line bg-surface p-6 shadow-brand-md sm:p-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={inputId} className="mb-2 block text-sm font-semibold">
            ZIP code
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id={inputId}
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder="e.g. 12345"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              aria-invalid={result?.kind === "invalid"}
              aria-describedby={result ? msgId : undefined}
              className="h-13 w-full rounded-btn border border-line bg-surface pr-4 pl-12 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-accent"
            />
          </div>
        </div>
        <button type="submit" className="h-13 rounded-btn bg-primary px-7 font-semibold text-on-primary transition-colors hover:bg-primary-dark">
          Check my area
        </button>
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
                Yes, we serve {result.area.city}, {result.area.state} ({result.area.zip}).
              </span>
            </p>
            <Link href="/book" className="font-bold text-primary underline underline-offset-4">
              Book a visit
            </Link>
          </div>
        ) : null}
        {result?.kind === "unserved" ? (
          <p className="flex items-start gap-2 rounded-brand-sm bg-surface-alt p-4 font-medium">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
            <span>
              {result.zip} is not in our listed service area. Call{" "}
              <a href={`tel:${phone.tel}`} className="font-bold text-primary underline underline-offset-4">
                {phone.display}
              </a>{" "}
              to ask whether we can help.
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
