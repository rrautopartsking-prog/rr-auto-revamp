import { isDbConnected } from "@/lib/db";

const defaults: Record<string, string> = {
  site_name: "RR Auto Revamp",
  site_tagline: "Premium Automotive Parts",
  contact_phone: "+91 84481 76091",
  contact_email: "info@rrautorevamp.com",
  contact_address: "Shop 1391, Top Floor, Ahata Banwari Lal, Nicholson Rd, Ram Bazar, South Indian Madrasi Colony, Kashmere Gate, Delhi - 110006",
  contact_map_url: "https://www.google.com/maps?q=The+Auto+Stores,+1390,+Nicholson+Rd,+Kashmere+Gate,+Delhi,+110006&ftid=0x390cfd08a2c48f6d:0x5c612834156b268c&entry=gps",
  contact_map_embed: "",
  whatsapp_number: "919205876091",
  google_analytics_id: "",
  meta_pixel_id: "",
  meta_description: "Source premium OEM, aftermarket, and performance automotive parts.",
  social_instagram: "https://www.instagram.com/rr_auto_revamp/",
  social_facebook: "https://www.facebook.com/sharer.php?t=R%20R%20Auto%20Parts%20Dealer%20in%20Delhi%2C%20India%20%7C%20Partfinder%20India&u=https%3A%2F%2Fwww.partfinder.in%2Fshop%2Fr-r-auto-revamp-2963",
  social_youtube: "https://www.youtube.com/@r_renterprises.",
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
