import { CategoriesManager } from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";
import { mockCategories } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";

async function getCategories() {
  if (!isDbConnected()) return mockCategories.map((c) => ({ ...c, _count: { products: 0 } }));
  const { prisma } = await import("@/lib/prisma");
  return prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { sortOrder: "asc" } });
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Categories</h1>
        <p className="text-carbon-400 text-sm mt-1">{categories.length} categories</p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
