# QA tooling

Repeatable checks for the public website, kept in the `@workspace/scripts` package
(`scripts/qa/`). Run everything from the repo root after `pnpm run build`; each command serves
the production build itself (set `QA_BASE_URL=http://127.0.0.1:<port>` to test a server that is
already running). The checks use the installed Google Chrome; on a machine without Chrome, run
`pnpm --filter @workspace/scripts exec playwright install chromium` and set `QA_CHANNEL=chromium`.

| Command | What it does | Time |
| --- | --- | --- |
| `pnpm run qa:rtl` | English/Arabic checks on 10 key pages, desktop and mobile | ~1–2 min |
| `pnpm run qa:visual` | Full-page screenshots compared with the committed baselines | ~35 s |
| `pnpm run qa:visual:update` | Rewrites the baselines after an intended design change | ~35 s |
| `pnpm run qa:lighthouse` | Lighthouse / Core Web Vitals audit with budgets | ~3–4 min |

Reports go to `scripts/qa-reports/` (git-ignored): the Playwright HTML report in
`qa-reports/playwright/index.html`, and per-run Lighthouse folders with an HTML report per page
plus `summary.md`.

## Pages covered

`scripts/qa/pages.mjs` lists the key pages: home, logistics hub, customs clearance, warehousing,
transportation, air freight, request a quote, track, about, contact, travel. Each runs in English and Arabic.
Add a page there to include it in every suite.

## English/Arabic checks (`qa/rtl.spec.mjs`)

For every key page:

1. The server HTML has the right `lang` and `dir`, and hreflang links to both twins.
2. Both twins render in the right direction with no sideways scrolling.
3. `.az-flip` icons are mirrored in Arabic. Right-pointing icons without `az-flip` are listed as
   "review" annotations rather than failures.
4. Phone numbers, emails and their inputs stay left-to-right in Arabic.
5. Internal links on Arabic pages keep the `/ar` prefix.
6. No English text, `alt`, `aria-label`, `placeholder` or `title` on Arabic pages. All-caps
   acronyms pass; proper nouns are allow-listed in `LATIN_ALLOWED`; text marked `lang="en"` or
   `dir="ltr"` is skipped.
7. The language switcher moves to the twin page and back (desktop header and mobile menu).

The project skill `.claude/skills/airzone-rtl-check` explains how to read and fix each failure.

## Visual regression (`qa/visual.spec.mjs`)

22 pages (11 × EN/AR) on desktop (1440 px) and mobile (390 px) = 44 baselines in
`scripts/qa/__screenshots__/` (about 29 MB). Screenshots use reduced motion, so the homepage
opening shows its poster frame and every section is static. Photos, video and canvas are masked
with flat grey, so the comparison covers layout, type and colour. A difference above 0.2% of
pixels fails. Baselines are produced by Chrome on Windows; another OS renders fonts slightly
differently, so regenerate baselines on the machine that runs the checks.

## Lighthouse (`qa/lighthouse.mjs`)

Audits home, logistics hub, customs clearance, request a quote and contact on mobile (Lighthouse's
throttled phone profile) and desktop. Options: `--pages=`, `--locales=en,ar`, `--form=mobile`,
`--runs=3` (median), `--url=`, `--no-fail`. Budgets live in `qa/lighthouse-budgets.json`:
performance ≥ 70 mobile / ≥ 90 desktop; accessibility, best practices and SEO ≥ 95;
LCP ≤ 4.0 s mobile / ≤ 2.5 s desktop; CLS ≤ 0.1; TBT ≤ 600 ms mobile / ≤ 300 ms desktop.

Lab results vary between runs and machines. Compare trends on the same machine, use `--runs=3`
before acting on a borderline number, and confirm real-user Core Web Vitals in Search Console
once the site is live.

## Results on 13 Oct 2026 (production build, local)

### First run (before the transformation pass)
- English/Arabic checks: 110 passed, 20 failed. The failures were English `alt` text and untagged photo credits on Arabic pages.
- Found and fixed during setup: `/travel` scrolled 529 px sideways on phones (the offer CTA's `.sr-only` label escaped the swipeable row).
- Lighthouse, mobile LCP: home 4.9 s, logistics hub 4.1 s, customs 4.2 s. Desktop scored 99–100.

### After the transformation pass
- English/Arabic checks: **133 passed, 0 failed** (27 skipped by design). This includes the new test that a language switch keeps the section being read.
- Visual comparison against the old (pre-pass) baselines: 27 of 40 differed. Each difference was reviewed. Two were regressions and were fixed: the About "Principles" grid had lost its styles, and the corporate travel guide was unstyled. The rest were intended changes. Baselines were then regenerated, and a re-check passes 40/40.
- The screenshot capture timeout was raised to 20 s: under load, the tall mobile homepage sometimes took longer than the 5 s default to capture.
- **Lighthouse, final build, mobile, median of 3 runs:**

  | Page | Performance | LCP | TBT | CLS |
  | --- | --- | --- | --- | --- |
  | Home | 82 | 4.13 s | 40 ms | 0 |
  | Logistics hub | 83 | 4.05 s | 2 ms | 0 |
  | Customs clearance | 82 | 4.13 s | 1 ms | 0 |

  - Single runs on mobile: request a quote 84 (LCP 3.8 s), contact 88 (LCP 3.3 s).
  - Desktop: 99–100 on all five pages, LCP 0.7–1.0 s.
  - Accessibility, best practices and SEO: 100 everywhere.
  - Remaining gap: the 4.0 s mobile LCP budget is missed by about 0.1 s. Images load within about 30 ms and are not lazy. The delay is the time to render: about 355 KB of JavaScript (React, GSAP, Lenis, Swiper) and about 2 s of script start-up on the throttled phone profile. The next step is to split the code bundle, for example loading Swiper and the cinematic opening only where they are used. A single run gave 5.1 s on the homepage, so use medians.

### After the fleet showroom and service cover photos (13 Oct 2026, later the same day)
- Visual: the homepage, customs and warehousing differences were reviewed, the baselines refreshed, and transportation added (4 new baselines): **44/44 pass**. The other 28 screenshots matched without changes.
- English/Arabic checks: 133 passed, 0 failed; transportation adds 13 passed.
- Lighthouse, mobile, median of 3:

  | Page | Performance | LCP |
  | --- | --- | --- |
  | Home | 81 | 4.21 s |
  | Customs clearance | 83 | 3.98 s |
  | Transportation | 83 | 3.98 s |
  | Warehousing | 79 | 4.73 s |
  | Logistics hub | 79 | 4.73 s |

  - The hub's photos did not change, so its number reflects run-to-run spread.
  - Desktop: 98–99.
- On phones the cover photos became the largest element on screen. Adding 800 px versions brought warehousing from 5.33 s to 4.73 s and customs from 4.28 s to 3.98 s. The warehouse photo is the heaviest of the three (183 KB at 1024 px).


### After the route-level code split (18 Oct 2026)
- **Lighthouse tool fix.** chrome-launcher's default flags turn off Chrome's `RenderDocument` feature, which real Chrome keeps on.
  - Without it, headless Chrome held back the homepage's first paint until about 2.5 s in most runs. The simulated LCP then jumped to about 39 s, because the cinematic frame downloads (about 5.7 MB) fell inside the first-paint window.
  - Controlled test: 3 of 3 runs stalled with the default feature list, and 0 of 3 with the same list minus `RenderDocument`.
  - `qa/lighthouse.mjs` now passes the default list without `RenderDocument`. A normal Chrome (Playwright) painted the homepage at 0.6–0.85 s throughout, so visitors were not affected.
  - If a homepage run reports an LCP far above 5 s, check the observed first paint in the report before trusting it.
- **Lighthouse, mobile, median of 3** (fixed tool):

  | Page | Performance | LCP | TBT |
  | --- | --- | --- | --- |
  | Home | 73 | 4.12 s | 407 ms |
  | Logistics hub | 83 | 3.89 s | 153 ms |
  | Customs clearance | 80 | 3.91 s | 255 ms |
  | Transportation | 80 | 3.97 s | 237 ms |
  | Warehousing | 82 | 4.30 s | 112 ms |

  - 3 of 5 pages are now within the 4.0 s mobile LCP budget (2 of 5 on 13 Oct). CLS is 0 everywhere, and accessibility, best practices and SEO are 100.
  - The homepage's main script is about half its old size (163 KB compressed, down from 307 KB). The animation code (about 62 KB compressed) loads after the first paint. Its lab LCP barely moved, for two reasons:
    - In local tests the script arrives before the first paint, so the simulation links the paint to it. On a real phone network the page can paint while the script is still downloading.
    - With phone-like CPU throttling, the first paint waits about 0.9 s for the browser's own style and layout of the prerendered page. This includes a second full layout when the web fonts swap in.
  - The homepage TBT (about 400 ms) is the cinematic and showroom set-up, which now runs after the first paint instead of before it.
- **Next step for the homepage** (not done; it touches the scroll animations, so it needs its own pass):
  - Skip off-screen layout with `content-visibility: auto` on sections below the fold.
  - Review the font loading so the second layout disappears.


### After the travel and logistics builds (19 Oct 2026)
- **Lighthouse, median of 3:**

  | Page | Mobile perf | Mobile LCP | Mobile TBT | Desktop perf | Desktop LCP |
  | --- | --- | --- | --- | --- | --- |
  | Home | 82 | 3.68 s | 266 ms | 100 | 0.65 s |
  | Logistics hub | 87 | 3.74 s | 104 ms | 98 | 1.02 s |
  | Travel | 73 | 3.68 s | 554 ms | 99 | 0.91 s |

  - All 6 audits are within budget, and all three pages are inside the 4.0 s mobile LCP budget. CLS is 0, and accessibility and SEO are 100.
  - **Travel best practices (96):** the only failure is a console 404 for `/api/site/settings`. This audit serves static files with no API behind them, so the request cannot succeed here. On the real site the API answers.
  - **Travel mobile TBT:** most of it is the page's hydration plus the scroll-animation set-up (ScrollTrigger and the flight frame sequence). Moving the frame-sequence set-up to idle time would be the next step.
- **Visual baselines:** regenerated after review. All 44 snapshots had changed for intended reasons: the footer (no personal name; separate logistics and travel quote links), the travel and logistics redesigns, the divisions section, two-row process grids and removed decorative numbers. 44/44 pass against the new baselines.
- **English/Arabic suite:** 146 passed, 0 failed, 30 skipped.
- **axe:** 0 violation types on 18 pages, including `/ar/travel`, `/ar/logistics` and the quote form opened with a preselected service and equipment.

