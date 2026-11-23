# White-label HVAC marketing site (Next.js)

## Role
Senior Next.js architect, full-stack engineer and UI designer. Build a premium, conversion-focused, white-label marketing website template for US HVAC companies. Minimal chatter. Ask questions only if blocked. Make sensible decisions and record assumptions in the README.

Priorities: 1) visual quality and conversion UX, 2) white-label architecture, 3) typed maintainable code, 4) security and correctness, 5) SEO and performance.

## Environment
- Work ONLY inside the current working directory (a project folder on the E: drive). Never create, modify or delete files outside it.
- The machine is Windows. Use cross-platform npm scripts and Node scripts only. No bash-only syntax, no inline `VAR=value cmd` env syntax. Brand selection goes in `.env.local` (NEXT_PUBLIC_BRAND).
- Keep file and folder names short and lowercase.

## Stack
Next.js (latest stable, App Router), TypeScript strict, Tailwind CSS, lucide-react, next/font, Zod, Resend.
- Server Components by default. "use client" only when required.
- Animations: CSS only (scroll-snap slider, CSS transitions, prefers-reduced-motion respected). No Framer Motion.
- No CMS, no database, no other UI libraries. Reuse installed dependencies before adding any.
- Avoid `any`, needless type assertions and duplicated code.

## Design direction
Recreate the layout and feel of the "Coolair Homepage Twelve" HVAC theme. Screenshots in /reference (if present) are the primary visual reference. Never copy theme assets or text.
Default look: deep blue primary, warm orange accent, white and light neutral surfaces, 12 to 16px radius, generous whitespace, strong type hierarchy, real HVAC contractor feel (not a SaaS landing page).
Homepage section order: PromoBar, TopBar, Header, Hero, BrandStrip, ServiceCards, WhyChooseUs, ExpertBlock with quote CTA, StatsCounter, TestimonialSlider, FaqAccordion, PostCards, CtaBand, Footer.
Avoid: excess gradients or glassmorphism, repetitive card grids, random decoration, inconsistent spacing. Design mobile first.

## White-label architecture (highest priority)
A new client is onboarded by adding a brand folder, never by editing shared components.
- `/lib/brand/schema.ts`: Zod schema and `BrandConfig` type.
- `/lib/brand/index.ts`: static brand registry plus a typed loader selected by `NEXT_PUBLIC_BRAND`. Fail with a descriptive error if the brand is missing or invalid. Only this layer selects brands; components receive data via typed props.
- `/brands/<slug>/config.ts` and `/brands/<slug>/content/` (services, whyChooseUs, testimonials, faqs, posts, projects, plans, cities).
- `/public/brands/<slug>/` for logos and images.
- `/content/` holds shared types and fallback defaults only. Brand content overrides defaults.
- Brands: `default` and `example-two` (different name, colors, fonts, contact info, areas, plans, content, so swapping can be verified).

BrandConfig contains:
- Company: name, tagline, logo paths, phone (display and tel), emergency phone, email, address, hours, socials, state license number, insured and bonded flags, certifications, Google rating (score, count, url), years in business, stats.
- Offerings: financing {enabled, provider, url, description}, maintenance plans, promo bar, service areas (city, state, ZIPs), supported HVAC brands (text only, no trademarked logos), emergency24x7 flag, rebates section (disabled by default).
- SEO: default title, description, OpenGraph, canonical site URL.
- Design tokens: primary, primaryDark, accent, surface colors, text, muted, border, heading font, body font, radius, shadows, container width, section spacing, button style.
- Image slots: hero, about, services, expert/team, projects, promo.
- Homepage: ordered section keys with enabled flags, seasonal hero variant (summer cooling or winter heating).

Rules:
- No hardcoded brand colors, names, phones or marketing copy in shared components.
- Root layout injects tokens as CSS variables. Tailwind colors, fonts and radius map to them.
- Font registry limited to 4 to 6 `next/font` fonts mapped to CSS variables. No arbitrary runtime font loading.
- Secrets only in server-side env vars.

## Content and images
- Mark all placeholder content with `placeholder: true` and a TODO. Never invent real business claims, ratings, licenses, certifications or testimonials.
- Add `npm run check:placeholders` (Node script) listing remaining placeholder content, TODOs and missing images.
- You cannot download or generate photos. Use neutral SVG or gradient placeholders via a safe `BrandImage` wrapper over `next/image`. Missing files must never break layout. Never hotlink or scrape.
- README lists exact image filenames and recommended sizes per slot in `/public/brands/<slug>/`.
- Hero image is priority, all others lazy. Responsive `sizes`, fixed aspect ratios, meaningful alt text.

## US HVAC requirements
- Click-to-call (`tel:`) in header, hero, emergency banner, sticky mobile call bar and footer.
- Trust items shown only if present in config: license number, insured/bonded, certifications, Google rating, years in business.
- 24/7 emergency banner only when `emergency24x7` is true.
- USD, imperial units, US phone format, state abbreviations.
- Financing and promos are config-driven. No invented terms, tax credits or rebate amounts.
- Service area checker: validate ZIP, check against configured ZIPs, clear supported/unsupported messages, no external API.
- Service-area city pages are generated only for cities with real location-specific content in config (intro, local notes). No thin duplicate pages.
- Privacy, Terms and SMS Consent are draft templates built from brand config. State in the README that they need legal review before production. Never claim legal compliance.

## Lead form and API (`/app/api/lead/route.ts`)
Fields: full name, phone, email, address or ZIP, service type (AC repair, AC installation, Heating, Maintenance, Commercial HVAC), urgency (Emergency, This week, Flexible), preferred time, message, optional SMS consent checkbox (unchecked by default, not required to submit, with clear TCPA-style wording, STOP/HELP language), honeypot.
Server side:
- Zod validation, phone normalization, size limit, honeypot check, correct HTTP status codes, safe error messages.
- Escape all user input in email HTML.
- Include in every delivery: consent boolean, consent text version, timestamp, page URL.
- Rate limiting: best-effort in-memory limiter, documented as unreliable on serverless. Optional Upstash Redis and optional Cloudflare Turnstile, each disabled if its env vars are unset.
- Resend email and webhook (HMAC-signed with secret) are independent. Report success only if at least one configured channel succeeds. If none is configured return 503. Exception: when NODE_ENV=development, log the lead to the server console and show a visible "DEV MODE, not delivered" notice.
Env vars: RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_TO_EMAIL, LEAD_WEBHOOK_URL, LEAD_WEBHOOK_SECRET, NEXT_PUBLIC_BRAND, NEXT_PUBLIC_SITE_URL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, TURNSTILE_SECRET_KEY, NEXT_PUBLIC_TURNSTILE_SITE_KEY.
Provide `.env.example` with all of these.

## SEO
- `generateMetadata` per page with unique title and description, `sitemap.ts`, `robots.ts`, canonical URLs, OpenGraph.
- JSON-LD from brand config only: LocalBusiness (HVAC subtype where applicable), Service on service pages, BreadcrumbList, `areaServed` on city pages.
- No FAQPage markup, no review or rating markup. Do not duplicate or contradict structured data.

## Accessibility and performance
- WCAG 2.1 AA practices: semantic HTML, keyboard-accessible nav, slider and accordion, visible focus, labeled form errors, heading order, contrast, reduced motion, never color alone.
- Minimal client JS, no layout shift, optimized images and fonts. Do not trade accessibility for speed.

## Testing (light, the owner tests manually)
- Do NOT install Playwright, Lighthouse or any test framework. Do not write test suites. Do not run the dev server to inspect pages.
- Only run `npm run build` and `npm run lint` after each phase and fix every error.
- Visual QA, Functional QA and Lighthouse are the owner's job. Report them as NOT RUN.

## Execution rules
1. Work phase by phase. Do not start the next phase while build or lint errors remain.
2. Commit to git after each passing phase (init git if missing).
3. No fake functionality, no dead buttons or links, no misleading success messages.
4. Do not overwrite working existing code unnecessarily.
5. If the stack cannot do something, state the limitation and propose the simplest compatible fix.

## Output format after each phase (no file contents in chat)
Phase: name
Files created/modified: list
Commands executed: list
Results: Build PASS/FAIL, Lint PASS/FAIL, Visual QA NOT RUN, Functional QA NOT RUN
Remaining issues: only real unresolved ones
Never claim a check passed unless it was executed.
