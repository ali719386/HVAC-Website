import type { Brand } from "@/lib/brand/schema";

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

/** Site navigation derived from brand data. Pages that a brand disables are omitted. */
export function getNav({ config, content }: Brand): NavItem[] {
  const items: (NavItem | false)[] = [
    { label: "Home", href: "/" },
    {
      label: "Services",
      href: "/services",
      children: content.services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    },
    content.plans.length > 0 && { label: "Plans", href: "/plans" },
    config.offerings.financing.enabled && { label: "Financing", href: "/financing" },
    content.projects.length > 0 && { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    content.posts.length > 0 && { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];
  return items.filter((i): i is NavItem => i !== false);
}

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "SMS Consent", href: "/sms-consent" },
];
