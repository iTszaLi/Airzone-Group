import { clerkClient, getAuth } from "@clerk/express";
import { and, desc, eq, inArray } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { ListMyEnquiriesResponseItem } from "@workspace/api-zod";
import { db, enquiriesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/portal/enquiries", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in to view your enquiries" });
    return;
  }
  try {
    const user = await clerkClient.users.getUser(userId);
    const primary = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    );
    if (!primary || primary.verification?.status !== "verified") {
      res.status(403).json({ error: "A verified email is required to use the customer portal" });
      return;
    }
    const records = await db
      .select({
        id: enquiriesTable.id,
        reference: enquiriesTable.reference,
        kind: enquiriesTable.kind,
        status: enquiriesTable.status,
        priority: enquiriesTable.priority,
        createdAt: enquiriesTable.createdAt,
        department: enquiriesTable.department,
      })
      .from(enquiriesTable)
      .where(
        and(
          eq(enquiriesTable.email, primary.emailAddress),
          inArray(enquiriesTable.kind, ["logistics", "travel", "contact"]),
        ),
      )
      .orderBy(desc(enquiriesTable.createdAt))
      .limit(100);
    res.json(
      records.map((record) =>
        ListMyEnquiriesResponseItem.parse({
          ...record,
          createdAt: record.createdAt.toISOString(),
        }),
      ),
    );
  } catch (error) {
    req.log.error({ err: error }, "Unable to load customer enquiries");
    res.status(503).json({ error: "Customer records are temporarily unavailable" });
  }
});

export default router;
