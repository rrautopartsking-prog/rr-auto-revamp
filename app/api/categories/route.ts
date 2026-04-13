import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { name, description, icon } = await req.json();
  if (!name) return NextResponse.json({ success: false, error: "Name required" }, { status: 400 });

  const slug = slugify(name);
  const category = await prisma.category.create({
    data: { name, slug, description, icon },
  });

  return NextResponse.json({ success: true, data: category }, { status: 201 });
}
