import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import {
  CreateContactEnquiryBody,
  CreateContactEnquiryResponse,
  CreateCallbackRequestBody,
  CreateCallbackRequestResponse,
  CreateLogisticsEnquiryBody,
  CreateLogisticsEnquiryResponse,
  CreateTravelEnquiryBody,
  CreateTravelEnquiryResponse,
} from "@workspace/api-zod";
import { saveEnquiry } from "../lib/enquiry";

const router: IRouter = Router();
const submissionLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

router.post("/enquiries/logistics", submissionLimit, async (req, res): Promise<void> => {
  const parsed = CreateLogisticsEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const input = parsed.data;
  try {
    const saved = await saveEnquiry({
      kind: "logistics",
      name: input.fullName,
      email: input.email,
      phone: input.mobile,
      company: input.company,
      department: "Logistics",
      leadSource: input.source ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      landingPage: input.landingPage ?? null,
      referrer: input.referrer ?? req.get("referer") ?? null,
      details: input,
    });
    res.status(201).json(
      CreateLogisticsEnquiryResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: "Your logistics request has been received.",
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to save logistics enquiry");
    res.status(500).json({ error: "Unable to save your request right now." });
  }
});

router.post("/enquiries/travel", submissionLimit, async (req, res): Promise<void> => {
  const parsed = CreateTravelEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const input = parsed.data;
  try {
    const saved = await saveEnquiry({
      kind: "travel",
      name: input.name,
      email: input.email,
      phone: input.mobile,
      company: input.company ?? null,
      department: input.tripType === "Corporate Travel" ? "Corporate Travel" : "Travel & Tourism",
      leadSource: input.source ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      landingPage: input.landingPage ?? null,
      referrer: input.referrer ?? req.get("referer") ?? null,
      details: input,
    });
    res.status(201).json(
      CreateTravelEnquiryResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: "Your travel enquiry has been received.",
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to save travel enquiry");
    res.status(500).json({ error: "Unable to save your request right now." });
  }
});

router.post("/enquiries/contact", submissionLimit, async (req, res): Promise<void> => {
  const parsed = CreateContactEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const input = parsed.data;
  try {
    const saved = await saveEnquiry({
      kind: "contact",
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      department: input.department,
      leadSource: input.source ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      landingPage: input.landingPage ?? null,
      referrer: input.referrer ?? req.get("referer") ?? null,
      details: input,
    });
    res.status(201).json(
      CreateContactEnquiryResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: "Your message has been received.",
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to save contact enquiry");
    res.status(500).json({ error: "Unable to save your message right now." });
  }
});

router.post("/enquiries/callback", submissionLimit, async (req, res): Promise<void> => {
  const parsed = CreateCallbackRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const input = parsed.data;
  try {
    const saved = await saveEnquiry({
      kind: "callback",
      name: input.name,
      phone: input.mobile,
      department: input.department,
      priority: input.urgency === "Urgent" ? "Urgent" : "Normal",
      leadSource: input.source ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      landingPage: input.landingPage ?? null,
      referrer: input.referrer ?? req.get("referer") ?? null,
      details: input,
    });
    res.status(201).json(
      CreateCallbackRequestResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: "Your callback request has been received.",
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to save callback request");
    res.status(500).json({ error: "Unable to save your callback request right now." });
  }
});

export default router;
