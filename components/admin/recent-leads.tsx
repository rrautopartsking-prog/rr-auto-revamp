"use client";

import Link from "next/link";
import { formatDateTime, cn } from "@/lib/utils";
import { Flame, Thermometer, Snowflake } from "lucide-react";
import type { Lead } from "@/types";

interface Props {
  leads: (Lead & { product: { name: string } | null })[];
}

const scoreConfig = {
  HOT: { color: "text-red-400 bg-red-400/10", icon: Flame },
  WARM: { color: "text-yellow-400 bg-yellow-400/10", icon: Thermometer },
  COLD: { color: "text-blue-400 bg-blue-400/10", icon: Snowflake },
};

export function RecentLeads({ leads }: Props) {
  return (
    <div className="glass rounded-lg p-4 lg:p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-white">Recent Leads</h3>
        <Link href="/admin/leads" className="text-gold text-xs hover:text-gold-light transition-colors">
          View all →
        </Link>
      </div>

      {leads.length === 0 ? (
        <p className="text-carbon-500 text-sm text-center py-4">No leads yet</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-carbon-800">
                  {["Name", "Phone", "Vehicle", "Part", "Score", "Date"].map((h) => (
                    <th key={h} className="text-left text-carbon-500 text-xs font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-800">
                {leads.map((lead) => {
                  const score = scoreConfig[lead.score];
                  const ScoreIcon = score.icon;
                  return (
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
                        <span className={cn("text-xs px-2 py-0.5 rounded-sm font-medium flex items-center gap-1 w-fit", score.color)}>
                          <ScoreIcon size={10} /> {lead.score}
                        </span>
                      </td>
                      <td className="py-3 text-carbon-500 text-xs whitespace-nowrap">{formatDateTime(lead.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {leads.map((lead) => {
              const score = scoreConfig[lead.score];
              const ScoreIcon = score.icon;
              return (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`}
                  className="block bg-carbon-800/40 rounded-lg p-3 hover:bg-carbon-800/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-white text-sm font-medium">{lead.name}</p>
                      <p className="text-carbon-400 text-xs">{lead.phone}</p>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-sm font-medium flex items-center gap-1 shrink-0", score.color)}>
                      <ScoreIcon size={10} /> {lead.score}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-carbon-500">
                    <span>{[lead.brand, lead.model].filter(Boolean).join(" ") || lead.partName || "General inquiry"}</span>
                    <span>{formatDateTime(lead.createdAt)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
