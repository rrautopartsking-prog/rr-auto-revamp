import { AdminProductsTable } from "@/components/admin/products-table";

export const dynamic = "force-dynamic";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";

interface PageProps {
  searchParams: { page?: string; search?: string; category?: string; status?: string };
}

async function getData(params: PageProps["searchParams"]) {
  const page = Number(params.page || 1);
  const limit = 20;

  if (!isDbConnected()) {
    let filtered = [...mockProducts];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    if (params.category) filtered = filtered.filter((p) => p.category.slug === params.category);
    if (params.status) filtered = filtered.filter((p) => p.status === params.status);
    return { products: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, categories: mockCategories, page, limit };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const where: Record<string, unknown> = {};
    if (params.search) {
      where.OR = [{ name: { contains: params.search, mode: "insensitive" } }, { sku: { contains: params.search, mode: "insensitive" } }];
    }
    if (params.status) where.status = params.status;
    if (params.category) {
      const cat = await prisma.category.findUnique({ where: { slug: params.category } });
      if (cat) where.categoryId = cat.id;
    }

    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.product.count({ where }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    ]);
    return { products, total, categories, page, limit };
  } catch (error) {
    console.error("DB error, falling back to mock:", error);
    return { products: mockProducts.slice(0, limit), total: mockProducts.length, categories: mockCategories, page, limit };
  }
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { products, total, categories, page, limit } = await getData(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold text-white">Products</h1>
          <p className="text-carbon-400 text-sm mt-1">{total} products</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/products/bulk-upload" className="btn-ghost-gold text-sm py-2">Bulk Upload</Link>
          <Link href="/admin/products/new" className="btn-gold text-sm py-2 flex items-center gap-2">
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </div>
      <AdminProductsTable products={products} total={total} page={page} limit={limit} categories={categories} currentFilters={searchParams} />
    </div>
  );
}
