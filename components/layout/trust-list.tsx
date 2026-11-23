import { Award, BadgeCheck, CalendarClock, ShieldCheck, Star } from "lucide-react";
import type { BrandConfig } from "@/lib/brand/schema";

type TrustItem = { key: string; icon: typeof Star; text: string; href?: string };

/** Builds trust items ONLY from fields present in config. Nothing is shown by default. */
export function getTrustItems(company: BrandConfig["company"]): TrustItem[] {
  const items: TrustItem[] = [];
  if (company.licenseNumber) items.push({ key: "license", icon: BadgeCheck, text: `Licensed, #${company.licenseNumber}` });
  if (company.insured || company.bonded) {
    const parts = [company.insured && "Insured", company.bonded && "Bonded"].filter(Boolean).join(" & ");
    items.push({ key: "insured", icon: ShieldCheck, text: parts });
  }
  if (company.yearsInBusiness) items.push({ key: "years", icon: CalendarClock, text: `${company.yearsInBusiness}+ years in business` });
  if (company.googleRating) {
    const r = company.googleRating;
    items.push({ key: "rating", icon: Star, text: `${r.score.toFixed(1)} on Google (${r.count} reviews)`, href: r.url });
  }
  for (const cert of company.certifications) items.push({ key: `cert-${cert}`, icon: Award, text: cert });
  return items;
}

export function TrustList({
  company,
  onDark = false,
  className = "",
}: {
  company: BrandConfig["company"];
  onDark?: boolean;
  className?: string;
}) {
  const items = getTrustItems(company);
  if (items.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold ${className}`} aria-label="Credentials">
      {items.map(({ key, icon: I, text, href }) => (
        <li key={key} className="flex items-center gap-2">
          <I className={`size-4.5 shrink-0 ${onDark ? "text-on-primary" : "text-accent"}`} aria-hidden="true" />
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              {text}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span>{text}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
