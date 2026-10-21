# Deploying on Vercel

The repository deploys to Vercel as one project: the prerendered website (static files) plus the Express API as a serverless function under `/api`, on the same domain. The Replit setup (`scripts/serve.mjs` plus `api-server` `start`) still works unchanged.

## How it works

| Piece | What it does |
| --- | --- |
| `vercel.json` | Framework preset "Other"; build command `pnpm run vercel-build`. The install command is left to Vercel on purpose (see *pnpm* below). |
| `pnpm run vercel-build` (root `package.json`) | Typecheck, build the website (Vite, SSR and prerender), then write the Vercel output. |
| `artifacts/airzone-group/scripts/vercel-output.mjs` | Copies `dist/public` to `.vercel/output/static` and writes `.vercel/output/config.json`, the routing table. It reproduces `scripts/serve.mjs`: www → apex, security headers, legacy and trailing-slash redirects, every prerendered page, the 404 page, `noindex` on admin/portal/sign-in pages and on `*.vercel.app` addresses, and long-term caching for hashed assets. |
| `artifacts/api-server/build-vercel.mjs` | Bundles the Express app (`src/app.ts`) with esbuild into `.vercel/output/functions/api.func` (Node.js 22), using the same esbuild settings as the normal server build (`build-options.mjs`). |
| `artifacts/airzone-group/scripts/headers.mjs` | Security headers and Content-Security-Policy shared by both hosts. |
| `artifacts/airzone-group/scripts/check-deploy.mjs` | Read-only smoke test for any deployed URL. |

This is Vercel's [Build Output API](https://vercel.com/docs/build-output-api): Vercel serves the `.vercel/output` folder written by the build as is.

## First deployment

1. In Vercel, choose **Add New → Project** and import the GitHub repository `iTszaLi/Airzone-Group`.
2. Keep **Root Directory** as the repository root. The framework ("Other") and build command come from `vercel.json`. Do not set an Install Command or Output Directory override.
3. Add the environment variables below, for Production and, if wanted, Preview.
4. Deploy, then run the smoke test (see *Checking a deployment*).
5. Connect the domain (see *Domain and email*).

### pnpm

The lockfile is pnpm format 9.0. Vercel uses pnpm 10 for new projects with that lockfile, which is what this repository needs. Two cautions:

- **Pin the version (recommended):** add the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1`. Vercel then uses exactly the version in `package.json` (`"packageManager": "pnpm@10.18.3"`).
- **Do not override the Install Command:** Vercel's docs say an overridden install command runs with the oldest pnpm version available, which cannot read this workspace's settings.

## Environment variables

Set these in **Project → Settings → Environment Variables**. Build-time variables take effect on the next deployment.

| Variable | When | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Required, runtime | PostgreSQL connection string. Use a pooled connection string (for example Neon's `-pooler` host), because serverless functions open many short connections. Without it every `/api` call fails. |
| `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Required, runtime | Clerk production keys; the admin API checks Clerk sessions and roles. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Runtime | Enquiry emails (see `docs/LAUNCH-READINESS.md`, item B3). Without them, enquiries are stored but not emailed, and the site says so. |
| `TRAVEL_QUOTE_EMAIL`, `LOGISTICS_QUOTE_EMAIL`, `FLEET_QUOTE_EMAIL`, `GENERAL_ENQUIRY_EMAIL` | Optional, runtime | Override the default recipients set on the server. |
| `ALLOWED_ORIGINS`, `LOG_LEVEL` | Optional, runtime | Cross-origin API access (normally not needed) and log detail. |
| `ENABLE_EXPERIMENTAL_COREPACK` | Recommended, build | `1`, to pin pnpm (above). |
| `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`, `INDEXNOW_KEY` | Optional, build | Webmaster verification tags and the IndexNow key file. |
| `VITE_GA4_MEASUREMENT_ID`, `VITE_SHOW_ADMIN_LINK` | Optional, build | Analytics after consent; footer admin link. |
| `CSP_ENFORCE` | Optional, build | `true` switches the Content-Security-Policy from report-only to enforced. |
| `VERCEL_API_REGIONS` | Optional, build | Region(s) for the API function, for example `fra1`, to sit next to the database. You can set the region in **Settings → Functions** instead. |

These are not used on Vercel:
- `PORT` and `BASE_PATH` (the build has defaults).
- `ENABLE_HSTS`: Vercel sends `Strict-Transport-Security` on custom domains by default.

## Database

1. Create a PostgreSQL database, for example Neon from the Vercel Marketplace or any managed Postgres, in a region close to Saudi Arabia (for example Frankfurt), and set the API region to match.
2. Create the tables once, from your computer, with the production connection string in your shell (not in a file):

   ```bash
   pnpm --filter @workspace/db run push
   ```

## Domain and email

airzonegroup.com is registered at GoDaddy and its email runs on Microsoft 365.

1. In Vercel, open **Settings → Domains** and add `airzonegroup.com` and `www.airzonegroup.com`. Make the apex the primary domain; the routing table also redirects www to the apex.
2. In GoDaddy DNS, replace the apex `A` records (the parking page) and the `www` record with the exact values Vercel shows on that screen.
3. **Keep the email records exactly as they are:**
   - MX `airzonegroup-com.mail.protection.outlook.com`
   - TXT `NETORGFT13613062.onmicrosoft.com`
   - SPF `v=spf1 include:secureserver.net -all`
4. Keep the nameservers at GoDaddy. Moving DNS to Vercel would mean recreating the Microsoft 365 records by hand.
5. Vercel issues the HTTPS certificate automatically once DNS resolves.

## Checking a deployment

After `pnpm run build` (or `pnpm run vercel-build`) locally, run:

```bash
pnpm --filter @workspace/airzone-group run check:deploy -- https://your-deployment.vercel.app
```

It checks:
- every page (200, HTML);
- trailing-slash and legacy redirects;
- `/ar` → `/ar/`;
- the 404 page with `noindex`;
- robots.txt, sitemap.xml, llms.txt and the manifest;
- security headers;
- immutable caching of hashed assets;
- `/api/healthz`.

Preview deployments are usually behind Vercel Deployment Protection. Either test the production URL, or set `VERCEL_AUTOMATION_BYPASS_SECRET` in your shell; the script sends it as the bypass header.

Then submit one test enquiry per form on the live site, and confirm it arrives in the database and, once Resend is set up, by email.

## Notes and limits

- **Rate limit:**
  - The enquiry limit (12 per 15 minutes per visitor) counts the real visitor IP, because the API trusts Vercel's single proxy hop.
  - The counter lives in memory, so each running function instance counts separately. That is weaker than on one long-running server.
  - If spam becomes a problem, move the limiter to a shared store such as Upstash Redis.
- **Logs:** the API writes JSON logs, visible under **Logs** in the Vercel dashboard.
- **Clerk proxy:** `/api/__clerk` proxies Clerk's Frontend API in production, so it works on the custom domain.
- **CSP on Vercel:** `frame-ancestors 'self'` plus `X-Frame-Options: SAMEORIGIN`. Nothing needs to frame the site there, unlike the Replit preview.

## Verified locally (21 October 2026)

- `pnpm install --frozen-lockfile` and `pnpm run vercel-build` succeed: 94 pages, 4 legacy redirects, and the function bundle.
- `config.json` (111 routes) passes Vercel's own route schema and normalisation (`@vercel/routing-utils` 6.6.0).
- **Routing comparison with the Node server:** a strict simulation of Vercel's routing phases (a filesystem hit needs an exact file) was compared with `scripts/serve.mjs` on 211 paths:
  - every page and its trailing-slash form;
  - legacy redirects;
  - `/ar`;
  - static files;
  - unknown paths (404);
  - nested sign-in paths;
  - hashed assets.

  All status codes, redirect targets and response bodies match.
- **API function:** the built function, called the way Vercel's Node launcher calls it, passed these checks:
  - `/api/healthz` answers;
  - JSON bodies are parsed (invalid enquiry → 400);
  - admin routes return 401 without sign-in;
  - the rate limit blocks the 13th request from one visitor while a different visitor gets through.
- `check:deploy` passes all 212 checks against the local production server.
- **Not yet run on Vercel itself.** The first real deployment needs the owner's Vercel account; run `check:deploy` against it.

## Undo

Delete these files and folders:
- `vercel.json`
- `artifacts/airzone-group/scripts/vercel-output.mjs`, `check-deploy.mjs` and `headers.mjs`
- `artifacts/api-server/build-vercel.mjs`
- `.vercel/`

Then:
- Restore the inline header lines in `scripts/serve.mjs` and the inline esbuild options in `artifacts/api-server/build.mjs` (merge `build-options.mjs` back).
- Remove the `vercel-build`, `vercel:output`, `build:vercel` and `check:deploy` scripts and the `packageManager`/`engines` fields.

`app.set("trust proxy", 1)` in `api-server/src/app.ts` is needed on Replit too; keep it.
