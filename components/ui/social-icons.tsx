import type { ReactNode } from "react";

type Network = "facebook" | "instagram" | "youtube" | "linkedin" | "x";

/** Simple geometric glyphs (24x24, currentColor). Decorative: the link carries the accessible name. */
const glyphs: Record<Network, ReactNode> = {
  facebook: <path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v7h4v-7h3l.5-4H14V8.6c0-.4.2-.6.6-.6Z" fill="currentColor" />,
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </g>
  ),
  youtube: (
    <g>
      <rect x="2" y="5.5" width="20" height="13" rx="4" fill="currentColor" />
      <path d="m10 9 5 3-5 3V9Z" fill="var(--brand-surface-dark)" />
    </g>
  ),
  linkedin: (
    <g fill="currentColor">
      <rect x="4" y="9" width="3.5" height="11" />
      <circle cx="5.75" cy="5.5" r="2" />
      <path d="M10 9h3.3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.9c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9v6H10V9Z" />
    </g>
  ),
  x: <path d="M4 4h4.5l4 5.6L17.3 4H20l-6.2 7.2L20.5 20H16l-4.4-6L6.5 20H3.8l6.6-7.6L4 4Z" fill="currentColor" />,
};

export function SocialIcon({ network, className = "size-5" }: { network: Network; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {glyphs[network]}
    </svg>
  );
}
