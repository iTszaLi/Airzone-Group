import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateAdminShipmentBody,
  CreateAdminShipmentResponse,
  GetAdminOverviewResponse,
  GetShipmentTrackingResponse,
  ListAdminEnquiriesQueryParams,
  ListAdminEnquiriesResponse,
  ListAdminEnquiriesResponseItem,
  UpdateAdminEnquiryBody,
  UpdateAdminEnquiryParams,
  UpdateAdminEnquiryResponse,
} from "@workspace/api-zod";
import {
  db,
  enquiriesTable,
  shipmentsTable,
  shipmentEventsTable,
} from "@workspace/db";
import {
  canManageEnquiryKind,
  requireAdmin,
  type AirzoneAdminRole,
} from "../middlewares/adminAuth";

const router: IRouter = Router();
const logisticsStatuses = [
  "New",
  "Contacted",
  "Quotation Sent",
  "In Progress",
  "Won",
  "Lost",
  "Closed",
];
const travelStatuses = [
  "New",
  "Contacted",
  "Itinerary Prepared",
  "Quote Sent",
  "Confirmed",
  "Cancelled",
  "Closed",
];
const contactStatuses = ["New", "Contacted", "Closed"];

function toAdminEnquiry(enquiry: typeof enquiriesTable.$inferSelect) {
  return ListAdminEnquiriesResponseItem.parse({
    id: enquiry.id,
    reference: enquiry.reference,
    kind: enquiry.kind,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    company: enquiry.company,
    status: enquiry.status,
    createdAt: enquiry.createdAt.toISOString(),
    details: JSON.stringify(enquiry.details, null, 2),
    internalNotes: enquiry.internalNotes,
  });
}

function roleFromLocals(res: Parameters<typeof requireAdmin>[1]): AirzoneAdminRole {
  return res.locals.airzoneRole as AirzoneAdminRole;
}

router.get("/admin/overview", requireAdmin, async (_req, res): Promise<void> => {
  const [logistics, travel, contact, shipments] = await Promise.all([
    db.select({ total: count() }).from(enquiriesTable).where(eq(enquiriesTable.kind, "logistics")),
    db.select({ total: count() }).from(enquiriesTable).where(eq(enquiriesTable.kind, "travel")),
    db.select({ total: count() }).from(enquiriesTable).where(eq(enquiriesTable.kind, "contact")),
    db.select({ total: count() }).from(shipmentsTable),
  ]);
  res.json(
    GetAdminOverviewResponse.parse({
      logistics: logistics[0]?.total ?? 0,
      travel: travel[0]?.total ?? 0,
      contact: contact[0]?.total ?? 0,
      shipments: shipments[0]?.total ?? 0,
    }),
  );
});

router.get("/admin/enquiries", requireAdmin, async (req, res): Promise<void> => {
  const query = ListAdminEnquiriesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const role = roleFromLocals(res);
  let kind = query.data.kind;
  if (role === "logistics_admin" && !kind) kind = "logistics";
  if (role === "travel_admin" && !kind) kind = "travel";
  if (
    role !== "super_admin" &&
    (!kind || !canManageEnquiryKind(role, kind))
  ) {
    res.status(403).json({ error: "This role cannot view the requested enquiries" });
    return;
  }

  const conditions = [];
  if (kind) conditions.push(eq(enquiriesTable.kind, kind));
  if (query.data.status) conditions.push(eq(enquiriesTable.status, query.data.status));
  if (query.data.search) {
    const term = `%${query.data.search}%`;
    conditions.push(
      or(
        ilike(enquiriesTable.name, term),
        ilike(enquiriesTable.email, term),
        ilike(enquiriesTable.reference, term),
        ilike(enquiriesTable.company, term),
      )!,
    );
  }
  const rows = await db
    .select()
    .from(enquiriesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(enquiriesTable.createdAt))
    .limit(250);
  res.json(ListAdminEnquiriesResponse.parse(rows.map(toAdminEnquiry)));
});

router.patch("/admin/enquiries/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateAdminEnquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateAdminEnquiryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  if (!body.data.status && body.data.internalNotes === undefined) {
    res.status(400).json({ error: "Provide a status or internal notes update" });
    return;
  }
  const [existing] = await db
    .select()
    .from(enquiriesTable)
    .where(eq(enquiriesTable.id, params.data.id))
    .limit(1);
  if (!existing) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  const role = roleFromLocals(res);
  if (!canManageEnquiryKind(role, existing.kind)) {
    res.status(403).json({ error: "This role cannot update this enquiry" });
    return;
  }
  if (body.data.status) {
    const allowedStatuses =
      existing.kind === "logistics"
        ? logisticsStatuses
        : existing.kind === "travel"
          ? travelStatuses
          : contactStatuses;
    if (!allowedStatuses.includes(body.data.status)) {
      res.status(400).json({ error: "Invalid status for this enquiry type" });
      return;
    }
  }
  const [updated] = await db
    .update(enquiriesTable)
    .set({
      ...(body.data.status ? { status: body.data.status } : {}),
      ...(body.data.internalNotes !== undefined
        ? { internalNotes: body.data.internalNotes }
        : {}),
    })
    .where(eq(enquiriesTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.json(UpdateAdminEnquiryResponse.parse(toAdminEnquiry(updated)));
});

router.post("/admin/shipments", requireAdmin, async (req, res): Promise<void> => {
  const role = roleFromLocals(res);
  if (role !== "super_admin" && role !== "logistics_admin") {
    res.status(403).json({ error: "This role cannot manage shipments" });
    return;
  }
  const parsed = CreateAdminShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const input = parsed.data;
  try {
    const shipment = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(shipmentsTable)
        .values({
          trackingNumber: input.trackingNumber,
          status: input.status,
          origin: input.origin,
          destination: input.destination,
          shipmentType: input.shipmentType,
          currentLocation: input.currentLocation ?? null,
          estimatedDelivery: input.estimatedDelivery
            ? input.estimatedDelivery.toISOString().slice(0, 10)
            : null,
        })
        .returning();
      if (!created) throw new Error("Database did not return the shipment");
      await tx.insert(shipmentEventsTable).values({
        shipmentId: created.id,
        status: input.status,
        location: input.currentLocation ?? null,
        note: input.eventNote ?? null,
      });
      return created;
    });
    res.status(201).json(
      CreateAdminShipmentResponse.parse({
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        origin: shipment.origin,
        destination: shipment.destination,
        shipmentType: shipment.shipmentType,
        currentLocation: shipment.currentLocation,
        estimatedDelivery: shipment.estimatedDelivery,
        events: [
          {
            status: input.status,
            location: input.currentLocation ?? null,
            note: input.eventNote ?? null,
            occurredAt: shipment.createdAt.toISOString(),
          },
        ],
      }),
    );
  } catch (error) {
    const pgError = error as { code?: string };
    if (pgError.code === "23505") {
      res.status(409).json({ error: "That tracking number already exists" });
      return;
    }
    req.log.error({ err: error }, "Failed to create shipment");
    res.status(500).json({ error: "Unable to create shipment right now" });
  }
});

export default router;
