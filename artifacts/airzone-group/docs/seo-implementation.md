# Airzone SEO implementation and audit

## Scope and status
Implemented in the existing React/Vite website, preserving its authentic division artwork, footer contacts, GSAP behavior, enquiry API contracts, database and fail-closed authentication. No production publish, DNS change, Google account modification, listing creation or external submission was performed.

The production build produces **74 EN/AR route documents**, of which **44 localized public URLs** are designated indexable and included in the sitemap. Some noindex utility-form labels remain English. These counts describe the build, not pages indexed by a search engine or organic traffic.

## Audit evidence and action
| Priority | Initial evidence | Action/status |
|---|---|---|
| High | All routes had generic “built on Replit” metadata; root HTML had an empty app container | Replaced with route-specific EN/AR title, description, canonical, language links, social metadata and structured data; anonymous public pages now prerender actual content |
| High | `/sitemap.xml` returned HTML with HTTP 200 | XML sitemap generated from the same route registry, only indexable canonical URLs, reciprocal EN/AR links, content dates only where actually updated |
| High | Unknown page URL returned the home HTML with HTTP 200 | Development HTML middleware and production server return real 404 responses; catch-all production rewrite removed |
| High | Service pages had only short generic content; no ATA/exhibition/import-export routes | Seven substantial bilingual service pages with answer-first copy, processes, document checklists, FAQ, related links, appropriate division contact and quote CTA; reused customs URL |
| High | No active published deployment was reported by the platform | Publishing/domain verification remains required; intended hostname is user-specified, not a fabricated deployment URL |
| High | HTTPS requests from this environment to apex and www failed with a TLS EOF error before a usable HTTP response | Could not verify live certificates, redirects or headers; this observation does not prove worldwide downtime. Diagnose DNS/hosting/certificates with owner access |
| Medium | Existing event helper invoked optional `window.gtag` without installation/consent handling | Added real-ID-only consent gate, analytics preferences, filtered parameters, explicit SPA views and success-only conversion hooks; no real GA4 ID is configured |
| Medium | Arabic service routes retained English service heroes | New Logistics and Travel content/chrome localized; core public copy reviewed for untranslated headings; professional Arabic approval still required |
| Medium | Verified office/phone belonged to Travel, not Logistics | Distinct Organization/TravelAgency entities, no Logistics address/phone invented; approved Travel office visible on Travel and corporate Travel |
| Medium | Static fallback could not implement real status/security headers | Registered production Node server serves built documents/assets, real 404, compression, www redirect and baseline headers; CSP report-only; HSTS opt-in after TLS verification |
| Medium | Road/warehouse/project and visa/Umrah authority/coverage unconfirmed; Insights/reviews not established content | Existing functionality retained; these legacy/thin pages excluded from indexable sitemap until verification/content readiness |

## Content and keyword decisions
- Primary clusters: Saudi/Riyadh customs support, ATA Carnet assistance, exhibition/event freight, import/export, freight forwarding, air and sea freight.
- Riyadh is a coordination/delivery discussion point, not an invented Logistics office.
- `/logistics/customs-clearance` is the existing authoritative customs URL. No duplicate Saudi/Riyadh doorway URL was created.
- New routes: `/logistics/ata-carnet`, `/logistics/exhibition-event-logistics`, `/logistics/import-export`, plus corresponding Arabic routes.
- Travel remains separate: `/travel` and `/travel/corporate-travel` have localized guidance and the verified Travel office contact. Legacy Travel pages remain available.
- `seo-keyword-map.csv` records priorities, intent, geography, supporting content, internal links, conversion and verification constraints. No search-volume or ranking estimates are represented as measurements.
- Official references checked: ZATCA temporary-admission e-service; ZATCA Import Instructions; ICC ATA Carnet information. Carnets are not described as issued by Airzone. Conditions depend on goods, territory and competent authorities.
- No fake testimonials, review stars, clients, SLAs, accreditations, owned fleet, prices, clearance times, authors or “CEO quotes” were added.

## Technical implementation
- Initial HTML contains public content and route-specific metadata. Client route changes replace only managed SEO tags, preserving favicon and touch-icon references.
- One title/description/canonical per applicable page. Self-referencing EN/AR canonicals and reciprocal hreflang on indexable pages; no unjustified x-default.
- Language and direction are present in the initial HTML, not just after JavaScript.
- Shared JSON-LD identifies Group, separate Logistics and Travel, WebSite/WebPage, primary Logistics Services, visible breadcrumbs and exact visible Logistics FAQs.
- FAQ markup does **not** promise a Google FAQ rich result; eligibility is restricted and markup is not a ranking guarantee. No fake ratings/reviews.
- Parent identity is never confused with division ownership; TravelAgency/address/phone belong only to the Travel entity.
- Private pages render no user data into static HTML, remain noindex, and retain their existing backend authorization requirements. Robots is not an access-control system.
- Public sitemap/robots are generated at build time. Preview responses deliberately use noindex and preview robots disallows crawling.
- Group-branded 1200×630 social image uses supplied artwork with preserved proportions. The circular browser favicon and Apple touch assets are unchanged.
- Existing responsive WebP photos, image sizes/lazy loading, hero preload and lazy GSAP chunks remain. Text compression and hashed-asset caching are added in the production server.
- No real-user Core Web Vitals or post-publish PageSpeed score has been claimed.

## Conversion/privacy implementation
- Events: `form_start`, success-only `form_submit`/`generate_lead`, `travel_enquiry_submit`, `callback_request_submit`, `request_quote_click`, `shipment_tracking_start`, `click_to_call`, `email_click`, `google_maps_directions_click`, and configured official WhatsApp interactions only.
- Parameters are restricted to known division, form, route/category, approved service category and CTA placement. Free-text service requests fall back to a fixed category, never the user text.
- URLs sent by the app omit query/hash information. Names, emails, phones, messages, files and references are not sent.
- No script or analytic transmission without a real configured measurement ID and opt-in. The privacy preference controls remain accessible when analytics is not configured.
- Lead events run after a successful API response only; form validation/server errors do not call the success hook. Receipt references prevent duplicate callbacks locally without being transmitted.
- Existing submission fields, endpoints, backend data handling and success receipts remain in place.
- Successful receipts now receive focus and scroll into view, avoiding a confirmation left above the visitor's position at the footer. Shared submit/privacy/receipt labels are localized; backend messages and references remain unchanged.
- GA4 account enhanced-measurement settings and actual data receipt require account access and post-configuration DebugView testing.

## Blockers and conditional requirements
1. Publish and connect both real hostnames; verify TLS/HTTP redirects/API routing on the live domain.
2. Supply the actual GA4 stream ID and configure GA4, Search Console, Bing and Google Business Profile with owner access.
3. Confirm Logistics contacts/coverage/licences and legacy service authority; do not borrow Travel information.
4. Business/professional Arabic and legal/privacy review before publishing.
5. Admin SEO editing/readiness integrations require working authorized admin authentication; no bypass or fake dashboard was implemented.
6. Live indexed counts, traffic, backlinks, rankings, review data and AI citations require real external measurements. None were invented.

See `seo-launch-checklist.md` for the concrete owner setup steps, reporting dimensions and AI baseline process.

## Final verification
| Check | Result and limits |
|---|---|
| TypeScript and production build | Passed; 74 generated route documents |
| Generated document validator | Passed: 44 sitemap URLs, 2,926 internal link targets, 600 local image references; unique titles, canonical/indexability/lang/dir, reciprocal language links, H1, JSON-LD parsing and FAQ/body agreement |
| Production server over local HTTP | Homepage, Arabic homepage, EN/AR ATA pages, robots and XML sitemap returned 200 with appropriate MIME types. Unknown route returned 404. Private admin/auth documents carry noindex headers. Known trailing-slash URL redirects permanently |
| Preferred hostname | Local request with `Host: www.airzonegroup.com` returned a single 301 to the intended HTTPS apex, preserving path and query. Live DNS/TLS/redirect chain remains unverified |
| Headers/compression | Local nosniff, referrer and permissions headers, CSP Report-Only and gzip verified. HSTS absent by default as intended; activate only after actual HTTPS verification |
| Desktop browser | ATA hero, expandable FAQ, official ZATCA/ICC links, one canonical/title, reciprocal language links and EN→AR navigation passed; Arabic HTML/RTL verified |
| Enquiry failure/retry | Intercepted `/api/enquiries/logistics` POSTs: simulated 500 displayed an error with no receipt; simulated 201 displayed the supplied reference. Submitted field values unchanged; no real enquiry, notification or database record created |
| Privacy | No GA/GTM script, collection request or analytics cookie without a real configured ID. Arabic preference dialog states analytics is not configured; Escape closes it and restores focus |
| Mobile layout | Arabic Travel tested at 390×844; correct Travel office contact block and Arabic metadata; no horizontal overflow. This is a layout check, not a performance score |
| Conversion construction | Approved ATA assistance label maps to a fixed category; arbitrary text/prototype keys do not become analytics parameters. No names, contact data, messages, attachments or references transmitted by the event construction |
| Browser errors | No unexpected JavaScript errors; the simulated failed POST's network error was expected |
| Timing/field metrics | Not measured: the local Chromium launcher did not expose a usable browser connection. Published mobile/desktop PageSpeed and real-user LCP/INP/CLS still require verification; no score or improvement is claimed |
| Live integrations/security | Actual GA4 receipt, Google/Bing indexing, business profiles, published HTTPS/headers/API routing and external AI citations remain blocked by missing ID/account access or an unpublished/unverified domain |

The browser pass preceded the straightforward final receipt-focus/localized-label and service-title changes. Those final changes were checked by TypeScript and the rebuilt-document/event validator, not a second full browser pass. Local/development results do not establish live domain availability or ranking gains.

## Update — 11 Oct 2026: logistics-first redesign

- Positioning changed to logistics-first (GCC transportation, heavy transport and trailers, Dayana local delivery, temperature-controlled warehousing, customs support). Travel & Tourism remains as a separate business with all routes preserved.
- New indexable routes (EN + AR): `/logistics/gcc-transportation`, `/logistics/heavy-transport`, `/logistics/dayana-local-delivery`, `/locations`. `/logistics/warehousing` upgraded from noindex utility page to a full indexable service page. `/logistics/customs-clearance` reframed as customs support and freight coordination (explicitly not a customs authority or broker).
- `/logistics/road-transportation` and `/logistics/project-cargo` now return 301 to the GCC transportation and heavy transport pages (server) with canonical redirect stubs for static hosting.
- Build output: **78 route documents, 54 indexable sitemap URLs** (was 74 / 44). `validate:seo` passes.
- Structured data: Service `areaServed` lists the five warehouse cities (City) or GCC states (Country) where relevant; Dayana carries a `Brand`; BreadcrumbList on `/locations`. No LocalBusiness schema, because no verified facility addresses exist.
- Organization logo is now the high-resolution Group logo (`airzone-group-logo-1200.png`); social card `social-share-v2.png`.
- Fonts are self-hosted, so Google Fonts requests and CSP origins were removed.
