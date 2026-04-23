import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ApiResponse } from "@/types/api";

export async function GET(req: NextRequest) {
  try {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const tag = searchParams.get("tag");
  const status = searchParams.get("status");
  const query = searchParams.get("query");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = { isActive: true };
  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (brand) where.brands = { has: brand };
  if (tag) where.tag = tag;
  if (status) where.status = status;
  if (featured === "true") where.isFeatured = true;
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { sku: { contains: query, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json<ApiResponse>({
    success: true,
    data: products,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.name);

    // Ensure unique slug
    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await prisma.product.create({
      data: { ...data, slug: finalSlug },
      include: { category: true },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
