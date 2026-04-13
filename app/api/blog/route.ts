import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ApiResponse } from "@/types/api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const category = searchParams.get("category");
  const adminView = searchParams.get("admin") === "true";

  const user = adminView ? await getAuthUser(req) : null;

  const where: Record<string, unknown> = {};
  if (!adminView || !user) where.isPublished = true;
  if (category) where.category = category;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true, avatar: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json<ApiResponse>({
    success: true,
    data: posts,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const post = await prisma.blogPost.create({
    data: {
      ...data,
      slug: finalSlug,
      authorId: user.userId,
      publishedAt: data.isPublished ? new Date() : null,
    },
  });

  return NextResponse.json<ApiResponse>({ success: true, data: post }, { status: 201 });
}
