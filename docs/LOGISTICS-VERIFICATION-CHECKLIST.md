# Airzone Logistics — business verification checklist

The logistics expansion (October 2026) was written so that nothing unverified
is stated as fact. The items below need confirmation from Airzone management.
Once confirmed, the wording in `artifacts/airzone-group/src/config/pillars/`
can be strengthened; until then the site uses the cautious wording noted.

## Customs clearance (highest priority)

| # | Question | Current website wording | Where to change |
| --- | --- | --- | --- |
| 1 | Does Airzone (or a group company) hold a ZATCA customs broker / customs clearance licence? Licence number and name on it? | "Declarations are lodged by the importer or a licensed customs broker; Airzone works with licensed brokers where one is required." | `pillars/customs.ts` (`filingNotice`, FAQ "Is Airzone a licensed customs broker?"), `service-catalog.ts` |
| 2 | Which entry points are actually served directly (Riyadh Dry Port, King Khalid Airport, Jeddah Islamic Port, King Abdulaziz Port, Jubail, land borders)? | Entry points listed "to help planning"; service confirmed per quotation; no office claimed. | `customs.ts` → section `coverage` |
| 3 | Are sea and air clearance handled directly or through partners? | "Coordinated through Airzone's partners and licensed brokers." | `customs.ts` → section `modes` note |
| 4 | Which specialised categories are accepted: food, pharmaceuticals, medical devices, chemicals/dangerous goods, aviation parts, personal effects, vehicles? | Listed "for guidance"; acceptance confirmed after assessment. | `customs.ts` → `cargoCategories` |
| 5 | Is there a dedicated customs team phone or email? | Contact links go to `/contact` and the logistics emails. | `business-contacts.ts`, `customsCtas.team` |
| 6 | Should a secure document-upload service be added? | No upload; customers email documents after receiving a reference. | `forms/CustomsForm.tsx` (needs backend storage + virus scanning) |

## Transportation

| # | Question | Current wording |
| --- | --- | --- |
| 7 | Refrigerated trailers / temperature-controlled trucks: owned, partner, or not offered? Temperature ranges? Monitoring? | "Arranged on request · subject to availability"; ranges and monitoring confirmed per shipment. |
| 8 | Part loads (LTL) and dedicated/scheduled fleets offered? | "Arranged on request." |
| 9 | Owned vs partner-operated vehicles; fleet counts (only if you want them published). | "May include partner-operated equipment"; no counts. |
| 10 | Dayana service areas by city. | "Service areas confirmed at booking." |
| 11 | GCC routes actually operated (UAE, Kuwait, Qatar, Bahrain, Oman) and typical border crossings. | All five listed; "each route is confirmed". |

## Warehousing

| # | Question | Current wording |
| --- | --- | --- |
| 12 | Facility addresses for Riyadh, Dammam, Jeddah, Jubail (publishable?). | "Address shared once arrangements are confirmed." |
| 13 | Temperature ranges (chilled / frozen) per facility; area or pallet capacity. | "Confirmed for your product"; no figures. |
| 14 | Is 24/7 operation true at all four facilities? | Stated for all four (from the original brief). Qassim was removed at the owner’s request on 13 Oct 2026. |
| 15 | Which value-added services exist (cross-docking, pick & pack, returns, labelling, container unloading, stock reporting, temperature monitoring)? | All marked "where available · confirmed per facility". |
| 16 | Any WMS, stock-visibility portal or reporting system? | Explicitly not offered unless confirmed in writing. |
| 17 | Pharmaceutical / healthcare storage approvals (SFDA) and food-storage licences. | "Only where suitable approvals and infrastructure exist." |

## Air freight, sea freight, destuffing and exhibitions (added October 2026)

Pages: `pillars/freight.ts` (air, sea, destuffing) and `pillars/exhibition.ts`.

| # | Question | Current website wording |
| --- | --- | --- |
| 21 | Air freight: which airline / forwarding partners, and is it offered for import, export or both? | "Coordinated through airlines and forwarding partners; Airzone does not operate aircraft." |
| 22 | Air: are temperature-sensitive, oversized and dangerous-goods air shipments actually arranged? | "Only where the carrier accepts it" / "where suitable arrangements are available". |
| 23 | Sea freight: shipping-line or forwarder partners; is LCL offered, and on which routes? | "LCL available on selected routes"; no carrier contracts claimed. |
| 24 | Which Saudi ports and airports are served in practice (Jeddah, Dammam, Jubail, Riyadh Dry Port; RUH, JED, DMM)? | Listed "for planning"; "no office or terminal operation is claimed". |
| 25 | Does Airzone prepare advance cargo information for sea imports, or only advise the importer / broker? | "Airzone helps you prepare the information but does not submit the manifest itself." |
| 26 | Container destuffing: at which warehouses, and is it in-house or through a partner? Are palletising, photo records, discrepancy reports and export stuffing offered? | "Equipment and labour confirmed job by job"; palletising and stuffing "where offered / where available"; no capacities published. |
| 27 | Exhibition logistics: past events or venues that may be named (with permission)? Is there on-site venue support or marshalling-yard coordination? | Generic; "coordination with organisers and contractors, where available"; no venues or events named. |
| 28 | Is temporary storage between build-up and dismantling offered, and in which cities? | "Where available" in the warehouse network. |
| 29 | Should a dedicated exhibitions contact (email or phone) be published? | Forms route to the logistics enquiry inbox; About page lists the two existing logistics emails. |
| 30 | Approve the illustrative Commons photos (they show third-party stands and equipment brands) or supply Airzone's own. | See `docs/photo-credits.md`. |

## About page (added October 2026)

| # | Question | Current website wording |
| --- | --- | --- |
| 31 | Confirm the legal name "Airzone Logistics Services Est" (taken from the logistics logo artwork) and whether a CR number may be shown. | Used in the About page and the `legalName` schema property. |
| 32 | Approve the leadership message, or supply a named, approved statement and portrait. | Attributed to "Airzone Group Leadership"; `config/leadership.ts`. |
| 33 | Which additional Saudi cities are genuinely served (e.g. Makkah, Madinah, Yanbu, Al Khobar)? | Only the four warehouse cities are named; "road transportation to other Saudi cities is quoted on request". |
| 34 | Is a public logistics office address approved? | Phones answered by the owner on 13 Oct 2026: footer phone 058 367 1739 (`logisticsFooterPhone`) and the floating Quick Call / WhatsApp +966 50 226 0256 (`logisticsQuickCall`). No office address is published (`officeAddress: null`). |

## Homepage service strip (added 13 October 2026)

| # | Question | Current website wording |
| --- | --- | --- |
| 35 | Is customs-clearance **support** genuinely available 24/7 (enquiries and coordination around the clock)? The strip says "24/7 Customs Clearance Support" as requested; government processing and release are not 24/7 or guaranteed. | Card 1 title; the customs page explains that ZATCA decides release. Change the title in `src/pages/HomePage.tsx` if 24/7 cover is not available. |
| 36 | Are flatbed and curtain-side trailers and local (Dayana) delivery available on request today? | Card 2: "Road Freight · Heavy Transport · Flatbeds · Curtain-Side Trailers · Local Delivery"; no fleet counts or ownership claimed. |
| 37 | Confirm the regulatory scope: documentation coordination and help identifying certificates (SABER, SFDA, SASO, IECEE, GACA, ZATCA, FASAH), with filings and approvals made by the importer, a licensed broker, a certification body or the authority. | Card 4 links to `/logistics/customs-documentation`, which states this role. |

## Trust signals (none published yet)

18. Company commercial registration, VAT number, certifications (ISO etc.), insurance cover, client references or testimonials — add only verified items.
19. Genuine photographs of Airzone vehicles, warehouses and staff to replace the illustrative Wikimedia/Unsplash images.
20. Native-speaker review of all Arabic copy (customs terminology in particular).
