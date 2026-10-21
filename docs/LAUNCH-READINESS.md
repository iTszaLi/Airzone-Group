# Launch readiness: Airzone Group website

Review date: 20 October 2026. Build checked: production build served by `scripts/serve.mjs` on a local machine, with the API on a local PostgreSQL copy.

Legend: ✅ checked and passing · 🔧 fixed during this review · ⏳ needs the owner · ⚠️ known limitation.

## 1. Go-live blockers (owner)

| # | Item | Why it blocks | What to do |
| --- | --- | --- | --- |
| B1 | **Domain points to a GoDaddy parking page** | airzonegroup.com answers with a parking page that redirects to `/lander`. Its A records (15.197.148.33, 3.33.130.190) are GoDaddy forwarding. | Publish the site on the host (Vercel: `docs/DEPLOY-VERCEL.md`; or a Replit deployment), then in GoDaddy DNS replace the apex A records and `www` with the records the host gives. **Keep the email records:** MX `airzonegroup-com.mail.protection.outlook.com`, TXT `NETORGFT13613062.onmicrosoft.com`, SPF `v=spf1 include:secureserver.net -all`. Removing them stops company email (Microsoft 365). |
| B2 | **Production secrets** | Forms need the database; the admin area needs real Clerk keys. | Set `DATABASE_URL` (production PostgreSQL) and Clerk production `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` in the host's secrets. |
| B3 | **Enquiry emails** | Without an email provider, enquiries are stored but **not emailed**. The site says so honestly; it never claims an email was sent. | Create a Resend account and verify a sending subdomain, for example `send.airzonegroup.com`, by adding the DNS records Resend gives. This leaves the Microsoft 365 records untouched. Then set `RESEND_API_KEY` and `EMAIL_FROM`. |

## 2. After the domain is live (owner, about 30 minutes)

1. Check HTTPS on `https://airzonegroup.com` and that `www` redirects to it. The server already sends www → apex 301s.
2. HSTS: on Vercel it is on by default for custom domains. On the Node server (Replit), set `ENABLE_HSTS=true`; it starts at 5 minutes, so raise it after a week of stable HTTPS.
3. Enforce the Content-Security-Policy: set `CSP_ENFORCE=true`. It currently runs in report-only mode, and the review found no violations (section 5).
4. **Search Console:**
   - add the property and verify it with `GOOGLE_SITE_VERIFICATION`, then rebuild;
   - submit `https://airzonegroup.com/sitemap.xml`;
   - review the generative-AI setting.
5. **Bing Webmaster Tools:** import from Search Console, or verify with `BING_SITE_VERIFICATION`.
6. **IndexNow:** set `INDEXNOW_KEY`, rebuild and deploy, then run `pnpm --filter @workspace/airzone-group run indexnow -- --confirm`.
7. **Analytics (optional):** set `VITE_GA4_MEASUREMENT_ID`. It loads only after a visitor accepts.
8. Submit one test enquiry per form on the live site, and confirm it appears in Admin and, once Resend is set up, by email.

## 3. Facts to confirm before launch (owner)

Everything below is already worded cautiously on the site. Confirm or correct it. The full list is in `docs/LOGISTICS-VERIFICATION-CHECKLIST.md`.

- **24/7:** is 24/7 operation true at all four warehouses (Riyadh, Dammam, Jeddah, Jubail)? Is "24/7 customs clearance support" accurate?
- **Legal name:** "Airzone Logistics Services Est" comes from the logo artwork. Can a CR number be shown?
- **GCC routes:** the GCC road routes actually operated (UAE, Kuwait, Qatar, Bahrain, Oman).
- **Leadership message:** approve it, or supply a named, approved statement.
- **Photos:** the illustrative Wikimedia/Unsplash photos, or genuine Airzone photos to replace them.
- **Arabic:** a native-speaker review of the Arabic copy, customs terminology in particular.

## 4. Security

| Check | Result |
| --- | --- |
| Secrets in the browser bundle | ✅ None. The built files were scanned for API keys, database URLs and private keys. Only `VITE_*` variables reach the browser. |
| Web server headers | ✅ `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`; CSP in report-only mode until `CSP_ENFORCE=true`; HSTS behind `ENABLE_HSTS`. |
| API headers | ✅ Helmet defaults: CSP, HSTS, `X-Frame-Options`, COOP/CORP and more. |
| Admin data | ✅ The API answers 401 without a signed-in admin. Admin, portal and sign-in pages are `noindex` and blocked in robots.txt. |
| Form input | ✅ Every enquiry endpoint validates with Zod on the server. 12 submissions per 15 minutes per visitor. Recipients are fixed on the server. |
| Dependencies (`pnpm audit --prod`) | ⚠️ 1 high: `braces` ≤3.0.3 (GHSA-vfj7-8cjw-p6xm, 18 Sep 2026) through `http-proxy-middleware` in the API's Clerk proxy. **No fixed version exists yet.** It is not reachable here: `braces` expands patterns from server config, never from requests, and the proxy is configured without any. Re-run `pnpm audit` before launch and upgrade when a fix ships. |
| Clickjacking | On Vercel: ✅ `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'`. On Replit: ⚠️ the CSP's `frame-ancestors` allows Replit domains (needed for the Replit preview), and it takes effect once CSP is enforced. |

## 5. Admin workspace (decision needed)

The admin screens exist, and the API protects them properly: Clerk sessions plus roles `super_admin`, `logistics_admin` and `travel_admin`. **But the website has no working sign-in.** The "Continue to sign in" button only links to `/admin`; this was already the case in the original project. So at launch nobody can sign in to read stored enquiries.

- **Recommended for launch:** receive enquiries by email (Resend, item B3). Every enquiry is also kept in the database.
- **Done in this review:** the footer "Admin access" link is hidden until sign-in works. Re-enable it with `VITE_SHOW_ADMIN_LINK=true`.
- **Next step, when wanted:** wire Clerk sign-in into the website. This needs the Clerk application (production keys) the API already expects; the work is about half a day plus testing with a real admin account.

## 6. Performance

Lighthouse lab runs, phone with simulated slow 4G, median of 3–5 runs; desktop scores 98–100 throughout:

| Page | Phone LCP | Notes |
| --- | --- | --- |
| Logistics hub | 3.62 s | Was 4.39 s; real LCP now equals first paint |
| Customs clearance | 3.85 s | |
| Air freight | 3.69 s | |
| Transportation | 3.95 s | |
| Request a quote | 3.51 s | |
| Track | 3.42 s | |
| About | 3.24 s | |
| Contact | 3.04 s | |
| Travel | 3.36 s | |
| Home | 3.3–4.0 s | Varies between runs |
| Warehousing | about 4.1–4.3 s | Just over the 4.0 s budget |

**On warehousing**, the hero photo paints at the first paint (0.26 s measured). The lab figure comes from Chrome pre-fetching lazy images further down the page, which the slow-4G simulation counts against the hero.

- **Other measures:** CLS is 0 on every audited page. Accessibility, best practices and SEO scores are 100, except travel best practices at 96; that is a 404 from the test server, which has no API behind it.
- **Bundle:** main script 161 KB compressed, at low fetch priority; stylesheet 36 KB. Pages are prerendered, so content shows without JavaScript.

## 7. Accessibility, layout and languages

| Check | Result |
| --- | --- |
| Every public page (86) at desktop 1440 px and phone 390 px | ✅ No console errors, failed requests, sideways scrolling, missing H1, title or description, unnamed controls, images without alt or broken images. Language and direction are correct in every Arabic page. |
| Links | ✅ All 88 internal link targets and 93 images answer 200. 82 external links checked; the 9 flagged Unsplash credit links are bot protection (they answer normally in a browser). |
| Duplicate ids | 🔧 Two fixed (container destuffing, exhibition). |
| axe (WCAG 2.2 AA) | ✅ 0 violation types on the audited EN/AR pages (see section 9). |
| Phone forms | ✅ Inputs are 16 px or larger (no zoom on focus); correct keyboard types (tel, email); autocomplete set; zoom never disabled; theme colour, touch icon and manifest present. |
| Structured data | ✅ 74 indexable pages: valid JSON-LD, required fields present, breadcrumb positions sequential, FAQ answers present. The visible "Page updated" date equals `dateModified` everywhere. |
| Browsers | ⚠️ Tested in Chrome (desktop and phone emulation). Safari/WebKit and Firefox need Playwright's browser builds downloaded (about 250 MB); that can be done on request, or check on a real iPhone before launch. |

## 8. SEO and AI search

- **Sitemap and robots:** 74 indexable URLs, every one with a built page; canonical, reciprocal hreflang and unique titles and descriptions (`validate:seo` and the search-appearance suite).
- **AI search:** AI crawlers explicitly allowed; `/llms.txt`; snippets allowed; FAQ, breadcrumb, service, organization and dated web-page structured data.
- **Checklist:** see `docs/GEO-CHECKLIST.md` for the owner's 20-point checklist.

## 9. Test results (final run, 20 October 2026)

All run against the final production build.

| Suite | Result |
| --- | --- |
| Typecheck, production build, `validate:seo` | ✅ Pass: 94 documents, 74 sitemap URLs, 7,932 internal links |
| Launch sweep, every public page × desktop and phone (`launch-audit`) | ✅ 0 issues after fixes (2 duplicate ids fixed) |
| axe WCAG 2.2 AA, all 86 public EN/AR pages | ✅ 0 violation types |
| English/Arabic Playwright suite | ✅ 146 passed, 0 failed, 30 skipped |
| Visual regression | ✅ 44/44 against baselines regenerated after review |
| Structured data, all 74 indexable pages | ✅ 0 problems |
| Navigation and header | ✅ 52/52 |
| Logistics hub | ✅ 51/51 |
| Travel page | ✅ 30/30 |
| Group divisions | ✅ 18/18 |
| Homepage opening | ✅ 42/42 |
| Showroom | ✅ 33/33 |
| WhatsApp and email routing | ✅ 21/21 |
| Quick call | ✅ 35/35 |
| Top bar | ✅ 27/27 |
| Interaction | ✅ 42/42 |
| Utility flows | ✅ 12/12 |
| Pillar pages | ✅ 22/22 |
| Pages | ✅ 46/46 |
| Language | ✅ 29/29 |
| Language switch position | ✅ 22/22 |
| Search appearance | ✅ 15/15 |
| Strip | ✅ 14/14 |
| Freight forms | ✅ 27/27 |
| Code split | ✅ 7/7 |
| Slow-load focus | ✅ 2/2 |
| Footer date across load and navigation | ✅ 6/6 (three runs) |
| Phone form check (6 form pages) | ✅ no zoom-on-focus inputs; keyboards and autocomplete correct |
| Lighthouse, 11 pages | Desktop 98–100. Phone: see section 6 |
| `pnpm audit --prod` | ⚠️ 1 high with no fix available, not reachable (section 4) |

**Not covered:**
- Real email delivery: needs a Resend account.
- Admin sign-in (section 5).
- Safari/Firefox engines (section 7).
- The live domain: it serves a parking page.
- The contact/callback email suite needs the local mock mail server and was not re-run. Its code is unchanged since its 9/9 pass on 18 October.

## 10. Optional next improvements

- **Contact page phone:** show the logistics phone and WhatsApp on the Contact page as well. On 13 Oct 2026 the owner asked to keep the logistics phone in the footer only, so this is left as is.
- **Real photography:** replace the illustrative photos with genuine Airzone photos of vehicles, warehouses and team. This improves trust and AI-search "identity" signals.
- **Verified figures:** add verified figures, a named leadership quote and real social profiles. Each closes an item on `docs/GEO-CHECKLIST.md`.
- **Other browsers:** Safari/WebKit and Firefox automated runs, after approving the Playwright browser download, or check manually on an iPhone.
- **Warehousing phone LCP:** load below-the-fold images on scroll (IntersectionObserver) instead of Chrome's generous native lazy distance on slow networks, to bring the page under the 4.0 s budget in lab tests.
