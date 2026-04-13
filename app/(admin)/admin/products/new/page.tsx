import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";
import { mockCategories } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";

export default async function NewProductPage() {
  const categories = isDbConnected()
    ? await (await import("@/lib/prisma")).prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } })
    : mockCategories;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Add Product</h1>
        <p className="text-carbon-400 text-sm mt-1">Create a new product listing</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
