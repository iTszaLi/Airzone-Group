# Airzone Group design system

How the public website looks and moves, documented from the code. The source of truth is
`artifacts/airzone-group/src/styles/airzone.css` (all `az-` classes and `--az-` tokens). When
the CSS and this page disagree, the CSS wins: fix this page.

`src/index.css` also holds the Tailwind/shadcn theme (`--background`, `--primary`, ...) and
older classes used by the admin and customer portal screens. New public-site work uses the `az-`
layer only; do not mix the two on one surface.

## Colour

Palette derived from the official logo (navy, Airzone blue, green). Contrast targets set in the
CSS: body text at least 7:1, muted text at least 4.5:1, white on buttons at least 4.5:1.

| Token | Value | Use |
| --- | --- | --- |
| `--az-navy-950` | `#061a33` | Darkest surfaces: heroes, `.az-dark` sections, cinematic shade |
| `--az-navy-900` | `#0b2545` | Navy buttons, outline buttons, mobile action bar, icon buttons on hover |
| `--az-navy-800` | `#12345e` | Navy button hover |
| `--az-navy-700` | `#1b4677` | Secondary navy |
| `--az-blue-600` | `#0d5fc4` | Text links, eyebrow numbers, active ghost buttons |
| `--az-blue-500` | `#1a8be0` | Focus ring |
| `--az-blue-100` / `--az-blue-50` | `#d6e8fb` / `#eef5fd` | Tinted backgrounds |
| `--az-green-800` | `#186616` | Primary button hover |
| `--az-green-700` | `#1f7a1d` | Primary buttons, eyebrow text, first mobile-bar action |
| `--az-green-600` / `--az-green-500` | `#2c9028` / `#3aa635` | Accents, eyebrow gradient end |
| `--az-green-300` | `#7cc556` | Accents on dark backgrounds (light eyebrow, strip icons, focus on dark) |
| `--az-green-50` | `#edf7e9` | Green tint |
| `--az-ink` | `#0f1d2e` | Headings |
| `--az-text` | `#2e3f52` | Body text |
| `--az-muted` | `#556677` | Secondary text |
| `--az-line` / `--az-line-strong` | `#dde4ec` / `#c5d0dc` | Borders and dividers |
| `--az-surface` | `#f4f7fa` | Muted panels (`.az-card-muted`), image placeholders |
| `--az-danger` | `#b3261e` | Errors |

On dark sections, text is `#dbe6f1` with leads at `#c3d0de` and headings white. Gradient overlays
on photographic heroes use navy-950 at 0.12–0.94 alpha; in Arabic the gradient direction flips
(270deg) so text always sits on the dark side.

## Typography

| Role | Font | Notes |
| --- | --- | --- |
| Headings (`--az-head`) | Manrope Variable | Weight 650, tight tracking (-0.025em), `text-wrap: balance` |
| Body (`--az-body`) | DM Sans Variable | |
| Arabic (both roles) | IBM Plex Sans Arabic 400–700 | Swapped in under `html[dir='rtl']` |

All fonts are self-hosted through `@fontsource` (imported in `src/main.tsx`); nothing loads from
Google Fonts.

| Element | Size |
| --- | --- |
| Page hero `h1` | `clamp(32px, 4.4vw, 56px)`, max 22ch |
| Section `h2` | `clamp(28px, 3.3vw, 44px)`, line-height 1.12 |
| Section `h3` | 19px, line-height 1.3 |
| Lead (`.az-lead`) | `clamp(17px, 1.4vw, 19px)`, line-height 1.7 |
| Long-form prose | 16px, line-height 1.75 |
| Eyebrow (`.az-eyebrow`) | 12.5px, 700, uppercase, 0.14em tracking, green-700, with a 26px blue→green bar |

Arabic rules: no letter-spacing and no uppercase transforms on Arabic text, and headings get a
taller line-height (1.25–1.4). Every `html[dir='rtl']` override in the CSS follows this.

## Spacing and layout

| Token / class | Value |
| --- | --- |
| `--az-gutter` | `clamp(16px, 4vw, 40px)` (page side padding) |
| `.az-container` | max width 1240px inside the gutters |
| `.az-section` | vertical padding `clamp(64px, 9vw, 120px)` |
| `.az-section-tight` | vertical padding `clamp(44px, 6vw, 80px)` |
| `--az-radius-sm` / `--az-radius` / `--az-radius-lg` | 10px / 14px / 20px |
| `--az-shadow-sm` | small lift for cards and controls |
| `--az-shadow` | large soft shadow for raised panels |

Breakpoints in use: 640px (phones; grids collapse to one column and rows become swipeable),
760px, 900/901px (desktop-only motion starts at 901px), 1100px, 1180px (four-column grids drop
to two). Use logical properties (`margin-inline`, `padding-inline`, `inset-inline`) everywhere so
layouts mirror in Arabic.

## Components

| Component | Class | Notes |
| --- | --- | --- |
| Button | `.az-btn` + variant | Min height 48px (`-sm` 40px, `-lg` 54px), radius 10px, 650 weight. Variants: `-primary` (green), `-navy`, `-outline`, `-outline-light` (on dark), `-ghost` (also marks the current page). |
| Text link | `.az-text-link` | Blue-600, underline on hover, trailing arrow with `az-flip`. |
| Icon button | `.az-icon-btn` | 44px circle; carousel controls (dims when disabled). |
| Eyebrow | `.az-eyebrow` | Short label with a blue→green bar. No decorative section numbers: use numbers only where order matters (process steps, shipment updates, carousel position). Pillar sections, service rows, accordions, FAQs, hub lists and travel cards are unnumbered. Process grids of 7–8 steps use two rows of four (`.pk-steps[data-count]`). |
| Card | `.az-card`, `.az-card-muted` | White or surface panel, 20px radius, 1px line border. |
| Service card | `.az-service-card` | Photo card, min height 300px, text over a navy gradient. |
| Service strip | `.az-svc-strip` / `.az-svc` | Homepage strip: four cards (1.3fr + 3 × 1fr), first one highlighted (`.is-primary`). No metrics. |
| Page hero | `.az-page-hero` | Navy, min height 460px (`-compact` 340px), photo with directional gradient. Without a photo (`PageHero` with no `photo`) it renders as a plain navy band (`.az-page-hero-plain`) for legal, utility and 404 pages. With `split` (`heroSplit: true` in a pillar config, used by customs clearance, transportation and warehousing), the cover photo is never cropped or darkened. From 1100px up it sits beside the text at its own shape, bleeding off the reading-end edge and feathered into the navy with a CSS mask. Below 1100px it is a full-width banner above the text. |
| Dark section | `.az-dark` | Navy-950 background with light text tokens. |
| Header | `.az-header` (`Header.tsx`) | Always on screen, blending with what is behind it. The state lives in attributes, set from a rAF-throttled scroll check:
`data-overlay` (homepage, `/logistics`, `/travel`): the header is fixed over the hero.
`data-tone`:
• `clear` — top of an overlay page: transparent, with a soft top gradient so white links stay legible over bright sky.
• `solid` — top of other pages: the white bar.
• `dark` / `light` — once scrolled: frosted glass whose tone follows the first opaque background under the bar.
`data-lift` (past 40px): the strip slides away; only the bar (`--az-nav-h`) stays.
Under reduced transparency, or without `backdrop-filter`, the bars are near-opaque. The logo always sits on its white badge. |
| Main navigation | `.az-nav-desktop`, `[data-nav-extra]` | Group and logistics pages: Home · Services ▾ · Vehicles (`/#vehicles`, the homepage showroom) · Locations · About · Contact, then Track, the language toggle (`LanguageToggle`: one button naming the other language, in the bar so it stays reachable on scroll) and Request a quote. Travel pages: their own travel links. Phones have no announcement strip. The full bar shows from 1024px. Between 1024 and 1279px it is compact: `[data-nav-extra]` items (Home, Locations; About on travel pages) step aside and Track is icon-only (label kept, plus a tooltip). Below 1024px: the menu button. Links to a section of the page already open render as plain anchors (`Link` in `site/locale.tsx`), so SmoothScroll scrolls below the header. |
| Services menu | `.az-mm-*` (`ServicesMenu.tsx`) | Two zones: Airzone Logistics (Customs clearance & freight as a double column, Transportation, Warehousing; a row with Vehicles & trailers, Industries and Service locations; "All logistics services") and Airzone Travel & Tourism (its own lagoon-tinted card: logo, six services, "Explore travel & tourism"). Names only, no descriptions, so the panel stays short. It is capped at the screen height below the header and scrolls inside if needed. |
| Mobile action bar | `.az-mobile-bar` | Phones only, fixed bottom, two actions (green quote, navy callback). |
| Form field | `.az-field` | Label above input; selects mirror their arrow in Arabic. Validation via `useValidatedForm` (FormKit): inline errors plus a focused error summary. |
| Long-form text | `.az-prose` | Children limited to 72ch, aligned with the page heading. Used by privacy, terms, reviews and portal. |
| Principles list | `.az-why-list` | Open four-column list under one rule (icon, heading, text). Replaces boxed hover cards. |
| City rows | `.az-city` | Each warehouse city is a link to its own page, with a mirrored arrow. Rows that look interactive must be links. |
| Photo focal point | `img[data-focus]` | `focus` and `focusMobile` (up to 640px) in `config/photography.ts` set the photo's `object-position` wherever it is cropped (cards, heroes), so the subject stays in view. Photos can also list their own `widths` when they exist only in smaller sizes. |
| Fleet showroom | `.az-sr-*` (`FleetShowroom.tsx`) | Homepage. One vehicle on a studio stage (`--az-stage: #eceef0`), with previous/next controls on the stage edges (under the photo on phones), swipe, a grouped picker (tablist with roving focus), and facts and actions beside the stage. Photos are normalised to the stage colour by `scripts/prepare-fleet-images.py`, so keep the token and the script's `STAGE` identical. Data lives in `src/config/fleet.ts`. |
| Group divisions | `.az-div-*` (`CinematicOpening.tsx`) | Homepage, after the opening scene. The Airzone Group logo, `h2` and lead branch into the two businesses: a stem, a bar and one drop per card (desktop, `aria-hidden`). Each card (`DivisionCard`) has a photo with the official logo, the business name as an `h3` link to its hub, what it does, four service links, one primary enquiry, and WhatsApp + call for that business only (`data-division` keeps analytics attribution right). Accents: travel `--az-blue-500` / text `#8fbfff` / button `--az-blue-600`; logistics `--az-green-500` / `--az-green-300` / `--az-green-700`. The article is what GSAP moves; the inner `.az-div-card` carries the surface and the hover lift (GSAP writes inline transforms on what it animates). The hover glow is a separate layer whose opacity fades. The call number shows only when the card is at least 470px wide (container query); otherwise it stays in the link's accessible name. |
| Travel hero scene | `.tv-scene*` (`TravelScene.tsx`) | `/travel`. The homepage flight frame sequence (shared sets in `cinematic-assets.ts`) on a short sticky stage that starts at the top of the page, under the transparent header (its copy is padded by `--az-header-h`). The stage uses `min-height`, never `height`, so long copy grows it instead of clipping. On phones the logo tile steps aside and the copy ends above the floating buttons. Followed by the trip planner (`.tv-planner*`), which fills the enquiry form, and the section bar (`.tv-subnav*`). Travel accents: `--tv-lagoon`, `--tv-sand`. |
| Logistics journey scene | `.lg-scene*` (`LogisticsScene.tsx`) | `/logistics`. Three photographs (port, road, warehouse) stacked on a short sticky stage, with a step list underneath (`data-active` marks the current step; without it all steps are at full contrast). Desktop: the steps and scroll cue sit on one row kept clear of the floating-button lane, and the place line is a glass caption chip in the photo's top inline-end corner. Phones: one step caption at a time, and the copy leaves the inline-end lane to the stacked call and WhatsApp buttons. Reduced motion: the first photo only (the others are `display: none`, so never downloaded). |
| Customs groups | `.lg-cu-groups` / `.lg-cu-group` | The 15 customs categories under five `h3` headings in CSS columns (`columns: 3 260px`, groups never split). Group order (`CU_GROUPS` in `LogisticsHub.tsx`) is chosen so the columns balance. |
| Quote with preset | `.lg-fr-quote`, fleet "Request this equipment" | Pill links beside "Service details" open `/logistics/request-quote?service=<slug>` (and `&equipment=<value>` from the fleet). The quote form preselects only values it offers. |
| Key facts | `.ab-facts`, `.ab-facts-list` (About) | A definition list (`dl`): label column and fact column, two columns on desktop and stacked on phones. Facts come from the verified config. Emails and phones are `dir="ltr"`, and foreign words carry `lang`. |
| Comparison table | `.lg-cmp` (logistics hub) | A real `<table>` with a hidden caption; row headers link to each service. Below 760px the rows stack as cards with `data-label` captions; table roles keep the table semantics. |
| Questions and answers | `.lg-faq-list` (logistics hub) | Question `h3` plus an always-visible answer, in two columns. The same words feed the FAQPage structured data (`config/logistics-hub-geo.ts`). |
| Page updated | `.az-footer-updated` (footer) | Shows the page's last content update next to the copyright, the same date as `dateModified`. It loads without putting the metadata module in the main bundle (`seo/page-updated.ts`). |
| Quote panel | `.az-qd*` (`VehicleQuoteDialog.tsx`) | Native modal `<dialog>` at the inline end (a full-screen sheet on phones), animated with `@starting-style`. Uses FormKit validation. Success text depends on whether the API emailed the team. |
| Shipment lookup | `.az-track-*`, `.az-shipment-*` | `/track`: lookup card plus a result panel with empty, loading, not-found and result states; status, route, details and a timeline of updates. |

## Motion

| Rule | Value |
| --- | --- |
| Easing token | `--az-ease: cubic-bezier(.22, 1, .36, 1)` (strong ease-out) |
| Hover nudge | Arrows move 3px along the reading direction (`translateX(3px)`, mirrored in Arabic) |
| Smooth scroll | Lenis, `duration: 1.05`, driven by the GSAP ticker; off under reduced motion |
| Scroll effects | `useMotion(ref, direction)` in `src/motion/use-motion.ts`, opt-in data attributes: `data-reveal`, `data-stagger`, `data-img-reveal`, `data-parallax`, `data-pin`, `data-curtain`, `data-scrub-line`, `data-line`, `data-count`, `data-progress`, `data-hero-bg` |
| Homepage opening | Scroll-scrubbed frame sequence (WebGL, `scrub: 0.35`) in `CinematicOpening.tsx`; poster frame when motion is off |
| Group divisions reveal | One scrubbed ScrollTrigger timeline (desktop): ambient light, then heading items (y 32px), then the stem (`scaleY`), the bar halves (`scaleX` from the centre, mirrored in Arabic), the drops, then each card (y 56px, x 28px from its reading side). A curtain slides off each photo (`yPercent`, composited), and the card details follow (30–35ms apart). Phones: a lighter per-card rise. Everything is visible without scripts and under reduced motion. |
| Travel hero | One scrubbed timeline from the top of the page until the stage leaves: frames play, the camera pushes in (1.14 desktop / 1.08 phones), the poster fades, and the copy drifts up. Static under reduced motion. |
| Logistics journey | One scrubbed timeline over the hold (`start: 0` to `'bottom bottom'`, `scrub: 0.4`). Each photo gets a third: the camera pushes in (`scale`), and the next photo dissolves in over 8% of the timeline. The step marker switches at each dissolve's midpoint. The copy does not move, so the buttons stay put and the breadcrumb never slides under the header. |
| Fleet showroom move | The incoming vehicle travels 14% of the stage width from the side it comes from (0.64s, `--az-ease`), with opacity over 0.42s and a blur from 6px to 0. The outgoing vehicle moves 10% the other way and fades over 0.36s. Text follows 0.12s later. Mirrored in Arabic. Under reduced motion it becomes a crossfade. Swipe tracks the finger 1:1 and projects the flick. |

Principles, all enforced in the code:

- Content is visible by default. Motion only enhances: if scripts fail, time out, or the visitor
  prefers reduced motion, every section renders statically (`data-motion="off"`).
- Content already on screen when motion starts is never hidden and re-shown.
- Parallax, pinning and curtains are desktop-only (901px and up).
- Horizontal movement mirrors in Arabic.
- Transitions name their properties (no `transition: all`).
- Hover motion only under `@media (hover: hover) and (pointer: fine)`; pressable controls scale to 0.97 on `:active`.
- Animate `transform` and `opacity` (and individual `translate` / `scale`). Fade a pre-drawn shadow layer instead of animating `box-shadow`, and slide a curtain instead of animating `clip-path`.
- Floating buttons (WhatsApp, Quick Call, travel call) use logical insets, so they mirror in Arabic and never sit on top of the right-aligned Arabic hero.
- Switching language keeps the section being read (`keepReadingPosition` in `SmoothScroll.tsx`); the logo returns to the top of the homepage.

## Accessibility baseline

- Focus ring: 3px solid blue-500, 3px offset, on every interactive element.
- Touch targets at least 44px (buttons 48px, icon buttons 44px, mobile bar 54px).
- Contrast targets as listed under Colour; axe runs are expected to stay at zero violations.
- Reduced motion is respected everywhere (see Motion).

## Changing the system

1. Add or change tokens in `:root` in `airzone.css` and reuse them; avoid one-off hex values.
2. Check both languages (`.claude/skills/airzone-rtl-check`, `pnpm run qa:rtl`).
3. Run `pnpm run qa:visual`; after an intended visual change, refresh the baselines with
   `pnpm run qa:visual:update` and review the image diffs before committing.
4. Update this page.
