import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { useId, type ReactNode } from "react";
import { Reveal, type RevealVariant } from "@/components/motion/reveal";
import type { ImageAsset } from "@/lib/brand/schema";

const publicDir = path.join(process.cwd(), "public");
const cache = new Map<string, boolean>();

/** Server-side check so a missing file renders a placeholder instead of a broken image. */
export function assetExists(src: string | undefined): src is string {
  if (!src || !src.startsWith("/brands/") || src.includes("..")) return false;
  // In development, always re-check so images added while `npm run dev` is running appear on refresh.
  if (process.env.NODE_ENV === "development") return existsSync(path.join(publicDir, ...src.split("/")));
  let hit = cache.get(src);
  if (hit === undefined) {
    hit = existsSync(path.join(publicDir, ...src.split("/")));
    cache.set(src, hit);
  }
  return hit;
}

/**
 * Safe wrapper over next/image. Always renders inside a fixed aspect-ratio box (no layout shift).
 * When the file is missing it renders a neutral, token-colored SVG placeholder with the same box.
 */
export function BrandImage({
  image,
  sizes,
  aspect = "aspect-[4/3]",
  className = "",
  imgClassName = "",
  preload = false,
  rounded = true,
  reveal,
}: {
  /** Scroll reveal for the image box, e.g. "mask-up" (clip-path wipe + inner image scale). Never use on the hero. */
  reveal?: RevealVariant;
  image: ImageAsset;
  sizes: string;
  /** Tailwind aspect class. Use "" when the parent sets the size (e.g. absolute inset-0). */
  aspect?: string;
  className?: string;
  imgClassName?: string;
  /** Only the hero image should preload. Everything else lazy-loads. */
  preload?: boolean;
  rounded?: boolean;
}) {
  const uid = useId().replace(/[^\w-]/g, "");
  const box = `relative overflow-hidden ${aspect} ${rounded ? "rounded-brand" : ""} ${className}`;
  const wrap = (children: ReactNode, extra = "", label?: string) =>
    reveal ? (
      <Reveal variant={reveal} className={`${box} ${extra}`} role={label ? "img" : undefined} aria-label={label}>
        {children}
      </Reveal>
    ) : (
      <div className={`${box} ${extra}`} role={label ? "img" : undefined} aria-label={label}>
        {children}
      </div>
    );

  if (assetExists(image.src)) {
    return wrap(
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          loading={preload ? undefined : "lazy"}
          className={`object-cover ${imgClassName}`}
        />,
    );
  }

  return wrap(
    <>
      <svg className="absolute inset-0 size-full" aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--brand-primary)" stopOpacity="0.14" />
            <stop offset="1" stopColor="var(--brand-primary)" stopOpacity="0.04" />
          </linearGradient>
          <pattern id={`p${uid}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M0 28 L28 0" stroke="var(--brand-primary)" strokeOpacity="0.07" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g${uid})`} />
        <rect width="100%" height="100%" fill={`url(#p${uid})`} />
      </svg>
      {/* Development only: show which file to add. Production keeps just the neutral gradient. */}
      {process.env.NODE_ENV === "development" ? (
        <div className="absolute inset-0 grid place-items-center p-4 text-center">
          <div className="flex flex-col items-center gap-2 text-primary/50">
            <svg viewBox="0 0 24 24" className="size-10" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="9" cy="10" r="2" />
              <path d="m21 16-5-5-9 9" />
            </svg>
            <span className="max-w-[16rem] text-xs font-medium break-all text-primary/70">Add image: public{image.src}</span>
          </div>
        </div>
      ) : null}
    </>,
    "bg-surface-alt",
    image.alt,
  );
}
