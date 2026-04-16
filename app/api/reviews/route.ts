import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import type { ApiResponse } from "@/types/api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || "APPROVED";
  const productId = searchParams.get("productId");
  const adminView = searchParams.get("admin") === "true";

  const user = adminView ? await getAuthUser(req) : null;

  const where: Record<string, unknown> = {};
  if (!adminView || !user) where.status = "APPROVED";
  else if (status) where.status = status;
  if (productId) where.productId = productId;

  const reviews = await prisma.review.findMany({
    where,
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json<ApiResponse>({ success: true, data: reviews });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Admin-created reviews: auth required, auto-approved, no rate limit
  const user = await getAuthUser(req);
  if (body.isAdminCreated) {
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }
    const review = await prisma.review.create({
      data: { ...parsed.data, status: "APPROVED", isVerified: true },
    });
    return NextResponse.json<ApiResponse>({ success: true, data: review, message: "Review added" }, { status: 201 });
  }

  // Public reviews: rate limited, pending approval
  const limited = rateLimit(req, 3, 60_000);
  if (limited) return limited;

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
  }

  const review = await prisma.review.create({ data: parsed.data });

  return NextResponse.json<ApiResponse>(
    { success: true, data: review, message: "Review submitted for approval" },
    { status: 201 }
  );
}
