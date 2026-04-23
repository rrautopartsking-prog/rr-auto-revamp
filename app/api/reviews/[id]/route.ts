import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status, title, content, rating, authorName } = body;

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (rating !== undefined) updateData.rating = rating;
  if (authorName !== undefined) updateData.authorName = authorName;

  const review = await prisma.review.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json({ success: true, data: review });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
