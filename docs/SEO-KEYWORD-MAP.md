# Airzone Group: keyword clusters, page mapping and off-site checklist

October 2026. No search-volume or difficulty data was used: no reputable
keyword tool was available, and none was invented. Treat the clusters below as
search themes. Measure real queries in Google Search Console once the site is
live. No one can guarantee rankings; the site provides the on-page and
technical foundation.

## Cluster → page mapping

Each cluster points to the one page that best answers that search. The About
page summarises and links; it does not compete with the service pages.

| Cluster | Primary page | Supporting pages |
| --- | --- | --- |
| A. Core company & logistics ("Airzone Group", "logistics company in Riyadh / Saudi Arabia / KSA", "serving the GCC") | `/about`, `/logistics` | `/` |
| B. Customs clearance (Riyadh, Dammam, Jeddah, import/export, documentation, declarations, compliance, exhibition cargo) | `/logistics/customs-clearance` | `/logistics/customs-documentation`, `/logistics/ata-carnet` |
| C. Transportation & heavy vehicles (Riyadh transport, KSA road freight, flatbed, curtain-side, low-bed, refrigerated, Dayana, KSA → UAE/Bahrain/Kuwait/Qatar/Oman) | `/logistics/transportation` | `/logistics/heavy-transport`, `/logistics/gcc-transportation`, `/logistics/dayana-local-delivery` |
| D. Warehousing & storage (temperature-controlled, Riyadh/Dammam/Jeddah/Jubail, receiving and dispatch) | `/logistics/warehousing` | `/logistics/warehousing-{riyadh,dammam,jeddah,jubail}`, `/logistics/container-destuffing` |
| E. Air freight, sea freight & cargo handling (air cargo import/export, FCL/LCL, port-to-warehouse, container destuffing/unloading) | `/logistics/air-freight`, `/logistics/sea-freight` | `/logistics/container-destuffing`, `/logistics/freight-forwarding`, `/logistics/import-export` |
| F. Exhibition & event logistics (Riyadh/Saudi exhibitions, trade shows, LED/AV/lighting transport, temporary import, ATA Carnet, return shipping) | `/logistics/exhibition-event-logistics` | `/logistics/ata-carnet`, `/logistics/air-freight`, `/logistics/sea-freight` |
| G. City intent (Riyadh, Dammam, Jeddah, Jubail) | `/logistics/warehousing-{city}` | `/locations`, `/about` (coverage section) |

Arabic versions (`/ar/...`) carry their own Arabic titles, descriptions and
headings with natural terms: التخليص الجمركي, النقل البري, النقل الثقيل,
الشحن الجوي, الشحن البحري, التخزين المتحكم بحرارته, تفريغ الحاويات,
لوجستيات المعارض. Arabic city names are used throughout.

## About page metadata

- Title: About Airzone Group | Logistics in Saudi Arabia & GCC
- Description: Discover Airzone Group’s logistics services in Saudi Arabia and the GCC, including customs support, road transportation, freight coordination, warehousing and delivery.
- H1: About Airzone Group — Logistics Services in Saudi Arabia & the GCC
- Arabic title: عن مجموعة إيرزون | خدمات لوجستية في السعودية والخليج

## Technical SEO in place

- Server-rendered (prerendered) HTML for every page in both languages.
- Unique titles and descriptions; self-referencing canonical; reciprocal `en`/`ar` hreflang.
- No `x-default`: there is no language-selection page, and English and Arabic each have their own URL.
- XML sitemap with language alternates; robots allow indexing (private pages are `noindex`).
- JSON-LD: Organization (group) with logistics (`legalName`) and travel sub-organisations, WebSite, WebPage/AboutPage, BreadcrumbList, Service and FAQPage from visible FAQs. No ratings, reviews, opening hours or addresses beyond the published travel office.
- Images: responsive WebP (800/1400/1920), descriptive alt text in both languages, and lazy loading below the fold.

## Pages that could be built next (only with real content)

- A dedicated "Customs clearance in Riyadh / Dammam / Jeddah" set: only once the entry points and brokers actually used per city are confirmed (checklist items 1–3, 24).
- GCC route pages (e.g. Saudi Arabia → UAE): only once route-specific border crossings, documents and frequency are confirmed (item 11).
- Case studies: only with real, permitted shipments.

## Google Business Profile & Search Console (for the business owner)

These steps happen outside the website, and website code cannot do them.

1. Claim or verify the Google Business Profile for each **real** business location. Keep logistics and travel separate if they operate as separate businesses with their own premises.
2. Use the exact business name, the right primary category (e.g. logistics service / customs broker only if licensed / travel agency), the real address or a service area, the phone number and the website URL.
3. Never create virtual or fake offices; list only eligible locations.
4. Keep name, address and phone consistent across legitimate listings (chamber of commerce, Maroof, industry directories).
5. Ask real customers for honest reviews, with no incentives and no scripted or fabricated reviews.
6. Post genuine updates (new services, events attended) on the profile.
7. Earn links through real partnerships, trade associations, supplier and organiser pages, and useful industry content. Do not buy links or use spam directories.
8. Set up Google Search Console for `https://airzonegroup.com`, verify the domain and submit `https://airzonegroup.com/sitemap.xml`.
9. Monitor queries, impressions, clicks, indexing (Pages report) and Core Web Vitals; fix any excluded URLs.
10. Use analytics to measure quotation requests and other enquiries (the site records successful enquiries without personal data).
