"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { HomeLink } from "./home-link";

/** True for the item's own page and its detail pages (e.g. /services and /services/ac-repair). */
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Top-level nav link with aria-current="page" on the active section. Style it with aria-[current=page]:. */
export function NavLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const current = isActivePath(pathname, href) ? "page" : undefined;
  if (href === "/") {
    return (
      <HomeLink className={className} aria-current={current} onNavigate={onNavigate}>
        {children}
      </HomeLink>
    );
  }
  return (
    <Link href={href} className={className} aria-current={current} onClick={onNavigate}>
      {children}
    </Link>
  );
}
