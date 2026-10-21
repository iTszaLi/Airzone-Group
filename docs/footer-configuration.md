# Footer contact configuration

The public business contact details are centralized in
`artifacts/airzone-group/src/config/business-contacts.ts`. Edit this one file to
update approved division emails, phone links, office addresses, Maps links,
WhatsApp numbers and official social accounts. Footer components consume this
configuration rather than duplicating the details.

- Logistics and Travel must remain separate.
- Logistics phone, office address and Maps URL are deliberately unset until
  confirmed. Display only the country when there is no approved office address.
- The supplied Travel office is not a Logistics office.
- Do not derive WhatsApp availability from a telephone number. Configure a
  WhatsApp number only after the company confirms it.
- Empty social lists should produce no inactive icons.
- The configuration is public information, not a place for credentials.

## Official contacts per division (owner-confirmed, 13 Oct 2026)

| Division | WhatsApp | Email |
| --- | --- | --- |
| Airzone Travel & Tourism | +966 54 345 7665 (`https://wa.me/966543457665`) | `Ticketing@airzonetravel.net` |
| Airzone Logistics | +966 50 226 0256 (`https://wa.me/966502260256`) | `info@envodkingdom.net` |

- Each division has its own pre-filled WhatsApp message in English and Arabic (`whatsappMessage`), built into links by `whatsappLink()`.
- Two further logistics numbers serve different purposes (owner request, 13 Oct 2026). Keep them separate.
  - `logisticsQuickCall` (`+966 50 226 0256`, `tel:+966502260256`) drives the floating "Quick Call" button (`components/layout/QuickCallButton.tsx`). It appears on the homepage only, stacked above the WhatsApp button.
  - `logisticsFooterPhone` (`058 367 1739`, `tel:0583671739`) appears only in the footer's "Logistics enquiries" block.
  - `businessContacts.logistics.phone` stays empty, so the Contact and callback pages are unchanged.
- The floating WhatsApp button (`components/layout/WhatsAppButton.tsx`) picks the division from the route: Travel on `/travel`, `/travel/*` and `/destinations`; Logistics on every other public page. The header email, the mobile menu email and the phone action bar use the same rule (`useDivision()`).
- "Request a quote" is business-specific (`components/layout/QuoteCta.tsx`).
  - Homepage: a chooser offering "Travel & Tourism quote" or "Logistics quote".
  - Travel pages: the travel form (`/travel/enquiry`; on `/travel` it scrolls to the form on the page).
  - All other pages: `/logistics/request-quote`.
  - The footer lists both quote links.
- Travel pages show a floating "Call Airzone Travel" button on the left (`tel:+966593567526`, from `businessContacts.travel.phone`), opposite the WhatsApp button.
- Website forms store enquiries in the database, tagged by division, for the admin workspace.
- Travel enquiries email `TRAVEL_QUOTE_EMAIL` (default `Ticketing@airzonetravel.net`, subject "New Travel Quotation Request — Airzone Travel & Tourism"). Logistics quotation requests email `LOGISTICS_QUOTE_EMAIL` (default `info@envodkingdom.net`, subject "New Logistics Quotation Request — Airzone Logistics"). Both send only once `RESEND_API_KEY` and `EMAIL_FROM` are set. Recipients live in `artifacts/api-server/src/lib/recipients.ts`.
- Contact and callback forms email the team for the department chosen:
  - Travel & Tourism and Corporate Travel go to the travel inbox.
  - Logistics and Customs Clearance go to the logistics inbox.
  - General Enquiry goes to `GENERAL_ENQUIRY_EMAIL` (default: the logistics inbox).
  - Subjects are "New Contact Enquiry — …" and "New Callback Request — …" ("Urgent Callback Request — …" when marked urgent).
- Vehicle requests from the homepage fleet showroom (`POST /api/enquiries/fleet`) are also emailed to the logistics team once `RESEND_API_KEY` and `EMAIL_FROM` are set on the API server (see `.env.example`). The recipient is `FLEET_QUOTE_EMAIL`, or `info@envodkingdom.net` by default.
  - Each stored request records the outcome in `details.emailNotification`: `sent`, `not-configured` or `failed`.
  - The website says "received by our logistics team" only when the provider accepted the email; otherwise it says the request was recorded.
- Every website form now uses the same email path (`artifacts/api-server/src/lib/mailer.ts`), and each stored enquiry records whether its email was sent.

This footer update does not modify the database or authentication system.
