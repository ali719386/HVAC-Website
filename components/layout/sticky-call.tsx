import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import type { Phone as PhoneT } from "@/lib/brand/schema";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { WhatsAppLink, type WhatsAppConfig } from "./whatsapp";

/** Fixed bottom bar on small screens: call, WhatsApp (when configured) and book. Footer reserves space for it. */
export function StickyMobileCallBar({ phone, bookLabel, whatsapp }: { phone: PhoneT; bookLabel: string; whatsapp?: WhatsAppConfig }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-brand-lg md:hidden">
      <div className={`grid gap-2 ${whatsapp ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-2"}`}>
        <a
          href={`tel:${phone.tel}`}
          className="flex h-12 items-center justify-center gap-2 rounded-btn bg-primary text-sm font-bold text-on-primary"
        >
          <Phone className="size-4" aria-hidden="true" />
          <span>
            Call <span className="sr-only">{phone.display}</span>
            <span aria-hidden="true">now</span>
          </span>
        </a>
        {whatsapp ? (
          <WhatsAppLink
            config={whatsapp}
            source="mobile_bar"
            className="grid h-12 w-12 place-items-center rounded-btn bg-[#0d7468] text-white"
          >
            <WhatsAppIcon className="size-6" />
            <span className="sr-only">{whatsapp.label}</span>
          </WhatsAppLink>
        ) : null}
        <Link
          href="/book"
          className="flex h-12 items-center justify-center gap-2 rounded-btn bg-accent text-sm font-bold text-on-accent"
        >
          <CalendarCheck className="size-4" aria-hidden="true" />
          {bookLabel}
        </Link>
      </div>
    </div>
  );
}
