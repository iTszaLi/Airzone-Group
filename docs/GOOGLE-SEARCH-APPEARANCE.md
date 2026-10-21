# Airzone Group: Google search appearance and Search Console

October 2026. This describes what the website controls about how Airzone appears
in Google, and what still depends on Google. No ranking, snippet or sitelink can
be guaranteed: Google chooses titles, descriptions and sitelinks automatically,
based on indexing, the search query, competition and the site's reputation.

## What a strong result needs, and where it comes from

| Part of the result | Source on the site | Status |
| --- | --- | --- |
| Site name ("Airzone Group") above the URL | `WebSite` structured data on every page, homepage included: `name: Airzone Group`, `alternateName: Airzone / مجموعة إيرزون`; `og:site_name` | Implemented |
| Logo / favicon next to the result | Favicon set (48 px+ ICO, PNG, manifest) and `Organization.logo` | Implemented |
| Blue title link | Unique `<title>` per page, ≤ 60 characters for English | Implemented (table below) |
| Description under the title | Unique meta description per page, 70–160 characters | Implemented; Google may still quote page text instead |
| Sitelinks (extra page links) | Clear hierarchy: header menu, footer, breadcrumbs, descriptive anchor text, all priority pages indexable and in the sitemap | Implemented; shown only if Google decides they help |
| Breadcrumb path instead of the bare URL | `BreadcrumbList` matching the visible breadcrumb on every page except the homepage | Implemented |
| Arabic result for Arabic searches | Separate `/ar/...` URLs, Arabic metadata, reciprocal `hreflang` | Implemented |

There is no markup that forces sitelinks, so none is used. FAQ structured data
stays only where the questions are visible on the page; Google currently shows
FAQ rich results mainly for government and health sites, so they are not
expected for Airzone.

## Priority pages and their search metadata (as built)

| Page | URL | Title (EN) | Meta description (EN) | H1 (EN) | Title (AR) |
| --- | --- | --- | --- | --- | --- |
| Home | `/` | Airzone Group \| Logistics & Transportation in Saudi Arabia | Logistics across Saudi Arabia and the GCC: customs clearance support, road and heavy transport, warehousing, air and sea freight. Request a quote from Airzone. | Moving cargo across Saudi Arabia and the GCC. | مجموعة إيرزون \| خدمات لوجستية ونقل في السعودية |
| Logistics Services | `/logistics` | Logistics Services in Saudi Arabia & the GCC \| Airzone | Airzone Logistics: customs clearance, road and heavy transport, warehousing, air and sea freight and exhibition logistics across Saudi Arabia and the GCC. | Integrated logistics solutions across Saudi Arabia & the GCC. | الخدمات اللوجستية في السعودية ودول الخليج \| إيرزون |
| Customs Clearance | `/logistics/customs-clearance` | Customs Clearance Services in Saudi Arabia \| Airzone | Import and export customs clearance coordination in Saudi Arabia: shipment documents, SABER and SFDA compliance support and ZATCA procedures. Request a quote. | Customs clearance services in Saudi Arabia | خدمات التخليص الجمركي في السعودية \| إيرزون |
| Transportation | `/logistics/transportation` | Road Transportation in Saudi Arabia & the GCC \| Airzone | Road transportation across Saudi Arabia and the GCC: flatbed, curtain-side and low-bed trailers, refrigerated transport on request and Dayana local delivery. | Road transportation across Saudi Arabia and the GCC | النقل البري في السعودية ودول الخليج \| إيرزون |
| Heavy Transport & Trailers | `/logistics/heavy-transport` | Heavy Transport, Flatbed & Curtain-Side Trailers \| Airzone | Heavy transport in Saudi Arabia and the GCC: heavy-duty trucks with flatbed and curtain-side trailers for machinery, steel, building materials and large cargo. | Heavy transport and trailer solutions | النقل الثقيل والمقطورات المسطحة وجانبية الستائر \| إيرزون |
| Warehousing | `/logistics/warehousing` | Warehousing & Storage in Saudi Arabia \| Airzone Logistics | Warehousing in Riyadh, Dammam, Jeddah and Jubail: temperature-controlled storage with 24/7 operations, receiving, container destuffing and dispatch. | Warehousing and storage in Saudi Arabia | التخزين والمستودعات في السعودية \| إيرزون |
| Air Freight | `/logistics/air-freight` | Air Freight & Air Cargo in Saudi Arabia \| Airzone | Air freight to and from Saudi Arabia: air waybill and document coordination, import and export customs clearance, and airport collection and delivery. | Air freight services in Saudi Arabia | الشحن الجوي في السعودية \| استيراد وتصدير \| إيرزون |
| Sea Freight | `/logistics/sea-freight` | Sea Freight & Container Shipping in Saudi Arabia \| Airzone | Sea freight to and from Saudi Arabia: FCL and LCL, machinery and project cargo, advance cargo information, customs coordination, port collection and delivery. | Sea freight services in Saudi Arabia: FCL, LCL and project cargo | الشحن البحري في السعودية \| حاويات كاملة وجزئية \| إيرزون |
| Exhibition & Trade Show Logistics | `/logistics/exhibition-event-logistics` | Exhibition & Trade Show Logistics in Saudi Arabia \| Airzone | Exhibition logistics in Saudi Arabia: freight, ATA Carnet and temporary admission, venue delivery, storage and re-export for stands, LED, AV and lighting. | Exhibition, trade show & event logistics in Saudi Arabia | لوجستيات المعارض والفعاليات في السعودية \| إيرزون |
| Service Locations | `/locations` | Logistics Service Locations in Saudi Arabia \| Airzone | Temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail, with road transportation across Saudi Arabia and the GCC. | Saudi warehouse cities and GCC transportation coverage | مواقع الخدمات اللوجستية في السعودية \| إيرزون |
| About Airzone Group | `/about` | About Airzone Group \| Logistics in Saudi Arabia & GCC | Airzone Group is a Saudi group with two businesses: Airzone Logistics (customs, transport, warehousing, freight across the GCC) and Airzone Travel & Tourism. | About Airzone Group — Logistics Services in Saudi Arabia & the GCC | عن مجموعة إيرزون \| خدمات لوجستية في السعودية والخليج |
| Contact Us | `/contact` | Contact Airzone Group \| Logistics Enquiries & Quotes | Contact Airzone Group about transportation, warehousing, local delivery or customs coordination, or reach the separate travel team. Send an enquiry online. | Talk to our logistics team | تواصل مع مجموعة إيرزون \| استفسارات الخدمات اللوجستية |
| Request a Quote | `/logistics/request-quote` | Request a Logistics Quote \| Airzone Logistics | Request a quote for road transport, warehousing, customs clearance or air and sea freight in Saudi Arabia and the GCC. Share your route, cargo and dates. | Request a logistics quote | اطلب عرض سعر لخدمات لوجستية \| إيرزون |
| Track a Shipment | `/track` | Track a Shipment \| Airzone Logistics | Track an Airzone Logistics shipment: enter your tracking number to see the latest status, route and updates available for your cargo. | Track your shipment. | تتبع شحنة \| إيرزون للخدمات اللوجستية |
| Airzone Travel & Tourism | `/travel` | Airzone Travel & Tourism \| Holidays & Travel from Riyadh | Holidays, honeymoons, family trips and corporate travel planned from Riyadh: flights, hotels, transfers and visa assistance, confirmed in a written proposal. | Travel, thoughtfully brought together. | إيرزون للسفر والسياحة \| عطلات وسفر أعمال من الرياض |

Every other indexable page (city warehousing pages, documentation, ATA Carnet,
destuffing, freight forwarding, import and export, industries, travel services,
privacy and terms) also has its own unique title, description and canonical URL.

## Technical checks in place

- Canonical URL on every page, pointing at the `https://airzonegroup.com` production URL; Arabic pages use `/ar/...`.
- `hreflang="en"` and `hreflang="ar"` on every indexable page, reciprocal. No `x-default`, because there is no language-selection page.
- `robots.txt` allows crawling, blocks only `/admin`, `/portal`, `/sign-in`, `/sign-up` and `/api/`, and lists the sitemap.
- `sitemap.xml` lists only canonical, indexable URLs (74 at this build), each answering 200 directly with language alternates.
- Trailing-slash and legacy URLs redirect once (301) to the canonical URL.
- Request a Quote and Track a Shipment are now indexable, so they can be sitelinks. The Track page is translated into Arabic.
- Content is prerendered (server-side HTML), so titles, headings, links and structured data are visible without JavaScript.

## Google Search Console: set-up and monitoring

1. **Add a Domain property** for `airzonegroup.com` at <https://search.google.com/search-console>.
   Google gives a `TXT` record; add it at the domain's DNS provider. This verifies
   both `http`/`https` and `www`/non-`www`. It is the recommended method, and no website change is needed.
2. **Alternative (URL-prefix property):** choose "HTML tag", copy only the `content` token,
   and build the site with `GOOGLE_SITE_VERIFICATION=<token>`. The homepage then carries
   `<meta name="google-site-verification" content="<token>">`. Nothing is emitted when the variable is unset.
3. **Submit the sitemap:** Indexing → Sitemaps → enter `sitemap.xml` (full URL `https://airzonegroup.com/sitemap.xml`).
4. **Request recrawling of updated pages:** URL Inspection → paste the URL → "Test live URL" → "Request indexing".
   Start with the homepage, `/logistics`, `/logistics/customs-clearance`, `/logistics/transportation`,
   `/logistics/warehousing`, `/logistics/air-freight`, `/logistics/sea-freight`,
   `/logistics/exhibition-event-logistics`, `/about`, and their `/ar/` versions.
5. **Check:** Pages report (indexed vs not indexed and why), Enhancements (Breadcrumbs, any structured-data errors),
   Core Web Vitals, and Performance (real queries, impressions, clicks, average position, Arabic vs English).
6. **Validate structured data on live URLs** with the Rich Results Test (<https://search.google.com/test/rich-results>)
   and the Schema Markup Validator (<https://validator.schema.org>) once the site is published.

Nothing has been indexed or verified yet: the site has not been published from
this workspace, so none of the steps above have been carried out.

## Outcomes that depend on Google and the business

- Whether and when pages are indexed, which title and description Google shows, and whether sitelinks appear.
- Rankings, which depend on competition, links from other sites, reviews, brand searches and time.
- A Google Business Profile for each real location (see `docs/SEO-KEYWORD-MAP.md` for the checklist).
- Production hosting must serve the built `dist/public` with the same 301 rules as `scripts/serve.mjs`,
  force HTTPS, and pick one host (with or without `www`) that redirects to the other.
