# Progress

Resume rule: after a restart, read CLAUDE.md and this file, then continue from the next incomplete phase.

## Plan
1. Next 16 App Router + TS 5.9 strict + Tailwind 4 (CSS-first `@theme` mapped to brand CSS variables), ESLint 9 flat config.
2. `lib/brand/schema.ts` (Zod) + `lib/brand/index.ts` (static registry, loader via NEXT_PUBLIC_BRAND, descriptive errors).
3. `brands/default` and `brands/example-two` with config + content folders; `content/` holds shared types and defaults.
4. Root layout injects tokens as CSS variables; `lib/fonts.ts` registers 6 next/font fonts as CSS vars.
5. Shared layout chrome: PromoBar, TopBar, Header (keyboard nav, mobile menu), Footer, StickyMobileCallBar, BrandImage (SVG fallback).
6. Homepage section registry (`components/home/registry.tsx`) driven by `homepage.sections` order + enabled flags.
7. Phase 2: inner pages + dynamic routes from typed brand content, LeadForm UI, Breadcrumbs, PlanCards.
8. Phase 3: `/api/lead` (Zod, honeypot, size limit, rate limit, Upstash/Turnstile optional, Resend + HMAC webhook, dev fallback, 503).
9. Phase 4: metadata/sitemap/robots/JSON-LD + a11y pass. Phase 5: white-label grep, dual-brand builds, README.
10. Only `npm run build` + `npm run lint` per phase; commit after each passing phase.

## Phases
| Phase | Status | Commit | Remaining issues |
|---|---|---|---|
| 1 Foundation + homepage | in progress | - | - |
| 2 Inner pages | pending | - | - |
| 3 Lead backend | pending | - | - |
| 4 SEO + a11y | pending | - | - |
| 5 White-label verify + README | pending | - | - |

Next step: Phase 1.
