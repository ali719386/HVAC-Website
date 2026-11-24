"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

/**
 * Click-to-load map: no iframe and no request to the map provider until the visitor clicks.
 * The directions link always works (it is a plain link).
 */
export function MapBlock({
  query,
  directionsUrl,
  addressLines,
  labels,
}: {
  /** Address used for the embedded map search. */
  query: string;
  directionsUrl: string;
  addressLines: string[];
  labels: { load: string; directions: string; note: string };
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="grid overflow-hidden rounded-brand border border-line bg-surface lg:grid-cols-[1fr_20rem]">
      <div className="relative aspect-[16/10] bg-surface-alt lg:aspect-auto lg:min-h-80">
        {loaded ? (
          <iframe
            title={addressLines.join(", ")}
            src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
            className="absolute inset-0 size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <MapPin className="mx-auto size-10 text-primary" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-btn bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-dark"
              >
                {labels.load}
              </button>
              <p className="mt-3 text-sm text-muted">{labels.note}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
        <address className="font-semibold not-italic">
          {addressLines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </address>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-btn border-2 border-primary px-5 font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
        >
          <Navigation className="size-4" aria-hidden="true" />
          {labels.directions}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
