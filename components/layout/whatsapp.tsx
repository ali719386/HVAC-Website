"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/social-icons";

export type WhatsAppConfig = { number: string; message: string; label: string };

/** wa.me link with an optional prefilled message (no third-party script). */
export const whatsappHref = (w: WhatsAppConfig) => `https://wa.me/${w.number}${w.message ? `?text=${encodeURIComponent(w.message)}` : ""}`;

/** Link that opens WhatsApp in a new tab and records click_to_whatsapp (only when analytics is configured). */
export function WhatsAppLink({ config, source, className, children }: { config: WhatsAppConfig; source: string; className: string; children: ReactNode }) {
  return (
    <a
      href={whatsappHref(config)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("click_to_whatsapp", { source })}
      className={className}
    >
      {children}
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}

/**
 * WhatsApp's own green (not a brand token), darkened to keep white text above 4.5:1 contrast.
 * Floating chat button, bottom right, tablet and desktop only. On phones the same action lives in the
 * sticky call bar, so nothing floats over forms or content.
 */
export function WhatsAppFloat({ config }: { config: WhatsAppConfig }) {
  return (
    <WhatsAppLink
      config={config}
      source="float"
      className="group fixed right-6 bottom-6 z-30 hidden items-center gap-2 rounded-full bg-[#0d7468] py-3 pr-5 pl-3.5 font-semibold text-white shadow-brand-lg transition-[background-color,scale] duration-200 hover:bg-[#0a5f55] active:scale-[0.97] focus-visible:ring-4 focus-visible:ring-[#0d7468]/40 motion-reduce:active:scale-100 md:inline-flex"
    >
      <WhatsAppIcon className="size-7" />
      <span>{config.label}</span>
    </WhatsAppLink>
  );
}
