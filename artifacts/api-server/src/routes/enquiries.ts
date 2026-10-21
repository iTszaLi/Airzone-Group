import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import {
  CreateContactEnquiryBody,
  CreateFleetQuoteBody,
  CreateFleetQuoteResponse,
  CreateContactEnquiryResponse,
  CreateCallbackRequestBody,
  CreateCallbackRequestResponse,
  CreateLogisticsEnquiryBody,
  CreateLogisticsEnquiryResponse,
  CreateTravelEnquiryBody,
  CreateTravelEnquiryResponse,
} from "@workspace/api-zod";
import type { Request } from "express";
import { addEnquiryDetails, saveEnquiry } from "../lib/enquiry";
import { buildFleetEmail } from "../lib/fleet-email";
import { buildCallbackEmail, buildContactEmail, buildLogisticsEmail, buildTravelEmail } from "../lib/enquiry-emails";
import { sendMail } from "../lib/mailer";
import { businessForDepartment, businessName, recipientsFor } from "../lib/recipients";

type Saved = Awaited<ReturnType<typeof saveEnquiry>>;

/**
 * Email the business team about a stored enquiry and record the outcome on the record.
 * Recipients come from server configuration only (lib/recipients.ts). Logs never contain
 * form contents. Returns true only when the email provider accepted the message.
 */
async function notifyTeam(req: Request, saved: Saved, to: string[], mail: { subject: string; html: string; text: string }, replyTo?: string | null) {
  const result = await sendMail({ to, subject: mail.subject, html: mail.html, text: mail.text, replyTo: replyTo || undefined });
  if (result.status === "sent") req.log.info({ reference: saved.reference }, "Enquiry emailed to the team");
  else req.log.warn({ reference: saved.reference, email: result.status, httpStatus: result.httpStatus }, "Enquiry stored but not emailed");
  await addEnquiryDetails(saved.enquiry, { emailNotification: result.status, emailId: result.id ?? null }).catch((err) =>
    req.log.error({ err, reference: saved.reference }, "Could not record the email outcome"),
  );
  return result.status === "sent";
}

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
    const emailed = await notifyTeam(req, saved, recipientsFor.logistics(),
      buildLogisticsEmail(input, saved.reference, saved.enquiry.createdAt ?? new Date()), input.email);
    res.status(201).json(
      CreateLogisticsEnquiryResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: emailed ? "Your logistics request has been sent to our logistics team." : "Your logistics request has been received.",
        emailed,
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to save logistics enquiry");
    res.status(500).json({ error: "Unable to save your request right now." });
  }
});

// Vehicle request from the homepage fleet showroom: stored like every enquiry, then emailed
// to the logistics team when an email provider is configured. `emailed` reports the outcome
// honestly so the website never claims an email was sent when it was not.
router.post("/enquiries/fleet", submissionLimit, async (req, res): Promise<void> => {
  const parsed = CreateFleetQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { website, ...input } = parsed.data;
  if (website) {
    res.status(400).json({ error: "Your request could not be accepted." });
    return;
  }
  let saved: Saved;
  try {
    saved = await saveEnquiry({
      kind: "logistics",
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      company: input.company ?? null,
      department: "Logistics",
      leadSource: input.source ?? "fleet-showroom",
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      landingPage: input.landingPage ?? null,
      referrer: input.referrer ?? req.get("referer") ?? null,
      details: { form: "fleet-vehicle", service: `Fleet vehicle: ${input.vehicle}`, ...input },
    });
  } catch (error) {
    req.log.error({ err: error }, "Failed to save fleet quote request");
    res.status(500).json({ error: "Unable to save your request right now." });
    return;
  }

  const emailed = await notifyTeam(req, saved, recipientsFor.fleet(),
    buildFleetEmail(input, saved.reference, saved.enquiry.createdAt ?? new Date()), input.email);
  res.status(201).json(
    CreateFleetQuoteResponse.parse({
      id: saved.enquiry.id,
      reference: saved.reference,
      message: emailed ? "Your vehicle request has been sent to our logistics team." : "Your vehicle request has been recorded.",
      emailed,
    }),
  );
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
      email: input.email || null,
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
    const emailed = await notifyTeam(req, saved, recipientsFor.travel(),
      buildTravelEmail(input, saved.reference, saved.enquiry.createdAt ?? new Date()), input.email);
    res.status(201).json(
      CreateTravelEnquiryResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: emailed ? "Your travel enquiry has been sent to our travel team." : "Your travel enquiry has been received.",
        emailed,
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
    const business = businessForDepartment(input.department);
    const emailed = await notifyTeam(req, saved, recipientsFor[business](),
      buildContactEmail(input, businessName[business], saved.reference, saved.enquiry.createdAt ?? new Date()), input.email);
    res.status(201).json(
      CreateContactEnquiryResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: emailed ? "Your message has been sent to our team." : "Your message has been received.",
        emailed,
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
    const business = businessForDepartment(input.department);
    const emailed = await notifyTeam(req, saved, recipientsFor[business](),
      buildCallbackEmail(input, businessName[business], saved.reference, saved.enquiry.createdAt ?? new Date()));
    res.status(201).json(
      CreateCallbackRequestResponse.parse({
        id: saved.enquiry.id,
        reference: saved.reference,
        message: emailed ? "Your callback request has been sent to our team." : "Your callback request has been received.",
        emailed,
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to save callback request");
    res.status(500).json({ error: "Unable to save your callback request right now." });
  }
});

export default router;
