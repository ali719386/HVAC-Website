import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getBrand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { buttonClass, CallButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { CtaBand } from "@/components/home/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: content.copy.financing.title,
    description: `Financing options for HVAC installations from ${config.company.name}. Subject to credit approval.`,
    path: "/financing",
    noindex: !config.offerings.financing.enabled,
  });
}

export default function FinancingPage() {
  const { config, content } = getBrand();
  const f = config.offerings.financing;
  if (!f.enabled) notFound();
  const c = content.copy.financing;
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Financing", href: "/financing" }]} />
      <div className="container-site section-y">
        <div className="mx-auto max-w-3xl">
          {f.description ? <p className="text-xl leading-relaxed">{f.description}</p> : null}
          {f.provider ? (
            <p className="mt-6 text-muted">
              Financing is offered through <strong className="text-ink">{f.provider}</strong>, a third-party lender.
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {f.url ? (
              <a href={f.url} target="_blank" rel="noopener noreferrer" className={buttonClass("accent", "lg")}>
                Apply with {f.provider || "our lender"}
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
            <CallButton phone={config.company.phone} variant={f.url ? "outline" : "accent"} size="lg" label="Ask about financing" />
          </div>
          <p className="mt-10 rounded-brand-sm border border-line bg-surface-alt p-5 text-sm leading-relaxed text-muted">
            All financing is subject to credit approval by the lender. Rates, terms and eligibility are set by the lender and may
            change. {config.company.name} does not make credit decisions. Ask the lender for complete terms before applying.
          </p>
        </div>
      </div>
      <CtaBand config={config} copy={content.copy.ctaBand} />
    </>
  );
}
