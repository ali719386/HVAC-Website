import "react";

declare module "react" {
  /** Allow CSS custom properties (e.g. "--reveal-delay") in style objects without casts. */
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
