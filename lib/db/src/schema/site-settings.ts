import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  companyName: text("company_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  logisticsWhatsapp: text("logistics_whatsapp"),
  travelWhatsapp: text("travel_whatsapp"),
  googleReviewUrl: text("google_review_url"),
  googleBusinessUrl: text("google_business_url"),
  googleMapsUrl: text("google_maps_url"),
  ga4MeasurementId: text("ga4_measurement_id"),
  metaPixelId: text("meta_pixel_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
