import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import type { BrandConfig } from "@/lib/brand/schema";
import type { NavItem } from "@/lib/nav";
import { LinkButton } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { MobileMenu } from "./mobile-menu";

export function Header({ config, nav, bookLabel }: { config: BrandConfig; nav: NavItem[]; bookLabel: string }) {
  const { company } = config;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/90">
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Logo name={company.name} src={company.logo.light} />

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              item.children?.length ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-btn px-3 py-2 text-[0.95rem] font-semibold text-ink hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden="true" />
                  </Link>
                  <div className="invisible absolute top-full left-0 z-50 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="w-64 rounded-brand border border-line bg-surface p-2 shadow-brand-lg">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-brand-sm px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-alt hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className="block rounded-btn px-3 py-2 text-[0.95rem] font-semibold text-ink hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${company.phone.tel}`} className="hidden items-center gap-3 md:flex" aria-label={`Call ${company.phone.display}`}>
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
            className="grid size-11 place-items-center rounded-full bg-primary text-on-primary md:hidden"
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
