import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  GetPublicSiteSettingsResponse,
  UpdateAdminSiteSettingsBody,
  UpdateAdminSiteSettingsResponse,
} from "@workspace/api-zod";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdmin, type AirzoneAdminRole } from "../middlewares/adminAuth";

const router: IRouter = Router();

function publicSettings(row?: typeof siteSettingsTable.$inferSelect) {
  return GetPublicSiteSettingsResponse.parse({
    companyName: row?.companyName ?? null,
    contactEmail: row?.contactEmail ?? null,
    contactPhone: row?.contactPhone ?? null,
    logisticsWhatsapp: row?.logisticsWhatsapp ?? null,
    travelWhatsapp: row?.travelWhatsapp ?? null,
    googleReviewUrl: row?.googleReviewUrl ?? null,
    googleBusinessUrl: row?.googleBusinessUrl ?? null,
    googleMapsUrl: row?.googleMapsUrl ?? null,
    ga4MeasurementId: row?.ga4MeasurementId ?? null,
    metaPixelId: row?.metaPixelId ?? null,
  });
}

router.get("/site/settings", async (_req, res): Promise<void> => {
  const [row] = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.id, 1))
    .limit(1);
  res.json(publicSettings(row));
});

router.patch("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateAdminSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const values = parsed.data;
  if (Object.keys(values).length === 0) {
    res.status(400).json({ error: "Provide at least one setting to update" });
    return;
  }

  const role = res.locals.airzoneRole as AirzoneAdminRole;
  const keys = Object.keys(values);
  if (role === "logistics_admin" && keys.every((key) => key === "logisticsWhatsapp")) {
    // Division admins may update their own WhatsApp entry only.
  } else if (role === "travel_admin" && keys.every((key) => key === "travelWhatsapp")) {
    // Division admins may update their own WhatsApp entry only.
  } else if (role !== "super_admin" && role !== "content_admin") {
    res.status(403).json({ error: "This role cannot update website settings" });
    return;
  }

  const [row] = await db
    .insert(siteSettingsTable)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({
      target: siteSettingsTable.id,
      set: { ...values, updatedAt: new Date() },
    })
    .returning();
  res.json(UpdateAdminSiteSettingsResponse.parse(publicSettings(row)));
});

export default router;
