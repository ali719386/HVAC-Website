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
import { coverageCounts, coverageLabel } from "@/lib/geo/coverage";
import { businessLd, JsonLd } from "@/lib/seo/jsonld";
import { assetExists } from "@/components/ui/brand-image";

const REVEAL_BOOT =
  "(function(d){d.classList.add(\"js\");setTimeout(function(){if(!window.__revealReady)d.classList.add(\"reveal-off\")},3500)})(document.documentElement);";

export function generateMetadata(): Metadata {
  const { config } = getBrand();
  const { seo, company } = config;
  const { icon, appleIcon } = company.logo;
  return {
    icons: assetExists(icon)
      ? { icon: { url: icon, type: "image/png" }, apple: assetExists(appleIcon) ? appleIcon : undefined }
      : undefined,
    metadataBase: new URL(getSiteUrl()),
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.description,
    applicationName: company.name,
    openGraph: {
      type: "website",
      siteName: company.name,
      locale: seo.locale,
      title: seo.defaultTitle,
      description: seo.description,
      url: "/",
      images: assetExists(seo.ogImage) ? [{ url: seo.ogImage, width: 1200, height: 630, alt: company.name }] : undefined,
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
    <html
      lang="en-US"
      className={fontClasses}
      data-motion={config.tokens.motion.enabled ? "on" : "off"}
      // The inline script below adds "js" before hydration.
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks JS as available so reveal hidden-states can apply (content stays visible without JS).
          Fallback: if the reveal code never runs (script error/blocked), show everything after 3.5s.
        */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
        {/* Brand design tokens. Values are validated by Zod (hex, enums, ints) before injection. */}
        <style id="brand-tokens" dangerouslySetInnerHTML={{ __html: tokensToCss(config.tokens) }} />
        {/* In <head> directly: page metadata sets its own `alternates` (canonical), which would drop this. */}
        <link rel="alternate" type="application/rss+xml" title={`${config.company.name} blog`} href="/feed.xml" />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[60] rounded-btn bg-primary px-4 py-3 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <PromoBar promo={config.offerings.promoBar} />
        <TopBar config={config} coverageText={coverageLabel(content.copy.serviceAreas.topBar, coverageCounts())} />
        <Header config={config} nav={nav} bookLabel={bookLabel} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer brand={brand} />
        <JsonLd data={businessLd(brand)} />
        <StickyMobileCallBar phone={config.company.phone} bookLabel={bookLabel} />
      </body>
    </html>
  );
}
