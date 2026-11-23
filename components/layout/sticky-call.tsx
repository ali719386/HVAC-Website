import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import type { Phone as PhoneT } from "@/lib/brand/schema";

/** Fixed bottom bar on small screens: call + book. Footer reserves space for it. */
export function StickyMobileCallBar({ phone, bookLabel }: { phone: PhoneT; bookLabel: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-brand-lg md:hidden">
      <div className="grid grid-cols-2 gap-2">
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
