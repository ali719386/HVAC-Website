"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, Phone as PhoneIcon, X } from "lucide-react";
import type { Phone } from "@/lib/brand/schema";
import type { NavItem } from "@/lib/nav";
import { HomeLink } from "./home-link";

/** Mobile/tablet navigation drawer. Escape closes, focus returns to the toggle. */
export function MobileMenu({ nav, phone, bookLabel }: { nav: NavItem[]; phone: Phone; bookLabel: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  // Close when the route changes (adjusting state during render, per React docs).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full border border-line text-ink"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-line bg-surface lg:h-[calc(100dvh-5rem)]"
      >
        <nav aria-label="Mobile" className="container-site py-4">
          <ul className="divide-y divide-line">
            {nav.map((item) => (
              <li key={item.label} className="py-1">
                {item.href === "/" ? (
                  <HomeLink
                    className="block py-3 font-heading text-lg font-bold text-ink"
                    aria-current={pathname === "/" ? "page" : undefined}
                    onNavigate={close}
                  >
                    {item.label}
                  </HomeLink>
                ) : (
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block py-3 font-heading text-lg font-bold text-ink"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
                {item.children?.length ? (
                  <ul className="mb-3 grid gap-1 border-l-2 border-line pl-4">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={close}
                          className="block rounded-brand-sm py-2 aria-[current=page]:text-primary"
                          aria-current={pathname === c.href ? "page" : undefined}
                        >
                          <span className="block text-[0.95rem] leading-snug font-medium text-ink">{c.label}</span>
                          {c.hint ? <span className="mt-0.5 line-clamp-1 block text-xs text-muted">{c.hint}</span> : null}
                        </Link>
                      </li>
                    ))}
                    {item.all ? (
                      <li>
                        <Link href={item.all.href} onClick={close} className="block py-2 text-sm font-bold text-primary">
                          {item.all.label} →
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 pb-24">
            <Link
              href="/book"
              onClick={close}
              className="inline-flex h-12 items-center justify-center rounded-btn bg-accent font-semibold text-on-accent"
            >
              {bookLabel}
            </Link>
            <a
              href={`tel:${phone.tel}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-btn border-2 border-primary font-semibold text-primary"
            >
              <PhoneIcon className="size-4" aria-hidden="true" />
              Call {phone.display}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
