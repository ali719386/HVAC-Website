import { Barlow, DM_Sans, Inter, Manrope, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import type { FontKey } from "@/lib/brand/schema";

/*
 * Font registry: the only fonts a brand can select (tokens.fonts.heading/body).
 * Downloaded at build time and self-hosted by next/font. Only the two selected
 * font classes are attached to <html>, so browsers download only those files.
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap" });
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const fontVars: Record<FontKey, { className: string; cssVar: string }> = {
  inter: { className: inter.variable, cssVar: "--font-inter" },
  manrope: { className: manrope.variable, cssVar: "--font-manrope" },
  outfit: { className: outfit.variable, cssVar: "--font-outfit" },
  dmSans: { className: dmSans.variable, cssVar: "--font-dm-sans" },
  plusJakarta: { className: plusJakarta.variable, cssVar: "--font-plus-jakarta" },
  barlow: { className: barlow.variable, cssVar: "--font-barlow" },
};
