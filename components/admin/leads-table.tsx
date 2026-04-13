"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Flame, Thermometer, Snowflake, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";
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
  if (score === "HOT") return <Flame size={14} className="text-red-400" />;
  if (score === "WARM") return <Thermometer size={14} className="text-yellow-400" />;
  return <Snowflake size={14} className="text-blue-400" />;
};

export function LeadsTable({ leads, total, page, limit, currentFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(total / limit);

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass rounded-lg p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, email, phone..."
          defaultValue={currentFilters.search}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFilter("search", (e.target as HTMLInputElement).value);
          }}
          className="input-premium text-sm py-2 flex-1 min-w-[200px]"
        />
        <select
          value={currentFilters.status || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="bg-carbon-800 border border-carbon-600 text-white text-sm px-3 py-2 rounded-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Status</option>
          {["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "SPAM"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={currentFilters.score || ""}
          onChange={(e) => updateFilter("score", e.target.value)}
          className="bg-carbon-800 border border-carbon-600 text-white text-sm px-3 py-2 rounded-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Scores</option>
          {["HOT", "WARM", "COLD"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-carbon-800">
              <tr>
                {["Lead", "Contact", "Vehicle", "Part", "Score", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-carbon-500 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-carbon-500 py-10">No leads found</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-carbon-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-carbon-500 text-xs">{lead.type.replace("_", " ")}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-carbon-300">{lead.phone}</div>
                      <div className="text-carbon-500 text-xs">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-carbon-300">
                      {[lead.brand, lead.model, lead.year].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-carbon-300">
                      {lead.product?.name || lead.partName || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <ScoreIcon score={lead.score} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-sm border", statusColors[lead.status])}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-carbon-500 text-xs whitespace-nowrap">
                      {formatDateTime(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-gold text-xs hover:text-gold-light transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-carbon-500 text-xs">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={getPageUrl(page - 1)} className="w-8 h-8 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold">
                <ChevronLeft size={14} />
              </Link>
            )}
            {page < totalPages && (
              <Link href={getPageUrl(page + 1)} className="w-8 h-8 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold">
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
