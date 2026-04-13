import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
  }

  const data = parsed.data;
  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...data,
      publishedAt: data.isPublished ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, data: post });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
