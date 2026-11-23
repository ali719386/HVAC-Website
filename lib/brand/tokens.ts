import type { Tokens } from "./schema";
import { fontVars } from "@/lib/fonts";

const buttonRadius: Record<Tokens["buttonStyle"], (r: number) => string> = {
  rounded: (r) => `${Math.min(r, 12)}px`,
  pill: () => "9999px",
  square: () => "2px",
};

const shadows: Record<Tokens["shadow"], { sm: string; md: string; lg: string }> = {
  none: { sm: "none", md: "none", lg: "none" },
  soft: {
    sm: "0 1px 2px rgb(15 23 42 / 0.06)",
    md: "0 6px 20px -6px rgb(15 23 42 / 0.12)",
    lg: "0 24px 48px -16px rgb(15 23 42 / 0.18)",
  },
  medium: {
    sm: "0 1px 3px rgb(15 23 42 / 0.12)",
    md: "0 10px 28px -8px rgb(15 23 42 / 0.22)",
    lg: "0 30px 60px -20px rgb(15 23 42 / 0.3)",
  },
};

const spacing: Record<Tokens["sectionSpacing"], string> = {
  compact: "clamp(3rem, 6vw, 4.5rem)",
  normal: "clamp(4rem, 8vw, 6.5rem)",
  relaxed: "clamp(5rem, 10vw, 8rem)",
};

/** Converts validated tokens to a :root CSS block. All values come from Zod-validated config. */
export function tokensToCss(t: Tokens): string {
  const c = t.colors;
  const s = shadows[t.shadow];
  const vars: Record<string, string> = {
    "--brand-primary": c.primary,
    "--brand-primary-dark": c.primaryDark,
    "--brand-on-primary": c.onPrimary,
    "--brand-accent": c.accent,
    "--brand-accent-dark": c.accentDark,
    "--brand-on-accent": c.onAccent,
    "--brand-surface": c.surface,
    "--brand-surface-alt": c.surfaceAlt,
    "--brand-surface-dark": c.surfaceDark,
    "--brand-text": c.text,
    "--brand-muted": c.muted,
    "--brand-border": c.border,
    "--brand-radius": `${t.radius}px`,
    "--brand-radius-sm": `${Math.round(t.radius * 0.6)}px`,
    "--brand-btn-radius": buttonRadius[t.buttonStyle](t.radius),
    "--brand-shadow-sm": s.sm,
    "--brand-shadow-md": s.md,
    "--brand-shadow-lg": s.lg,
    "--brand-container": `${t.containerWidth}px`,
    "--brand-section-y": spacing[t.sectionSpacing],
    "--brand-font-heading": `var(${fontVars[t.fonts.heading].cssVar})`,
    "--brand-font-body": `var(${fontVars[t.fonts.body].cssVar})`,
  };
  const body = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `:root{${body}}`;
}
