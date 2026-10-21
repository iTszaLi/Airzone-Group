# Airzone Group website

Bilingual (English/Arabic) corporate website for **Airzone Group**: GCC road
transportation, heavy transport and trailer solutions, **Dayana** local delivery,
temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail,
and customs support. It also hosts the separate Airzone Travel & Tourism pages.

## Stack

| Part | Technology |
| --- | --- |
| Monorepo | pnpm workspaces (pnpm 10), Node.js 24, TypeScript 5.9 |
| Website (`artifacts/airzone-group`) | React 19, Vite 7, wouter, Tailwind CSS 4 + custom design system (`src/styles/airzone.css`), SSR prerender of every public route |
| Motion and media | GSAP + ScrollTrigger, Lenis, Motion for React (`motion/react`), Swiper, Three.js, Lucide icons |
| API (`artifacts/api-server`) | Express 5, Zod (OpenAPI-generated), Drizzle ORM + PostgreSQL, Clerk (admin) |
| Shared libs (`lib/*`) | OpenAPI spec, generated React Query client, Zod schemas, DB schema |

## Run locally

```bash
pnpm install
```

```bash
pnpm --filter @workspace/airzone-group run dev
```

The dev server runs on http://localhost:5173 (override with `PORT`). Forms and
tracking call `/api`; without the API server they show an honest "not sent"
message with the logistics email address. To exercise them locally, run the API
server (default port 8080) and set `API_PROXY_TARGET=http://127.0.0.1:8080`
before `dev` or `serve`; both then forward `/api` to it.

Note: this is a pnpm workspace. `npm install <pkg>` is blocked by the
preinstall hook; add packages with `pnpm --filter @workspace/airzone-group add <pkg>`.

Design tooling: the UI UX Pro Max skill (official CLI, `uipro init --ai claude`)
is installed in `.claude/skills/`. Claude Code loads it automatically for UI/UX
requests; its search script can also be run directly:
`python .claude/skills/ui-ux-pro-max/scripts/search.py "logistics b2b" --design-system`.

`standalone/freight-hero.html` is a separate single-file hero mock-up built to
an external visual spec; it is not part of the website build.

Production build and server:

```bash
pnpm --filter @workspace/airzone-group run build
```

```bash
PORT=21365 pnpm --filter @workspace/airzone-group run serve
```

Checks:

```bash
pnpm run typecheck
```

```bash
pnpm --filter @workspace/airzone-group run validate:seo
```

API server (needs `DATABASE_URL` and Clerk keys, see `.env.example`):

```bash
pnpm --filter @workspace/api-server run build
```

```bash
PORT=8080 node artifacts/api-server/dist/index.mjs
```

## Where things live

| What | File |
| --- | --- |
| Routes | `artifacts/airzone-group/src/App.tsx` (`Routes`) |
| Pages | `src/pages/HomePage.tsx`, `LogisticsPages.tsx`, `CompanyPages.tsx`; travel, tracking, legal and admin remain in `App.tsx` |
| Service names, groups, icons, warehouse cities, GCC states, legacy redirects | `src/config/service-catalog.ts` |
| Service page copy (EN/AR, FAQ) | `src/config/logistics-content-core.ts` (transport, Dayana, warehousing) and `src/config/logistics-content.ts` |
| Company contact details | `src/config/business-contacts.ts` (single source; edit here only) |
| SEO titles, descriptions, canonical, hreflang, JSON-LD, sitemap, robots | `src/seo/site.ts`, `src/seo/html.ts` |
| Production domain | `siteOrigin` in `src/seo/site.ts` and `origin` in `scripts/serve.mjs` (`https://airzonegroup.com`) |
| Animation utilities | `src/motion/` (`use-motion.ts`, `SmoothScroll.tsx`, `gsap.ts`, `reduced-motion.ts`, `features.ts`) |
| Logos and favicons | `scripts/prepare-brand-assets.py`, see `docs/branding-assets.md` |
| Photography | `src/config/photography.ts`, `scripts/prepare-photos.py`, `docs/photo-credits.md` |
| Launch checklist | `artifacts/airzone-group/docs/seo-launch-checklist.md` |
| Implementation report | `docs/IMPLEMENTATION-REPORT.md` |

## Deploying

**Vercel:** import the repository as a Vercel project; `vercel.json` and
`pnpm run vercel-build` produce the static site plus the API as a serverless
function under `/api`. Environment variables, database, domain (keeping the
Microsoft 365 email records) and the post-deploy smoke test are in
`docs/DEPLOY-VERCEL.md`.

**Replit:** the project is also configured for Replit deployments (`.replit`,
`artifacts/*/.replit-artifact/artifact.toml`): the website service runs
`scripts/serve.mjs` (prerendered HTML, real 404s, 301 redirects, gzip, caching
and security headers), and the API service is mounted at `/api` on the same
origin.

On another host, run the same two Node processes behind one domain and route
`/api/*` to the API server. Static hosting of `dist/public` also works for the
pages (redirect stubs are generated), but forms, tracking and admin need the
API on the same origin. See `docs/IMPLEMENTATION-REPORT.md` for the full checklist.
