"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

/**
 * Link to "/" that also works when you are already on the homepage: Next.js does not
 * scroll for a same-route link, so we scroll to the top (smoothly unless reduced motion).
 */
export function HomeLink({
  className,
  children,
  onNavigate,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  /** Called on every click, e.g. to close the mobile menu. */
  onNavigate?: () => void;
  "aria-label"?: string;
  "aria-current"?: "page";
}) {
  const pathname = usePathname();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    // Let modified clicks (new tab, etc.) behave normally.
    if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (window.location.hash) window.history.replaceState(null, "", "/");
  }

  return (
    <Link href="/" className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
