import { oneLine, renderEnquiryEmail, riyadhTime } from "./email-template";

type When = Date | string | null | undefined;

/** Travel quotation request -> Airzone Travel & Tourism. */
export function buildTravelEmail(q: {
  name: string; mobile: string; email?: string | null; company?: string | null;
  destination: string; departureCity: string; departureDate?: When; returnDate?: When;
  travellers?: number | null; adults?: number | null; children?: number | null;
  travelType: string; budget?: string | null; preferredPackage?: string | null; message?: string | null;
  landingPage?: string | null;
}, reference: string, submittedAt: Date) {
  const subject = "New Travel Quotation Request — Airzone Travel & Tourism";
  const { html, text } = renderEnquiryEmail({
    brand: "Airzone Travel & Tourism",
    title: "Travel quotation request",
    summary: `${oneLine(q.destination, 60)} · from ${oneLine(q.departureCity, 40)}`,
    reference,
    customerEmail: q.email,
    customerPhone: q.mobile,
    intro: "Please contact the customer about the options for this trip. Replying to this email goes to the customer when they gave an email address.",
    rows: [
      ["Reference", reference],
      ["Submitted", riyadhTime(submittedAt)],
      ["Name", q.name],
      ["Phone / WhatsApp", q.mobile],
      ["Email", q.email],
      ["Company", q.company],
      ["Destination", q.destination],
      ["Departure city", q.departureCity],
      ["Departure date", q.departureDate],
      ["Return date", q.returnDate],
      ["Travellers", q.travellers ?? q.adults],
      ["Travel purpose", q.travelType],
      ["Budget", q.budget],
      ["Selected offer", q.preferredPackage],
      ["Additional requirements", q.message],
      ["Sent from page", q.landingPage],
    ],
  });
  return { subject, html, text };
}

/** Logistics quotation request (quote form and the specialist logistics forms) -> Airzone Logistics. */
export function buildLogisticsEmail(q: {
  fullName: string; company?: string | null; email: string; mobile: string;
  service: string; shipmentType: string; mode?: string | null; origin: string; destination: string;
  cargoType?: string | null; packages?: number | null; weight?: string | null; dimensions?: string | null;
  incoterm?: string | null; expectedDate?: When; details?: string | null; landingPage?: string | null;
}, reference: string, submittedAt: Date) {
  const subject = "New Logistics Quotation Request — Airzone Logistics";
  const { html, text } = renderEnquiryEmail({
    brand: "Airzone Logistics",
    title: "Logistics quotation request",
    summary: `${oneLine(q.service, 60)} · ${oneLine(q.origin, 50)} → ${oneLine(q.destination, 50)}`,
    reference,
    customerEmail: q.email,
    customerPhone: q.mobile,
    intro: "Please contact the customer about the quotation or any further information needed. Replying to this email goes to the customer.",
    rows: [
      ["Reference", reference],
      ["Submitted", riyadhTime(submittedAt)],
      ["Service", q.service],
      ["Name", q.fullName],
      ["Company", q.company],
      ["Email", q.email],
      ["Phone", q.mobile],
      ["Shipment type", q.shipmentType],
      ["Transport mode", q.mode],
      ["Pickup / origin", q.origin],
      ["Delivery destination", q.destination],
      ["Cargo", q.cargoType],
      ["Pallets or packages", q.packages],
      ["Weight", q.weight],
      ["Dimensions", q.dimensions],
      ["Incoterm", q.incoterm],
      ["Required date", q.expectedDate],
      ["Additional requirements", q.details],
      ["Sent from page", q.landingPage],
    ],
  });
  return { subject, html, text };
}

/** Contact form message -> the business the visitor chose (see recipients.ts). */
export function buildContactEmail(q: {
  name: string; email: string; phone?: string | null; company?: string | null; department: string; message: string; landingPage?: string | null;
}, business: string, reference: string, submittedAt: Date) {
  const subject = `New Contact Enquiry — ${business}`;
  const { html, text } = renderEnquiryEmail({
    brand: business,
    title: "Contact enquiry",
    summary: `${oneLine(q.department, 40)} · ${oneLine(q.name, 60)}`,
    reference,
    customerEmail: q.email,
    customerPhone: q.phone,
    intro: "Please reply to the customer. Replying to this email goes to the customer.",
    rows: [
      ["Reference", reference],
      ["Submitted", riyadhTime(submittedAt)],
      ["Department", q.department],
      ["Name", q.name],
      ["Company", q.company],
      ["Email", q.email],
      ["Phone", q.phone],
      ["Message", q.message],
      ["Sent from page", q.landingPage],
    ],
  });
  return { subject, html, text };
}

/** Callback request -> the business the visitor chose. Urgent requests say so in the subject. */
export function buildCallbackEmail(q: {
  name: string; mobile: string; department: string; preferredTime: string; message?: string | null; urgency?: string | null; landingPage?: string | null;
}, business: string, reference: string, submittedAt: Date) {
  const urgent = q.urgency === "Urgent";
  const subject = `${urgent ? "Urgent " : "New "}Callback Request — ${business}`;
  const { html, text } = renderEnquiryEmail({
    brand: business,
    title: urgent ? "Urgent callback request" : "Callback request",
    summary: `${oneLine(q.department, 40)} · call ${oneLine(q.preferredTime, 40)}`,
    reference,
    customerPhone: q.mobile,
    intro: "Please call the customer at the preferred time.",
    rows: [
      ["Reference", reference],
      ["Submitted", riyadhTime(submittedAt)],
      ["Department", q.department],
      ["Urgency", urgent ? "Urgent" : "Normal"],
      ["Name", q.name],
      ["Phone", q.mobile],
      ["Preferred time", q.preferredTime],
      ["Message", q.message],
      ["Sent from page", q.landingPage],
    ],
  });
  return { subject, html, text };
}
