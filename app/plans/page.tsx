import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { PageHeader } from "@/components/ui/page-header";
import { PlanCards } from "@/components/plans/plan-cards";
import { CtaBand, FaqAccordion } from "@/components/home/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: content.copy.plans.title,
    description: `HVAC maintenance plans from ${config.company.name}: ${content.plans.map((p) => p.name).join(", ")}.`,
    path: "/plans",
  });
}

export default function PlansPage() {
  const { config, content } = getBrand();
  if (content.plans.length === 0) notFound();
  const c = content.copy.plans;
  return (
    <>
      <PageHeader image={config.images.promo} eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Plans", href: "/plans" }]} />
      <div className="container-site section-y">
        <div className="flex justify-center pt-4">
          <PlanCards plans={content.plans} />
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
          Plan details, pricing and terms are confirmed in writing when you enroll.
        </p>
      </div>
      <FaqAccordion faqs={content.faqs} copy={content.copy.faq} phone={config.company.phone} />
      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
