import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { assetExists } from "@/components/ui/brand-image";

/**
 * Per-page metadata with a canonical URL and OpenGraph. `title` is run through the
 * brand's titleTemplate (set in the root layout). metadataBase makes paths absolute.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const { config } = getBrand();
  // Only reference files that exist, so social previews never point at a 404.
  const ogImage = [image, config.seo.ogImage].find((src) => assetExists(src));
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: config.company.name,
      locale: config.seo.locale,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
