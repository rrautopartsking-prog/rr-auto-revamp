import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!isDbConnected()) {
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) notFound();
    return (
      <div className="max-w-3xl space-y-6">
        <div><h1 className="font-display text-2xl font-bold text-white">Edit Product</h1></div>
        <ProductForm categories={mockCategories} product={product} />
      </div>
    );
  }

  const { prisma } = await import("@/lib/prisma");
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="font-display text-2xl font-bold text-white">Edit Product</h1><p className="text-carbon-400 text-sm mt-1">{product.name}</p></div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
