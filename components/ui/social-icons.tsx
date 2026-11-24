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

/** WhatsApp-style glyph: chat bubble with a handset (simple shapes, currentColor). Decorative. */
export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none">
      <path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.8 21.2l4.6-1.2A9.2 9.2 0 1 0 12 2.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path
        transform="translate(6.6 6.6) scale(0.45)"
        fill="currentColor"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}