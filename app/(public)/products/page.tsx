import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { ProductsGrid } from "@/components/products/products-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductsSkeleton } from "@/components/products/products-skeleton";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";
import type { SearchFilters } from "@/types/api";

export const metadata: Metadata = {
  title: "Products — Premium Automotive Parts",
  description: "Browse our extensive catalog of OEM, aftermarket, and performance automotive parts.",
};

interface PageProps {
  searchParams: SearchFilters & { page?: string };
}

async function getData(searchParams: PageProps["searchParams"]) {
  const page = Number(searchParams.page || 1);
  const limit = 12;

  if (!isDbConnected()) {
    let filtered = [...mockProducts];
    if (searchParams.brand) filtered = filtered.filter((p) => p.brands.includes(searchParams.brand!));
    if (searchParams.category) filtered = filtered.filter((p) => p.category.slug === searchParams.category);
    if (searchParams.tag) filtered = filtered.filter((p) => p.tag === searchParams.tag);
    if (searchParams.status) filtered = filtered.filter((p) => p.status === searchParams.status);
    if (searchParams.query) {
      const q = searchParams.query.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    return {
      products: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      categories: mockCategories,
      page,
      limit,
    };
  }

  const { prisma } = await import("@/lib/prisma");
  const where: Record<string, unknown> = { isActive: true };
  if (searchParams.brand) where.brands = { has: searchParams.brand };
  if (searchParams.tag) where.tag = searchParams.tag;
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.query) {
    where.OR = [
      { name: { contains: searchParams.query, mode: "insensitive" } },
      { sku: { contains: searchParams.query, mode: "insensitive" } },
    ];
  }
  if (searchParams.category) {
    const cat = await prisma.category.findUnique({ where: { slug: searchParams.category } });
    if (cat) where.categoryId = cat.id;
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return { products, total, categories, page, limit };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { products, total, categories, page, limit } = await getData(searchParams);

  return (
    <div className="min-h-screen bg-carbon-950 pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Catalog</span>
          <h1 className="font-display text-4xl font-bold text-white mt-2">Automotive Parts</h1>
          <p className="text-carbon-400 mt-2">
            {total} parts found{searchParams.brand && ` for ${searchParams.brand}`}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <ProductFilters categories={categories} currentFilters={searchParams} />
          </aside>
          <div className="flex-1">
            <Suspense fallback={<ProductsSkeleton />}>
              <ProductsGrid products={products} total={total} page={page} limit={limit} filters={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
