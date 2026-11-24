import Link from "next/link";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
import type { BrandConfig } from "@/lib/brand/schema";
import type { NavItem } from "@/lib/nav";
import { LinkButton } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";

/** Active item: primary color plus an accent underline (not color alone). */
const topLink =
  "relative flex cursor-pointer items-center gap-1 rounded-btn px-2.5 py-2 text-[0.95rem] font-semibold text-ink hover:text-primary xl:px-3 aria-[current=page]:text-primary aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-2.5 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-accent aria-[current=page]:after:content-['']";
const chevron = "size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180";

export function Header({ config, nav, bookLabel }: { config: BrandConfig; nav: NavItem[]; bookLabel: string }) {
  const { company } = config;
  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-surface">
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Logo name={company.name} src={company.logo.light} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {nav.map((item) =>
              item.children?.length ? (
                <li key={item.label} className="group relative">
                  <Link href={item.href} className={topLink} aria-haspopup="true">
                    {item.label}
                    <ChevronDown className={chevron} aria-hidden="true" />
                  </Link>
                  <NavDropdown item={item} />
                </li>
              ) : (
                <li key={item.label}>
                  <NavLink href={item.href} className={topLink}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${company.phone.tel}`} className="hidden items-center gap-3 md:flex lg:hidden 2xl:flex" aria-label={`Call ${company.phone.display}`}>
            <span className="grid size-11 place-items-center rounded-full bg-surface-alt text-primary">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-medium text-muted">Call us</span>
              <span className="block font-heading text-lg font-extrabold text-primary">{company.phone.display}</span>
            </span>
          </a>
          <LinkButton href="/book" variant="accent" className="hidden sm:inline-flex">
            {bookLabel}
          </LinkButton>
          <a
            href={`tel:${company.phone.tel}`}
            className="grid size-11 place-items-center rounded-full bg-primary text-on-primary md:hidden lg:grid 2xl:hidden"
            aria-label={`Call ${company.phone.display}`}
          >
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <MobileMenu nav={nav} phone={company.phone} bookLabel={bookLabel} />
        </div>
      </div>
    </header>
  );
}

/** Dropdown panel: shows on hover and on keyboard focus (focus-within), no JS. */
function NavDropdown({ item }: { item: NavItem }) {
  if (!item.children?.length) return null;
  return (
    <div className="invisible absolute top-full left-1/2 z-50 w-[22rem] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="overflow-hidden rounded-brand border border-line bg-surface shadow-brand-lg">
        <div aria-hidden="true" className="h-1 bg-primary" />
        <ul className="max-h-[60vh] overflow-y-auto p-2">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="group/item flex items-start gap-3 rounded-brand-sm px-3 py-3 transition-colors hover:bg-surface-alt focus-visible:bg-surface-alt"
              >
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[0.95rem] leading-snug font-semibold text-ink group-hover/item:text-primary">
                    {child.label}
                  </span>
                  {child.hint ? <span className="mt-0.5 line-clamp-1 text-xs text-muted">{child.hint}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {item.all ? (
          <Link
            href={item.all.href}
            className="flex items-center justify-between border-t border-line bg-surface-alt px-5 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            {item.all.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
