import { randomUUID } from "node:crypto";
import { db, enquiriesTable, type Enquiry } from "@workspace/db";

type EnquiryKind = "logistics" | "travel" | "contact" | "callback";

export async function saveEnquiry(input: {
  kind: EnquiryKind;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  department?: string | null;
  priority?: "Low" | "Normal" | "High" | "Urgent";
  leadSource?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  landingPage?: string | null;
  referrer?: string | null;
  details: Record<string, unknown>;
}): Promise<{ enquiry: Enquiry; reference: string }> {
  const prefix =
    input.kind === "logistics"
      ? "AZL"
      : input.kind === "travel"
        ? "AZT"
        : input.kind === "callback"
          ? "AZB"
          : "AZC";
  const reference = `${prefix}-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      reference,
      kind: input.kind,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company: input.company ?? null,
      department: input.department ?? null,
      status: "New",
      priority: input.priority ?? "Normal",
      leadSource: input.leadSource ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      landingPage: input.landingPage ?? null,
      referrer: input.referrer ?? null,
      details: input.details,
    })
    .returning();

  if (!enquiry) throw new Error("Database did not return the saved enquiry");
  return { enquiry, reference };
}
