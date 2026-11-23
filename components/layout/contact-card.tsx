import { Clock, Mail, MapPin, Phone, Siren } from "lucide-react";
import type { BrandConfig } from "@/lib/brand/schema";
import { TrustList } from "./trust-list";

/** Contact details panel used on Book and Contact pages and service sidebars. */
export function ContactCard({ config, className = "" }: { config: BrandConfig; className?: string }) {
  const { company, offerings } = config;
  const emergency = offerings.emergency24x7 ? (company.emergencyPhone ?? company.phone) : undefined;
  const row = "flex items-start gap-4";
  const ico = "grid size-11 shrink-0 place-items-center rounded-brand-sm bg-surface-alt text-primary";
  return (
    <div className={`rounded-brand border border-line bg-surface p-6 shadow-brand-sm sm:p-8 ${className}`}>
      <ul className="grid gap-6">
        <li className={row}>
          <span className={ico}>
            <Phone className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-muted">Call us</p>
            <a href={`tel:${company.phone.tel}`} className="font-heading text-xl font-extrabold text-primary">
              {company.phone.display}
            </a>
          </div>
        </li>
        {emergency ? (
          <li className={row}>
            <span className="grid size-11 shrink-0 place-items-center rounded-brand-sm bg-accent text-on-accent">
              <Siren className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-muted">24/7 emergency line</p>
              <a href={`tel:${emergency.tel}`} className="font-heading text-xl font-extrabold">
                {emergency.display}
              </a>
            </div>
          </li>
        ) : null}
        <li className={row}>
          <span className={ico}>
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-muted">Email</p>
            <a href={`mailto:${company.email}`} className="font-semibold break-all hover:text-primary">
              {company.email}
            </a>
          </div>
        </li>
        <li className={row}>
          <span className={ico}>
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-muted">Office</p>
            <address className="font-semibold not-italic">
              {company.address.street}
              <br />
              {company.address.city}, {company.address.state} {company.address.zip}
            </address>
          </div>
        </li>
        <li className={row}>
          <span className={ico}>
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-muted">Hours</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {company.hours.map((h) => (
                <div key={h.days} className="contents">
                  <dt className="font-semibold">{h.days}</dt>
                  <dd>{h.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </li>
      </ul>
      <TrustList company={company} className="mt-6 border-t border-line pt-6" />
    </div>
  );
}
