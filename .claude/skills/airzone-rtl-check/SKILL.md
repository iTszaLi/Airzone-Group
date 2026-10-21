---
name: airzone-rtl-check
description: Use when changing, reviewing or testing anything on the Airzone Group website that exists in English and Arabic - pages under /ar, copy, layout, icons, images, forms, phone numbers, emails, the language switcher or hreflang - or when an Arabic page looks wrong, scrolls sideways, shows English, or links back to English.
---

# Airzone English/Arabic (RTL) check

## Overview

Every page exists twice: `/path` (English, LTR) and `/ar/path` (Arabic, RTL). RTL bugs are invisible on the English twin, so after any UI or copy change check both twins: run the suite, then review what it cannot judge.

## How the site handles two languages

| Concern | Where / rule |
| --- | --- |
| Locale | URL prefix `/ar`. `src/site/locale.tsx` sets `<html lang dir>`; prerender writes the same server-side. |
| Copy | `const T = useT(); T('English', 'عربي')`, keys in `src/lib/i18n.ts`, or `{ en, ar }` fields in `src/config/pillars/*`. Never a bare English string in JSX. |
| Internal links | `Link` from `@/site/locale` (adds `/ar`). A raw `<a href="/...">` drops Arabic visitors into English. |
| Pointing icons | Arrows/chevrons get `className="az-flip"`; `html[dir='rtl'] .az-flip` mirrors them. |
| Type | IBM Plex Sans Arabic via `--az-head`/`--az-body` under `html[dir='rtl']`; Arabic text gets `letter-spacing: 0`, no `text-transform`, taller line-height. |
| Layout | Logical CSS only: `margin-inline-*`, `padding-inline-*`, `inset-inline`, `text-align: start`. |
| Motion | `useMotion(ref, direction)` mirrors horizontal GSAP movement. |
| LTR islands | Phone numbers, emails, codes and acronym lists carry `dir="ltr"` so digit groups do not reorder. Digits are Western (0-9) in both languages. |
| SEO | Each twin links both via hreflang `en`/`ar`; no `x-default` (validate-seo enforces this). |
| Switching | `changeLocale` calls `keepReadingPosition()`: the twin page opens at the same section (matched by order of `main section` elements), not the top. Keep both languages' sections in the same order. |

## Run the checks

```bash
pnpm run build
pnpm run qa:rtl
```

Run from the repo root. It serves `dist` on port 4310; to reuse a running server, prefix with `QA_BASE_URL=http://127.0.0.1:<port>`. The report is at `scripts/qa-reports/playwright/index.html`. Pages live in `scripts/qa/pages.mjs`; add new key pages there.

| Failing test | Usual cause | Fix |
| --- | --- | --- |
| server HTML ... hreflang | page missing from the SEO map, or a wrong twin path | `src/seo/site.ts` / prerender |
| direction ... overflow | fixed widths, `left/right` CSS, absolute element (e.g. `.sr-only`) inside a horizontal scroller with no positioned ancestor | logical CSS; `position: relative` on the scroller's item |
| directional icons | `.az-flip` overridden by another transform | combine transforms (see `.az-btn:hover .az-flip`) |
| phone/email LTR | number or email outside a `dir="ltr"` element | add `dir="ltr"` to the link or input |
| links keep Arabic | raw `<a href="/...">` | use `Link` |
| untranslated English | text, `alt`, `aria-label`, `placeholder` or `title` only in English | translate; mark genuine English (names, licences) with `lang="en"`; allow-list a proper noun in `LATIN_ALLOWED` (acronyms pass automatically) |
| language switcher | `changeLocale` path mapping, or the mobile menu not opening | `src/site/locale.tsx`, `Header.tsx` |
| keeps the section being read | a section rendered in one language only, or a different section order | render the same `<section>` structure in both languages |

"Review" annotations in the report list right-pointing icons that are not mirrored. Decide each one: mirror it with `az-flip` unless it means something absolute (e.g. an external-link arrow kept for consistency).

## Manual review (what the suite cannot judge)

- Read the Arabic for meaning and tone: no literal translation, Arabic punctuation (، ؛ ؟), correct gender and number agreement.
- Compare twins visually: `pnpm run qa:visual` keeps EN/AR screenshots in `scripts/qa/__screenshots__/`.
- Carousels swipe the natural way, progress bars fill from the right, and drawers open from the correct side.
- Arabic form validation messages, placeholders and success states.
- Keep business facts identical in both languages (see `docs/LOGISTICS-VERIFICATION-CHECKLIST.md`).

## Common mistakes

- Fixing the English twin and assuming Arabic follows.
- Translating visible text but leaving `alt` and `aria-label` in English.
- Allow-listing an English phrase to make the test pass; allow-list only proper nouns.
- Adding `letter-spacing` or uppercase styling that also hits Arabic headings.
