import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";
import { isDbConnected } from "@/lib/db";

const defaultSettings: Record<string, string> = {
  site_name: "RR Auto Revamp",
  site_tagline: "Premium Automotive Parts",
  contact_phone: "+91 84481 76091",
  contact_email: "rrautopartsking@gmail.com",
  contact_address: "Delhi, India",
  whatsapp_number: "+918448176091",
  google_analytics_id: "",
  meta_pixel_id: "",
};

async function getSettings() {
  if (!isDbConnected()) return defaultSettings;
  const { prisma } = await import("@/lib/prisma");
  const settings = await prisma.siteSettings.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="text-carbon-400 text-sm mt-1">Site configuration</p>
      </div>
      <SettingsForm settings={{ ...defaultSettings, ...settings }} />
    </div>
  );
}
