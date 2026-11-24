import type { Metadata } from "next";
import { Suspense } from "react";
import { getBrand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { BookForm } from "@/components/forms/book-form";
import { LeadForm } from "@/components/forms/lead-form";
import { ContactCard } from "@/components/layout/contact-card";
import { PageHeader } from "@/components/ui/page-header";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: content.copy.book.title,
    description: `Request heating or cooling service from ${config.company.name}. ${content.copy.book.intro}`,
    path: "/book",
  });
}

export default function BookPage() {
  const { config, content } = getBrand();
  const c = content.copy.book;
  const formProps = {
    companyName: config.company.name,
    phone: config.company.phone,
    serviceOptions: content.services.map((s) => s.slug),
  };
  const issues = Object.fromEntries(content.symptoms.map((s) => [s.id, { service: s.service, message: s.message }]));
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} crumbs={[{ name: c.eyebrow, href: "/book" }]} />
      <div className="container-site section-y grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
        <Suspense fallback={<LeadForm {...formProps} />}>
          <BookForm {...formProps} issues={issues} />
        </Suspense>
        <aside aria-label="Contact details">
          <ContactCard config={config} className="lg:sticky lg:top-28" />
        </aside>
      </div>
    </>
  );
}
