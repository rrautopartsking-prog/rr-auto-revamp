import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductInfo } from "@/components/products/product-info";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { RelatedProducts } from "@/components/products/related-products";
import { mockProducts } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";

interface PageProps { params: { slug: string } }

async function getProduct(slug: string) {
  if (!isDbConnected()) {
    return mockProducts.find((p) => p.slug === slug) || null;
  }
  const { prisma } = await import("@/lib/prisma");
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  });
  if (product) {
    await prisma.product.update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } });
  }
  return product;
}

async function getRelated(categoryId: string, excludeId: string) {
  if (!isDbConnected()) {
    return mockProducts.filter((p) => p.categoryId === categoryId && p.id !== excludeId).slice(0, 4);
  }
  const { prisma } = await import("@/lib/prisma");
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, isActive: true },
    include: { category: true },
    take: 4,
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc || undefined,
    openGraph: { images: product.images[0] ? [{ url: product.images[0] }] : [] },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelated(product.categoryId, product.id);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product",
    name: product.name, description: product.description, sku: product.sku,
    offers: {
      "@type": "Offer",
      availability: product.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-carbon-950 pt-20">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ProductGallery images={product.images} name={product.name} />
            <ProductInfo product={product} />
          </div>
          <div id="inquiry" className="max-w-2xl mx-auto mb-16">
            <div className="text-center mb-8">
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Interested?</span>
              <h2 className="font-display text-3xl font-bold text-white mt-2">Request This Part</h2>
            </div>
            <InquiryForm productId={product.id} productName={product.name} prefillBrand={product.brands[0]} prefillModel={product.models[0]} />
          </div>
          {related.length > 0 && <RelatedProducts products={related} />}
        </div>
      </div>
    </>
  );
}
