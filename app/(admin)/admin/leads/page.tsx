import { LeadsTable } from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";
import { mockLeads } from "@/lib/mock-leads";
import { isDbConnected } from "@/lib/db";
import { Download } from "lucide-react";

interface PageProps {
  searchParams: { page?: string; status?: string; score?: string; search?: string };
}

async function getLeads(params: PageProps["searchParams"]) {
  const page = Number(params.page || 1);
  const limit = 20;

  if (!isDbConnected()) {
    let filtered = [...mockLeads];
    if (params.status) filtered = filtered.filter((l) => l.status === params.status);
    if (params.score) filtered = filtered.filter((l) => l.score === params.score);
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone.includes(q));
    }
    return { leads: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, limit };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const where: Record<string, unknown> = {};
    if (params.status) where.status = params.status;
    if (params.score) where.score = params.score;
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { phone: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit, include: { product: { select: { name: true, slug: true } } } }),
      prisma.lead.count({ where }),
    ]);
    return { leads, total, page, limit };
  } catch (error) {
    console.error("DB error, falling back to mock:", error);
    return { leads: mockLeads.slice(0, limit), total: mockLeads.length, page, limit };
  }
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const { leads, total, page, limit } = await getLeads(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold text-white">Leads CRM</h1>
          <p className="text-carbon-400 text-sm mt-1">{total} total leads</p>
        </div>
        <a href="/api/leads/export" className="flex items-center gap-2 btn-ghost-gold text-sm py-2 w-fit">
          <Download size={14} /> Export CSV
        </a>
      </div>
      <LeadsTable leads={leads} total={total} page={page} limit={limit} currentFilters={searchParams} />
    </div>
  );
}
