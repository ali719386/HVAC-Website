import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BrandConfig } from "@/lib/brand/schema";

export function PromoBar({ promo }: { promo: BrandConfig["offerings"]["promoBar"] }) {
  if (!promo.enabled || !promo.text) return null;
  return (
    <div className="bg-accent text-on-accent">
      <p className="container-site flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-sm font-medium">
        <span>{promo.text}</span>
        {promo.href && promo.linkLabel ? (
          <Link href={promo.href} className="inline-flex items-center gap-1 font-bold underline underline-offset-4">
            {promo.linkLabel}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </p>
    </div>
  );
}
