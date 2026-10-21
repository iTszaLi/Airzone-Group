import { recipients } from "./mailer";

/**
 * Who receives each kind of enquiry email. Server-side only: the website never sends a
 * recipient, and request bodies cannot change these addresses. Each can be overridden with
 * an environment variable (comma-separated); the defaults are the owner-confirmed inboxes.
 */
export const recipientsFor = {
  logistics: () => recipients(process.env.LOGISTICS_QUOTE_EMAIL, ["info@envodkingdom.net"]),
  travel: () => recipients(process.env.TRAVEL_QUOTE_EMAIL, ["Ticketing@airzonetravel.net"]),
  fleet: () => recipients(process.env.FLEET_QUOTE_EMAIL ?? process.env.LOGISTICS_QUOTE_EMAIL, ["info@envodkingdom.net"]),
  /** Contact and callback forms marked "General Enquiry" (group level). */
  general: () => recipients(process.env.GENERAL_ENQUIRY_EMAIL ?? process.env.LOGISTICS_QUOTE_EMAIL, ["info@envodkingdom.net"]),
};

export type Business = "logistics" | "travel" | "general";

/** Same department-to-business rule as the website (analytics/events.ts departmentDivision). */
export function businessForDepartment(department: string): Business {
  if (department === "Travel & Tourism" || department === "Corporate Travel") return "travel";
  if (department === "Logistics" || department === "Customs Clearance") return "logistics";
  return "general";
}

export const businessName: Record<Business, string> = {
  logistics: "Airzone Logistics",
  travel: "Airzone Travel & Tourism",
  general: "Airzone Group",
};
