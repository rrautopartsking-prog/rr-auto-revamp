import { isDbConnected } from "@/lib/db";

const defaults: Record<string, string> = {
  site_name: "RR Auto Revamp",
  site_tagline: "Premium Automotive Parts",
  contact_phone: "+91 84481 76091",
  contact_email: "info@rrautorevamp.com",
  contact_address: "Delhi, India",
  whatsapp_number: "918448176091",
  google_analytics_id: "",
  meta_pixel_id: "",
  meta_description: "Source premium OEM, aftermarket, and performance automotive parts.",
};

export async function getSettings(): Promise<Record<string, string>> {
  if (!isDbConnected()) return defaults;

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteSettings.findMany();
    const fromDb = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaults, ...fromDb };
  } catch {
    return defaults;
  }
}

export function getSetting(settings: Record<string, string>, key: string): string {
  return settings[key] || defaults[key] || "";
}
