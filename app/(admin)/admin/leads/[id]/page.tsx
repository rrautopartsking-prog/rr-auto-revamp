import { notFound } from "next/navigation";
import { LeadDetailView } from "@/components/admin/lead-detail-view";
import { mockLeads, mockLeadNotes } from "@/lib/mock-leads";
import { isDbConnected } from "@/lib/db";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  if (!isDbConnected()) {
    const lead = mockLeads.find((l) => l.id === params.id);
    if (!lead) notFound();
    return <LeadDetailView lead={{ ...lead, notes: mockLeadNotes[params.id] || [] }} />;
  }

  const { prisma } = await import("@/lib/prisma");
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      product: { select: { name: true, slug: true } },
      notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) notFound();
  return <LeadDetailView lead={lead} />;
}
