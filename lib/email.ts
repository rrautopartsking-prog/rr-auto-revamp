import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rrautorevamp.com";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@rrautorevamp.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "rrautopartsking@gmail.com";
const WHATSAPP = "918448176091";

interface LeadEmailData {
  name: string;
  email: string;
  phone: string;
  brand?: string;
  model?: string;
  year?: number;
  partName?: string;
  message?: string;
  type: string;
}

// ─── Customer confirmation email ─────────────────────────────────────────────
export async function sendLeadConfirmationEmail(lead: LeadEmailData): Promise<void> {
  if (!resend) return;

  const carInfo = [lead.brand, lead.model, lead.year].filter(Boolean).join(" ");
  const partInfo = lead.partName || "your part";

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: lead.email,
      subject: `Hi ${lead.name}, we received your inquiry — RR Auto Revamp`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;padding:0;border-radius:10px;overflow:hidden;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1a1a1a,#0d0d0d);padding:32px 32px 24px;border-bottom:2px solid #C9A84C;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="background:#C9A84C;width:40px;height:40px;border-radius:6px;display:flex;align-items:center;justify-content:center;">
                <span style="color:#000;font-weight:900;font-size:16px;">RR</span>
              </div>
              <div>
                <div style="color:#C9A84C;font-weight:700;font-size:18px;letter-spacing:2px;">AUTO REVAMP</div>
                <div style="color:#666;font-size:12px;">Premium Automotive Parts</div>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div style="padding:32px;">
            <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Hi ${lead.name}, we've got your inquiry! 👋</h2>
            <p style="color:#9e9e9e;line-height:1.7;margin:0 0 24px;">
              Thank you for reaching out to RR Auto Revamp. We've received your inquiry for
              <strong style="color:#C9A84C;">${partInfo}</strong>${carInfo ? ` for your <strong style="color:#C9A84C;">${carInfo}</strong>` : ""} and our team is already on it.
            </p>

            <!-- Summary box -->
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-left:3px solid #C9A84C;border-radius:6px;padding:20px;margin-bottom:24px;">
              <div style="color:#C9A84C;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:12px;">YOUR INQUIRY SUMMARY</div>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:5px 0;color:#666;font-size:13px;width:120px;">Name</td><td style="color:#fff;font-size:13px;">${lead.name}</td></tr>
                <tr><td style="padding:5px 0;color:#666;font-size:13px;">Phone</td><td style="color:#C9A84C;font-size:13px;font-weight:bold;">${lead.phone}</td></tr>
                ${carInfo ? `<tr><td style="padding:5px 0;color:#666;font-size:13px;">Vehicle</td><td style="color:#fff;font-size:13px;">${carInfo}</td></tr>` : ""}
                ${lead.partName ? `<tr><td style="padding:5px 0;color:#666;font-size:13px;">Part</td><td style="color:#fff;font-size:13px;">${lead.partName}</td></tr>` : ""}
                ${lead.message ? `<tr><td style="padding:5px 0;color:#666;font-size:13px;vertical-align:top;">Notes</td><td style="color:#fff;font-size:13px;">${lead.message}</td></tr>` : ""}
              </table>
            </div>

            <p style="color:#9e9e9e;line-height:1.7;margin:0 0 8px;">
              ⏱️ We typically respond within <strong style="color:#fff;">2–4 hours</strong> during business hours (Mon–Sat, 9AM–7PM IST).
            </p>
            <p style="color:#9e9e9e;line-height:1.7;margin:0 0 24px;">
              For urgent inquiries, reach us directly on WhatsApp:
            </p>

            <!-- WhatsApp CTA -->
            <a href="https://wa.me/${WHATSAPP}?text=Hi%2C%20I%20submitted%20an%20inquiry%20for%20${encodeURIComponent(partInfo)}%20on%20RR%20Auto%20Revamp"
               style="display:inline-block;background:#25D366;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;margin-bottom:24px;">
              💬 Chat on WhatsApp
            </a>

            <p style="color:#555;font-size:13px;line-height:1.6;margin:0;">
              If you didn't submit this inquiry, please ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#111;padding:20px 32px;border-top:1px solid #222;">
            <p style="color:#444;font-size:12px;margin:0;">RR Auto Revamp · Delhi, India · <a href="mailto:${ADMIN_EMAIL}" style="color:#C9A84C;text-decoration:none;">${ADMIN_EMAIL}</a></p>
            <p style="color:#333;font-size:11px;margin:6px 0 0;"><a href="${APP_URL}" style="color:#555;text-decoration:none;">${APP_URL}</a></p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email confirmation error:", err);
  }
}

// ─── Admin notification email ─────────────────────────────────────────────────
export async function sendLeadNotificationEmail(lead: LeadEmailData): Promise<void> {
  if (!resend) return;

  const carInfo = [lead.brand, lead.model, lead.year].filter(Boolean).join(" ") || "N/A";
  const typeLabel = lead.type.replace(/_/g, " ");

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `🔥 New ${typeLabel}: ${lead.name} — ${lead.brand || "General"} ${lead.model || ""}`.trim(),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;padding:0;border-radius:10px;overflow:hidden;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1a1a1a,#0d0d0d);padding:32px 32px 24px;border-bottom:2px solid #C9A84C;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="background:#C9A84C;width:40px;height:40px;border-radius:6px;display:flex;align-items:center;justify-content:center;">
                <span style="color:#000;font-weight:900;font-size:16px;">RR</span>
              </div>
              <div>
                <div style="color:#C9A84C;font-weight:700;font-size:18px;letter-spacing:2px;">AUTO REVAMP</div>
                <div style="color:#666;font-size:12px;">Admin Notification</div>
              </div>
            </div>
          </div>

          <!-- Alert banner -->
          <div style="background:#C9A84C;padding:12px 32px;">
            <p style="color:#000;font-weight:700;font-size:14px;margin:0;">🔥 New ${typeLabel} received — respond within 2 hours for best conversion</p>
          </div>

          <!-- Body -->
          <div style="padding:32px;">
            <h2 style="color:#fff;font-size:20px;margin:0 0 20px;">You have a new inquiry from <span style="color:#C9A84C;">${lead.name}</span></h2>

            <!-- Contact details -->
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;padding:20px;margin-bottom:20px;">
              <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:1px;margin-bottom:12px;">CONTACT DETAILS</div>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#666;font-size:13px;width:120px;">Name</td><td style="color:#fff;font-size:13px;font-weight:600;">${lead.name}</td></tr>
                <tr><td style="padding:6px 0;color:#666;font-size:13px;">Email</td><td style="font-size:13px;"><a href="mailto:${lead.email}" style="color:#C9A84C;">${lead.email}</a></td></tr>
                <tr><td style="padding:6px 0;color:#666;font-size:13px;">Phone</td><td style="font-size:13px;"><a href="tel:${lead.phone}" style="color:#C9A84C;font-weight:bold;font-size:15px;">${lead.phone}</a></td></tr>
              </table>
            </div>

            <!-- Part & vehicle details -->
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;padding:20px;margin-bottom:24px;">
              <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:1px;margin-bottom:12px;">INQUIRY DETAILS</div>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#666;font-size:13px;width:120px;">Type</td><td style="color:#fff;font-size:13px;">${typeLabel}</td></tr>
                <tr><td style="padding:6px 0;color:#666;font-size:13px;">Vehicle</td><td style="color:#fff;font-size:13px;">${carInfo}</td></tr>
                ${lead.partName ? `<tr><td style="padding:6px 0;color:#666;font-size:13px;">Part</td><td style="color:#C9A84C;font-size:13px;font-weight:600;">${lead.partName}</td></tr>` : ""}
                ${lead.message ? `<tr><td style="padding:6px 0;color:#666;font-size:13px;vertical-align:top;">Message</td><td style="color:#fff;font-size:13px;font-style:italic;">"${lead.message}"</td></tr>` : ""}
              </table>
            </div>

            <!-- Action buttons -->
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a href="${APP_URL}/admin/leads"
                 style="display:inline-block;background:#C9A84C;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">
                View in Admin Panel →
              </a>
              <a href="https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(lead.name)}%2C%20I%20received%20your%20inquiry%20for%20${encodeURIComponent(lead.partName || "the part")}%20from%20RR%20Auto%20Revamp.%20Could%20you%20please%20share%20more%20details%3F"
                 style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">
                💬 Reply on WhatsApp
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#111;padding:20px 32px;border-top:1px solid #222;">
            <p style="color:#444;font-size:12px;margin:0;">RR Auto Revamp Admin · <a href="${APP_URL}/admin" style="color:#C9A84C;text-decoration:none;">Open Admin Panel</a></p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email notification error:", err);
  }
}
