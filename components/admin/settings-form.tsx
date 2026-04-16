"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  settings: Record<string, string>;
}

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Use refs so inputs are uncontrolled — no re-render on every keystroke
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleSave = async () => {
    const values: Record<string, string> = {};
    Object.keys(settings).forEach((key) => {
      values[key] = refs.current[key]?.value ?? settings[key] ?? "";
    });

    setIsLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Settings saved");
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const Field = ({ label, settingKey, type = "text", placeholder }: {
    label: string; settingKey: string; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="text-xs text-carbon-400 mb-1 block">{label}</label>
      <input
        type={type}
        defaultValue={settings[settingKey] || ""}
        ref={(el) => { refs.current[settingKey] = el; }}
        placeholder={placeholder}
        className="input-premium"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">General</h3>
        <Field label="Site Name" settingKey="site_name" />
        <Field label="Tagline" settingKey="site_tagline" />
      </div>

      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Contact</h3>
        <Field label="Phone" settingKey="contact_phone" placeholder="+91 XXXXX XXXXX" />
        <Field label="Email" settingKey="contact_email" type="email" />
        <Field label="Address" settingKey="contact_address" />
        <Field label="WhatsApp Number" settingKey="whatsapp_number" placeholder="+91XXXXXXXXXX" />
      </div>

      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Analytics</h3>
        <Field label="Google Analytics ID" settingKey="google_analytics_id" placeholder="G-XXXXXXXXXX" />
        <Field label="Meta Pixel ID" settingKey="meta_pixel_id" placeholder="XXXXXXXXXXXXXXXX" />
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="btn-gold flex items-center gap-2"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save Settings
      </button>
    </div>
  );
}
