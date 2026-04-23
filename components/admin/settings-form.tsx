"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  settings: Record<string, string>;
}

export function SettingsForm({ settings: initialSettings }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaved(true);
      toast.success("Settings saved successfully");
      router.refresh();

      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const update = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const Field = ({
    label,
    settingKey,
    type = "text",
    placeholder,
    hint,
  }: {
    label: string;
    settingKey: string;
    type?: string;
    placeholder?: string;
    hint?: string;
  }) => (
    <div>
      <label className="text-xs text-carbon-400 mb-1 block font-medium">{label}</label>
      <input
        type={type}
        value={values[settingKey] || ""}
        onChange={(e) => update(settingKey, e.target.value)}
        placeholder={placeholder}
        className="input-premium"
      />
      {hint && <p className="text-carbon-600 text-xs mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* General */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">General</h3>
        <Field label="Site Name" settingKey="site_name" placeholder="RR Auto Revamp" />
        <Field label="Tagline" settingKey="site_tagline" placeholder="Premium Automotive Parts" />
      </div>

      {/* Contact */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Contact Information</h3>
        <p className="text-carbon-500 text-xs">These values appear on the website footer and contact page.</p>
        <Field
          label="Phone Number"
          settingKey="contact_phone"
          placeholder="+91 84481 76091"
          hint="Displayed on contact page and footer"
        />
        <Field
          label="WhatsApp Number"
          settingKey="whatsapp_number"
          placeholder="918448176091"
          hint="Without + or spaces — used for wa.me links"
        />
        <Field
          label="Email Address"
          settingKey="contact_email"
          type="email"
          placeholder="info@rrautorevamp.com"
        />
        <Field
          label="Address"
          settingKey="contact_address"
          placeholder="Delhi, India"
        />
      </div>

      {/* Analytics */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Analytics</h3>
        <Field
          label="Google Analytics ID"
          settingKey="google_analytics_id"
          placeholder="G-XXXXXXXXXX"
        />
        <Field
          label="Meta Pixel ID"
          settingKey="meta_pixel_id"
          placeholder="XXXXXXXXXXXXXXXX"
        />
      </div>

      {/* SEO */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">SEO</h3>
        <Field
          label="Meta Description"
          settingKey="meta_description"
          placeholder="Premium automotive spare parts sourced globally..."
        />
      </div>

      {/* Social Media */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Social Media</h3>
        <p className="text-carbon-500 text-xs">These links appear in the website footer.</p>
        <Field
          label="Instagram URL"
          settingKey="social_instagram"
          placeholder="https://www.instagram.com/rr_auto_revamp/"
        />
        <Field
          label="Facebook URL"
          settingKey="social_facebook"
          placeholder="https://www.facebook.com/..."
        />
        <Field
          label="YouTube URL"
          settingKey="social_youtube"
          placeholder="https://www.youtube.com/@r_renterprises."
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="btn-gold flex items-center gap-2 w-full justify-center"
      >
        {isLoading ? (
          <><Loader2 size={16} className="animate-spin" /> Saving...</>
        ) : saved ? (
          <><CheckCircle size={16} /> Saved!</>
        ) : (
          <><Save size={16} /> Save Settings</>
        )}
      </button>
    </div>
  );
}
