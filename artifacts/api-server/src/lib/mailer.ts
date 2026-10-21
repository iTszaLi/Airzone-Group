/**
 * Server-side email delivery through the Resend HTTP API (plain fetch, no SDK).
 * Credentials come only from server environment variables and never reach the browser:
 *   RESEND_API_KEY  API key from resend.com (server secret)
 *   EMAIL_FROM      verified sender, e.g. "Airzone Logistics <quotes@airzonegroup.com>"
 *   EMAIL_API_URL   optional, testing only: send to a local mock instead of Resend
 * Without RESEND_API_KEY and EMAIL_FROM, nothing is sent and callers get `not-configured`.
 */
export type MailResult = { status: "sent" | "not-configured" | "failed"; id?: string; httpStatus?: number };

type Mail = { to: string[]; subject: string; html: string; text: string; replyTo?: string };

const ADDRESS = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

/** Comma-separated recipient list from an environment variable, keeping only plausible addresses. */
export function recipients(value: string | undefined, fallback: string[]): string[] {
  const list = (value ?? "").split(",").map((s) => s.trim()).filter((s) => ADDRESS.test(s));
  return list.length ? list : fallback;
}

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendMail(mail: Mail): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { status: "not-configured" };
  try {
    const res = await fetch(process.env.EMAIL_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { status: "failed", httpStatus: res.status };
    const body = (await res.json().catch(() => ({}))) as { id?: string };
    return { status: "sent", id: body.id };
  } catch {
    return { status: "failed" };
  }
}
