import { DashboardStats } from "@/components/admin/dashboard-stats";

export const dynamic = "force-dynamic";
import { LeadsChart } from "@/components/admin/leads-chart";
import { RecentLeads } from "@/components/admin/recent-leads";
import { TopBrands } from "@/components/admin/top-brands";
import { mockProducts } from "@/lib/mock-data";
import { mockLeads } from "@/lib/mock-leads";
import { isDbConnected } from "@/lib/db";

async function getStats() {
  if (!isDbConnected()) {
    return {
      totalLeads: mockLeads.length,
      newLeads: mockLeads.filter((l) => l.status === "NEW").length,
      hotLeads: mockLeads.filter((l) => l.score === "HOT").length,
      totalProducts: mockProducts.length,
      leadsToday: 1, leadsThisWeek: 3, leadsThisMonth: mockLeads.length,
      leadsByStatus: [
        { status: "NEW", count: mockLeads.filter((l) => l.status === "NEW").length },
        { status: "CONTACTED", count: mockLeads.filter((l) => l.status === "CONTACTED").length },
        { status: "QUALIFIED", count: mockLeads.filter((l) => l.status === "QUALIFIED").length },
        { status: "CLOSED", count: mockLeads.filter((l) => l.status === "CLOSED").length },
      ],
      recentLeads: mockLeads.slice(0, 5),
      topBrands: [
        { brand: "BMW", count: 2 }, { brand: "Porsche", count: 2 },
        { brand: "Mercedes-Benz", count: 1 }, { brand: "Toyota", count: 1 }, { brand: "Land Rover", count: 1 },
      ],
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalLeads, newLeads, hotLeads, totalProducts, leadsToday, leadsThisWeek, leadsThisMonth, leadsByStatus, recentLeads, topBrandsRaw] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { score: "HOT" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { product: { select: { name: true } } } }),
      prisma.lead.groupBy({ by: ["brand"], _count: { brand: true }, orderBy: { _count: { brand: "desc" } }, take: 5, where: { brand: { not: null } } }),
    ]);

    return {
      totalLeads, newLeads, hotLeads, totalProducts,
      leadsToday, leadsThisWeek, leadsThisMonth,
      leadsByStatus: leadsByStatus.map((s) => ({ status: s.status, count: s._count.status })),
      recentLeads,
      topBrands: topBrandsRaw.map((b) => ({ brand: b.brand || "Unknown", count: b._count.brand })),
    };
  } catch (error) {
    console.error("DB error, falling back to mock:", error);
    return {
      totalLeads: mockLeads.length,
      newLeads: mockLeads.filter((l) => l.status === "NEW").length,
      hotLeads: mockLeads.filter((l) => l.score === "HOT").length,
      totalProducts: mockProducts.length,
      leadsToday: 1, leadsThisWeek: 3, leadsThisMonth: mockLeads.length,
      leadsByStatus: [
        { status: "NEW", count: mockLeads.filter((l) => l.status === "NEW").length },
        { status: "CONTACTED", count: mockLeads.filter((l) => l.status === "CONTACTED").length },
        { status: "QUALIFIED", count: mockLeads.filter((l) => l.status === "QUALIFIED").length },
        { status: "CLOSED", count: mockLeads.filter((l) => l.status === "CLOSED").length },
      ],
      recentLeads: mockLeads.slice(0, 5),
      topBrands: [
        { brand: "BMW", count: 2 }, { brand: "Porsche", count: 2 },
        { brand: "Mercedes-Benz", count: 1 }, { brand: "Toyota", count: 1 }, { brand: "Land Rover", count: 1 },
      ],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-carbon-400 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><LeadsChart leadsByStatus={stats.leadsByStatus} /></div>
        <TopBrands brands={stats.topBrands} />
      </div>
      <RecentLeads leads={stats.recentLeads} />
    </div>
  );
}
