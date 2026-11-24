import { Clock, Mail, MapPin, Phone, Siren } from "lucide-react";
import type { BrandConfig, Copy } from "@/lib/brand/schema";
import { hoursText } from "@/lib/hours";
import { OpenNowBadge } from "@/components/contact/open-badge";
import { SocialIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { WhatsAppLink } from "./whatsapp";
import { TrustList } from "./trust-list";

const socialLabels = { facebook: "Facebook", instagram: "Instagram", youtube: "YouTube", linkedin: "LinkedIn", x: "X" } as const;

/** Contact details: phone, emergency line, email, office, hours with a live Open now badge, socials, trust chips. */
export function ContactCard({
  config,
  copy,
  badge,
  className = "",
}: {
  config: BrandConfig;
  copy: Copy["contactPage"]["info"];
  badge: { open: string; closed: string };
  className?: string;
}) {
  const { company, offerings } = config;
  const emergency = offerings.emergency24x7 ? (company.emergencyPhone ?? company.phone) : undefined;
  const row = "flex items-start gap-4";
  const ico = "grid size-11 shrink-0 place-items-center rounded-brand-sm bg-primary/8 text-primary";
  return (
    <div className={`rounded-brand border border-line bg-surface p-6 sm:p-8 ${className}`}>
      <h2 className="font-heading text-xl font-bold">{copy.title}</h2>
      <ul className="mt-6 grid gap-6">
        <li className={row}>
          <span className={ico}>
            <Phone className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-muted">{copy.phone}</p>
            <a href={`tel:${company.phone.tel}`} className="font-heading text-xl font-extrabold text-primary hover:underline">
              {company.phone.display}
            </a>
          </div>
        </li>
        {company.whatsapp ? (
          <li className={row}>
            <span className="grid size-11 shrink-0 place-items-center rounded-brand-sm bg-[#0d7468] text-white">
              <WhatsAppIcon className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted">WhatsApp</p>
              <WhatsAppLink config={company.whatsapp} source="contact_card" className="font-semibold text-[#0d7468] hover:underline">
                {company.whatsapp.label}
              </WhatsAppLink>
            </div>
          </li>
        ) : null}
        {emergency ? (
          <li className={row}>
            <span className="grid size-11 shrink-0 place-items-center rounded-brand-sm bg-accent text-on-accent">
              <Siren className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-muted">{copy.emergency}</p>
              <a href={`tel:${emergency.tel}`} className="font-heading text-xl font-extrabold hover:underline">
                {emergency.display}
              </a>
            </div>
          </li>
        ) : null}
        <li className={row}>
          <span className={ico}>
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-muted">{copy.email}</p>
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
            <p className="text-sm text-muted">{copy.office}</p>
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
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {copy.hours}
              <OpenNowBadge hours={company.hours} timeZone={company.timezone} labels={badge} />
            </p>
            <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {company.hours.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="font-semibold">{h.label}</dt>
                  <dd>{hoursText(h)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </li>
      </ul>
      {company.socials.length > 0 ? (
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-sm text-muted">{copy.follow}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {company.socials.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-line text-primary transition-colors hover:border-primary hover:bg-primary/8"
                >
                  <SocialIcon network={s.network} />
                  <span className="sr-only">{socialLabels[s.network]} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <TrustList company={company} variant="chips" className="mt-6 border-t border-line pt-6" />
    </div>
  );
}
