"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Flame, Thermometer, Snowflake } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatDateTime, cn } from "@/lib/utils";
import type { Lead } from "@/types";

interface Props {
  lead: Lead & {
    product: { name: string; slug: string } | null;
    notes: { id: string; content: string; leadId: string; authorId: string; createdAt: Date; author: { name: string } }[];
  };
}

const statusOptions = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "SPAM"];
const scoreOptions = ["HOT", "WARM", "COLD"];

const statusColors: Record<string, string> = {
  NEW: "border-blue-400 text-blue-400",
  CONTACTED: "border-yellow-400 text-yellow-400",
  QUALIFIED: "border-green-400 text-green-400",
  CLOSED: "border-carbon-400 text-carbon-400",
  SPAM: "border-red-400 text-red-400",
};

export function LeadDetailView({ lead }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [score, setScore] = useState(lead.score);
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (newStatus?: string, newScore?: string, newNote?: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus || status,
          score: newScore || score,
          note: newNote,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Lead updated");
      if (newNote) setNote("");
      router.refresh();
    } catch {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    value ? (
      <div className="flex gap-4 py-2 border-b border-carbon-800">
        <span className="text-carbon-500 text-sm w-36 shrink-0">{label}</span>
        <span className="text-white text-sm">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads" className="text-carbon-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{lead.name}</h1>
          <p className="text-carbon-400 text-sm">{formatDateTime(lead.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-white mb-4">Contact Information</h3>
            <InfoRow label="Name" value={lead.name} />
            <InfoRow label="Email" value={lead.email} />
            <InfoRow label="Phone" value={lead.phone} />
            <InfoRow label="Company" value={lead.company} />
            <InfoRow label="Country" value={lead.country} />
          </div>

          <div className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-white mb-4">Vehicle Details</h3>
            <InfoRow label="Brand" value={lead.brand} />
            <InfoRow label="Model" value={lead.model} />
            <InfoRow label="Year" value={lead.year} />
            <InfoRow label="Variant" value={lead.variant} />
            <InfoRow label="Fuel Type" value={lead.fuelType} />
            <InfoRow label="Country Spec" value={lead.countrySpec} />
            <InfoRow label="Chassis No." value={lead.chassisNumber} />
          </div>

          <div className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-white mb-4">Part Details</h3>
            <InfoRow label="Part Name" value={lead.partName} />
            <InfoRow label="Part Number" value={lead.partNumber} />
            <InfoRow label="Quantity" value={lead.quantity} />
            <InfoRow label="Product" value={lead.product?.name} />
            {lead.message && (
              <div className="mt-3">
                <span className="text-carbon-500 text-sm block mb-1">Message</span>
                <p className="text-white text-sm bg-carbon-800 rounded-sm p-3">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-white mb-4">Notes</h3>
            <div className="space-y-3 mb-4">
              {lead.notes.map((n) => (
                <div key={n.id} className="bg-carbon-800 rounded-sm p-3">
                  <p className="text-white text-sm">{n.content}</p>
                  <p className="text-carbon-500 text-xs mt-1">{n.author.name} · {formatDateTime(n.createdAt)}</p>
                </div>
              ))}
              {lead.notes.length === 0 && (
                <p className="text-carbon-500 text-sm">No notes yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="input-premium text-sm py-2 flex-1"
                onKeyDown={(e) => { if (e.key === "Enter" && note) handleUpdate(undefined, undefined, note); }}
              />
              <button
                onClick={() => note && handleUpdate(undefined, undefined, note)}
                disabled={!note || isUpdating}
                className="btn-gold py-2 px-4 text-sm flex items-center gap-1"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-white mb-4">Status</h3>
            <div className="space-y-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatus(s as typeof status); handleUpdate(s); }}
                  className={cn(
                    "w-full text-left text-sm px-3 py-2 rounded-sm border transition-all",
                    status === s ? statusColors[s] + " bg-white/5" : "border-carbon-700 text-carbon-400 hover:border-carbon-500"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-white mb-4">Lead Score</h3>
            <div className="flex gap-2">
              {scoreOptions.map((s) => {
                const Icon = s === "HOT" ? Flame : s === "WARM" ? Thermometer : Snowflake;
                const color = s === "HOT" ? "text-red-400 border-red-400" : s === "WARM" ? "text-yellow-400 border-yellow-400" : "text-blue-400 border-blue-400";
                return (
                  <button
                    key={s}
                    onClick={() => { setScore(s as typeof score); handleUpdate(undefined, s); }}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 py-3 rounded-sm border text-xs transition-all",
                      score === s ? color + " bg-white/5" : "border-carbon-700 text-carbon-400"
                    )}
                  >
                    <Icon size={16} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-lg p-5 space-y-2">
            <h3 className="font-display font-semibold text-white mb-3">Quick Actions</h3>
            <a
              href={`tel:${lead.phone}`}
              className="block w-full text-center text-sm py-2 bg-green-400/10 border border-green-400/20 text-green-400 rounded-sm hover:bg-green-400/20 transition-all"
            >
              📞 Call {lead.phone}
            </a>
            <a
              href={`mailto:${lead.email}`}
              className="block w-full text-center text-sm py-2 bg-blue-400/10 border border-blue-400/20 text-blue-400 rounded-sm hover:bg-blue-400/20 transition-all"
            >
              ✉️ Send Email
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm py-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-sm hover:bg-[#25D366]/20 transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
