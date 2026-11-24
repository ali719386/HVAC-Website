import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Brand } from "@/lib/brand/schema";
import { getFooterLinks, legalLinks } from "@/lib/nav";
import { Logo } from "@/components/ui/logo";
import { TrustList } from "./trust-list";
import { getCoverage, licenseFor, primaryCities } from "@/lib/geo/coverage";
import { Reveal } from "@/components/motion/reveal";

const socialLabels = { facebook: "Facebook", instagram: "Instagram", youtube: "YouTube", linkedin: "LinkedIn", x: "X" } as const;

export function Footer({ brand }: { brand: Brand }) {
  const { company, offerings } = brand.config;
  // Up to 10 primary cities (falls back to the first 10 configured cities).
  const primary = primaryCities(10);
  const footerCities = primary.length > 0 ? primary : getCoverage().cities.slice(0, 10);
  const sa = brand.content.copy.serviceAreas;
  const license = licenseFor(company);
  const companyLinks = getFooterLinks(brand);
  const year = new Date().getFullYear();
  const heading = "mb-4 font-heading text-base font-bold text-on-primary";
  const link = "text-on-primary/75 transition-colors hover:text-on-primary";

  return (
    <footer className="bg-surface-dark pb-[calc(5rem+env(safe-area-inset-bottom))] text-on-primary/80 md:pb-0">
      <Reveal variant="fade-in" className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo name={company.name} src={company.logo.dark} onDark />
          <p className="mt-4 max-w-sm leading-relaxed">{company.tagline}</p>
          <TrustList company={company} onDark className="mt-6 text-on-primary/90" />
          {company.socials.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-4 text-sm">
              {company.socials.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={link}>
                    {socialLabels[s.network]}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Services" className="lg:col-span-2">
          <h2 className={heading}>Services</h2>
          <ul className="grid gap-2.5 text-sm">
            {brand.content.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={link}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className={heading}>Company</h2>
          <ul className="grid gap-2.5 text-sm">
            {companyLinks.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={link}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className={heading}>Contact</h2>
          <ul className="grid gap-3.5 text-sm">
            <li>
              <a href={`tel:${company.phone.tel}`} className="flex items-center gap-3 font-heading text-xl font-extrabold text-on-primary">
                <Phone className="size-5 text-accent" aria-hidden="true" />
                {company.phone.display}
              </a>
            </li>
            {offerings.emergency24x7 && company.emergencyPhone ? (
              <li>
                <a href={`tel:${company.emergencyPhone.tel}`} className={`flex items-center gap-3 ${link}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  24/7 emergency: {company.emergencyPhone.display}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${company.email}`} className={`flex items-center gap-3 ${link}`}>
                <Mail className="size-4" aria-hidden="true" />
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <address className="not-italic">
                {company.address.street}
                <br />
                {company.address.city}, {company.address.state} {company.address.zip}
              </address>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                {company.hours.map((h) => (
                  <div key={h.days} className="contents">
                    <dt className="font-semibold text-on-primary/90">{h.days}</dt>
                    <dd>{h.hours}</dd>
                  </div>
                ))}
              </dl>
            </li>
          </ul>
          {footerCities.length > 0 ? (
            <>
              <h2 className={`${heading} mt-8`}>{sa.whereWeWork.title}</h2>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {footerCities.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className={link}>
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/service-areas" className={`${link} font-semibold text-on-primary`}>
                    {sa.viewAll}
                  </Link>
                </li>
              </ul>
            </>
          ) : null}
        </div>
      </Reveal>

      <div className="border-t border-on-primary/15">
        <div className="container-site flex flex-col gap-4 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {company.legalName}. All rights reserved.
            {license ? <span> License #{license}.</span> : null}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
