import type { ReactNode } from "react";

/**
 * Remounts on every navigation, so the page content gets a quick CSS fade-in (see .page-enter
 * in globals.css). Server Component; no JS. Off with reduced motion or when brand motion is disabled.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
