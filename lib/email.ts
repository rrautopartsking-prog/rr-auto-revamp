import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

export async function sendLeadNotificationEmail(lead: LeadEmailData): Promise<void> {
  if (!resend) return;
  const adminEmail = process.env.ADMIN_EMAIL || "rrautopartsking@gmail.com";
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@rrautorevamp.com",
      to: adminEmail,
      subject: `🔥 New Lead: ${lead.name} — ${lead.brand || "General"} ${lead.model || ""}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;padding:24px;border-radius:8px;">
          <div style="border-bottom:2px solid #C9A84C;padding-bottom:16px;margin-bottom:24px;">
            <h1 style="color:#C9A84C;margin:0;font-size:24px;">RR Auto Revamp</h1>
            <p style="color:#9e9e9e;margin:4px 0 0;">New Lead Notification</p>
          </div>
          <h2 style="color:#fff;font-size:18px;">New ${lead.type.replace("_", " ")} from ${lead.name}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#9e9e9e;width:140px;">Name</td><td style="color:#fff;">${lead.name}</td></tr>
            <tr><td style="padding:8px 0;color:#9e9e9e;">Email</td><td style="color:#fff;">${lead.email}</td></tr>
            <tr><td style="padding:8px 0;color:#9e9e9e;">Phone</td><td style="color:#C9A84C;font-weight:bold;">${lead.phone}</td></tr>
            ${lead.brand ? `<tr><td style="padding:8px 0;color:#9e9e9e;">Brand</td><td style="color:#fff;">${lead.brand}</td></tr>` : ""}
            ${lead.model ? `<tr><td style="padding:8px 0;color:#9e9e9e;">Model</td><td style="color:#fff;">${lead.model}</td></tr>` : ""}
            ${lead.year ? `<tr><td style="padding:8px 0;color:#9e9e9e;">Year</td><td style="color:#fff;">${lead.year}</td></tr>` : ""}
            ${lead.partName ? `<tr><td style="padding:8px 0;color:#9e9e9e;">Part</td><td style="color:#fff;">${lead.partName}</td></tr>` : ""}
            ${lead.message ? `<tr><td style="padding:8px 0;color:#9e9e9e;vertical-align:top;">Message</td><td style="color:#fff;">${lead.message}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid #303030;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads" style="background:#C9A84C;color:#000;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;">View in Admin Panel</a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email notification error:", err);
  }
}

export async function sendLeadConfirmationEmail(lead: LeadEmailData): Promise<void> {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@rrautorevamp.com",
      to: lead.email,
      subject: "We received your inquiry — RR Auto Revamp",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;padding:24px;border-radius:8px;">
          <div style="border-bottom:2px solid #C9A84C;padding-bottom:16px;margin-bottom:24px;">
            <h1 style="color:#C9A84C;margin:0;font-size:24px;">RR Auto Revamp</h1>
          </div>
          <h2 style="color:#fff;">Thank you, ${lead.name}</h2>
          <p style="color:#9e9e9e;line-height:1.6;">We've received your inquiry and our team will get back to you within 24 hours.</p>
          <p style="color:#9e9e9e;line-height:1.6;">For urgent inquiries, WhatsApp us: <a href="https://wa.me/918448176091" style="color:#C9A84C;">+91 84481 76091</a></p>
          <div style="margin-top:24px;padding:16px;background:#1a1a1a;border-radius:8px;border-left:3px solid #C9A84C;">
            <p style="color:#9e9e9e;margin:0;font-size:14px;">RR Auto Revamp — Premium Automotive Parts, Delhi, India</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email confirmation error:", err);
  }
}
