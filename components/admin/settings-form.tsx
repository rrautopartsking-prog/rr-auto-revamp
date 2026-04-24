"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  settings: Record<string, string>;
}

// ── Field is defined OUTSIDE the parent so it never remounts on state change ──
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-xs text-carbon-400 mb-1 block font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-premium"
      />
      {hint && <p className="text-carbon-600 text-xs mt-1">{hint}</p>}
    </div>
  );
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

  return (
    <div className="space-y-5">
      {/* General */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">General</h3>
        <Field
          label="Site Name"
          value={values.site_name || ""}
          onChange={(v) => update("site_name", v)}
          placeholder="RR Auto Revamp"
        />
        <Field
          label="Tagline"
          value={values.site_tagline || ""}
          onChange={(v) => update("site_tagline", v)}
          placeholder="Premium Automotive Parts"
        />
      </div>

      {/* Contact */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Contact Information</h3>
        <p className="text-carbon-500 text-xs">These values appear on the website footer and contact page.</p>
        <Field
          label="Phone Number"
          value={values.contact_phone || ""}
          onChange={(v) => update("contact_phone", v)}
          placeholder="+91 84481 76091"
          hint="Displayed on contact page and footer"
        />
        <Field
          label="WhatsApp Number"
          value={values.whatsapp_number || ""}
          onChange={(v) => update("whatsapp_number", v)}
          placeholder="918448176091"
          hint="Digits only, with country code — e.g. 919205876091 (no +, no spaces)"
        />
        <Field
          label="Email Address"
          value={values.contact_email || ""}
          onChange={(v) => update("contact_email", v)}
          type="email"
          placeholder="info@rrautorevamp.com"
        />
        <Field
          label="Address"
          value={values.contact_address || ""}
          onChange={(v) => update("contact_address", v)}
          placeholder="Delhi, India"
        />
      </div>

      {/* Analytics */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Analytics</h3>
        <Field
          label="Google Analytics ID"
          value={values.google_analytics_id || ""}
          onChange={(v) => update("google_analytics_id", v)}
          placeholder="G-XXXXXXXXXX"
        />
        <Field
          label="Meta Pixel ID"
          value={values.meta_pixel_id || ""}
          onChange={(v) => update("meta_pixel_id", v)}
          placeholder="XXXXXXXXXXXXXXXX"
        />
      </div>

      {/* SEO */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">SEO</h3>
        <Field
          label="Meta Description"
          value={values.meta_description || ""}
          onChange={(v) => update("meta_description", v)}
          placeholder="Premium automotive spare parts sourced globally..."
        />
      </div>

      {/* Social Media */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Social Media</h3>
        <p className="text-carbon-500 text-xs">These links appear in the website footer.</p>
        <Field
          label="Instagram URL"
          value={values.social_instagram || ""}
          onChange={(v) => update("social_instagram", v)}
          placeholder="https://www.instagram.com/rr_auto_revamp/"
        />
        <Field
          label="Facebook URL"
          value={values.social_facebook || ""}
          onChange={(v) => update("social_facebook", v)}
          placeholder="https://www.facebook.com/..."
        />
        <Field
          label="YouTube URL"
          value={values.social_youtube || ""}
          onChange={(v) => update("social_youtube", v)}
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
