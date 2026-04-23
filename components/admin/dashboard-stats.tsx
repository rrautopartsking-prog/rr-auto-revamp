"use client";

import { motion } from "framer-motion";
import { Users, Flame, Package, TrendingUp, Calendar, Clock, Target, BarChart2 } from "lucide-react";

interface Props {
  stats: {
    totalLeads: number;
    newLeads: number;
    hotLeads: number;
    totalProducts: number;
    leadsToday: number;
    leadsThisWeek: number;
    leadsThisMonth: number;
    totalCategories?: number;
    leadsByStatus?: { status: string; count: number }[];
  };
}

export function DashboardStats({ stats }: Props) {
  const closedLeads = stats.leadsByStatus?.find((s) => s.status === "CLOSED")?.count || 0;
  const conversionRate = stats.totalLeads > 0
    ? ((closedLeads / stats.totalLeads) * 100).toFixed(1)
    : "0.0";

  const cards = [
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "New Leads", value: stats.newLeads, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Hot Leads", value: stats.hotLeads, icon: Flame, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Active Products", value: stats.totalProducts, icon: Package, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Today", value: stats.leadsToday, icon: Clock, color: "text-gold", bg: "bg-gold/10" },
    { label: "This Week", value: stats.leadsThisWeek, icon: Calendar, color: "text-gold", bg: "bg-gold/10" },
    { label: "This Month", value: stats.leadsThisMonth, icon: BarChart2, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Conversion", value: `${conversionRate}%`, icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-lg p-3 lg:p-4"
        >
          <div className={`w-7 h-7 lg:w-8 lg:h-8 ${card.bg} rounded-sm flex items-center justify-center mb-2 lg:mb-3`}>
            <card.icon size={14} className={card.color} />
          </div>
          <div className={`font-display text-lg lg:text-xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-carbon-500 text-xs mt-0.5 leading-tight">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
