import { hoursText } from "@/lib/hours";
import { Clock, Mail, MapPin, Siren } from "lucide-react";
import Link from "next/link";
import type { BrandConfig } from "@/lib/brand/schema";
import { licenseFor } from "@/lib/geo/coverage";

export function TopBar({ config, coverageText }: { config: BrandConfig; coverageText: string }) {
  const { company, offerings, coverage } = config;
  const license = licenseFor(company);
  const firstHours = company.hours[0];
  const emergency = offerings.emergency24x7 ? (company.emergencyPhone ?? company.phone) : undefined;
  return (
    <div className="hidden bg-primary-dark text-sm text-on-primary/90 lg:block">
      <div className="container-site flex h-11 items-center justify-between gap-6">
        <ul className="flex items-center gap-6">
          <li>
            <Link href="/service-areas" className="flex items-center gap-2 hover:text-on-primary hover:underline">
              <MapPin className="size-4 opacity-80" aria-hidden="true" />
              {coverageText}
            </Link>
          </li>
          {coverage.headquarters ? <li className="hidden xl:block">{coverage.headquarters}</li> : null}
          {firstHours ? (
            <li className="flex items-center gap-2">
              <Clock className="size-4 opacity-80" aria-hidden="true" />
              <span>
                {firstHours.label}: {hoursText(firstHours)}
              </span>
            </li>
          ) : null}
          <li>
            <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-on-primary">
              <Mail className="size-4 opacity-80" aria-hidden="true" />
              {company.email}
            </a>
          </li>
        </ul>
        <ul className="flex items-center gap-6">
          {/* Default license only: no state context here, so per-state licenses are never shown. */}
          {license ? <li>License #{license}</li> : null}
          {emergency ? (
            <li>
              <a href={`tel:${emergency.tel}`} className="flex items-center gap-2 font-semibold text-on-primary hover:underline">
                <Siren className="size-4" aria-hidden="true" />
                24/7 Emergency: {emergency.display}
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
