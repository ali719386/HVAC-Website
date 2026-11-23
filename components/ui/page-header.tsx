import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import type { ImageAsset } from "@/lib/brand/schema";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { BrandImage } from "./brand-image";

/** Inner-page hero band with breadcrumbs (visual + BreadcrumbList JSON-LD). */
export function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
  image,
  children,
}: {
  /** Optional image slot shown on the right on large screens. */
  image?: ImageAsset;
  title: string;
  intro?: string;
  eyebrow?: string;
  /** Trail after Home, e.g. [{ name: "Services", href: "/services" }] */
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...crumbs];
  return (
    <section className="relative overflow-hidden bg-primary-dark text-on-primary">
      <JsonLd data={breadcrumbLd(trail)} />
      {image ? (
        <div className="absolute inset-y-0 right-0 hidden w-[38%] [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:block">
          <BrandImage image={image} rounded={false} aspect="" className="size-full" sizes="38vw" />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-1/3 bg-primary opacity-60 [clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)] lg:block"
        />
      )}
      <div className="container-site relative py-14 lg:py-20">
        <Breadcrumbs items={trail} onDark />
        {eyebrow ? <p className="mt-6 text-sm font-bold tracking-[0.14em] text-on-primary/80 uppercase">{eyebrow}</p> : null}
        <h1 className={`${eyebrow ? "mt-2" : "mt-6"} max-w-3xl lg:max-w-[58%] text-4xl leading-tight font-extrabold sm:text-5xl`}>{title}</h1>
        {intro ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-primary/85">{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
