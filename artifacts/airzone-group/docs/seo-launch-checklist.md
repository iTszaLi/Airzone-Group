# Owner and publishing checklist

## 1. Publish, domain and HTTPS
- The user-selected canonical target is **https://airzonegroup.com**. It is not a verified active deployment URL.
- This workspace had no active published deployment at the initial audit.
- Publish through Replit's Publishing interface. The registered web service now builds anonymous page HTML and runs the small Node web server; the existing API service remains separate.
- Connect **airzonegroup.com** and **www.airzonegroup.com** separately, with the exact DNS records provided by Publishing. Replit manages certificates after verification; it does not automatically connect or redirect the www name.
- After DNS propagation, verify valid certificates, HTTP-to-HTTPS behavior, and exactly one permanent redirect from `https://www.airzonegroup.com/path` to `https://airzonegroup.com/path`. The web server implements the www-to-apex redirect; it cannot issue certificates or change DNS.
- Fetch `/`, `/ar/`, a service page, an unknown URL, `/robots.txt` and `/sitemap.xml` on the real hostname. Unknown URLs must return 404, not a 200 home page. Verify the API still routes to the existing API service.
- Keep `ENABLE_HSTS` unset until HTTPS is verified. If enabled, the current rollout value is `max-age=300` without `includeSubDomains` or `preload`. Increase deliberately after monitoring, not blindly.
- CSP starts in **Report-Only**, not enforced. Review actual fonts, analytics, auth and preview frame origins before setting `CSP_ENFORCE=true`. The report-only policy has no collection endpoint; inspect the browser console locally. No claim that an enforced CSP or production headers have already been verified.
- Official setup reference: https://docs.replit.com/features/publishing/custom-domains

## 2. Real analytics configuration
- No real GA4 measurement ID was configured at implementation. No invented ID has been installed, and no Google analytics script loads in that state.
- Create or select the correct GA4 property and web stream for the real hostname. Set public build-time environment variable **VITE_GA4_MEASUREMENT_ID** to that stream's actual `G-...` ID through workspace environment settings, then rebuild/publish.
- No Google account credential or API key should be pasted into source, forms, or chat. Use the proper connection/secret flow if a future account integration requires one.
- Before collecting data, disable GA4 enhanced-measurement **automatic form interactions** and **page changes based on browser history** (and other unwanted automatic events) to avoid duplicate or unintended data collection. This app explicitly emits consent-aware SPA page views and success-only form events.
- Confirm in Tag Assistant/DebugView: no Google request before consent; none after Reject; one page view per SPA route after Accept; rejected/failed/invalid submissions produce no `generate_lead`; a successful enquiry produces one `form_submit` and one `generate_lead`, plus its appropriate Travel/callback event.
- Reject after accepting, verify GA disabling and first-party cookie cleanup. Preferences are on Privacy → Privacy choices. Storage restrictions keep analytics disabled.
- Enquiry references are used only for in-memory duplicate prevention; they are never sent to GA. Never add names, contact information, messages, document contents, free-text service values, query strings or tracking-reference fields to event parameters.
- Mark `generate_lead`, `travel_enquiry_submit` and `callback_request_submit` as key events as appropriate. Avoid summing these overlapping success events as separate unique enquiries.
- Register event-scoped custom dimensions: `business_division`, `form_type`, `service_category`, `page_category`, `cta_location`.
- Build GA4 explorations segmented by division, landing page, device and language; link Search Console for actual organic reports when permitted. Do not populate dashboards with estimates.

## 3. Search Console and Bing
- Verify a domain property for `airzonegroup.com` with its owner-authorized DNS process.
- Submit **https://airzonegroup.com/sitemap.xml** after publishing, then inspect English/Arabic home, customs, ATA Carnet, exhibition and Travel pages.
- Check the selected canonical, crawlability, initial HTML, hreflang, response status and mobile rendering. Indexing is not guaranteed or immediate.
- Set up Bing Webmaster Tools using actual owner access and submit the same sitemap. Do not report submission until it has actually been done.
- Preview HTML and preview robots deliberately prevent indexing. Production public content uses index/follow; private/account/enquiry utility pages remain noindex.

## 4. Verified local presence
- Travel's approved Al Malaz office, phone and email are the only public physical-office/phone details currently available.
- Do not reuse that address/number for Logistics or create extra Riyadh/Jeddah/Dammam offices.
- Request company-confirmed Logistics office/service area, official telephone/WhatsApp, legal business name and any supported licence/accreditation before adding them.
- Confirm road coverage, warehousing and project-cargo scope; confirm visa/Umrah operating authority before indexing/promoting those legacy service pages further.
- With real Google Business Profile access, verify eligibility, genuine name/category/address/contact details, service area and hours. Never fabricate a listing, pin, review, rating or opening hours.
- Review the new Arabic service copy and privacy/legal text with the business and a professional Arabic reviewer. “Content updated” is not a regulatory or legal approval.

## 5. Ongoing measurement, authority and AI discovery
- Record real baseline indexed pages, Search Console impressions/clicks, GA4 consented sessions/leads and query/device/division segments before comparing changes.
- No keyword volumes, current rankings, backlinks, traffic or AI mentions were measured here. No ranking or citation guarantee is made.
- Use the keyword map to improve genuine pages; do not create city doorway pages or mass-produced articles.
- Source factual customs guidance from ZATCA, temporary-admission scope from ZATCA/ICC, and route-specific advice from actual shipment assessment. Check for regulatory changes.
- Use the AI baseline template below; manually check each system with the same questions/date/location, saving actual citations and answers. Do not label ordinary web search results as AI mentions.
- Seek legitimate mentions from real event partners, trade directories and chambers only if the relationship and eligibility are genuine. No purchased link scheme, fake partnership or automatic disavow list.
- A secure authenticated admin SEO editor and account-backed readiness dashboard remain follow-up work. Existing admin access fails closed and was not bypassed. Current metadata/content edits use the typed source configuration; no admin-only configuration is exposed in public HTML.

### AI baseline template
| Date | System | Query | Country/language | Brand mentioned? | Exact cited URL | Evidence link/capture | Notes |
|---|---|---|---|---|---|---|---|
| Not measured | Google AI features | Customs clearance assistance Saudi Arabia | SA / EN | Unknown | — | — | Do not infer a mention |
| Not measured | ChatGPT search | ATA Carnet assistance Saudi Arabia | SA / EN | Unknown | — | — | Check actual answer and source |
| Not measured | Perplexity | Exhibition logistics Riyadh | SA / EN | Unknown | — | — | Check actual answer and source |
| Not measured | Gemini | Corporate travel agency Riyadh | SA / EN | Unknown | — | — | Check actual answer and source |
| Not measured | Bing Copilot | خدمات التخليص الجمركي في السعودية | SA / AR | Unknown | — | — | Check actual answer and source |
