import { randomUUID } from "node:crypto";
import { db, enquiriesTable, type Enquiry } from "@workspace/db";

type EnquiryKind = "logistics" | "travel" | "contact";

export async function saveEnquiry(input: {
  kind: EnquiryKind;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  details: Record<string, unknown>;
}): Promise<{ enquiry: Enquiry; reference: string }> {
  const prefix = input.kind === "logistics" ? "AZL" : input.kind === "travel" ? "AZT" : "AZC";
  const reference = `${prefix}-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      reference,
      kind: input.kind,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      company: input.company ?? null,
      status: "New",
      details: input.details,
    })
    .returning();

  if (!enquiry) throw new Error("Database did not return the saved enquiry");
  return { enquiry, reference };
}
