import type { Brand } from "@/lib/brand/schema";

/** `hint` is a short second line shown under the label in dropdowns (e.g. a date or location). */
export type NavLink = { label: string; href: string; hint?: string };
/** Dropdown items list detail pages in `children`; `all` is the "view all" footer link. */
export type NavItem = { label: string; href: string; children?: NavLink[]; all?: NavLink };

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "SMS Consent", href: "/sms-consent" },
];

const present = <T>(items: (T | false)[]) => items.filter((i): i is T => i !== false);

/**
 * Main navigation, derived from brand data. Dropdowns are generated from content,
 * so new services, projects and posts appear automatically; empty sections are hidden.
 */
export function getNav({ content }: Brand): NavItem[] {
  // Plain links, no dropdowns. (Header still supports `children`/`all` if dropdowns are wanted later.)
  return present<NavItem>([
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    content.projects.length > 0 && { label: "Projects", href: "/projects" },
    content.posts.length > 0 && { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]);
}

/** Footer "Company" column: every non-service, non-legal page. */
export function getFooterLinks({ config, content }: Brand): NavLink[] {
  return present<NavLink>([
    { label: "About Us", href: "/about" },
    { label: "Book a Service", href: "/book" },
    { label: "Service Areas", href: "/service-areas" },
    content.plans.length > 0 && { label: "Maintenance Plans", href: "/plans" },
    config.offerings.financing.enabled && { label: "Financing", href: "/financing" },
    content.projects.length > 0 && { label: "Projects", href: "/projects" },
    content.posts.length > 0 && { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]);
}
