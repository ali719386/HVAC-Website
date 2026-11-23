import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { name: string; href: string };

/** Visual breadcrumbs. The matching BreadcrumbList JSON-LD is emitted by PageHeader. */
export function Breadcrumbs({ items, onDark = false }: { items: Crumb[]; onDark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${onDark ? "text-on-primary/80" : "text-muted"}`}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={`font-semibold ${onDark ? "text-on-primary" : "text-ink"}`}>
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="hover:underline">
                    {c.name}
                  </Link>
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
