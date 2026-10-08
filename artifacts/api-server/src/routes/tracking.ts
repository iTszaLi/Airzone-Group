import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, shipmentsTable, shipmentEventsTable } from "@workspace/db";
import {
  GetShipmentTrackingParams,
  GetShipmentTrackingResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/shipments/:trackingNumber", async (req, res): Promise<void> => {
  const params = GetShipmentTrackingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.trackingNumber, params.data.trackingNumber))
    .limit(1);
  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  const events = await db
    .select()
    .from(shipmentEventsTable)
    .where(eq(shipmentEventsTable.shipmentId, shipment.id))
    .orderBy(asc(shipmentEventsTable.occurredAt));

  res.json(
    GetShipmentTrackingResponse.parse({
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      shipmentType: shipment.shipmentType,
      currentLocation: shipment.currentLocation,
      estimatedDelivery: shipment.estimatedDelivery,
      events: events.map((event) => ({
        status: event.status,
        location: event.location,
        note: event.note,
        occurredAt: event.occurredAt.toISOString(),
      })),
    }),
  );
});

export default router;
