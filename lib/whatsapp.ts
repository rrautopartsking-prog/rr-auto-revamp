interface WhatsAppLeadData {
  name: string;
  phone: string;
  brand?: string;
  model?: string;
  year?: number;
  partName?: string;
  type: string;
}

/**
 * Sends WhatsApp alert to admin.
 * Uses Twilio if credentials are set, otherwise logs to console.
 * The floating WhatsApp button on the frontend uses wa.me directly (no API needed).
 */
export async function sendWhatsAppAlert(lead: WhatsAppLeadData): Promise<void> {
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER?.replace(/\D/g, "") || "918448176091";

  const message =
    `🔥 *New Lead — RR Auto Revamp*\n\n` +
    `👤 *Name:* ${lead.name}\n` +
    `📞 *Phone:* ${lead.phone}\n` +
    `🚗 *Car:* ${[lead.brand, lead.model, lead.year].filter(Boolean).join(" ") || "N/A"}\n` +
    `🔧 *Part:* ${lead.partName || "General Inquiry"}\n` +
    `📋 *Type:* ${lead.type.replace("_", " ")}\n\n` +
    `View: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/leads`;

  // Try Twilio if credentials exist
  const accountSid = process.env.WHATSAPP_ACCOUNT_SID;
  const authToken = process.env.WHATSAPP_AUTH_TOKEN;
  const from = process.env.WHATSAPP_FROM;

  if (accountSid && authToken && from) {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          },
          body: new URLSearchParams({
            From: from,
            To: `whatsapp:+${adminNumber}`,
            Body: message,
          }),
        }
      );
      if (!response.ok) {
        console.error("WhatsApp Twilio error:", await response.text());
      } else {
        console.log("✅ WhatsApp alert sent via Twilio");
      }
    } catch (err) {
      console.error("WhatsApp error:", err);
    }
    return;
  }

  // No Twilio — just log the message (admin sees it in server logs)
  console.log(`\n📱 WhatsApp Alert (no Twilio configured):\n${message}\n`);
  console.log(`💡 To enable WhatsApp alerts, add WHATSAPP_ACCOUNT_SID, WHATSAPP_AUTH_TOKEN, WHATSAPP_FROM to .env`);
}
