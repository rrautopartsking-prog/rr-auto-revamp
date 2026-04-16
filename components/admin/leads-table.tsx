"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Flame, Thermometer, Snowflake, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Lead } from "@/types";

interface Props {
  leads: (Lead & { product: { name: string; slug: string } | null })[];
  total: number;
  page: number;
  limit: number;
  currentFilters: Record<string, string | undefined>;
}

const statusColors: Record<string, string> = {
  NEW: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  CONTACTED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  QUALIFIED: "text-green-400 bg-green-400/10 border-green-400/20",
  CLOSED: "text-carbon-400 bg-carbon-400/10 border-carbon-400/20",
  SPAM: "text-red-400 bg-red-400/10 border-red-400/20",
};

const ScoreIcon = ({ score }: { score: string }) => {
  if (score === "HOT") return <Flame size={13} className="text-red-400" />;
  if (score === "WARM") return <Thermometer size={13} className="text-yellow-400" />;
  return <Snowflake size={13} className="text-blue-400" />;
};

export function LeadsTable({ leads, total, page, limit, currentFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(total / limit);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries({ ...currentFilters, [key]: value, page: "1" }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    Object.entries({ ...currentFilters, page: String(p) }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `${pathname}?${params.toString()}`;
  };

  const quickUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { toast.success(`Marked as ${status}`); router.refresh(); }
      else toast.error("Update failed");
    } catch { toast.error("Update failed"); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-lg p-3 lg:p-4 flex flex-wrap gap-2 lg:gap-3 items-center">
        <input type="text" placeholder="Search..." defaultValue={currentFilters.search}
          onKeyDown={(e) => { if (e.key === "Enter") updateFilter("search", (e.target as HTMLInputElement).value); }}
          className="input-premium text-sm py-2 flex-1 min-w-[140px]" />
        <select value={currentFilters.status || ""} onChange={(e) => updateFilter("status", e.target.value)}
          className="bg-carbon-800 border border-carbon-600 text-white text-xs lg:text-sm px-2 lg:px-3 py-2 rounded-sm focus:border-gold focus:outline-none">
          <option value="">All Status</option>
          {["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "SPAM"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={currentFilters.score || ""} onChange={(e) => updateFilter("score", e.target.value)}
          className="bg-carbon-800 border border-carbon-600 text-white text-xs lg:text-sm px-2 lg:px-3 py-2 rounded-sm focus:border-gold focus:outline-none">
          <option value="">All Scores</option>
          {["HOT", "WARM", "COLD"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <a href="/api/leads/export" target="_blank"
          className="flex items-center gap-1 text-xs text-carbon-400 hover:text-gold border border-carbon-600 hover:border-gold px-2 lg:px-3 py-2 rounded-sm transition-all">
          <Download size={12} /> Export
        </a>
      </div>
      <div className="text-carbon-500 text-xs px-1">{total} lead{total !== 1 ? "s" : ""} found</div>
      <div className="hidden lg:block glass rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-carbon-800">
              <tr>{["Lead", "Contact", "Vehicle", "Part", "Score", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left text-carbon-500 text-xs font-medium px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-carbon-800">
              {leads.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-carbon-500 py-10">No leads found</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-carbon-800/20 transition-colors">
                  <td className="px-4 py-3"><div className="font-medium text-white">{lead.name}</div><div className="text-carbon-500 text-xs">{lead.type.replace(/_/g, " ")}</div></td>
                  <td className="px-4 py-3"><a href={`tel:${lead.phone}`} className="text-carbon-300 hover:text-gold block">{lead.phone}</a><div className="text-carbon-500 text-xs">{lead.email}</div></td>
                  <td className="px-4 py-3 text-carbon-300">{[lead.brand, lead.model, lead.year].filter(Boolean).join(" ") || "—"}</td>
                  <td className="px-4 py-3 text-carbon-300">{lead.product?.name || lead.partName || "—"}</td>
                  <td className="px-4 py-3"><ScoreIcon score={lead.score} /></td>
                  <td className="px-4 py-3">
                    <select value={lead.status} disabled={updatingId === lead.id} onChange={(e) => quickUpdateStatus(lead.id, e.target.value)}
                      className={cn("text-xs px-2 py-1 rounded-sm border bg-transparent cursor-pointer focus:outline-none", statusColors[lead.status])}>
                      {["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "SPAM"].map((s) => <option key={s} value={s} className="bg-carbon-900 text-white">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-carbon-500 text-xs whitespace-nowrap">{formatDateTime(lead.createdAt)}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Link href={`/admin/leads/${lead.id}`} className="text-gold text-xs">View →</Link><a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">💬</a></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lg:hidden space-y-3">
        {leads.length === 0 ? <div className="text-center text-carbon-500 py-10 glass rounded-lg">No leads found</div>
        : leads.map((lead) => (
          <div key={lead.id} className="glass rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div><p className="text-white font-semibold text-sm">{lead.name}</p><p className="text-carbon-500 text-xs">{lead.type.replace(/_/g, " ")}</p></div>
              <div className="flex items-center gap-1.5 shrink-0"><ScoreIcon score={lead.score} /><span className={cn("text-xs px-2 py-0.5 rounded-sm border", statusColors[lead.status])}>{lead.status}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href={`tel:${lead.phone}`} className="text-carbon-300 hover:text-gold">{lead.phone}</a>
              <span className="text-carbon-400 truncate">{lead.email}</span>
              {(lead.brand || lead.model) && <span className="text-carbon-400 col-span-2">{[lead.brand, lead.model, lead.year].filter(Boolean).join(" ")}</span>}
              {(lead.partName || lead.product?.name) && <span className="text-carbon-400 col-span-2">{lead.product?.name || lead.partName}</span>}
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-carbon-800">
              <span className="text-carbon-600 text-xs">{formatDateTime(lead.createdAt)}</span>
              <div className="flex gap-3"><a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-xs">💬 WhatsApp</a><Link href={`/admin/leads/${lead.id}`} className="text-gold text-xs">View →</Link></div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-carbon-500 text-xs">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={getPageUrl(page - 1)} className="w-8 h-8 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold"><ChevronLeft size={14} /></Link>}
            {page < totalPages && <Link href={getPageUrl(page + 1)} className="w-8 h-8 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold"><ChevronRight size={14} /></Link>}
          </div>
        </div>
      )}
    </div>
  );
}
