import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import type { ImageAsset, Phone } from "@/lib/brand/schema";
import { CallButton, LinkButton } from "./button";
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
  compact = false,
  stats,
  ctas,
  children,
}: {
  /** Optional stats row (render only real values). */
  stats?: { value: string; label: string }[];
  /** Optional primary link button and click-to-call button. */
  ctas?: { primary?: { label: string; href: string }; call?: { label: string; phone: Phone } };
  /** Tighter vertical padding (about 400px tall on desktop with CTAs and chips). */
  compact?: boolean;
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
      {/* Desktop height about 380 to 440px: a minimum height, with content vertically centered. */}
      <div className={`container-site relative flex flex-col justify-center lg:min-h-[23.75rem] ${compact ? "py-12" : "py-14 lg:py-16"}`}>
        <Breadcrumbs items={trail} onDark />
        {eyebrow ? <p className={`${compact ? "mt-5" : "mt-6"} text-sm font-bold tracking-[0.14em] text-on-primary/80 uppercase`}>{eyebrow}</p> : null}
        <h1 className={`${eyebrow ? "mt-2" : "mt-6"} max-w-3xl lg:max-w-[58%] text-4xl leading-tight font-extrabold sm:text-5xl`}>{title}</h1>
        {intro ? <p className="mt-4 max-w-[40rem] text-lg leading-relaxed text-balance text-on-primary/85">{intro}</p> : null}
        {ctas?.primary || ctas?.call ? (
          <div className={`${compact ? "mt-7" : "mt-8"} flex flex-col gap-3 sm:flex-row`}>
            {ctas.primary ? (
              <LinkButton href={ctas.primary.href} variant="accent" size="lg">
                {ctas.primary.label}
              </LinkButton>
            ) : null}
            {ctas.call ? (
              <CallButton
                phone={ctas.call.phone}
                variant="ghost"
                size="lg"
                label={
                  <span>
                    {ctas.call.label}
                    <span className="sr-only"> {ctas.call.phone.display}</span>
                  </span>
                }
              />
            ) : null}
          </div>
        ) : null}
        {stats && stats.length > 0 ? (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-last text-sm text-on-primary/75">{s.label}</dt>
                <dd className="font-heading text-3xl font-extrabold">{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {children ? <div className={compact ? "mt-6" : "mt-8"}>{children}</div> : null}
      </div>
    </section>
  );
}

/** Shared inner-page hero (alias used by newer pages). */
export const PageHero = PageHeader;
