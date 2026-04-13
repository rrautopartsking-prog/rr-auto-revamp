import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      product: { select: { name: true, slug: true } },
      notes: { include: { author: { select: { name: true, avatar: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  return NextResponse.json<ApiResponse>({ success: true, data: lead });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status, score, note } = body;

  const updateData: Record<string, unknown> = {};
  if (status) {
    updateData.status = status;
    if (status === "CONTACTED") updateData.contactedAt = new Date();
    if (status === "CLOSED") updateData.closedAt = new Date();
  }
  if (score) updateData.score = score;

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: updateData,
  });

  if (note) {
    await prisma.leadNote.create({
      data: { content: note, leadId: params.id, authorId: user.userId },
    });
  }

  return NextResponse.json<ApiResponse>({ success: true, data: lead });
}
