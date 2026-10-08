import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const shipmentsTable = pgTable(
  "shipments",
  {
    id: serial("id").primaryKey(),
    trackingNumber: text("tracking_number").notNull(),
    status: text("status").notNull(),
    origin: text("origin").notNull(),
    destination: text("destination").notNull(),
    shipmentType: text("shipment_type").notNull(),
    currentLocation: text("current_location"),
    estimatedDelivery: text("estimated_delivery"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("shipments_tracking_number_unique").on(table.trackingNumber),
    index("shipments_status_idx").on(table.status),
  ],
);

export const shipmentEventsTable = pgTable(
  "shipment_events",
  {
    id: serial("id").primaryKey(),
    shipmentId: integer("shipment_id")
      .notNull()
      .references(() => shipmentsTable.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    location: text("location"),
    note: text("note"),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("shipment_events_shipment_date_idx").on(table.shipmentId, table.occurredAt)],
);

export type Shipment = typeof shipmentsTable.$inferSelect;
export type ShipmentEvent = typeof shipmentEventsTable.$inferSelect;
