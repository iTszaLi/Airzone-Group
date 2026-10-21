# Airzone Group website — implementation report (11 Oct 2026)

## 1. Stack found
pnpm monorepo (Replit export). Website: React 19 + Vite 7 + TypeScript, wouter,
Tailwind 4, custom CSS, SSR prerender script, small Node production server, GSAP,
Three.js. API: Express 5 + Drizzle/PostgreSQL + Clerk admin, OpenAPI-generated
Zod schemas and React Query hooks. Bilingual EN/AR with `/ar/` routes.

## 2. Architecture and pages found
Home (aviation-themed Three.js scroll story), Logistics hub and 10 logistics
service routes (7 rich, 3 thin/noindex), Travel hub and 9 travel routes,
Destinations, About, Contact, Request quote, Travel enquiry, Callback, Track,
Reviews, Insights, Portal, Privacy, Terms, Admin, Sign-in/up, 404. Enquiries
are stored by the API (no email notification). Contact details are centralised
in `business-contacts.ts`.

## 3. Main problems found
* The site did not present the actual core services (GCC transport, trailers,
  Dayana, temperature-controlled warehousing). The homepage framed the company as
  an aviation/travel group with a 747 KB Three.js airliner and low-contrast hero text.
* The newest high-resolution logos had been supplied but not used. The site
  displayed an upscaled 119 × 62 px Group logo, and the old favicon came from it.
* The build failed outside Replit: Windows-incompatible `import()` paths, mandatory
  `PORT`/`BASE_PATH`, and workspace overrides that removed every non-linux-x64
  native binary.
* `createRoot` discarded the prerendered HTML (LCP element re-created), and fonts
  loaded through a render-blocking Google Fonts `@import`.
* The API reflected any origin in CORS with credentials, and a critical `proxy-addr`
  advisory affected the API.
* No `.env` rules in `.gitignore`.

## 4–5. Improvements and new pages/components
* **New design system** (`src/styles/airzone.css`): navy, Airzone blue and green
  taken from the logo, AA contrast, consistent buttons, radii, cards, focus
  states, RTL and reduced-motion support. Legacy CSS pruned from 94 KB to 55 KB
  and recoloured from gold to green.
* **New pages:** GCC transportation, Heavy transport & trailers, Dayana local
  delivery, Service locations. Rebuilt: Home, Logistics hub, Warehousing
  (temperature-controlled), Customs support, About, Contact, Request a quote.
  Every logistics service page uses one template: hero, highlight block,
  inclusions, audience, process, information to prepare, coverage, FAQ, related links.
* **Navigation:** Services mega menu (click-controlled, Escape and focus handling,
  inert when closed), mobile menu with scroll lock, skip link, footer with
  separate Logistics and Travel contacts, photo credits and privacy choices.
* **Components:** `ServicesMenu`, `Header`, `Footer`, `Layout`, `BrandLogo`,
  `VehicleIllustration` (original line drawings), `VehicleCarousel`, `GccNetwork`
  (Three.js plus SVG fallback), `FormKit`, `QuoteForm`, `ContactForm`, page primitives.
* **Libraries configured:** GSAP + ScrollTrigger (reveals, stagger, parallax,
  pinned process heading, scroll-scrubbed timeline line, counters, progress bar),
  Lenis (synced to GSAP's ticker, idle init, off for reduced motion and touch),
  Motion (`motion/react` via `LazyMotion`: menus, Dayana tabs, form states),
  Lucide icons, Swiper (vehicle carousel only, progressive enhancement), Three.js
  (GCC network, lazy and visibility-gated). All are reverted or destroyed on unmount.
* **Removed:** aviation story and its assets, unused Clerk React packages,
  `framer-motion` (duplicate of `motion`), old logo/favicon files, ImageMagick
  scripts (replaced by portable Python scripts), an unused not-found page.

## 6. SEO
78 prerendered documents (54 indexable EN/AR URLs in the sitemap, up from 44).
Unique titles and descriptions, self-canonical, hreflang, Open Graph and Twitter
tags, JSON-LD (Organization, WebSite, WebPage, Service with accurate `areaServed`,
FAQPage mirroring visible text, BreadcrumbList, Dayana `Brand`). No LocalBusiness,
because no verified addresses exist. 301s for consolidated URLs; real 404s.
`validate:seo` passes (4,992 internal links and 392 images verified). Keyword map extended.

## 7. Performance
Prerender + hydration; self-hosted variable fonts; CSS 39 → 28 KB gzip; Swiper,
Three.js, GSAP, Lenis and Motion features split out and loaded on demand; hero (LCP)
images eager with `fetchpriority="high"`, sized `srcset`, WebP; heavy photos
re-encoded; intrinsic image sizes (CLS ≤ 0.045 in all tests).

Lab results (localhost, Lighthouse 12.2, not field data):

| Page | Desktop | Mobile (simulated) | Mobile (applied throttling) |
| --- | --- | --- | --- |
| Home | Perf 98, LCP 1.0 s, CLS 0.03 | Perf 80, LCP 4.2 s | Perf 78, LCP 2.5 s, TBT 600 ms |
| GCC transportation | Perf 99, LCP 0.9 s | Perf 84, LCP 3.4 s | Perf 90, LCP 2.4 s |
| Warehousing | n/a | Perf 87, LCP 3.4 s | Perf 87, LCP 2.5 s |
| Contact | n/a | Perf 89, LCP 3.4 s | Perf 94, LCP 2.3 s |

Accessibility, Best Practices and SEO scored 100 on all public pages tested.
(The quote form is noindex by design, so its Lighthouse SEO score is 69.) Real-user
Core Web Vitals must be measured after launch (Search Console / CrUX).

## 8. Security
CORS restricted to same-origin plus an explicit `ALLOWED_ORIGINS` list;
`proxy-addr` patched via override (critical advisory resolved); CSP tightened
(self-hosted fonts, GA origins only after consent; still Report-Only until
reviewed); `.env*` ignored, `.env.example` added; honeypot field; existing rate
limit (12 submissions / 15 min) and Zod validation kept. Residual: `braces` (high,
no patch released) via `http-proxy-middleware`. It is only reached through
server-defined glob patterns, so exposure is low; update when a fix ships.

## 9. Forms and integrations
Quote and contact forms post to the existing API, which stores enquiries in
PostgreSQL. Success is shown only after the API returns a reference. On failure
the form says "not sent" and offers the verified logistics email. Accessible
validation: field messages, focused error summary, `aria-invalid`. **Not
verified end to end here:** there is no database or API running locally, and
no email notification exists; enquiries appear in the admin workspace.

## 9b. Design and motion pass (second and third rounds)
- Motion system: GSAP + ScrollTrigger (lazy, `gsap.matchMedia`, reverted on
  route change) for scroll reveals, counters (verified figures only), hero
  parallax, a desktop pinned section and a scrubbed "curtain" on the dark
  warehousing section; Lenis smooth scroll on desktop pointers only; Motion
  (`motion/react`, `LazyMotion`) for UI state: mobile menu, mega menu and the
  route cross-fade; Swiper core for the fleet carousel; Three.js GCC network
  (lazy, SVG fallback, WebGL context-loss handling). All of it is off under
  `prefers-reduced-motion`.
- Scroll restoration rebuilt (per-URL positions, hash targets with header
  offset, back/forward restore that survives ScrollTrigger refreshes); CSS
  `scroll-behavior: smooth` removed because it fought both libraries.
- UI UX Pro Max audit fixes: form error summary with links that focus fields,
  blur validation for edited fields, focus moved to `<main>` after client
  navigation, scroll padding for the sticky header, 44 px touch targets on
  coarse pointers, tabular numerals, numbered editorial section labels
  (01–10, hidden from assistive tech), hero quick-track box deep-linking to
  `/track?n=`.
- React Bits `SpotlightCard` (installed with the official shadcn CLI, source in
  `src/components/SpotlightCard.*`, MIT + Commons Clause) used via the
  `SpotCard` preset on why-cards, location cards, About principles and fleet
  cards. Pointer/focus-driven, honours reduced motion.
- Not installed: Skiper UI (mostly paid), Scrolltide (paid template library,
  used only as inspiration), Vengeance UI and "AnimMaster Lab" (no official
  project could be identified). VividSites, Refero Styles and 21st.dev were
  used as design references only.

## 9c. Homepage cinematic opening and business divisions
- Sources (unchanged, in `attached_assets/`): `new1.webp` (animated, 1280 x 720,
  192 frames, 24 fps, 8 s; the supplied MP4 of the clip is also 1280 x 720),
  `im1.png` (1915 x 821 still that the clip opens on: it matches frame 0's
  picture area at 1.5x resolution) and `im3.png` (1672 x 941 closing still).
- `scripts/prepare-cinematic-frames.py` extracts the clip's frames unchanged
  (an animated WebP cannot be scrubbed by scroll) into `public/assets/cinematic/`:
  landscape 1280 x 720 (192 frames, ~12 MB) and portrait centre 720 x 720
  (96 frames, ~3.9 MB); posters from `im1.png`; the Travels panel image from
  `im3.png`.
- Header over the scene (home only, CSS keyed on `html:has(.az-cine)`): the
  existing header floats over the full-screen stage. A: transparent bar, white
  links, translucent navy strip, official logo on its white badge (its dark
  "GROUP" lettering disappears on navy). B: GSAP scrubs `--hdr-dark` (navy
  glass) and `--hdr-lift` (strip slides up) over the first ~40% of a screen of
  scroll. C: when the divisions reach the bar, `data-tone="solid"` restores the
  standard white header with the strip; the mobile menu always opens solid.
  Reverse scrolling returns to A. Other pages keep the normal sticky header.
- Layout (`src/components/home/CinematicOpening.tsx`, `frame-sequence.ts`):
  a full-screen CSS-sticky stage (copy padded below the measured header height
  `--az-header-h`) holds, back to front, the
  scene (sharp still, then canvas frames), a contrast shade, the original
  homepage hero copy (eyebrow, H1 "Moving cargo across Saudi Arabia and the
  GCC.", description, Request a quote / Explore services, track box, key
  figures) and a veil. One GSAP ScrollTrigger timeline (`scrub: 1`, ~280vh of
  scroll on desktop, ~190vh on phones): the still hands over to the frames in
  the first few percent, the copy lifts away by ~20% (autoAlpha, so hidden links
  cannot take focus), frames 0-191 play over the first 70%, then the veil
  closes while the divisions section rises and the stage releases. Reverse
  scrolling restores everything.
- Image quality: the clip's early frames have a baked-in letterbox (rows 85-633
  only) that fades out by frame 105; the canvas crops each frame to its usable
  rows, easing to the full 720 rows after frame 105 (~30% more real detail),
  draws at device resolution with high-quality smoothing, and the resting view
  uses the 1.5x-resolution still. The clip itself remains 1280 x 720, so large
  screens still enlarge the frames ~1.5-2x mid-sequence.
- Fit: the headline scales with screen height; the key-figures strip appears
  in the opening only on screens at least 961 px tall, otherwise in a band
  right after the divisions (one copy is displayed); the track box is hidden in
  the opening on short laptops and phones (the header has a Track button).
- Layout shift: copy is top-anchored and the first-paint fonts are preloaded
  per language (`scripts/prerender.mjs`), so CLS is 0. The poster stops 1px
  short of the viewport (same still painted behind it) because Chrome ignores
  full-viewport images for LCP; phones get a tighter 640 px crop of the still.
- Divisions: Airzone Travels (left; official Travel and Tourism logo; links to
  `/travel`) and Airzone Logistics (right; official logistics logo; truck
  photograph; links to `/logistics`); Arabic mirrors the order for RTL.
- Reduced motion / no script / frames unavailable: still image with the full
  hero copy, normal scrolling.
- Results: 42 dedicated opening/header checks, a 21-point homepage content
  audit, 42 interaction checks, all routes, forms and axe pass. Lighthouse:
  desktop 97 (LCP 1.0 s, CLS 0); mobile 68-81 (simulated LCP 3.8-4.7 s,
  observed under 1 s locally; the LCP is the opening image).

## 9d. Language-switch animation bug and logo Home behaviour (12 Oct 2026)
- Symptom: switching EN/AR at the bottom of the homepage returned to the top,
  but the airplane frames no longer followed the scroll.
- Root cause: the switch is a client-side route change, so the page stays
  mounted and the direction change rebuilds `useMotion` immediately, before
  the switch's scroll-to-top (which runs two frames later). At the bottom of
  the page every reveal trigger was created already passed; with `once: true`
  each killed itself inside ScrollTrigger's refresh loop, ScrollTrigger threw
  ("reading 'end'") with its internal refreshing flag left set, and from then
  on every trigger rendered with events suppressed (no frame drawing, skipped
  refreshes). `useMotion` swallowed the error.
- Fix: reveals and counters no longer use `once: true` (GSAP's default
  toggleActions already play once and never reverse); `useMotion` also refreshes
  on `document.fonts` `loadingdone` (Arabic font arriving after a switch) and
  logs initialisation errors; `CinematicOpening` rebuilds its GSAP context on a
  language change so RTL entry directions are read fresh.
- Logo: on the homepage (either language) it scrolls to the very top via
  `scrollToTop()` in `SmoothScroll.tsx` (Lenis-aware, instant under reduced
  motion); elsewhere it navigates home in the current language. Accessible name
  "Airzone Group — Home".
- Verified: switch EN→AR and AR→EN at the bottom, middle and top; six repeated
  switches with a constant trigger count (45) and no pin-spacer growth; direct
  entry; reload; back button; mobile menu switch; all logo scenarios; the full
  cinematic plays each time (28/28 checks).

## 9e. Travel & Tourism and Logistics page redesigns (12 Oct 2026)
- `/travel` (`src/pages/TravelLanding.tsx`, copy in `src/config/travel-content.ts`):
  cinematic hero, verified-facts strip (office, services, written proposals:
  no years, customer counts, ratings or licence numbers, none verified),
  four suggested offers (durations only; prices in SAR after confirmation),
  four editorial service rows, six travel styles, planning timeline, brand
  story, destination track (scroll-snap, prev/next, progress), single-open
  FAQ (FAQPage schema), ticket-style enquiry form with contact card, and a
  closing scene. No True Travel content, credentials or identifiers are used.
- Accreditations section omitted: no Airzone Travel licence documents exist in
  the project. Add verified documents before publishing one.
- WhatsApp: no travel WhatsApp number is configured. CTAs read
  "Plan your trip" and open the form; they become WhatsApp links (with a
  destination-specific message for each offer) as soon as the number is set in
  `business-contacts.ts` or the admin "Travel WhatsApp" site setting.
- Travel enquiry form (`src/components/forms/TravelForm.tsx`), EN/AR, used on
  `/travel` and `/travel/enquiry`: email optional (API schema updated and
  client regenerated), return date cannot precede departure, presets from
  offers, travel styles and `?destination=/purpose=/offer=`, honest failure
  state with data kept, success only after the API stores the record.
- `/logistics` (`src/pages/LogisticsHub.tsx`): cinematic hero with the Airzone
  Logistics logo, numbered service strip, flagship transportation
  composition, warehousing split with the five cities and 24/7, customs &
  freight grid (customs-authority disclaimer kept), fleet showcase (accessible
  tabs, a category photo for each of the eight vehicle types, quote CTAs
  preset by service), principles, quotation timeline and final CTA.
- Homepage: the Airzone Group logo replaces the small "Airzone Group" label
  above "Travel and logistics, under one group."
- Fixes found while testing: the phone `pattern` was invalid under the `v`
  regex flag browsers use, so phone validation was silently skipped on the
  quote, contact and travel forms (now `PHONE_PATTERN` in FormKit); in-page
  anchor links stopped short because Lenis used a stale page height and then
  over-shot because it added CSS scroll-padding/margin (now an explicit,
  header-measured position).
- 24 new Wikimedia Commons photographs (CC0 / public domain / CC BY /
  CC BY-SA), credited in the footer and docs/photo-credits.md.

## 9f. Airzone Logistics expansion: customs, transportation, warehousing (12 Oct 2026)
- Three-pillar hierarchy (Customs clearance → Transportation → Warehousing) on
  `/logistics`, with customs featured first: pillar cards, a 15-branch customs
  directory, four customs CTAs and the filing disclosure. Services menu now
  lists the customs group first and links Transportation, Documentation and
  Industries.
- Data-driven pages (`src/config/pillars/*`, rendered server-side by
  `src/components/logistics/PillarPageView.tsx`), all EN/AR:
  `/logistics/customs-clearance` (flagship: import/export/temporary admission,
  7-step process, 9 specialised-cargo categories with documents, authorities,
  procedure, transport and storage, transport modes, entry points, customs
  form), `/logistics/customs-documentation` (SABER, SASO, IEC/IECEE, SFDA,
  GACA and other authorities, document directory, indicative document
  checker), `/logistics/ata-carnet` (exhibition cargo and ATA Carnet with
  ZATCA pre-approval steps and an ATA form), `/logistics/transportation`
  (10-category fleet directory, service models, temperature-controlled
  transport, Dayana, coverage, industries), `/logistics/warehousing`
  (categories, value-added services, locations), city pages
  `/logistics/warehousing-{riyadh,dammam,jeddah,jubail}` with distinct
  local context, and `/logistics/industries` (14 industries linked to
  services). Existing URLs were kept (no redirects needed).
- Forms: `CustomsForm` (customs and ATA variants) submits to the existing
  logistics enquiry API with structured details; presets from category links
  and the checker; no document upload (no secure storage exists).
- SEO: unique titles/descriptions, canonical, hreflang, sitemap (70 URLs),
  BreadcrumbList, Service (with areaServed) and FAQPage schema from visible
  FAQs. Official sources linked (ZATCA, Fasah, SABER, SASO, SFDA, GACA, MEWA,
  CST, ICC). Facts checked against zatca.gov.sa, saber.sa and saso.gov.sa.
- Accuracy: no licence, fleet size, capacity, temperature range, timing, fee
  or guarantee is claimed. Open questions are listed in
  `docs/LOGISTICS-VERIFICATION-CHECKLIST.md`.
- 6 more Commons photographs (refrigerated and low-loader trailers, Jeddah
  port, Dammam, Jubail), credited.

## 9g. Specialist freight services, exhibition logistics and About page (12 Oct 2026)
- New or rebuilt pillar pages (EN/AR, server-rendered): `/logistics/air-freight`
  (inbound/outbound, documents and clearance, cargo types incl. urgent, spare
  parts, exhibition, temperature-sensitive, oversized and dangerous goods,
  who-does-what, 7-step process, Saudi cargo airports for planning, quote form),
  `/logistics/sea-freight` (inbound/outbound, FCL vs LCL vs breakbulk, cargo by
  vessel, ZATCA advance manifest and declaration requirement from 29 Oct 2025,
  port-to-door services, process, seaports, quote form),
  `/logistics/container-destuffing` (new URL: destuffing vs stuffing, 13 handling
  services, 8-step workflow, preparation checklist, quote form) and
  `/logistics/exhibition-event-logistics` (kept URL; "Exhibition, Trade Show &
  Event Logistics in Saudi Arabia": services, planning, A–H equipment directory
  with transport, packing, identification, temporary-admission and storage
  notes, ATA Carnet and event-disclosure coordination with ZATCA sources, a
  10-step cargo journey labelled by who performs each step, customer types,
  quote form). The superseded generic entries were removed from
  `logistics-content.ts`.
- `FreightForm` (air, sea, destuffing, exhibition variants) posts to the
  existing logistics enquiry API; the thank-you panel shows only after the API
  stores the enquiry. Links can pre-fill the forms (`presetPageForm`).
- Industries page: six event-sector entries (organisers and contractors, event
  production and AV rental, stage/lighting/LED suppliers, exhibitors and
  manufacturers, conference organisers, industrial suppliers).
- About page rewritten (`src/pages/AboutPage.tsx`): sections A–L, H1 "About
  Airzone Group — Logistics Services in Saudi Arabia & the GCC", title "About
  Airzone Group | Logistics in Saudi Arabia & GCC", AboutPage + Organization +
  BreadcrumbList schema, `legalName` on the logistics organisation, links to
  every service page. No founding year, size, clients, awards or named
  executives.
- Not created on purpose: separate import/export air and sea pages,
  trade-show-shipping, LED-screen and AV-transport pages. They would duplicate
  the air, sea and exhibition pages, which cover those topics with anchors
  (`#led-screens`, `#audio-visual`, …).
- 10 more Commons photographs (exhibition stands, LED, AV, lighting, truss,
  interactive display, flight cases, air cargo loader), credited.

## 9h. Qassim warehouse location removed (13 Oct 2026)
At the owner's request, Qassim is no longer presented as a warehouse
location. Removed: the `/logistics/warehousing-qassim` page (EN/AR) and its
sitemap, schema and metadata entries; the Qassim card on the Locations,
About and logistics pages; the GCC map node and its routes; and Qassim from
every city list, service-area list, SEO description and FAQ. Copy now reads
"four Saudi cities" (Riyadh, Dammam, Jeddah, Jubail). The Buraydah photograph
was only used for Qassim, so it was deleted; the food-storage card now uses
the refrigerated-trailer photo. Earlier sections that mention five cities
describe the site before this change.

## 9i. Google search appearance (13 Oct 2026)
See `docs/GOOGLE-SEARCH-APPEARANCE.md` for the full table and the Search
Console steps.
- **Titles and descriptions:** homepage title "Airzone Group | Logistics &
  Transportation in Saudi Arabia". Every indexable English title is now ≤ 60
  characters and every description is 70–160 characters, all unique. The About
  description now explains the group and its two businesses. The five
  content-driven service pages get written descriptions instead of truncated
  intros.
- **Headings and intros:** customs H1 "Customs clearance services in Saudi
  Arabia", transportation H1 "Road transportation across Saudi Arabia and the
  GCC" with a clearer intro, warehousing H1 "Warehousing and storage in Saudi
  Arabia". The homepage hero copy is unchanged (owner-approved).
- **Indexing:** `/logistics/request-quote` and `/track` are now indexable and in
  the sitemap (74 URLs), so they can appear as sitelinks. The Track page is
  translated into Arabic and has a descriptive H1.
- **Structured data:** WebSite `alternateName` (site name), group Organization
  `alternateName` and description, and a BreadcrumbList on every page with a
  visible breadcrumb (contact, logistics hub, quote, track, travel services),
  matching the visible labels.
- **Search Console:** optional `GOOGLE_SITE_VERIFICATION` build variable adds the
  verification tag to the homepage only.

## 9j. Hero animation: sharpness and scroll smoothness (13 Oct 2026)
**Source.** The only footage of the airplane clip is 1280 × 720 at 24 fps
(8 s, 192 frames): `Scroll_driven_airplane_animation_.mp4` (H.264, ~4.9 Mbit/s,
now copied into `attached_assets/`) and the same clip as `new1.webp`. No 4K or
higher-resolution master exists on this machine; the other videos found are
different scenes. The source resolution therefore remains the limit: on a
2000 px-wide screen the opening band (548 usable rows) is enlarged about 2×
and later frames about 1.6×. A genuine higher-resolution export of the same
clip (ideally 3840 × 2160, 24 fps, high-bitrate H.264/H.265 or ProRes) is
needed for truly crisp large-screen playback.

**Causes found.**
- *Blur:*
  1. Frames were re-compressed at WebP q68, a second generation of loss
     (~38 dB PSNR against the source).
  2. The animated WebP source has 8 × 8 block artefacts on flat areas such as
     the fuselage; the MP4 does not.
  3. The push-in zoom scaled the canvas with a CSS transform (with
     `will-change`), so every frame was resampled twice.
  4. Canvas 2D "high" smoothing measured as soft as bilinear when enlarging.
- *Stutter and lag:*
  1. `scrub: 1` added a second of catch-up on top of Lenis smoothing; the shown
     frame trailed the scroll by 2.4–12 frames on average (up to 27).
  2. Whole-frame stepping between the 24 fps frames.
  3. Drawing straight from `<img>` elements cost 12–15 ms per new frame (the
     browser re-decodes them).

**Changes.**
- Frames are re-extracted from the MP4 (every frame verified against the WebP
  frame of the same index) and encoded at WebP q86 (desktop) / q84 (phones):
  ~41 dB against the source, no visible blocks. Desktop set 18.8 MB (was 12.3),
  phone set 5.8 MB (was 4.0); both still load in the background after the page
  has rendered (`scripts/prepare-cinematic-frames.py --frames <png dir>`).
- New renderer (`frame-sequence.ts`):
  - WebGL with Catmull-Rom bicubic reconstruction (no sharpening filter), and
    a Canvas 2D fallback.
  - Blending between neighbouring frames at the fractional scroll position.
  - The zoom is applied in the source crop, so frames are resampled once.
  - Frames are decoded off the main thread into a sliding window of
    ImageBitmaps (texture upload 1.8 ms average instead of 13 ms; ~130 MB
    desktop / ~50 MB phones).
  - The canvas is reallocated only when its displayed size changes; it is
    cleaned up on unmount.
- Timeline scrub reduced to 0.35 s with one update callback for frame and zoom.
  Pinning (CSS sticky), the copy and veil choreography, the header states,
  reduced motion and the language rebuild are unchanged.

**Measured (Chrome, real GPU, 2000 px-wide viewport).**

| Measurement | Before | After |
| --- | --- | --- |
| Fine detail on frames 90–175 | — | +16–33% |
| Frames behind the scroll, slow / fast / reverse | 2.4 / 6.9 / 12.2 | 0.9 / 2.6 / 4.7 |
| Dropped animation frames | up to 6.8% | 0–0.9% |

There are no backwards jumps, the final frame is reached, and scrolling back
returns cleanly to the opening still. Phone (390 × 844 @ 3×) and tablet runs
pass the same checks. Side-by-side crops are in `docs/hero-before-after.png`.

## 9k. Homepage core-services strip (13 Oct 2026)
The key-figures strip (warehouse-city count, "24/7 warehouse operations", GCC
freight, Dayana vehicle sizes) is replaced by four linked service cards, in
priority order, in English and Arabic:

| # | Card | Links to |
| --- | --- | --- |
| 1 | **24/7 Customs Clearance Support** (most prominent: green accent, filled icon, wider card, larger title) | `/logistics/customs-clearance` |
| 2 | **Saudi Arabia & GCC Transportation** | `/logistics/transportation` |
| 3 | **Warehousing Services**: Riyadh · Dammam · Jeddah · Jubail | `/logistics/warehousing` |
| 4 | **Regulatory Approvals & Documentation**: SABER · SFDA · SASO · IECEE · GACA · ZATCA · FASAH | `/logistics/customs-documentation` |

- On the regulatory card, each acronym carries its full name, and the
  documentation page explains every body. A new "ZATCA & FASAH" entry there
  states that declarations are lodged by the importer or a licensed broker,
  and that inspection and release decisions are ZATCA's.
- No counts or metrics remain.
- The same component serves both placements: inside the opening on tall
  screens, and the band under the business cards elsewhere.
- Layout: one row on desktop, 2 × 2 below 1180 px, stacked below 640 px.
- Separators always end a line, never start one.
- The backdrop blur over the moving scene was removed, for performance.
- Files: `src/pages/HomePage.tsx`, `src/styles/airzone.css` (`.az-svc-*`),
  `src/config/pillars/customs.ts`.

## 9l. QA tooling, RTL skill and design-system docs (13 Oct 2026)
- **Repeatable checks** live in `scripts/qa/`, with root commands `pnpm run qa:rtl`,
  `qa:visual`, `qa:visual:update` and `qa:lighthouse`. Full guide and first results:
  `docs/QA-TOOLING.md`.
- **Project skill** `.claude/skills/airzone-rtl-check` covers how the site handles English and
  Arabic, and how to read and fix each failure.
- **Design system** reference: `docs/DESIGN-SYSTEM.md` (tokens, type, spacing, components,
  motion, accessibility baseline).
- **Fixed:** `/travel` scrolled 529 px sideways on phones because the offer CTA's `.sr-only` label
  escaped the swipeable row (`.tv-offer { position: relative }`).
- **Open findings from the new checks:**
  - English `alt` text on Arabic pages.
  - Untagged Latin names and untranslated descriptions in the footer photo credits.
  - Mobile lab LCP above 4 s on the home, logistics hub and customs pages.

## 9m. Transformation pass: critique, polish and fixes (13 Oct 2026)
Audit method: Impeccable critique and polish playbooks in their single-context fallback (no sub-agents; the detector binary was not run by the owner's choice), plus real screenshots of 11 key routes at 1440 / 820 / 390 px in both languages, the QA suites and Lighthouse. Benchmarks reviewed: DSV and Maersk (principles only).

**Fixed**
- **Language switch keeps the reading position.** It used to jump to the top. Now `keepReadingPosition()` → `SmoothScroll.tsx`: same section, same relative position, in both directions, with smooth scrolling on or off. Focus stays on the language control; reveals keep working.
- **`/track` and `/callback` rebuilt** on the shared design system (`src/pages/UtilityPages.tsx`).
  - Track has proper empty, loading, not-found and result states, and keeps the `?n=` deep link and the honest note that tracking is not live carrier data.
  - Callback uses the shared validated form and translated options; Arabic visitors previously saw English options.
- **Privacy, terms, 404, insights, reviews and portal** moved onto `PageHero` (a plain navy band when there is no photo) and `.az-prose`. The 404 page now has an Arabic version.
- **Arabic accessibility**
  - Arabic alt text for 12 photos (`altAr`) and the three logos (`BrandLogo`).
  - Photo-credit names and licences isolated left-to-right; "Public domain" and the Unsplash licence translated.
  - The copyright line in Arabic.
- **Directional icons:** 51 forward and "more" arrows now mirror in Arabic. Carousel previous/next buttons already swap icons.
- **Homepage**
  - Decorative section numbers (01–10) removed site-wide.
  - The warehousing heading gets room above its text.
  - Warehouse city rows are now links to each city page; the 01–04 numbers and the repeated "Temperature-controlled · 24/7" tags are gone, and the claim stays once in the intro.
  - "Why work with us" is an open list rather than boxed hover cards.
  - The vehicle row no longer shows a sliver of a fifth card before Swiper loads.
- **Arabic hero headings** are balanced (`text-wrap: balance`), with a wider Arabic measure on page heroes: About goes from 4 lines to 3, and Transportation and Locations from 3 to 2.
- **Hero photography:** the logistics hub now uses Jeddah Islamic Port, so it no longer repeats the Transportation truck; the Track page uses a less-used photo.
- **Travel sub-pages and Destinations** moved onto the shared design (`src/pages/TravelServicePage.tsx`): nine `/travel/*` pages with a hero photo per service, related travel links and the corporate travel guide. The old one-off travel page, enquiry shell and form components were removed from `App.tsx`.
- **Performance hygiene**
  - The header logo is no longer preloaded at high priority (the hero image is the LCP element).
  - Unused `tw-animate-css` removed.
  - `transition: all` replaced with explicit properties.
  - 389 unused legacy rules removed from `src/index.css` (source 55 KB → 27 KB); site CSS gzip 39.0 → 33.6 KB.

**Regressions found by the final checks, and fixed**
- *About, "Principles behind every shipment":* the card grid lost its styles when the homepage section was rebuilt, so the cards stacked full width (caught by the visual comparison). About now uses the same open list as the homepage.
- *Corporate travel guide (`/travel/corporate-travel`):* it sat outside the page container with unstyled lists after the move to the new travel page. It was rebuilt on the shared classes (checklist card, FAQ, contact list). Its own link column was dropped, because the "Other travel services" tiles below already cover it and one of its links pointed to the page itself.
- *Long button labels on phones:* buttons never wrapped. The exhibition page scrolled 17 px sideways because of its submit button, and the ATA Carnet hero button ran off-screen. Buttons now wrap below 560 px and never exceed their container. A sweep of every public route at 1440 px and 390 px found no sideways page scrolling afterwards.

**WhatsApp buttons and email routing (owner-confirmed contacts)**
- One floating WhatsApp button per page (`components/layout/WhatsAppButton.tsx`), using the official WhatsApp icon from `react-icons`. Travel pages (`/travel`, `/travel/*`, `/destinations`) open +966 54 345 7665; every other public page opens +966 50 226 0256. Each opens in a new tab with that team's pre-filled English or Arabic message.
- Placement: bottom-right, 56 px (52 px on phones, raised above the phone action bar); hidden while the mobile menu or, on small screens, the cookie notice is open; accessible label, visible focus ring, tooltip on hover and focus; no motion under reduced motion; hidden in print.
- Email: `Ticketing@airzonetravel.net` for Travel, `info@envodkingdom.net` for Logistics, both from `config/business-contacts.ts`. The header email, the mobile menu email and the phone action bar now follow the page's division (travel pages show the Travel email and "Plan a trip"); travel pages no longer end with the logistics "Planning a shipment" banner.
- Form failure fallbacks point to the department chosen in the form.
- The website forms store enquiries in the database by division; they do not send email (no email service is configured). See `docs/footer-configuration.md`.

**Not changed (needs a decision or is out of scope)**
- Qassim is not re-added: it was removed on the owner's instruction earlier the same day.
- "24/7" wording is still awaiting confirmation (checklist #35).
- Enquiries are not emailed to the division inboxes; that needs an email provider and server-side credentials.

## 9n. Homepage fleet showroom and vehicle quote requests (13 Oct 2026)
Replaces the homepage "Vehicles & trailers" card carousel (illustrations) and the separate Dayana block underneath it. The section heading, the availability note and Dayana's service copy and link were kept.

**Showroom** (`src/components/fleet/FleetShowroom.tsx`, data in `src/config/fleet.ts`)
- Nine vehicles from the company's own photos:
  - Heavy transport: curtain-side, flatbed, low-bed (empty, as supplied) and car carrier trailers.
  - Dayana: Isuzu refrigerated, closed-box and open-box trucks, a cargo van and a Suzuki Carry pickup.
- Each shows its name, service line, a description, body type and typical use, a "Request this vehicle" button and a link to the existing service page.
- No capacities, dimensions, temperatures or ownership claims are made.
- Photos: the originals are kept in `attached_assets/fleet/`. `scripts/prepare-fleet-images.py` normalises each studio background to one stage colour, aligns the wheel line and writes WebP at 240/640/1024 px (20–44 KB at 1024). The vehicles themselves are not edited.
- Motion: a directional move with Motion (already a dependency), looping, safe under rapid clicks (the selected index is the single source of truth), swipe with flick projection, and a crossfade under reduced motion.
- Navigation and accessibility:
  - Grouped picker with roving keyboard focus.
  - Labelled carousel region with a live announcement.
  - On phones the arrows sit under the photo; everything mirrors in Arabic.
- No autoplay.

**Quote panel** (`VehicleQuoteDialog.tsx`)
- A native modal dialog with the vehicle pre-filled.
- Fields: name, company, email, phone/WhatsApp, pickup, destination, date, cargo, weight/quantity and additional requirements.
- Uses FormKit validation. The page scroll is locked while open, Escape closes it and focus returns to the button.
- Typed data is kept after a failure; the form starts fresh after success.

**API and email** (`POST /api/enquiries/fleet`, OpenAPI spec and generated clients updated)
- Server-side validation, the shared rate limit, a honeypot, and storage like every other enquiry.
- When configured, an email goes to the logistics team through Resend's HTTP API (`src/lib/mailer.ts`, no new dependency), formatted by `src/lib/fleet-email.ts`:
  - Subject: "Fleet Quote Request — vehicle — pickup to destination".
  - Body: every field, the reference and Riyadh time, with the customer as reply-to and all customer input escaped.
- The outcome (`sent`, `not-configured` or `failed`) is saved on the record, and the website's message reflects it truthfully.
- Settings: `RESEND_API_KEY`, `EMAIL_FROM` and optional `FLEET_QUOTE_EMAIL` (default `info@envodkingdom.net`). **Email is not live until the owner sets up a Resend account with a verified sending domain.**

**Verified:**
- Showroom suite 33/33, twice: without email (emailed=false) and with a local mock provider (emailed=true).
- Email checks 12/12: recipient, sender, reply-to, subject, all fields, HTML escaping, header-injection safety, provider failure, validation and honeypot.
- Database rows record the email outcome.

## 9o. Service cover photos: customs clearance, warehousing, transportation (13 Oct 2026)
Three company-supplied photos are now the covers of their service pages and cards:

| Service | Photo | Files |
| --- | --- | --- |
| Customs clearance | Inspector in a branded vest at a container terminal | `public/assets/photo/customs-clearance-cover-{640,1024}.webp` |
| Warehousing | Racked warehouse with forklifts | `warehousing-cover-{640,1024}.webp` |
| Transportation | Branded truck and trailer on a highway | `transportation-cover-{640,1024}.webp` |

- **Files:** the 1024 px files are byte-identical to the supplied originals (kept in `attached_assets/service-covers/`). The 640 px versions are downscaled for phones.
- **Photo library:** the entries are `customsCover`, `warehousingCover` and `transportCover`, with Arabic alt text. The library now supports per-photo `widths` and focal points (`focus`/`focusMobile`).
- **Where they appear:**
  - The pillar configs (`customs.ts`, `warehousing.ts`, `transport.ts`).
  - The service catalogue cards: the homepage Warehousing and Customs cards, and the Transportation entry.
  - The three Logistics hub pillar cards.
- **Hero layout:** the full-bleed hero hid half the truck behind the heading and darkened the photos to near-invisibility on phones. These three pages now use a split cover (`heroSplit`):
  - The photo is shown whole: beside the text from 1100 px, as a banner above it below that.
  - It feathers into the navy with a mask rather than being covered by an overlay.
  - The other service pages keep the full-bleed hero.
- **Verified** at 1440, 1280, 768, 390 and 360 px, and in Arabic: the correct file loads on every page, 100% of each photo is visible in the hero, nothing scrolls sideways, and layout shift is 0.
- **Limitation:** the originals are 1024 px wide, so on large desktop screens they are shown slightly enlarged.

## 9p. Travel call button, business-specific quotes and enquiry emails (13 Oct 2026)
- **Travel call button:** "Call Airzone Travel" (`tel:+966593567526`) on travel pages, fixed bottom-left opposite the unchanged WhatsApp button.
  - 56 px circle with a tooltip on hover and focus; 52 px on phones, above the action bar.
  - Implemented in `QuickCallButton.tsx`, which also keeps the homepage logistics Quick Call.
- **Quote routing** (`QuoteCta.tsx`): the homepage header, hero, phone action bar and mobile menu ask Travel or Logistics. Travel pages lead to the travel form, and logistics and other pages to the logistics quotation page. The footer lists both quote links.
- **Travel offers:** "Request this offer" now opens the travel form with the offer and destination filled in, instead of WhatsApp.
- **Forms:** both now state which business they reach. Their success text says "submitted successfully" and adds "sent to the … team" only when the email was accepted, otherwise "recorded for the … team".
- **API:** `/enquiries/travel` and `/enquiries/logistics` now email their own teams (shared template `src/lib/email-template.ts`, builders in `src/lib/enquiry-emails.ts`, recipients in `src/lib/recipients.ts`). Each saves the email outcome on the record and returns `emailed`.
- **Verified with a local mock provider:**
  - Quote routing and travel call suite: 39/39.
  - Travel emails go to Ticketing@ and logistics emails to info@envodkingdom.net, with the required subjects and reply-to.
  - Extra recipient fields in a request are ignored, malformed emails are rejected, and a provider failure is reported honestly.
- **Not live:** email still needs a Resend account with a verified domain.

## 9q. Faster phone loading and email for contact and callback forms (18 Oct 2026)
- **Smaller first download.** Every page except the homepage now loads as its own file, only when visited.
  - The main script went from 1,055 KB to 507 KB (307 KB to 162 KB compressed), so the homepage downloads half as much code.
  - The page metadata for client-side navigation (titles, descriptions, canonical links) also loads only when needed. Analytics loads it only after consent.
  - Every page is still prerendered with its full content, so search engines and the first paint are unchanged.
  - Links prefetch their page on hover, focus or touch. While a page loads, the header and footer stay in place.
  - Code:
    - `src/site/lazy-page.tsx`.
    - `preloadRoute` and `preloadAll` in `src/App.tsx`, used by `main.tsx` before hydration and by `scripts/prerender.mjs`.
    - `src/seo/route-info.ts`.
    - `src/config/route-paths.ts`: route lists checked at build time against the page configs.
  - Hydration now waits for the next paint (`main.tsx`), so the first paint never waits for React. Homepage blocking time fell from about 470 ms to about 410 ms in the lab.
- **Fix found during testing.** Links into a section of a page that had not loaded yet landed at the top of the page. One example is the hub's customs branches, such as `/logistics/customs-clearance#food`; 37 such links exist.
  - Keyboard focus also went to the loading placeholder, which then disappeared.
  - The scroll manager (`src/motion/SmoothScroll.tsx`) now waits for the real page before applying the `#` target, back/forward position or focus.
- **Phone speed (Lighthouse, mobile, median of 3):**
  - Home 4.12 s, logistics hub 3.89 s, customs 3.91 s, transportation 3.97 s, warehousing 4.30 s. On 13 Oct these were 4.21, 4.73, 3.98, 3.98 and 4.73 s.
  - 3 of 5 pages are within the 4.0 s budget.
  - The homepage is now limited by the browser's first style and layout pass, not by JavaScript. Details and next steps are in `docs/QA-TOOLING.md`.
  - The Lighthouse tool (`scripts/qa/lighthouse.mjs`) was fixed. It had reported a false ~39 s homepage LCP on this machine because of a headless Chrome setting.
- **Contact and callback emails.** `/enquiries/contact` and `/enquiries/callback` now email the team for the department the visitor chose:
  - Travel & Tourism and Corporate Travel go to `TRAVEL_QUOTE_EMAIL`.
  - Logistics and Customs Clearance go to `LOGISTICS_QUOTE_EMAIL`.
  - General Enquiry goes to the new `GENERAL_ENQUIRY_EMAIL`, defaulting to the logistics inbox.
  - Subjects: "New Contact Enquiry — {business}", and "New Callback Request — {business}" or "Urgent Callback Request — {business}".
  - Contact emails reply to the visitor.
  - Builders are in `src/lib/enquiry-emails.ts` and routing in `src/lib/recipients.ts`.
  - The contact form and callback page say "sent to the relevant Airzone team" only when the provider accepted the email.
- **Verified** with a local mock provider:
  - Contact and callback emails: 9/9 checks pass. Each department reaches the right inbox with the right subject, an extra recipient field is ignored, HTML is escaped, and a provider failure returns `emailed: false` with "received" wording.
  - Browser checks: the contact page and an urgent travel callback both show "sent to the relevant Airzone team". The callback sent one email, to Ticketing@ with the "Urgent" subject.
  - The shared email path still passes: quote routing 39/39, fleet email 12/12.
- **Regression on the final build** (all pass):

  | Area | Result |
  | --- | --- |
  | Code-split checks | 7/7 |
  | Slow-load focus and `#` scroll | 2/2 |
  | Cinematic opening | 42/42 |
  | Showroom | 33/33 |
  | WhatsApp and email | 21/21 |
  | Quick Call | 35/35 |
  | Top bar | 27/27 |
  | Utility pages | 12/12 |
  | Interactions | 42/42 |
  | Pillar pages | 22/22 |
  | Pages | 46/46 |
  | Language | 29/29 |
  | Language-switch scroll | 22/22 |
  | SEO | 15/15 |
  | Services strip | 14/14 |
  | Freight | 27/27 |
  | RTL | 146 pass, 30 skipped by design |
  | Visual | 44/44 |
  | axe | 0 violations |
  | `validate:seo` | pass (94 documents, 7,620 internal links) |

  - Two cinematic checks were updated. They predated the 13 Oct quote chooser and expected the hero's old direct quote link.

## 9r. Design critique fixes and the group divisions section (19 Oct 2026)
- **Critique fixes** (Impeccable critique, run in a single context):
  - **Floating buttons:** they now use logical insets, so they mirror in Arabic. On 1280×720 the Arabic Quick Call had covered the hero's main "Request a quote" button.
  - **Phone heroes:** homepage hero buttons leave a lane for the floating buttons, and the travel hero ends above them.
  - **Process grids:** 7- and 8-step grids now use two rows of four, so no step is stranded alone.
  - **Numbering:** decorative numbers were removed (pillar section labels, service rows, accordions, FAQs, hub lists, travel offers and services). They break the site's own rule of numbers only for real sequences.
- **Group divisions section** (homepage, "Travel and logistics, under one group"), redesigned for clarity, trust and enquiries:
  - **Structure:**
    - The Airzone Group logo, the heading and a self-contained lead state which businesses the group owns and where each operates.
    - On desktop the group visibly branches into the two businesses.
    - Each card shows the official logo and photo, the business name as an `h3` link to its hub, what it does, four service links, one primary enquiry ("Plan your trip" → `/travel/enquiry`; "Request a logistics quote" → `/logistics/request-quote`), and WhatsApp + call for that business only.
  - **Naming:** "Airzone Travels" became "Airzone Travel & Tourism", matching the logo, footer, contact page and structured data. The business names moved from `h2` to `h3` under the section `h2`.
  - **Contacts:** Travel uses WhatsApp +966 54 345 7665 and phone +966 59 356 7526; Logistics uses WhatsApp and Quick Call +966 50 226 0256. All come from `config/business-contacts.ts`. Each card carries `data-division`, so analytics credits each click to the right business.
  - **Motion:**
    - One scrubbed timeline: light, heading, branches, cards, a photo curtain, then details. It plays in reverse when scrolling back.
    - Hover is for mouse devices only: the card lifts, an accent glow layer fades in and the photo eases in.
    - Pressable controls give press feedback.
    - Lighter motion on phones; under reduced motion or without scripts, everything is static and visible.
  - **Performance:** only transforms and opacity animate. The glow is a pre-drawn layer whose opacity fades, and a sliding curtain replaced the clip-path reveal (which repainted the photo every frame).
    - At 4× CPU throttling, scrolling through the reveal ran at a median of 16.7 ms per frame and a 95th percentile of 17.4 ms.
    - Occasional slower frames also appear before the section, from the opening scene.
  - **Service cards beneath:** the band now carries a visible "Airzone Logistics · core services" label. Its hover works on mouse devices only, with press feedback.
- **Skills used:** Impeccable (critique method and craft rules), ui-ux-pro-max (the project copy: colour, CTA and GSAP searches plus its checklists), emil-design-eng, apple-design, animate and animation-performance.
  - review-animations can only be started by the owner (`/review-animations`).
  - 21st-registry publishes components to a 21st.dev account, so it does not apply here.

## 9s. Airzone Travel & Tourism page (19 Oct 2026)
- **Kept as it was:** every piece of content and every feature on `/travel`.
  - The four offers, four services, six travel styles (medical copy keeps its healthcare-professionals caveat), the four process steps, About, six destinations, eight FAQs and the enquiry form.
  - Travel contacts: Ticketing@airzonetravel.net, +966 59 356 7526 and WhatsApp +966 54 345 7665.
- **Hero:** the existing flight frame sequence (shared with the homepage through `components/home/cinematic-assets.ts`) now plays on a short sticky stage (`components/travel/TravelScene.tsx`).
  - The poster image is the LCP element.
  - Under reduced motion the stage is static.
- **Trip planner** (`TripPlanner.tsx`), under the hero: destination, departure city, dates and travellers.
  - It fills the existing enquiry form and scrolls to it.
  - It states plainly that it is not a live booking search; nothing is booked or priced online.
- **Section bar** (`TravelSubnav.tsx`): Offers, Services, Styles, Destinations and FAQ, with the current section marked, plus a "Plan your trip" button.
- **Presets:** the destination, style and offer buttons fill the form the same way. The travel form has gained a `fill()` for its inputs.
- **Header on travel pages:**
  - Travel links: Home, Travel & Tourism, Offers, Services, Destinations, About, Contact.
  - A travel tagline, and a top-bar link to Airzone Logistics.
  - No shipment tracking.
- **Footer:** the travel block no longer shows a personal name (owner request).
- **Analytics:** allowlisted events for the planner, presets and form view. No personal data is sent.
- **Suite:** `travel-suite`, 30 checks.

## 9t. Airzone Logistics hub (19 Oct 2026)
- **Kept as it was:** every piece of content and every feature on `/logistics`:
  - the hero copy and both buttons;
  - the three pillars;
  - all 15 customs categories with their links, the four customs buttons and the Fasah disclaimer (verbatim);
  - transportation;
  - warehousing (four cities and the variation note);
  - the eight specialist services and the customs-authority disclaimer (verbatim);
  - the eight fleet categories and the photo disclaimer (verbatim);
  - why us, process and the final call to action.
  - Contacts are unchanged: info@envodkingdom.net, footer phone 058 367 1739, WhatsApp +966 50 226 0256.
  - No new claims: nothing about operations, certifications, prices, fleet ownership or warehouse specifications.
- **Hero: a shipment's journey** (`components/logistics/LogisticsScene.tsx`).
  - Three real photographs (container port, truck on the road, warehouse aisle) on a short sticky stage.
  - While the visitor scrolls, the camera slowly pushes into each photograph and the next one dissolves in. A step list (customs → transport → warehousing) marks the current one.
  - The headline and both buttons stay readable and clickable throughout. The page then carries on normally, with no scroll trap.
  - **Phones:** one step caption at a time, and the copy stays clear of the floating buttons and the action bar.
  - **Desktop:** the step row and scroll cue sit on one line, and "Saudi Arabia · Serving the GCC" becomes a caption chip in the photograph's corner.
  - **Reduced motion or no scripts:** a static first photograph and a plain step list. The other two photographs are never downloaded.
  - No 3D models exist for the business, so real photography was used rather than invented renders.
- **Pillars:** a rail draws across the three as the section scrolls in.
- **Customs:** the 15 categories are grouped under five headings so a visitor finds theirs quickly:
  - Import & export
  - Temporary imports & exhibitions
  - Product conformity & regulatory documents
  - Food, pharmaceutical & medical
  - Industrial, electrical & project cargo
  
  The columns balance at five links each.
- **Quote links with the service already chosen:**
  - Each specialist service now has "Request a quote" (`?service=<slug>`).
  - Each fleet category has "Request this equipment" (`?service=…&equipment=…`).
  - The quote form preselects both. An unknown equipment value is ignored.
  - The recipient is still set on the server; the client cannot change it.
- **Floating actions on `/logistics`:** Call (+966 50 226 0256, stacked above WhatsApp) and WhatsApp, with "Get a quote" in the phone action bar. Other pages are unchanged.
- **Suite:** `logistics-suite`, 51 checks. It covers the content checklist, the scene (steps, crossfades, a clickable button during the hold, release after the hold), presets, floating actions, phones at 390 and 360 px, Arabic, reduced motion, and fit at 1024–1920 px in English and Arabic.
- **Skills used:** Impeccable (craft rules), ui-ux-pro-max, emil-design-eng, apple-design, animate and animation-performance (transform/opacity only; no copy drift, because the photographs' camera push carries the depth).

## 9u. Navigation and the transparent header (19 Oct 2026)
- **Owner request:**
  - a visible navigation (Services, About, Contact) and a link to the transportation vehicles section;
  - a header that is transparent, blends with the background and stays on screen while scrolling;
  - all of this for both logistics and travel.
- **Navigation:**
  - **Group and logistics pages:** Home · Services ▾ · Vehicles · Locations · About · Contact, plus Track and Request a quote.
  - **Vehicles** opens the homepage "Vehicles & trailers" showroom (`/#vehicles`) from any page.
  - **Travel pages** keep their travel links.
  - **Width:** the bar now shows from 1024px (it used to switch to the menu button below 1181px, which many laptops hit). Between 1024 and 1279px, Home and Locations step aside and Track is icon-only.
- **Services menu:** two zones, so one menu serves both businesses while keeping them distinct.
  - Airzone Logistics: all its services in three groups, plus Vehicles & trailers, Industries and Service locations.
  - Airzone Travel & Tourism: Flights, Hotels, Holiday packages, Visa assistance, Umrah, Corporate travel.
  - Names only, so the panel fits the screen. It scrolls inside if it ever has to.
- **Transparent header:**
  - At the top of the homepage, `/logistics` and `/travel` it floats fully transparent over the hero. The logistics and travel heroes now start under it.
  - Once scrolled, on every page, the strip slides away and the bar stays as frosted glass. The tone follows the section underneath: navy glass with white links over dark sections, white glass with navy links over light ones.
  - The open phone menu always shows the solid white header. Reduced transparency gives near-opaque bars.
  - The homepage's own header animation (`--hdr-dark`, `--hdr-lift`, the solid state C) was removed; the Header handles all pages the same way.
- **Language switch moved to the bar:** the announcement strip slides away on scroll, so the language could only be changed at the top of a page. A compact toggle naming the other language ("العربية" / "English") now sits between Track and Request a quote and keeps the reading position. The strip keeps the tagline, email and the other business's link. On phones the strip held only the language switch, so it is gone and the toggle sits in the bar. Tests that clicked the switch in the strip were updated, including `scripts/qa/rtl.spec.mjs`.
- **Fix found on the way:** links to a section of the page already open (e.g. "Offers" on `/travel`, "Vehicles" on the homepage) changed the address but did not scroll. The router took the click. Such links are now plain anchors handled by SmoothScroll.
- **Suite:** `nav-suite`, 52 checks:
  - the bar at 1024/1140/1280/1440px on six pages (English and Arabic), with no overlaps;
  - the phone menu;
  - both Services zones;
  - Vehicles from the homepage and from `/contact`;
  - Offers on `/travel`;
  - the tones over dark and light sections, the strip slide, the travel section bar sticking under the header, and reduced motion.
  - the language toggle mid-page (it switches and keeps the section in view) and on phones.
- **Regression after this change:**
  - cinematic 42/42, showroom 33/33, WhatsApp/email 21/21, quick call 35/35, top bar 27/27;
  - divisions 18/18, travel 30/30, logistics 51/51, utility 12/12, interaction 42/42, pillar 22/22, pages 46/46;
  - language 29/29, language-switch position 22/22, search appearance 15/15, strip 14/14, code split 7/7, freight/About 27/27 (re-run after the API's 15-minute form rate limit reset);
  - English/Arabic 146 passed, 0 failed; axe 0 violation types; `validate:seo` PASS.
- **Visual:** 29 snapshots changed (all phones, where the strip is gone and the toggle is in the bar; on desktop, the overlay pages, track and contact). Reviewed, regenerated, then 44/44 passed.
- **Tests updated for the new header:**
  - header states: clear, then dark or light glass, with the strip sliding away;
  - landing positions measured below the bar;
  - the language switch clicked in the bar.

## 9v. AI search readiness (GEO), 20 October 2026
- The owner's 20-point GEO checklist was audited with GEO Optimizer 4.19.5 on the local production preview. Status per item: `docs/GEO-CHECKLIST.md`.
- **Scores:** homepage 67 → 81, logistics 82, customs 83, About 80, travel 80 (68–85 = "good"). Each gains about 2 more points on the live domain, where the canonical matches.
- **Added:**
  - **`robots.txt`:** names the search and AI-answer crawlers explicitly (Googlebot, Bingbot, OAI-SearchBot, GPTBot, Claude-SearchBot, ClaudeBot, PerplexityBot and others), with the private paths blocked.
  - **Robots meta:** allows full snippets and large previews.
  - **`/llms.txt`:** built from the page titles and descriptions, plus key facts and contacts.
  - **Dates:** `dateModified` and author/publisher in each page's structured data, and a visible "Page updated" date in the footer. Dates come from page configs or `contentUpdated` in `seo/site.ts`.
  - **`sameAs`:** from `socialLinks` once real profiles are added.
  - **About:** an "At a glance" facts list.
  - **Logistics hub:** a service comparison table and a question-led FAQ (`config/logistics-hub-geo.ts`, also emitted as FAQPage).
  - **Webmaster tools:** Bing (`BING_SITE_VERIFICATION`) and Google (`GOOGLE_SITE_VERIFICATION`) verification tags.
  - **IndexNow:** key file and submit script (`INDEXNOW_KEY`, `pnpm run indexnow -- --confirm`).
  - **Server:** Brotli compression.
- **Not invented:** statistics, expert quotes, author bios and original data are waiting on owner material.

## 9w. Pre-launch review, 20 October 2026
Full report and owner checklist: `docs/LAUNCH-READINESS.md`. Fixes made during the review:
- **Main script size:** back from 250 KB to 161 KB (compressed). The footer date had imported the page-metadata registry into the main bundle. It now reads the date from the server render during hydration and loads the registry on demand after client navigation (`seo/page-updated.ts`). That also removed a hydration mismatch (React #418) seen when a lazily loaded page re-rendered.
- **Caching:** versioned assets get `immutable` caching on every platform. The server had matched the file path, which failed on Windows.
- **Phone layout shifts removed:**
  - The CSS default for the phone header height (`--az-header-h`) was still 103px after the announcement strip was removed from phones; it is now 67px.
  - The logistics scene now renders one step caption from the first paint on phones, instead of collapsing three into one on hydration.
- **Phone LCP:**
  - The hero lead paragraph stays visible from the first frame, with an upward nudge instead of a fade-from-zero, which delayed the browser's LCP by about 0.7 s.
  - The buttons arrive earlier.
  - The main script loads at low fetch priority.
  - The logistics scene's second and third photographs download after page load.
  - Result: the logistics hub's lab LCP went from 4.39 to 3.62 s, and its real LCP now equals first paint.
- **Accessibility:**
  - About facts: emails and phones are `dir="ltr"` links with an underline; foreign-script names carry `lang`.
  - Duplicate ids fixed on the container-destuffing and exhibition pages.
- **Admin:** the footer "Admin access" link is hidden until the admin sign-in works (`VITE_SHOW_ADMIN_LINK=true`). The admin UI has no Clerk sign-in wired in; this was already true in the original project. The API's role-based Clerk protection is in place.

## 9x. Logistics email address changed (20 October 2026)
- At the owner's request, the Airzone Logistics email is now **info@envodkingdom.net**, replacing fazlu@kingdomlogistics.net everywhere.
- **Website:** `businessContacts.logistics.emails` (`config/business-contacts.ts`), the single source for the header top bar, phone menu, footer, Contact page, quote forms, About facts, structured data and `/llms.txt`.
- **Server:** the default recipients for logistics, fleet and general enquiries (`api-server/src/lib/recipients.ts`), plus `.env.example` and the footer docs.
- **Host settings:** if `LOGISTICS_QUOTE_EMAIL`, `FLEET_QUOTE_EMAIL` or `GENERAL_ENQUIRY_EMAIL` are set to the old address, update them; they override the defaults.

## 9y. Vercel hosting (21 October 2026)
Full guide: `docs/DEPLOY-VERCEL.md`.
- **Build:** `vercel.json` plus `pnpm run vercel-build` write a Vercel Build Output API folder (`.vercel/output`):
  - the prerendered site as static files;
  - a routing table that reproduces `scripts/serve.mjs`;
  - the Express API bundled as one Node.js 22 function under `/api`.
- **Shared code:** both hosts use the same security headers (`scripts/headers.mjs`); the server and function builds use the same esbuild settings (`api-server/build-options.mjs`).
- **Rate limit fix:** the API now trusts one proxy hop (`trust proxy`), so the enquiry rate limit counts each visitor's own IP instead of the platform proxy's. This applies to Replit too.
- **Smoke test:** `pnpm --filter @workspace/airzone-group run check:deploy -- <url>` checks a deployed site (read-only).
- **Verified locally:**
  - routes valid against Vercel's own schema;
  - 211 paths route identically to the Node server;
  - the function answers health, parses bodies, protects admin routes and rate-limits per visitor;
  - the smoke test passes all 212 checks locally.
  - Not yet run on Vercel itself (needs the owner's account).

## 10. Tests executed
Workspace typecheck (pass); production build (pass); `validate:seo` (pass);
32 browser interaction checks in headless Chrome (all pass: hydration, menus,
keyboard, Swiper, tabs, WebGL, validation, failure fallback, language switch,
mobile menu, reduced motion, redirects, 404); axe-core WCAG 2.2 AA audit of 20
pages in EN/AR (0 violations); screenshots at 360, 390, 768, 1440 and 1920 px
(no horizontal overflow); favicon assets (HTTP 200, correct types, ICO with
16/32/48 px, transparent circular corners); Lighthouse (above); `pnpm audit`.
No automated unit-test suite exists in the project.

Latest round (after the design/motion pass): typecheck and both builds pass;
`validate:seo` PASS (78 documents, 54 sitemap URLs); every prerendered route
loaded in Chrome with 0 hydration mismatches and 0 console errors (only the
expected 401s on admin/portal without sign-in); 42/42 interaction checks;
16 checks of the new features (15 pass; the 16th flagged only the expected
404 from looking up a made-up tracking number); axe-core 0 violations on 16
EN/AR pages; quote (EN/AR), contact and callback forms submitted end to end
to the real API with rows verified in Postgres (local PGlite).

Freight, exhibition and About round (12–13 Oct 2026), against the final
root build: `pnpm run build` at the repository root (typecheck + all packages)
PASS; `validate:seo` PASS (96 documents, 72 sitemap URLs, 7,654 internal
links, 634 local images); new freight/exhibition/About suite 27/27 (schema,
canonical/hreflang, unique titles and descriptions across all 72 sitemap
URLs, accuracy checks, air/sea/destuffing/exhibition forms stored by the API
with structured payloads, date rules, presets, language switch, 360/768 px
overflow); pillar 22/22; pages 45/45; cinematic 42/42; language 28/28;
interaction 42/42; content audit 21/21; route sweep 96/100 clean (the 4 are
the expected admin/portal 401s); axe-core 0 violation types on 22 EN/AR pages;
form end-to-end 14/14 with rows verified in Postgres (local PGlite).

Qassim removal and search-appearance round (13 Oct 2026), final root build:
`pnpm run build` PASS; `validate:seo` PASS (94 documents, 74 sitemap URLs,
7,470 internal links); search-appearance suite 15/15 (metadata lengths and
uniqueness, canonical, reciprocal hreflang, OG, structured data, breadcrumbs
matching visible trails, sitemap URLs 200 and self-canonical, robots,
single-hop redirects, crawlable navigation, language switcher); Qassim check
17/17 (no mention in any built page, bundle, sitemap or map; old URL 404);
pillar 22/22; pages 45/45; cinematic 42/42; language 28/28; interaction
42/42; content audit 21/21; freight/About 27/27; sweep 94/98 (4 expected
401s); axe 0 violation types on 25 pages; forms end-to-end 14/14.

Transformation and WhatsApp/email round (13 Oct 2026), final build:
- Typecheck passes; build passes (94 documents, 74 sitemap URLs); `validate:seo` PASS (7,554 internal links).
- WhatsApp/email routing: 21/21 across every public route.
- Suites: utility flows 12/12; interaction 42/42; pillar 22/22; pages 46/46; language 29/29 (re-run alone after the machine's network dropped mid-run); language-switch position 22/22; search appearance 15/15; strip 14/14; freight/About 27/27.
- English/Arabic: 133 passed, 0 failed, 27 skipped.
- Visual: 40/40 against the reviewed, regenerated baselines.
- Every public route at 1440 px and 390 px: no sideways page scrolling.
- Lighthouse: see `docs/QA-TOOLING.md`. Mobile LCP is about 4.1 s (median), against a 4.0 s budget.

Travel and logistics round (19 Oct 2026), final build (local production preview):
- Typecheck and build pass (94 documents, 74 sitemap URLs). `validate:seo` passes with 6,888 internal links, down from 7,620. The drop comes from the travel header: travel pages no longer carry the logistics Services menu and link to `/logistics` from the top bar instead.
- New suites: logistics 51/51, travel 30/30, group divisions 18/18.
- Existing suites:
  - interaction 42/42, cinematic 42/42, showroom 33/33, WhatsApp/email routing 21/21, quick call 35/35, top bar 27/27;
  - utility flows 12/12, pillar 22/22, pages 46/46, language 29/29, language-switch position 22/22;
  - search appearance 15/15, strip 14/14, freight/About 27/27, code split 7/7, slow-load focus 2/2.
- English/Arabic: 146 passed, 0 failed, 30 skipped. axe: 0 violation types on 18 EN/AR pages (including `/ar/travel`, `/ar/logistics` and the quote form with presets).
- Lighthouse, median of 3 (mobile LCP / desktop performance): home 3.68 s / 100, logistics hub 3.74 s / 98, travel 3.68 s / 99. All within budget; details in `docs/QA-TOOLING.md`.
- Visual: all 44 snapshots differed from the 13 Oct baselines. Each difference was reviewed and traced to an intended change: footer (no personal name; separate logistics and travel quote links), travel and logistics redesigns, the divisions section, two-row process grids, and removed decorative numbers. Baselines were regenerated, then 44/44 passed.
- Tests updated for intended behaviour, with the date noted in each:
  - footer without a personal name;
  - the travel tagline on travel pages;
  - the floating logistics call on `/logistics`;
  - travel style links filling the on-page form;
  - the form landing below the travel section bar;
  - fleet links carrying `&equipment=`.
- The contact/callback email suite needs the mock mail provider and was not re-run. Email routing code did not change after its 9/9 pass on 18 Oct.

Known minor issue: in about one in three automated runs, Back restored a long
page roughly 60 px from the saved position (lazy images settling); manual
use is unaffected.

## 11. Build status
`pnpm run typecheck` and `pnpm --filter @workspace/airzone-group run build` succeed.

## 12. Missing company information (needed to go further)
Logistics phone, office address and legal name; Dayana logo and
service areas; warehouse addresses, temperature ranges and capacities; which
vehicles are owned versus partner-operated; licences and certifications; real
photographs; social profile URLs; a Google review URL; Arabic copy review by a
native speaker; legal review of the privacy notice and terms.

## 13. Environment variables
See `.env.example`. API: `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`,
`CLERK_SECRET_KEY`, optional `ALLOWED_ORIGINS`. Website: optional
`VITE_GA4_MEASUREMENT_ID`, `CSP_ENFORCE`, `ENABLE_HSTS`, and for local
testing `API_PROXY_TARGET` (dev and serve forward `/api` to it).

## 14. Run locally
See README.md (`pnpm install`, `pnpm --filter @workspace/airzone-group run dev`,
or `build` + `serve`).

## 15. Deployment steps
On Vercel, follow `docs/DEPLOY-VERCEL.md`. On Replit or another Node host:
1. Set the environment variables on the host (Replit Secrets or equivalent).
2. Publish both services (website + API under `/api` on the same domain).
3. Connect `airzonegroup.com` and `www` (the server already 301s www → apex) and verify HTTPS.
4. Check `/`, `/ar/`, a service page, a legacy URL (301), an unknown URL (404), `/robots.txt` and `/sitemap.xml` on the live domain.
5. Submit an enquiry and confirm it appears in Admin.
6. Review the CSP report-only console output, then optionally set `CSP_ENFORCE=true`; enable HSTS after HTTPS is stable.
7. Verify the domain in Search Console and Bing, then submit the sitemap. Favicon and listing updates in Google happen on Google's schedule.
8. Measure field Core Web Vitals after launch.
