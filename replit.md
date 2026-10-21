# Airzone Group website

Bilingual logistics website for Airzone Group (GCC transportation, heavy transport, Dayana local delivery, temperature-controlled warehousing, customs support) plus the separate Airzone Travel & Tourism pages. See README.md.

## Run & Operate

- `pnpm --filter @workspace/airzone-group run dev` — website dev server (PORT, default 5173)
- `pnpm --filter @workspace/airzone-group run build` then `run serve` — production web server
- `pnpm --filter @workspace/airzone-group run validate:seo` — checks titles, canonicals, H1s, hreflang, schema, links and sitemap of the built site
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env (API): `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`; optional `ALLOWED_ORIGINS`. Website: optional `VITE_GA4_MEASUREMENT_ID`. See `.env.example`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Website: React 19 + Vite 7, SSR prerender + hydration, Tailwind 4, GSAP/ScrollTrigger, Lenis, Motion, Swiper, Three.js
- API: Express 5, PostgreSQL + Drizzle ORM, Zod (`zod/v4`), Orval codegen, Clerk admin auth
- Build: Vite (website), esbuild (API)

## Where things live

See the "Where things live" table in README.md.

## Architecture decisions

- Every public route is prerendered to static HTML and hydrated (`hydrateRoot`), so content, metadata and the LCP image are in the initial HTML.
- Heavy libraries load on demand: GSAP after hydration, Lenis on idle, Swiper and Three.js only when their sections approach the viewport, Motion features via `LazyMotion`.
- Business facts live in typed config files; copy never states fleet sizes, temperatures, certifications, addresses or guaranteed timings that are not confirmed.
- Legacy URLs `/logistics/road-transportation` and `/logistics/project-cargo` 301 to the consolidated GCC and heavy transport pages.

## User preferences

- Favicon uses the Airzone Group logo (confirmed by the owner), not the Logistics letterhead file named "airzone logo.png".
- Keep Group, Logistics and Travel identities and contact details separate.

## Gotchas

- On Windows Git Bash set `MSYS_NO_PATHCONV=1` when passing `/` paths to scripts.
- `scripts/serve.mjs` caches gzip output in memory; restart it after rebuilding.
- The shadcn/ui kit in `src/components/ui` is unused and excluded from Tailwind scanning.
