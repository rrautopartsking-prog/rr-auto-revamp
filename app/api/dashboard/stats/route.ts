import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import type { DashboardStats } from "@/types/api";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalLeads,
    newLeads,
    hotLeads,
    totalProducts,
    totalCategories,
    leadsToday,
    leadsThisWeek,
    leadsThisMonth,
    leadsByStatus,
    topBrandsRaw,
    leadsByDayRaw,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { score: "HOT" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.lead.groupBy({ by: ["brand"], _count: { brand: true }, orderBy: { _count: { brand: "desc" } }, take: 5, where: { brand: { not: null } } }),
    prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE(created_at)::text as date, COUNT(*)::bigint as count
      FROM leads
      WHERE created_at >= ${startOfMonth}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
  ]);

  const stats: DashboardStats = {
    totalLeads,
    newLeads,
    hotLeads,
    totalProducts,
    totalCategories,
    leadsToday,
    leadsThisWeek,
    leadsThisMonth,
    topBrands: topBrandsRaw.map((b) => ({ brand: b.brand || "Unknown", count: b._count.brand })),
    leadsByStatus: leadsByStatus.map((s) => ({ status: s.status, count: s._count.status })),
    leadsByDay: leadsByDayRaw.map((d) => ({ date: d.date, count: Number(d.count) })),
  };

  return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
