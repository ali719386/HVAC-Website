import type { Brand } from "@/lib/brand/schema";

export type NavLink = { label: string; href: string };
/** Items with children may omit href: they are menu groups (e.g. "Pages"), not pages. */
export type NavItem = { label: string; href?: string; children?: NavLink[] };

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "SMS Consent", href: "/sms-consent" },
];

const present = <T>(items: (T | false)[]) => items.filter((i): i is T => i !== false);

/**
 * Site navigation derived from brand data, so every built page is reachable.
 * Pages a brand disables (no plans, financing off, no posts...) are omitted automatically.
 */
export function getNav({ config, content }: Brand): NavItem[] {
  const pages = present<NavLink>([
    { label: "About Us", href: "/about" },
    { label: "Book a Service", href: "/book" },
    { label: "Service Areas", href: "/service-areas" },
    content.plans.length > 0 && { label: "Maintenance Plans", href: "/plans" },
    config.offerings.financing.enabled && { label: "Financing", href: "/financing" },
    ...legalLinks,
  ]);

  return present<NavItem>([
    { label: "Home", href: "/" },
    { label: "Pages", children: pages },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "All Services", href: "/services" },
        ...content.services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
      ],
    },
    content.projects.length > 0 && { label: "Projects", href: "/projects" },
    content.posts.length > 0 && {
      label: "Blog",
      href: "/blog",
      children: [
        { label: "All Articles", href: "/blog" },
        ...content.posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}` })),
      ],
    },
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
