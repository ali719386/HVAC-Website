import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PromoBar } from "@/components/layout/promo-bar";
import { StickyMobileCallBar } from "@/components/layout/sticky-call";
import { TopBar } from "@/components/layout/top-bar";
import { getBrand, getSiteUrl } from "@/lib/brand";
import { tokensToCss } from "@/lib/brand/tokens";
import { fontVars } from "@/lib/fonts";
import { getNav } from "@/lib/nav";

export function generateMetadata(): Metadata {
  const { config } = getBrand();
  const { seo, company } = config;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.description,
    applicationName: company.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: company.name,
      locale: seo.locale,
      title: seo.defaultTitle,
      description: seo.description,
      url: "/",
      images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630, alt: company.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.defaultTitle, description: seo.description },
    formatDetection: { telephone: false },
  };
}

export function generateViewport(): Viewport {
  return { themeColor: getBrand().config.tokens.colors.primary, width: "device-width", initialScale: 1 };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const brand = getBrand();
  const { config, content } = brand;
  const { fonts } = config.tokens;
  const nav = getNav(brand);
  const bookLabel = content.copy.hero.primaryCta;
  const fontClasses = [...new Set([fontVars[fonts.heading].className, fontVars[fonts.body].className])].join(" ");

  return (
    <html lang="en-US" className={fontClasses}>
      <head>
        {/* Brand design tokens. Values are validated by Zod (hex, enums, ints) before injection. */}
        <style id="brand-tokens" dangerouslySetInnerHTML={{ __html: tokensToCss(config.tokens) }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[60] rounded-btn bg-primary px-4 py-3 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <PromoBar promo={config.offerings.promoBar} />
        <TopBar config={config} />
        <Header config={config} nav={nav} bookLabel={bookLabel} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer brand={brand} nav={nav} />
        <StickyMobileCallBar phone={config.company.phone} bookLabel={bookLabel} />
      </body>
    </html>
  );
}
