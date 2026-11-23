import { Clock, Mail, MapPin, Siren } from "lucide-react";
import type { BrandConfig } from "@/lib/brand/schema";

export function TopBar({ config }: { config: BrandConfig }) {
  const { company, offerings } = config;
  const firstHours = company.hours[0];
  const emergency = offerings.emergency24x7 ? (company.emergencyPhone ?? company.phone) : undefined;
  return (
    <div className="hidden bg-primary-dark text-sm text-on-primary/90 lg:block">
      <div className="container-site flex h-11 items-center justify-between gap-6">
        <ul className="flex items-center gap-6">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 opacity-80" aria-hidden="true" />
            <span>
              {company.address.city}, {company.address.state}
            </span>
          </li>
          {firstHours ? (
            <li className="flex items-center gap-2">
              <Clock className="size-4 opacity-80" aria-hidden="true" />
              <span>
                {firstHours.days}: {firstHours.hours}
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
          {company.licenseNumber ? <li>License #{company.licenseNumber}</li> : null}
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
