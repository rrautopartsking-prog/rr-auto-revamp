"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Loader2, CheckCircle, Plus, Trash2,
  ChevronDown, ChevronUp, ExternalLink,
  Image as ImageIcon, Users, Clock, Star, Heart, Globe,
  LayoutTemplate,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { defaultAboutData } from "@/app/api/about/route";

type AboutData = typeof defaultAboutData;

interface Props {
  initialData: AboutData;
}

// ─── Collapsible Section — defined outside to prevent remount on state change ──
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
            <Icon size={16} className="text-gold" />
          </div>
          <span className="font-display font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-carbon-400" /> : <ChevronDown size={16} className="text-carbon-400" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">{children}</div>}
    </div>
  );
}

// ─── Field — defined outside to prevent remount on state change ───────────────
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-carbon-400 mb-1 block font-medium">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="input-premium w-full resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-premium w-full"
        />
      )}
      {hint && <p className="text-carbon-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export function AboutEditor({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState<AboutData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      toast.success("About page saved!");
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Hero ──────────────────────────────────────────────────────────────────
  const updateHero = (key: keyof typeof data.hero, value: string) => {
    setData((d) => ({ ...d, hero: { ...d.hero, [key]: value } }));
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const updateStat = (i: number, key: "value" | "label", val: string) => {
    setData((d) => {
      const stats = [...d.stats];
      stats[i] = { ...stats[i], [key]: val };
      return { ...d, stats };
    });
  };
  const addStat = () => setData((d) => ({ ...d, stats: [...d.stats, { value: "0+", label: "New Stat" }] }));
  const removeStat = (i: number) => setData((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));

  // ── Story ─────────────────────────────────────────────────────────────────
  const updateStory = (key: keyof typeof data.story, value: string | string[]) => {
    setData((d) => ({ ...d, story: { ...d.story, [key]: value } }));
  };
  const updateParagraph = (i: number, val: string) => {
    const paragraphs = [...data.story.paragraphs];
    paragraphs[i] = val;
    updateStory("paragraphs", paragraphs);
  };
  const addParagraph = () => updateStory("paragraphs", [...data.story.paragraphs, ""]);
  const removeParagraph = (i: number) => updateStory("paragraphs", data.story.paragraphs.filter((_, idx) => idx !== i));

  // ── Values ────────────────────────────────────────────────────────────────
  const updateValue = (i: number, key: keyof (typeof data.values)[0], val: string) => {
    setData((d) => {
      const values = [...d.values];
      values[i] = { ...values[i], [key]: val };
      return { ...d, values };
    });
  };
  const addValue = () =>
    setData((d) => ({
      ...d,
      values: [...d.values, { icon: "shield", title: "New Value", description: "Description here" }],
    }));
  const removeValue = (i: number) => setData((d) => ({ ...d, values: d.values.filter((_, idx) => idx !== i) }));

  // ── Team ──────────────────────────────────────────────────────────────────
  const updateTeam = (i: number, key: keyof (typeof data.team)[0], val: string) => {
    setData((d) => {
      const team = [...d.team];
      team[i] = { ...team[i], [key]: val };
      return { ...d, team };
    });
  };
  const addTeamMember = () =>
    setData((d) => ({
      ...d,
      team: [...d.team, { name: "New Member", role: "Role", bio: "Bio here", image: "", linkedin: "" }],
    }));
  const removeTeamMember = (i: number) => setData((d) => ({ ...d, team: d.team.filter((_, idx) => idx !== i) }));

  // ── Timeline ──────────────────────────────────────────────────────────────
  const updateTimeline = (i: number, key: keyof (typeof data.timeline)[0], val: string) => {
    setData((d) => {
      const timeline = [...d.timeline];
      timeline[i] = { ...timeline[i], [key]: val };
      return { ...d, timeline };
    });
  };
  const addTimelineItem = () =>
    setData((d) => ({
      ...d,
      timeline: [...d.timeline, { year: "2025", title: "New Milestone", description: "Description" }],
    }));
  const removeTimelineItem = (i: number) =>
    setData((d) => ({ ...d, timeline: d.timeline.filter((_, idx) => idx !== i) }));

  // ── Gallery ───────────────────────────────────────────────────────────────
  const updateGallery = (i: number, key: keyof (typeof data.gallery)[0], val: string) => {
    setData((d) => {
      const gallery = [...d.gallery];
      gallery[i] = { ...gallery[i], [key]: val };
      return { ...d, gallery };
    });
  };
  const addGalleryItem = () =>
    setData((d) => ({ ...d, gallery: [...d.gallery, { url: "", caption: "New image" }] }));
  const removeGalleryItem = (i: number) =>
    setData((d) => ({ ...d, gallery: d.gallery.filter((_, idx) => idx !== i) }));

  // ── CTA ───────────────────────────────────────────────────────────────────
  const updateCta = (key: keyof typeof data.cta, val: string) => {
    setData((d) => ({ ...d, cta: { ...d.cta, [key]: val } }));
  };

  const iconOptions = ["shield", "zap", "users", "globe", "heart", "award"];

  return (
    <div className="space-y-4">
      {/* Preview link */}
      <div className="flex items-center justify-between">
        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-carbon-400 hover:text-gold transition-colors text-sm"
        >
          <ExternalLink size={14} /> Preview About Page
        </a>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn-gold flex items-center gap-2"
        >
          {isLoading ? (
            <><Loader2 size={15} className="animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle size={15} /> Saved!</>
          ) : (
            <><Save size={15} /> Save All Changes</>
          )}
        </button>
      </div>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <Section title="Hero Section" icon={LayoutTemplate} defaultOpen>
        <Field label="Badge Text" value={data.hero.badge} onChange={(v) => updateHero("badge", v)} placeholder="Our Story" />
        <Field
          label="Headline (use \\n for line break)"
          value={data.hero.headline}
          onChange={(v) => updateHero("headline", v)}
          placeholder="Built for Gearheads,\nBy Gearheads"
          multiline
        />
        <Field
          label="Subheadline"
          value={data.hero.subheadline}
          onChange={(v) => updateHero("subheadline", v)}
          multiline
          placeholder="Your brand story..."
        />
        <Field
          label="Background Image URL"
          value={data.hero.backgroundImage}
          onChange={(v) => updateHero("backgroundImage", v)}
          placeholder="https://..."
          hint="Leave empty for animated gradient background"
        />
      </Section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <Section title="Stats Bar" icon={Star}>
        <div className="space-y-3">
          {data.stats.map((stat, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Field label="Value" value={stat.value} onChange={(v) => updateStat(i, "value", v)} placeholder="10+" />
                <Field label="Label" value={stat.label} onChange={(v) => updateStat(i, "label", v)} placeholder="Years Experience" />
              </div>
              <button
                onClick={() => removeStat(i)}
                className="mt-5 text-carbon-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addStat}
          className="flex items-center gap-2 text-gold text-sm hover:text-gold/80 transition-colors"
        >
          <Plus size={14} /> Add Stat
        </button>
      </Section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <Section title="Our Story Section" icon={Globe}>
        <Field label="Section Title" value={data.story.title} onChange={(v) => updateStory("title", v)} />
        <Field
          label="Story Image URL"
          value={data.story.image}
          onChange={(v) => updateStory("image", v)}
          placeholder="https://..."
          hint="Square image recommended"
        />
        <div className="space-y-3">
          <label className="text-xs text-carbon-400 font-medium block">Paragraphs</label>
          {data.story.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
                rows={3}
                className="input-premium flex-1 resize-none text-sm"
                placeholder={`Paragraph ${i + 1}...`}
              />
              <button
                onClick={() => removeParagraph(i)}
                className="text-carbon-500 hover:text-red-400 transition-colors self-start mt-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addParagraph}
          className="flex items-center gap-2 text-gold text-sm hover:text-gold/80 transition-colors"
        >
          <Plus size={14} /> Add Paragraph
        </button>
      </Section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <Section title="Core Values" icon={Heart}>
        <div className="space-y-4">
          {data.values.map((value, i) => (
            <div key={i} className="bg-carbon-900/50 rounded-lg p-4 space-y-3 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-carbon-400 text-xs font-medium">Value #{i + 1}</span>
                <button onClick={() => removeValue(i)} className="text-carbon-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-carbon-400 mb-1 block">Icon</label>
                  <select
                    value={value.icon}
                    onChange={(e) => updateValue(i, "icon", e.target.value)}
                    className="input-premium w-full"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <Field label="Title" value={value.title} onChange={(v) => updateValue(i, "title", v)} />
              </div>
              <Field
                label="Description"
                value={value.description}
                onChange={(v) => updateValue(i, "description", v)}
                multiline
              />
            </div>
          ))}
        </div>
        <button
          onClick={addValue}
          className="flex items-center gap-2 text-gold text-sm hover:text-gold/80 transition-colors"
        >
          <Plus size={14} /> Add Value
        </button>
      </Section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <Section title="Team Members" icon={Users}>
        <div className="space-y-4">
          {data.team.map((member, i) => (
            <div key={i} className="bg-carbon-900/50 rounded-lg p-4 space-y-3 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-carbon-400 text-xs font-medium">{member.name || `Member #${i + 1}`}</span>
                <button onClick={() => removeTeamMember(i)} className="text-carbon-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={member.name} onChange={(v) => updateTeam(i, "name", v)} />
                <Field label="Role / Title" value={member.role} onChange={(v) => updateTeam(i, "role", v)} />
              </div>
              <Field label="Bio" value={member.bio} onChange={(v) => updateTeam(i, "bio", v)} multiline />
              <Field
                label="Photo URL"
                value={member.image}
                onChange={(v) => updateTeam(i, "image", v)}
                placeholder="https://..."
                hint="Square image recommended"
              />
              <Field
                label="LinkedIn URL"
                value={member.linkedin}
                onChange={(v) => updateTeam(i, "linkedin", v)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          ))}
        </div>
        <button
          onClick={addTeamMember}
          className="flex items-center gap-2 text-gold text-sm hover:text-gold/80 transition-colors"
        >
          <Plus size={14} /> Add Team Member
        </button>
      </Section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <Section title="Company Timeline" icon={Clock}>
        <div className="space-y-4">
          {data.timeline.map((item, i) => (
            <div key={i} className="bg-carbon-900/50 rounded-lg p-4 space-y-3 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-gold font-display font-bold">{item.year}</span>
                <button onClick={() => removeTimelineItem(i)} className="text-carbon-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Year" value={item.year} onChange={(v) => updateTimeline(i, "year", v)} placeholder="2024" />
                <div className="col-span-2">
                  <Field label="Title" value={item.title} onChange={(v) => updateTimeline(i, "title", v)} />
                </div>
              </div>
              <Field
                label="Description"
                value={item.description}
                onChange={(v) => updateTimeline(i, "description", v)}
                multiline
              />
            </div>
          ))}
        </div>
        <button
          onClick={addTimelineItem}
          className="flex items-center gap-2 text-gold text-sm hover:text-gold/80 transition-colors"
        >
          <Plus size={14} /> Add Timeline Event
        </button>
      </Section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <Section title="Photo Gallery" icon={ImageIcon}>
        <p className="text-carbon-500 text-xs">
          First and 4th images display wider (2-column span). Recommended: 6 images total.
        </p>
        <div className="space-y-3">
          {data.gallery.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Field
                  label={`Image ${i + 1} URL`}
                  value={item.url}
                  onChange={(v) => updateGallery(i, "url", v)}
                  placeholder="https://..."
                />
                <Field
                  label="Caption"
                  value={item.caption}
                  onChange={(v) => updateGallery(i, "caption", v)}
                  placeholder="Image description"
                />
              </div>
              <button
                onClick={() => removeGalleryItem(i)}
                className="mt-5 text-carbon-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addGalleryItem}
          className="flex items-center gap-2 text-gold text-sm hover:text-gold/80 transition-colors"
        >
          <Plus size={14} /> Add Gallery Image
        </button>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Section title="Call to Action" icon={Star}>
        <Field label="Headline" value={data.cta.title} onChange={(v) => updateCta("title", v)} />
        <Field label="Subtitle" value={data.cta.subtitle} onChange={(v) => updateCta("subtitle", v)} multiline />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Button Text" value={data.cta.buttonText} onChange={(v) => updateCta("buttonText", v)} />
          <Field label="Button Link" value={data.cta.buttonHref} onChange={(v) => updateCta("buttonHref", v)} placeholder="/contact" />
        </div>
      </Section>

      {/* Save button at bottom */}
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="btn-gold flex items-center gap-2 w-full justify-center py-3"
      >
        {isLoading ? (
          <><Loader2 size={16} className="animate-spin" /> Saving...</>
        ) : saved ? (
          <><CheckCircle size={16} /> Saved!</>
        ) : (
          <><Save size={16} /> Save All Changes</>
        )}
      </button>
    </div>
  );
}
