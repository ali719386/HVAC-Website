/** WCAG 2.1 contrast helpers used to validate brand color tokens at build time. */

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Text/background pairs that shared components actually use. Each must reach AA (4.5:1). */
export const requiredPairs = [
  ["text", "surface"],
  ["text", "surfaceAlt"],
  ["muted", "surface"],
  ["muted", "surfaceAlt"],
  ["onPrimary", "primary"],
  ["onPrimary", "primaryDark"],
  ["onPrimary", "surfaceDark"],
  ["onAccent", "accent"],
  ["onAccent", "accentDark"],
  ["primary", "surface"],
  ["accent", "surface"],
  ["accent", "surfaceAlt"],
  ["primary", "surfaceAlt"],
  ["accentDark", "surface"],
] as const;
