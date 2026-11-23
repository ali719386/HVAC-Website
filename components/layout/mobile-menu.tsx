"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, Phone as PhoneIcon, X } from "lucide-react";
import type { Phone } from "@/lib/brand/schema";
import type { NavItem } from "@/lib/nav";

/** Mobile/tablet navigation drawer. Escape closes, focus returns to the toggle. */
export function MobileMenu({ nav, phone, bookLabel }: { nav: NavItem[]; phone: Phone; bookLabel: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
    <div className="xl:hidden">
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
              <li key={item.href} className="py-1">
                <Link
                  href={item.href}
                  className="block py-3 font-heading text-lg font-bold text-ink"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="mb-2 grid gap-1 pl-3">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="block py-2 text-[0.95rem] text-muted"
                          aria-current={pathname === c.href ? "page" : undefined}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 pb-24">
            <Link
              href="/book"
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
