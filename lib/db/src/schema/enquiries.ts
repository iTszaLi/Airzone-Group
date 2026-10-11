import {
  index,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const enquiriesTable = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").notNull(),
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    department: text("department"),
    status: text("status").notNull().default("New"),
    priority: text("priority").notNull().default("Normal"),
    leadSource: text("lead_source"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    landingPage: text("landing_page"),
    referrer: text("referrer"),
    details: jsonb("details").$type<Record<string, unknown>>().notNull(),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("enquiries_reference_unique").on(table.reference),
    index("enquiries_kind_status_created_idx").on(
      table.kind,
      table.status,
      table.createdAt,
    ),
    index("enquiries_email_idx").on(table.email),
  ],
);

export type Enquiry = typeof enquiriesTable.$inferSelect;
