import { Fragment, type ReactNode } from "react";
import { CircleAlert, Info, Quote } from "lucide-react";
import type { PostBlock } from "@/lib/brand/schema";
import { headingIds } from "@/lib/blog";
import { BrandImage } from "@/components/ui/brand-image";

/**
 * Renders typed body blocks. Headings get stable ids (for the table of contents).
 * `afterSecondHeading` is inserted right after the section that follows the second heading starts,
 * i.e. just before the third heading (or at the end when there are fewer).
 */
export function ArticleBody({ blocks, afterSecondHeading }: { blocks: PostBlock[]; afterSecondHeading?: ReactNode }) {
  const ids = headingIds(blocks);
  const headingIdx = blocks.flatMap((b, i) => (b.type === "heading" ? [i] : []));
  // Insert before the third heading, so the mid CTA closes the second section.
  const insertAt = headingIdx[2] ?? (headingIdx.length >= 2 ? blocks.length : -1);

  return (
    <div className="prose-site text-lg">
      {blocks.map((b, i) => (
        <Fragment key={i}>
          {i === insertAt && afterSecondHeading ? <div className="not-prose my-10">{afterSecondHeading}</div> : null}
          <Block block={b} id={ids.get(i)} />
        </Fragment>
      ))}
      {insertAt === blocks.length && afterSecondHeading ? <div className="not-prose my-10">{afterSecondHeading}</div> : null}
    </div>
  );
}

function Block({ block: b, id }: { block: PostBlock; id?: string }) {
  switch (b.type) {
    case "heading":
      return b.level === 3 ? (
        <h3 id={id} className="scroll-mt-28">
          {b.text}
        </h3>
      ) : (
        <h2 id={id} className="scroll-mt-28">
          {b.text}
        </h2>
      );
    case "paragraph":
      return <p>{b.text}</p>;
    case "list":
      return b.ordered ? (
        <ol className="mb-4 list-decimal pl-5">
          {b.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {b.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
    case "callout": {
      const warn = b.tone === "warning";
      const I = warn ? CircleAlert : Info;
      return (
        <aside className={`not-prose my-6 flex gap-3 rounded-brand border p-5 ${warn ? "border-accent/40 bg-accent/8" : "border-primary/25 bg-primary/5"}`}>
          <I className={`mt-1 size-5 shrink-0 ${warn ? "text-accent-dark" : "text-primary"}`} aria-hidden="true" />
          <div className="text-base leading-relaxed">
            {b.title ? <p className="mb-1 font-heading font-bold">{b.title}</p> : null}
            <p className="mb-0">{b.text}</p>
          </div>
        </aside>
      );
    }
    case "image":
      return (
        <figure className="not-prose my-8">
          <BrandImage image={b.image} sizes="(min-width: 1024px) 720px, 100vw" aspect="aspect-[16/9]" />
          {b.caption ? <figcaption className="mt-2 text-sm text-muted">{b.caption}</figcaption> : null}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="not-prose my-8 border-l-4 border-primary pl-5">
          <Quote className="mb-2 size-6 text-primary/40" aria-hidden="true" />
          <p className="font-heading text-xl leading-snug">{b.text}</p>
          {b.cite ? <footer className="mt-2 text-sm text-muted">{b.cite}</footer> : null}
        </blockquote>
      );
  }
}
