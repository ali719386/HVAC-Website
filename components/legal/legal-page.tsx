import { TriangleAlert } from "lucide-react";
import type { BrandConfig } from "@/lib/brand/schema";
import type { LegalDoc } from "@/lib/legal";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";

export function LegalPage({ doc, path, legal }: { doc: LegalDoc; path: string; legal: BrandConfig["legal"] }) {
  return (
    <>
      <PageHeader title={doc.title} crumbs={[{ name: doc.title, href: path }]} />
      <div className="container-site section-y">
        <article className="prose-site mx-auto max-w-3xl">
          {!legal.reviewed ? (
            <p role="note" className="mb-8 flex gap-3 rounded-brand-sm border border-accent-dark/40 bg-accent/8 p-4 text-sm">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
              <span>
                <strong>Draft template.</strong> This page has not yet been reviewed by an attorney and may not reflect current
                law or our final practices.
              </span>
            </p>
          ) : null}
          {legal.effectiveDate ? (
            <p className="text-sm text-muted">
              Effective date: <time dateTime={legal.effectiveDate}>{formatDate(legal.effectiveDate)}</time>
            </p>
          ) : null}
          <p className="text-lg">{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {s.list ? (
                <ul>
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
