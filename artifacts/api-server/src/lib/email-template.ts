/**
 * Shared layout for enquiry notification emails. Every value is escaped for HTML;
 * header values go through `oneLine` so customer input can never add email headers.
 */
export type EmailRow = [label: string, value: string | number | Date | null | undefined];

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** One line, no control characters, bounded length: safe for an email header. */
export const oneLine = (s: string, max: number) => {
  const flat = s.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
};

export const riyadhTime = (d: Date) =>
  `${new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", dateStyle: "medium", timeStyle: "short" }).format(d)} (Riyadh time)`;

const show = (v: EmailRow[1]) => (v instanceof Date ? v.toISOString().slice(0, 10) : v == null ? "" : String(v).trim());

export function renderEnquiryEmail(opts: {
  brand: string;
  title: string;
  summary: string;
  rows: EmailRow[];
  reference: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  intro: string;
}) {
  const present = opts.rows.map(([k, v]) => [k, show(v)] as const).filter(([, v]) => v !== "");
  const text = [`${opts.title} from the Airzone Group website.`, "", ...present.map(([k, v]) => `${k}: ${v}`), "", opts.intro].join("\n");
  const digits = (opts.customerPhone ?? "").replace(/[^\d+]/g, "");
  const waDigits = digits.replace(/\D/g, "");
  const cell = "padding:10px 14px;border-bottom:1px solid #dde4ec;vertical-align:top;font-size:14px;line-height:1.5";
  const html = `<!doctype html><html><body style="margin:0;background:#f4f7fa;font-family:Arial,Helvetica,sans-serif;color:#2e3f52">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #dde4ec;border-radius:12px;overflow:hidden">
<tr><td style="background:#061a33;padding:20px 24px;color:#ffffff">
<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7cc556;font-weight:bold">${escapeHtml(opts.brand)}</div>
<div style="font-size:20px;font-weight:bold;margin-top:6px">${escapeHtml(opts.title)}</div>
<div style="font-size:14px;color:#c3d0de;margin-top:4px">${escapeHtml(opts.summary)}</div>
</td></tr>
<tr><td style="padding:8px 10px 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${present.map(([k, v]) => `<tr><th align="left" style="${cell};width:38%;color:#556677;font-weight:normal">${escapeHtml(k)}</th><td style="${cell};color:#0f1d2e;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join("\n")}
</table></td></tr>
<tr><td style="padding:20px 24px 24px">
<p style="margin:0 0 14px;font-size:14px">${escapeHtml(opts.intro)}</p>
${opts.customerEmail ? `<a href="mailto:${escapeHtml(opts.customerEmail)}?subject=${encodeURIComponent(`Your enquiry ${opts.reference}`)}" style="display:inline-block;background:#1f7a1d;color:#ffffff;text-decoration:none;font-weight:bold;padding:11px 18px;border-radius:8px;font-size:14px">Email the customer</a>` : ""}
${digits ? `<a href="tel:${escapeHtml(digits)}" style="display:inline-block;margin-left:8px;color:#0d5fc4;font-weight:bold;font-size:14px;text-decoration:none;padding:11px 6px">Call</a>` : ""}
${waDigits ? `<a href="https://wa.me/${waDigits}" style="display:inline-block;margin-left:4px;color:#0d5fc4;font-weight:bold;font-size:14px;text-decoration:none;padding:11px 6px">WhatsApp</a>` : ""}
</td></tr>
</table>
<p style="font-size:12px;color:#556677;margin:14px 0 0">Sent by the Airzone Group website. The request is also stored in the admin workspace under ${escapeHtml(opts.reference)}.</p>
</td></tr></table></body></html>`;
  return { html, text };
}
