"use client";

import { useState } from "react";
import { Check, Link2, Mail } from "lucide-react";

/** Copy-link button and a plain mailto link. No third-party share scripts. */
export function ShareRow({
  url,
  title,
  labels,
}: {
  url: string;
  title: string;
  labels: { share: string; copy: string; copied: string; email: string };
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked (permissions or insecure context): the URL stays in the address bar.
      setCopied(false);
    }
  }
  const pill =
    "inline-flex h-11 items-center gap-2 rounded-btn border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="mr-2 font-heading font-bold">{labels.share}</p>
      <button type="button" onClick={copy} className={pill}>
        {copied ? <Check className="size-4 text-primary" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
        {copied ? labels.copied : labels.copy}
      </button>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className={pill}>
        <Mail className="size-4" aria-hidden="true" />
        {labels.email}
      </a>
      <span aria-live="polite" className="sr-only">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
}
