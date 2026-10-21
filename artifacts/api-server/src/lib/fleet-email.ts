/**
 * Email to the logistics team for a vehicle request from the homepage fleet showroom.
 * Every customer value is escaped for HTML and stripped of line breaks in the subject.
 */
import { oneLine, renderEnquiryEmail, riyadhTime } from "./email-template";

export type FleetQuote = {
  vehicle: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  pickup: string;
  destination: string;
  pickupDate?: Date | string | null;
  cargo: string;
  weight?: string;
  requirements?: string;
  locale?: "en" | "ar";
};

export function buildFleetEmail(q: FleetQuote, reference: string, submittedAt: Date) {
  const subject = `Fleet Quote Request — ${oneLine(q.vehicle, 60)} — ${oneLine(q.pickup, 50)} to ${oneLine(q.destination, 50)}`;
  const { html, text } = renderEnquiryEmail({
    brand: "Airzone Logistics",
    title: "Fleet quote request",
    summary: `${q.vehicle} · ${q.pickup} → ${q.destination}`,
    reference,
    customerEmail: q.email,
    customerPhone: q.phone,
    intro: "Please contact the customer about availability, pricing and the requested route. Replying to this email goes to the customer.",
    rows: [
      ["Reference", reference],
      ["Submitted", riyadhTime(submittedAt)],
      ["Vehicle", q.vehicle],
      ["Name", q.fullName],
      ["Company", q.company],
      ["Email", q.email],
      ["Phone / WhatsApp", q.phone],
      ["Pickup location", q.pickup],
      ["Delivery destination", q.destination],
      ["Preferred pickup date", q.pickupDate],
      ["Cargo", q.cargo],
      ["Weight or quantity", q.weight],
      ["Additional requirements", q.requirements],
      ["Website language", q.locale === "ar" ? "Arabic" : "English"],
    ],
  });
  return { subject, html, text };
}
