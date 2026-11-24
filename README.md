# White-label HVAC marketing site

A conversion-focused marketing website template for US heating and cooling contractors. One codebase serves any number of client brands. You onboard a new client by adding a brand folder. You never need to edit shared components.

**Stack:** Next.js 16 (App Router), TypeScript (strict), Tailwind CSS 4, lucide-react, next/font, Zod, Resend. There is no CMS and no database.

> **Status:** every client fact in this repo is placeholder content. Run `npm run check:placeholders` to see what still needs replacing before launch.

---

## 1. Run it locally (Windows)

Requires Node.js 20.9 or newer.

```powershell
npm install
copy .env.example .env.local     # then edit .env.local; NEXT_PUBLIC_BRAND=default
npm run dev                      # http://localhost:3000
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Production build. Brand config is validated here, so a bad config fails the build with a readable error. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules). |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run check:placeholders` | Lists placeholder content, TODOs and missing images per brand. Use `-- default` for one brand, or `-- --strict` to exit 1 if anything remains (useful in CI). |

## 2. Architecture

```
app/                     Routes (Server Components by default)
  api/lead/route.ts      Lead endpoint (validation, rate limit, delivery)
  sitemap.ts robots.ts   Generated from the active brand
brands/<slug>/
  config.ts              BrandConfig: company, offerings, SEO, tokens, images, homepage
  content/               services, why, testimonials, faqs, posts, projects, plans, cities, copy
  index.ts               Exports { config, content }
content/
  types.ts               Shared content types (input shapes)
  defaults.ts            Brand-neutral fallback copy, used when a brand omits a section
lib/brand/
  schema.ts              Zod schema + BrandConfig type (single source of truth)
  index.ts               Static registry + loader (selects brand by NEXT_PUBLIC_BRAND)
  tokens.ts              Design tokens -> CSS variables
  contrast.ts            WCAG AA contrast check applied to brand colors at build time
lib/fonts.ts             Font registry (6 next/font fonts)
lib/lead/                Lead constants, shared zod/mini schema, server delivery code
lib/seo/                 Per-page metadata helper and JSON-LD builders
lib/legal.ts             Draft Privacy / Terms / SMS templates built from brand config
components/              Shared UI. Receives data only through typed props.
public/brands/<slug>/images/   ALL images for the brand, one flat folder (originals/ = raw uploads, git-ignored)
scripts/check-placeholders.mjs
```

How it fits together:

- `lib/brand/index.ts` is the **only** module that selects a brand. It reads `NEXT_PUBLIC_BRAND`, merges the brand's copy over `content/defaults.ts`, validates everything with Zod, and resolves image paths to `/brands/<slug>/...`. A missing or unknown brand, a schema error, or a slug mismatch stops the build with a descriptive message.
- `app/layout.tsx` injects the brand tokens as `--brand-*` CSS variables. `app/globals.css` maps Tailwind utilities onto them (`bg-primary`, `text-accent`, `rounded-brand`, `font-heading`, `shadow-brand-md`, and so on). Shared components never contain hex colors, names, phones or marketing copy.
- Pages are statically generated. Dynamic routes use `generateStaticParams` from typed brand content, with `dynamicParams = false`.

## 3. Add a new brand in 5 steps

1. **Copy a brand folder.** Duplicate `brands/default` to `brands/acme-air`. Use a lowercase-hyphen slug.
2. **Edit `config.ts`.** Set `slug: "acme-air"` (it must match the folder name), then company info, offerings, SEO, tokens, image alt text and homepage sections. Remove TODO comments as you verify each value.
3. **Edit `content/*.ts`.** Add services, FAQs, coverage (states and cities, see "Add or remove coverage"), plans, posts, projects, real testimonials and copy overrides. Set `placeholder: true` only on content that is not final.
4. **Register the brand.** In `lib/brand/index.ts`, add `import acmeAir from "@/brands/acme-air";` and `"acme-air": acmeAir,` to the `registry` object. This is the only shared file you touch.
5. **Add assets and build.** Put images in `public/brands/acme-air/images/` (see section 5), set `NEXT_PUBLIC_BRAND=acme-air` in `.env.local`, then run `npm run check:placeholders -- acme-air` and `npm run build`.

## 4. Design tokens (`config.tokens`)

| Token | Purpose |
|---|---|
| `colors.primary` / `primaryDark` | Brand blue (headers, hero, buttons). Dark variant for hero and top bar backgrounds. |
| `colors.onPrimary` | Text on primary backgrounds. |
| `colors.accent` / `accentDark` / `onAccent` | CTA color, its hover state, and the text on it. |
| `colors.surface` / `surfaceAlt` / `surfaceDark` | Page background, alternate section background, footer. |
| `colors.text` / `muted` / `border` | Body text, secondary text, dividers. |
| `fonts.heading` / `fonts.body` | One of `inter`, `manrope`, `outfit`, `dmSans`, `plusJakarta`, `barlow` (registered in `lib/fonts.ts`). |
| `radius` | Card radius in px (template default is 14). |
| `buttonStyle` | `rounded`, `pill` or `square`. |
| `shadow` | `none`, `soft` or `medium`. |
| `containerWidth` | Max content width in px (960 to 1600). |
| `sectionSpacing` | `compact`, `normal` or `relaxed` vertical rhythm. |

**Motion** (`tokens.motion`): `{ enabled, durationMs, distancePx, staggerMs }`, exposed as `--motion-duration`, `--motion-distance` and `--motion-stagger`. Scroll reveals use `components/motion/reveal.tsx` (`Reveal`, `RevealGroup`) with one shared IntersectionObserver. They are CSS-only transitions of opacity, transform and clip-path. Hidden states apply only after the inline script adds `html.js`, so content stays visible without JS, and a 3.5 s fallback shows everything if the reveal code never runs. `prefers-reduced-motion` shows everything immediately. The hero image never animates. Set `enabled: false` to turn all motion off.

**Contrast is enforced.** The build fails if any text/background pair the components use is below WCAG AA (4.5:1). Examples are `onAccent` on `accent` and `muted` on `surfaceAlt`. The full list is in `lib/brand/contrast.ts`.

**Adding a font:** add a `next/font/google` import in `lib/fonts.ts`, add its key to `fontKeys` in `lib/brand/schema.ts`, and keep the registry at 4 to 6 fonts. Runtime font loading is intentionally not supported.

## 5. Logos and images

**All images for a brand live in one folder: `public/brands/<slug>/images/`.** No subfolders; names use a prefix (`service-`, `post-`, `project-`, `review-`, `logo-`) so the folder stays easy to scan. In config and content, write just the file name (e.g. `src: "service-heating-furnace.jpg"`). Raw, unedited uploads can go in `images/originals/`, which is git-ignored so it is never deployed. Put the files in that folder using **exactly** these names. JPG is shown below, but any `.jpg/.jpeg/.png/.webp/.avif` works if you update the `src` in config. Missing files never break the layout: a neutral, token-colored placeholder renders in the same box. In `npm run dev` the placeholder shows the expected path.

| File | Used for | Recommended size (px) | Aspect |
|---|---|---|---|
| `logo.svg` or `logo.png` | Header logo (light background) | SVG, or transparent PNG ~900 x 233 | wide (~3.9:1) |
| `logo-dark.svg` or `logo-dark.png` | Footer logo (dark background) | SVG, or transparent PNG ~900 x 233 | wide (~3.9:1) |
| `icon.png` | Browser tab icon (favicon), emblem only | transparent PNG, 512 x 512 | 1:1 |
| `apple-icon.png` | iOS home-screen icon | PNG on solid background, 180 x 180 | 1:1 |
| `og.jpg` | Social share image (OpenGraph/Twitter) | 1200 x 630 | 1.91:1 |
| `hero.jpg` | Homepage hero (preloaded) | 1400 x 1450 | ~1:1 (4:3 on mobile) |
| `about.jpg` | Why Choose Us block, About page "Our mission" (technician with homeowner) | 1200 x 1020 | ~4:3.4 |
| `images.aboutHero` (optional) | About page header background. Subject on the right; the left side is covered by navy | 1600 x 900 or larger | 16:9 |
| `images.aboutStory` (optional) | About page "Our story" photo, e.g. technician at an indoor unit. Falls back to `about` | 1100 x 1375 | 4:5 (4:3 on mobile) |
| `images.aboutStoryInset` (optional) | Smaller photo overlapping the story photo (tablet and desktop) | 600 x 450 | 4:3 |
| `images.aboutMission` (optional) | About page "Our mission" photo (technician with homeowner). Falls back to `about` | 1200 x 900 or larger | 4:3 |
| `copy.about.services.items[].image` (optional) | About page service card photo, overrides the service's own image on that page only | 1200 x 675 or larger | 16:9 |
| `images.aboutCta` (optional) | About page final CTA background, e.g. home exterior. Left side is covered by a dark overlay for text | 1920 x 1080 | 16:9 |
| `expert.jpg` | Expert / quote block | 1100 x 1000 | ~1:1 |
| `services.jpg` | /services page header | 1000 x 800 | tall crop |
| `projects.jpg` | /projects page header | 1000 x 800 | tall crop |
| `promo.jpg` | /plans and /financing page headers | 1000 x 800 | tall crop |
| `service-<name>.jpg` | Service cards and service pages (`ac-repair`, `ac-installation`, `heating`, `maintenance`, `commercial`) | 1600 x 900 | 16:9 |
| `post-<name>.jpg` | Blog cards and article header | 1600 x 900 | 16:9 |
| `project-<name>.jpg` | Project gallery | 1600 x 1000 | 16:10 |
| `review-<name>.jpg` (optional, set `background` on a testimonial) | Review card background. Keep the left ~55% plain (wall/sky) so the quote stays readable; subject on the right. | 1200 x 900 | 4:3 |

Until a logo file exists, a wordmark (initial plus company name) is shown. `npm run check:placeholders` lists every missing file by name. Use photos you own or have licensed. Never hotlink. Write meaningful `alt` text in config.

Supported equipment brands (`offerings.supportedBrands`) appear in the brand strip under the hero as `{ name, logo? }`. Put official logo files at the configured path, e.g. `public/brands/default/images/logo-carrier.png` (SVG or a transparent PNG, ~400 x 160). A text wordmark shows until the file exists. Use only official logo files the client has permission to display (e.g. from the manufacturer dealer portal). A trademark disclaimer is shown under the strip.

## 6. Editing content

| What | Where |
|---|---|
| Company info, phone, hours, license, credentials | `brands/<slug>/config.ts` -> `company` |
| Promo bar, financing, 24/7 flag, rebates, equipment brands | `config.offerings` |
| Section headings and marketing copy | `brands/<slug>/content/copy.ts` (any key in `content/defaults.ts` can be overridden per section) |
| Services (pages are generated from this) | `content/services.ts`. `category` (cooling / heating / maintenance) and `audience` (residential / commercial) drive the `/services` filters; `emergency: true` shows a 24/7 badge only when `offerings.emergency24x7` is also true; `startingAt` (USD) is optional and must come from the client's real price list. |
| `/services` problem picker | `content/symptoms.ts`. `action: "service"` links to `/services/<service>`; `action: "book"` links to `/book?issue=<id>`, which prefills the service and message. |
| `/services` process steps | `content/process.ts` (4 to 5 steps). Also used on `/projects`. |
| Projects (`/projects` and `/projects/<slug>`) | `content/projects.ts`: slug, title, city, state, category (`ac-installation`, `heating`, `repair`, `maintenance`, `commercial`), systemType, buildingType, buildingSize, completedYear, duration, summary, overview, challenge, solution, equipment, timeline, results, featured, cover, gallery, before, after, videoUrl, testimonialId. Only real jobs with customer permission. `results` must be real, measured numbers (the block is hidden when empty). Gallery, before/after and video sections show only when their files or URL exist. `videoUrl` is an https embed URL, loaded only after the visitor clicks play. |
| Projects FAQ | `content/project-faqs.ts` (timeline, permits, warranty, financing). No FAQPage markup. |
| Project hero stats | `company.projectsCompleted`, `company.homesServed`, `company.yearsInBusiness`. Each is hidden while undefined. |
| States, cities, ZIPs and area pages | `content/cities.ts` (imported into `config.coverage`). See "Add or remove coverage" below. |
| Plans | `content/plans.ts`. Omit `priceUsd` to show "Call for pricing". |
| Blog posts, projects, FAQs, testimonials, why-choose-us | matching files in `content/` |

**Trust items appear only when set.** These are `licenses` (per state, shown only on that state's pages), `licenseNumber` (default, shown on pages without a state), `insured`, `bonded`, `certifications`, `googleRating`, `yearsInBusiness`, and `foundedYear` (JSON-LD). All are empty in the examples. Do not fill them in unless they are verified.

**Testimonials** marked `placeholder: true` show a visible "Sample" tag. Publishing invented reviews is illegal under the FTC rule on fake reviews, so replace them with real reviews you have permission to use.

## 7. Homepage sections

`config.homepage.sections` is an ordered list of `{ key, enabled }`. Reorder entries to reorder the page, and set `enabled: false` to hide a section. Each key may appear once.

| Key | Section |
|---|---|
| `hero` | Hero with seasonal copy (`homepage.heroVariant`: `summer` or `winter`) and click-to-call |
| `emergency` | 24/7 emergency banner (renders only when `offerings.emergency24x7` is true) |
| `brandStrip` | Supported equipment brands (text) |
| `services` | Service cards |
| `whyChooseUs` | Reasons + trust items |
| `expert` | Expert block with quote CTA |
| `stats` | Stats counter (`company.stats`) |
| `testimonials` | Scroll-snap testimonial slider |
| `plans` | Maintenance plan cards |
| `financing` | Financing teaser (only when financing is enabled) |
| `serviceArea` | Primary cities and the area checker |
| `serviceAreas` | Climate tabs (Cooling, Heating, Mixed) with city chips, the area checker and a CTA |
| `rebates` | Rebates block (disabled by default; never invent amounts) |
| `faq` | FAQ accordion (no FAQPage markup) |
| `posts` | Latest blog posts |
| `ctaBand` | Closing CTA band |

PromoBar, TopBar, Header, Footer and the sticky mobile call bar are site chrome. They are not homepage sections. The promo bar is controlled by `offerings.promoBar.enabled`.

To add a new section type, add its key to `sectionKeys` in `lib/brand/schema.ts` and a renderer in `components/home/registry.tsx`.

### Services page sections

`config.servicesPage.sections` works the same way for `/services` (omit it to show every section in the default order). Copy lives in `copy.servicesPage`; the header reuses `copy.services`, the emergency band reuses `copy.emergency`, and the area checker reuses `copy.serviceArea`. A section with no content (no symptoms, no plans and financing disabled, no reviews and no Google rating) is skipped.

| Key | Section |
|---|---|
| `filters` | Category tabs and Residential / Commercial toggle above the cards. Client-side CSS filtering; state is in the URL (`/services?type=cooling&for=commercial`) |
| `cards` | Service cards (image, icon, summary, 3 features, optional 24/7 badge and "Starting at" price) |
| `problemPicker` | Symptom links from `content/symptoms.ts` |
| `emergency` | Navy 24/7 band with a large call button (only when `offerings.emergency24x7` is true) |
| `process` | Steps from `content/process.ts` |
| `plansFinancing` | Banners to `/plans` (when plans exist) and `/financing` (when `offerings.financing.enabled`) |
| `serviceArea` | Inline ZIP checker |
| `brands` | Supported equipment brands |
| `reviews` | Google rating badge (only when `company.googleRating` is set) plus up to 3 testimonials. No review markup |
| `faq` | First 5 FAQs (no FAQPage markup) |
| `cta` | Navy band with the compact lead form |

### Projects page sections

`config.projectsPage.sections` orders and toggles the `/projects` index (the hero always shows first). Copy lives in `copy.projects` (header) and `copy.projectsPage` (all labels, including the detail page). Filters are stored in the URL, e.g. `/projects?cat=heating&city=Dublin%2C%20OH&system=Gas%20furnace&q=furnace&sort=oldest`.

| Key | Section |
|---|---|
| `trust` | License, insured/bonded, certifications, Google rating (only what is configured) |
| `featured` | First project with `featured: true` |
| `grid` | Sticky toolbar (category tabs with counts, city, system type, search, sort, result count, clear) and the project cards, 6 at a time with Load more |
| `stats` | Navy band with count-up numbers from `company.stats` |
| `process` | Steps from `content/process.ts` |
| `testimonials` | Slider of testimonials linked from a project's `testimonialId` |
| `cities` | Links to every configured city page |
| `faq` | `content/project-faqs.ts` |
| `cta` | Navy band with the compact lead form |

Project detail pages show only the fields a project has. The sidebar quote form pre-selects the service mapped from the project category. JSON-LD on the detail page is BreadcrumbList only (plus the site-wide LocalBusiness from the layout).

## 7d. Contact page, hours and lead form

- **Hours** (`company.hours`) are structured as `{ days: [0-6], open: "HH:mm", close: "HH:mm", label, note? }` (0 = Sunday), with `company.timezone` (IANA). Leave out `open` and `close` for a closed day. The "Open now" badge is calculated in that timezone in the browser only.
- **`config.contact`:**
  - `safetyNotice` (always shown): review the wording with the client.
  - `faqs`.
  - `mapLink` (optional). Without it, directions fall back to a maps search for the address.
  - `responseTimeText`: only set this when the client confirms a real response time.
- **Sections:** `config.contactPage.sections` orders and toggles quick cards, main (contact card and form), safety, steps, map, areas, faq and cta. The map makes no request to Google until the visitor clicks "Load map".
- **Lead form:**
  - The steps variant (Service, Location, Contact) is used on `/contact` and `/book`. The compact variant (name, phone, service, ZIP, urgency) is used in CTA bands and sidebars.
  - The ZIP is required. When it matches configured coverage, the city and state are filled in automatically; otherwise the visitor picks a state and city, or "Not listed".
  - The payload adds street, preferred date and time, referrer, UTM and gclid. The server returns a short reference (for example `R-7K3M9Q`) that appears in the success state and the email subject.
- **Analytics:** set `config.analytics.gtmId` to load Google Tag Manager. Without it, nothing is loaded and `track()` (form_start, step_complete, form_submit, click_to_call) does nothing. Never send personal data in events.
- **Footer CTA card** text comes from `config.footer.cta`.
## 7e. Website assistant and WhatsApp

- `config.chatbot` (`enabled`, `name`, `avatar`) turns on the website assistant. It answers **only** from this brand's content: services, FAQs, coverage, hours, contact, financing, plans, projects and blog. The knowledge base is built in `lib/chatbot.ts` at build time and served as `/assistant.json`, which loads only when a visitor opens the chat. The browser first matches topics (`lib/chat-match.ts`), then checks 5-digit ZIPs, then searches every passage of site text (services, blog, projects, about, plans, FAQs, written city notes) and shows the closest passage exactly as written, with a link. Off-topic questions get a polite fallback with call, WhatsApp and book links. UI text lives in `copy.chatbot`.
- **Optional AI answers (Gemini).** Set `GEMINI_API_KEY` in `.env.local` (or the host's env vars) **before** `npm run build`. Typed questions then go to `/api/chat` (`lib/chat-ai.ts`), which sends the question, the last few messages and the site knowledge above to Google Gemini (`GEMINI_MODEL`, default `gemini-flash-latest`) with strict rules: answer only from site content, never invent prices, times, licenses or ratings, decline off-topic. Returned links are kept only if they are real pages of this site. Quick-reply buttons and ZIP checks stay scripted. If the key is missing, the API fails or the visitor hits the limit (30 questions per 10 minutes per IP; same rate limiter as leads, in-memory unless Upstash is set), the browser silently uses the scripted answers. The key stays on the server. Free-tier Gemini keys may let Google use prompts to improve its products; use a paid (billing-enabled) key in production and mention the AI provider in the privacy policy (needs legal review).
- `company.whatsapp` (`number` digits with country code, `message`, `label`) adds WhatsApp links. On desktop the assistant and WhatsApp share one floating pill. On phones both live in the sticky bottom bar, so nothing floats over forms.
- Analytics events (only with `analytics.gtmId`): `chat_open`, `chat_question` (matched topic id only, never the question text), `click_to_whatsapp`.

## 7c. Blog

- **Posts** live in `content/posts.ts`. The body is a typed block array (`heading`, `paragraph`, `list`, `callout`, `image`, `quote`), with no MDX. Heading ids, the table of contents and reading time are generated from the blocks.
  - Other fields: `takeaways`, `tags`, `featured`, `popular`, `season`, `serviceSlug`, `updated` ("Last reviewed") and `cover`.
  - `category` must match `content/blog-categories.ts` and `authorId` must match `content/authors.ts`, or the build fails with a clear message.
- **Authors** describe the team. Do not add credentials unless they are verified.
- **Sections:** `config.blogPage.sections` orders and toggles `featured`, `seasonal`, `grid` and `cta`. `config.blogPage.season` overrides the month-based Seasonal picks.
- **Category pages:** `/blog/category/<slug>` exists for every category that has posts.
- **Placeholder posts** render noindex and stay out of `sitemap.xml` and `/feed.xml`. In development they show a "Placeholder content" notice. Set `placeholder: false` after the client reviews a post.
- **Checklist signup** posts to `/api/lead` with `source: "checklist"`. It uses the same rate limit, honeypot, Turnstile and delivery rules as leads (email only, no SMS). The consent text comes from `copy.blog.checklist.consent` on the server.
- **Footer** text comes from `config.footer.blurb`, where `{cities}` and `{states}` are filled from coverage.
## 7b. Add or remove coverage

Coverage drives `/service-areas`, `/service-areas/<state>` and `/service-areas/<state>/<city>`, the top bar label, the homepage Service Areas section, the footer cities, the area checker and the lead form state and city selects.

1. **Edit `brands/<slug>/content/cities.ts`** (imported into `config.coverage`). Keep one entry per line.
   - `states`: `{ abbr, climate: "cooling" | "heating" | "mixed", intro?, placeholder }`. The build fails with a clear message for an unknown abbreviation or a duplicate.
   - `cities`: `{ name, stateAbbr, slug, primary?, zips, intro?, localNotes?, neighborhoods?, placeholder }`. A city's state must be listed in `states`. Up to 8 `primary` cities show in the footer and "Available in" chips.
   - A state with no cities gets a state page only.
   - `headquarters` (optional) shows in the top bar.
2. **Set the climate.** It picks the climate profile in `content/climate.ts`: service emphasis order, headline, seasonal suggestion, 4 FAQs and an intro template with `{city}` and `{state}`. The wording is generic on purpose. Write real local content in `intro` and `localNotes`; never invent local statistics, temperatures, landmarks, utilities, rebates or competitors.
3. **Add licenses** in `config.company.licenses` as `{ stateAbbr, number }`. A number shows only on that state's pages and on its city pages. `company.licenseNumber` is the default shown where there is no state (top bar, footer); leave it empty unless it applies everywhere.
4. **Add ZIP codes** only from real data. Get a CSV of ZIP, city and state, then run `npm run geo:zips -- data/zips.csv "St. Louis" MO` and paste the printed `zips: [...]` line into that city. Cities without ZIPs are still checkable with the state and city picker.
5. **Publish a page** by writing real content and setting `placeholder: false` on the state or city. Placeholder pages render with `robots: noindex`, are left out of `sitemap.xml` and show a "Placeholder content" notice in development only.
6. **Remove a location** by deleting its line. Links, the sitemap, JSON-LD `areaServed` and the selects update automatically.

`npm run check:placeholders` lists placeholder states and cities, states without a configured license, and cities without ZIP data.

**Licensing and insurance rules vary by state (and sometimes by city or county).** Verify the license, registration and insurance requirements for every state and city before advertising it, and do not list a location the business is not allowed to serve.
## 8. Environment variables

Copy `.env.example` to `.env.local`. Only the `NEXT_PUBLIC_*` values reach the browser. Everything else is server-only.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BRAND` | **yes** | Brand folder slug. The build fails if it is unset or unknown. |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical origin, e.g. `https://www.acmeair.com`. Overrides `config.seo.siteUrl`. |
| `RESEND_API_KEY` | for email | Resend API key. |
| `LEAD_FROM_EMAIL` | for email | Verified sender, e.g. `Website <leads@acmeair.com>`. |
| `LEAD_TO_EMAIL` | for email | Recipient(s), comma-separated. |
| `LEAD_WEBHOOK_URL` | for webhook | HTTPS endpoint (CRM, Zapier, Make, etc.). |
| `LEAD_WEBHOOK_SECRET` | for webhook | HMAC secret. The webhook is not used without it. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | optional | Distributed rate limiting. |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | optional | Cloudflare Turnstile. Enforced only when **both** are set. |

### Switching brands on Windows

Edit `.env.local`:

```
NEXT_PUBLIC_BRAND=example-two
```

Then restart `npm run dev`, or re-run `npm run build`. No inline `VAR=value` shell syntax is needed. On Vercel, set it in Project Settings -> Environment Variables. `NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

## 9. Lead form and delivery

The form (`components/forms/lead-form.tsx`) posts JSON to `/api/lead`. The same `zod/mini` schema (`lib/lead/schema.ts`) validates on the client, for instant labeled errors, and on the server, which is authoritative.

Server pipeline (`app/api/lead/route.ts`):

1. Same-origin check (403), JSON content type (415), and a 16 KB body cap that also covers bodies without a `Content-Length` header (413).
2. Rate limit: 5 requests per IP per 10 minutes (429 + `Retry-After`).
3. Zod validation (422 with field errors). US phone normalized to E.164.
4. Honeypot field `website`: if filled, the request is rejected (400) and nothing is delivered.
5. Turnstile verification when enabled (403).
6. Delivery through **independent** channels, Resend email and a signed webhook, run in parallel:
   - At least one succeeds: 200 and the success message.
   - All configured channels fail: 502 and an error with the phone number.
   - **None configured:** 503 in production. Exception: when `NODE_ENV=development` (`npm run dev`), the lead is printed to the server console and the form shows a **"DEV MODE, not delivered"** notice.

Every delivery includes the SMS consent boolean, consent text and version (`SMS_CONSENT_VERSION` in `lib/lead/constants.ts`), a timestamp and the page URL. Bump the version whenever you change the consent wording. All user input is HTML-escaped in the email body, and the subject is stripped of line breaks.

SMS consent is an **optional, unchecked** checkbox. It is not required to submit, and its wording includes frequency, rates, STOP/HELP, and "not a condition of purchase".

### Resend setup

1. Create a Resend account and verify the client's sending domain (DNS records).
2. Create an API key. Set `RESEND_API_KEY`, `LEAD_FROM_EMAIL` (on the verified domain) and `LEAD_TO_EMAIL`.
3. Replies go to the customer automatically (`replyTo` is the email they entered).

### Webhook signature

Headers sent: `X-Lead-Timestamp` (unix seconds), `X-Lead-Signature: sha256=<hex>` and `X-Lead-Id`. The signature is HMAC-SHA256 over `` `${timestamp}.${rawBody}` ``. To verify it on your side (Node):

```js
import { createHmac, timingSafeEqual } from "node:crypto";
const expected = "sha256=" + createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET)
  .update(`${req.headers["x-lead-timestamp"]}.${rawBody}`).digest("hex");
const ok = expected.length === sig.length && timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
// Also reject timestamps older than ~5 minutes to prevent replays.
```

Payload: `{ "event": "lead.created", "lead": { id, receivedAt, brand, name, phone, email, address, serviceType, urgency, preferredTime, message, consent: { sms, textVersion, text, timestamp }, pageUrl, ... } }`.

### Rate limiting caveat

Without Upstash, the limiter is **in-memory and best-effort**. On serverless hosts like Vercel, each instance keeps its own counters and instances are recycled, so the limit is not enforced globally. Set the Upstash variables for a reliable limit. If Upstash is unreachable, the route falls back to in-memory limiting.

## 10. SEO

- Per-page `generateMetadata` with unique titles and descriptions (the brand `titleTemplate` is applied), canonical URLs, and OpenGraph/Twitter tags. OG images are referenced only when the file exists.
- `sitemap.xml` and `robots.txt` are generated from the active brand. `/api/` is disallowed.
- JSON-LD is built from config only:
  - `HVACBusiness` (a LocalBusiness subtype) once per page, in the layout
  - `Service` on service pages
  - `Service` with a city `areaServed` on city pages
  - `BreadcrumbList` on every inner page
- There is intentionally **no** FAQPage, Review or AggregateRating markup.

## 11. Deploying to Vercel

1. Push the repo to GitHub, GitLab or Bitbucket and import it in Vercel. The framework is detected as Next.js automatically.
2. Set environment variables: `NEXT_PUBLIC_BRAND` (the committed `.env.production` defaults it to `default`; a value set in Vercel overrides it), `NEXT_PUBLIC_SITE_URL`, plus Resend and/or webhook variables (at least one channel, or leads return 503). Optionally add Upstash and Turnstile.
3. Deploy, then add the client's domain and make sure `NEXT_PUBLIC_SITE_URL` matches it.
4. One Vercel project per client brand is the simplest setup. Each project uses the same repo with a different `NEXT_PUBLIC_BRAND`.

## 12. Legal pages: review required

`/privacy`, `/terms` and `/sms-consent` are **draft templates** generated from brand config (`lib/legal.ts`). They are not legal advice and make no claim of compliance with TCPA, CTIA, CCPA or any other law. **An attorney must review them before production.** After review, edit the text as advised and set `config.legal.reviewed = true` (and `effectiveDate`). Until then, each page shows a visible "Draft template" notice. Your SMS provider (10DLC registration) may require specific wording.

## 13. Assumptions and decisions

- **TypeScript 5.9 and ESLint 9** are used instead of the brand-new TS 7 and ESLint 10, for proven compatibility with Next's type checking and lint plugins.
- **Fonts** come from Google Fonts via `next/font` and are self-hosted at build time, so the build needs network access.
- **Brand selection is build-time** (`NEXT_PUBLIC_BRAND`). There is no runtime or domain-based switching, which keeps every page static.
- **Phone numbers** in the examples use the fictional 555-01XX range. Example sites use `example.com` / `example.org`.
- **Service area checking** happens in the browser against configured ZIPs, with a state and city picker for cities that have no ZIP data. No external API is called, and an unlisted place is never described as covered.
- **No map embed.** Embedding Google Maps needs an API key and third-party scripts, so it is left out.
- **The 24/7 flag** controls the banner, top-bar line and hero chip. It is not expressed as 24/7 opening hours in JSON-LD, because that would contradict office hours.
- **Missing images** render token-colored SVG placeholders. Nothing is downloaded or generated.

## 14. QA status

Only `npm run build` and `npm run lint` were run during development, plus a build with each example brand. The following are the owner's responsibility and were **not run**:

- Visual QA across breakpoints
- Functional QA: form submission with real Resend/webhook credentials, rate limiting, Turnstile
- Lighthouse and accessibility audits
- Cross-browser testing
