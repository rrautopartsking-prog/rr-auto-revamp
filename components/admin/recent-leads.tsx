"use client";

import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types";

interface Props {
  leads: (Lead & { product: { name: string } | null })[];
}

const scoreColors = {
  HOT: "text-red-400 bg-red-400/10",
  WARM: "text-yellow-400 bg-yellow-400/10",
  COLD: "text-blue-400 bg-blue-400/10",
};

export function RecentLeads({ leads }: Props) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-white">Recent Leads</h3>
        <Link href="/admin/leads" className="text-gold text-xs hover:text-gold-light transition-colors">
          View all →
        </Link>
      </div>

      {leads.length === 0 ? (
        <p className="text-carbon-500 text-sm text-center py-4">No leads yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-carbon-800">
                {["Name", "Phone", "Brand/Model", "Part", "Score", "Date"].map((h) => (
                  <th key={h} className="text-left text-carbon-500 text-xs font-medium pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-carbon-800/30 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/leads/${lead.id}`} className="text-white hover:text-gold transition-colors font-medium">
                      {lead.name}
                    </Link>
                    <div className="text-carbon-500 text-xs">{lead.email}</div>
                  </td>
                  <td className="py-3 pr-4 text-carbon-300">{lead.phone}</td>
                  <td className="py-3 pr-4 text-carbon-300">
                    {[lead.brand, lead.model].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="py-3 pr-4 text-carbon-300">
                    {lead.product?.name || lead.partName || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={cn("text-xs px-2 py-0.5 rounded-sm font-medium", scoreColors[lead.score])}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="py-3 text-carbon-500 text-xs">{formatDateTime(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
