"use client";

import { useSyncExternalStore } from "react";

/** Fired after replaceState (which emits no event of its own) so subscribers re-read the URL. */
const EVENT = "query-state-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * Filter state stored in the query string (shareable, no navigation, page stays static).
 * The server snapshot is empty, so pre-rendered HTML shows the unfiltered list.
 */
export function useQueryState() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const params = new URLSearchParams(search);

  /** Sets or clears (empty string / default value) the given keys and notifies subscribers. */
  function update(changes: Record<string, string | undefined>) {
    const url = new URL(window.location.href);
    for (const [k, v] of Object.entries(changes)) {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    }
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(EVENT));
  }

  return { params, update };
}
