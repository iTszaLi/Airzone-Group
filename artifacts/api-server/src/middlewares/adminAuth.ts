import { clerkClient, getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

export const AIRZONE_ADMIN_ROLES = [
  "super_admin",
  "logistics_admin",
  "travel_admin",
  "content_admin",
] as const;

export type AirzoneAdminRole = (typeof AIRZONE_ADMIN_ROLES)[number];

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const rawRole = user.publicMetadata.airzoneRole;
    if (
      typeof rawRole !== "string" ||
      !AIRZONE_ADMIN_ROLES.includes(rawRole as AirzoneAdminRole)
    ) {
      res.status(403).json({ error: "Airzone administrator access required" });
      return;
    }
    res.locals.airzoneRole = rawRole as AirzoneAdminRole;
    next();
  } catch (error) {
    req.log.error({ err: error }, "Unable to verify Airzone administrator role");
    res.status(503).json({ error: "Administrator access could not be verified" });
  }
};

export function canManageEnquiryKind(
  role: AirzoneAdminRole,
  kind: string,
): boolean {
  if (role === "super_admin") return true;
  if (role === "logistics_admin") return kind === "logistics";
  if (role === "travel_admin") return kind === "travel";
  return false;
}
