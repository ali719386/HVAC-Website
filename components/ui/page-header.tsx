import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import type { ImageAsset } from "@/lib/brand/schema";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { BrandImage } from "./brand-image";

/**
 * Photo on the right that fades into the navy band. The left side stays solid navy so white text keeps
 * AA contrast at every width. Decorative only (the heading carries the meaning), so the layers are aria-hidden.
 */
function BlendedBackground({ image }: { image: ImageAsset }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[64%]">
        <BrandImage
          image={image}
          rounded={false}
          aspect=""
          className="size-full"
          imgClassName="object-[68%_center]"
          sizes="(min-width: 1024px) 64vw, 100vw"
          preload
        />
        {/* Navy wash: heavy on phones (text sits over the photo), lighter from lg where text sits left of it. */}
        <div className="absolute inset-0 bg-primary-dark/85 lg:bg-primary-dark/45" />
        <div className="absolute inset-0 hidden bg-linear-to-r from-primary-dark via-primary-dark/70 to-primary-dark/0 lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary-dark/70 to-transparent" />
      </div>
      {/* Subtle blue glow behind the subject. */}
      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_72%_45%,color-mix(in_srgb,var(--brand-primary)_45%,transparent),transparent_55%)] lg:block" />
      {/* The band's diagonal accent, kept as a thin translucent stripe where photo meets navy. */}
      <div className="absolute inset-y-0 left-[30%] hidden w-[14%] bg-primary opacity-25 [clip-path:polygon(70%_0,100%_0,30%_100%,0_100%)] lg:block" />
    </div>
  );
}

/** Inner-page hero band with breadcrumbs (visual + BreadcrumbList JSON-LD). */
export function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
  image,
  imageStyle = "panel",
  children,
}: {
  /** Optional image slot shown on the right on large screens. */
  image?: ImageAsset;
  /**
   * panel: photo in a diagonal panel on the right (large screens only).
   * blend: photo fades into the navy from the right under a navy overlay; faint on mobile.
   */
  imageStyle?: "panel" | "blend";
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
      {image && imageStyle === "blend" ? (
        <BlendedBackground image={image} />
      ) : image ? (
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
