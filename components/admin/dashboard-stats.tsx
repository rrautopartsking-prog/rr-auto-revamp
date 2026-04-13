"use client";

import { motion } from "framer-motion";
import { Users, Flame, Package, TrendingUp, Calendar, Clock } from "lucide-react";

interface Props {
  stats: {
    totalLeads: number;
    newLeads: number;
    hotLeads: number;
    totalProducts: number;
    leadsToday: number;
    leadsThisWeek: number;
    leadsThisMonth: number;
  };
}

export function DashboardStats({ stats }: Props) {
  const cards = [
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "New Leads", value: stats.newLeads, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Hot Leads", value: stats.hotLeads, icon: Flame, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Active Products", value: stats.totalProducts, icon: Package, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Today", value: stats.leadsToday, icon: Clock, color: "text-gold", bg: "bg-gold/10" },
    { label: "This Week", value: stats.leadsThisWeek, icon: Calendar, color: "text-gold", bg: "bg-gold/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-lg p-4"
        >
          <div className={`w-8 h-8 ${card.bg} rounded-sm flex items-center justify-center mb-3`}>
            <card.icon size={16} className={card.color} />
          </div>
          <div className={`font-display text-2xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-carbon-500 text-xs mt-1">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
