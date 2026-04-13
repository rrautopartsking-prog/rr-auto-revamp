import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import type { ApiResponse } from "@/types/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json<ApiResponse>({ success: true, data: product });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data,
    include: { category: true },
  });

  return NextResponse.json<ApiResponse>({ success: true, data: product });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await prisma.product.update({
    where: { id: params.id },
    data: { isActive: false },
  });

  return NextResponse.json<ApiResponse>({ success: true, message: "Product deleted" });
}
