import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductInfo } from "@/components/products/product-info";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { RelatedProducts } from "@/components/products/related-products";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { StickyQuoteBar } from "@/components/products/sticky-quote-bar";
import { LiveViewers } from "@/components/products/live-viewers";
import { ProductViewTracker } from "@/components/products/product-view-tracker";
import { mockProducts } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";
import { Star } from "lucide-react";

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

async function getReviews(productId: string) {
  if (!isDbConnected()) return [];
  const { prisma } = await import("@/lib/prisma");
  return prisma.review.findMany({
    where: { productId, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 10,
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

  const [related, reviews] = await Promise.all([
    getRelated(product.categoryId, product.id),
    getReviews(product.id),
  ]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product",
    name: product.name, description: product.description, sku: product.sku,
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating,
        reviewCount: reviews.length,
      },
    }),
    offers: {
      "@type": "Offer",
      availability: product.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StickyQuoteBar productName={product.name} />
      <div className="min-h-screen bg-carbon-950 pt-20">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-6">
            <ProductGallery images={product.images} name={product.name} />
            <div className="space-y-4">
              <ProductInfo product={product} />
              <LiveViewers />
            </div>
          </div>
          <ProductViewTracker
            id={product.id}
            slug={product.slug}
            name={product.name}
            image={product.images[0]}
            brand={product.brands[0]}
          />

          {/* Reviews section */}
          {reviews.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">Customer Reviews</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < Math.round(Number(avgRating)) ? "text-gold fill-gold" : "text-carbon-600"} />
                      ))}
                    </div>
                    <span className="text-gold font-semibold">{avgRating}</span>
                    <span className="text-carbon-500 text-sm">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="glass rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "text-gold fill-gold" : "text-carbon-600"} />
                        ))}
                      </div>
                      {review.isVerified && (
                        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-sm">Verified</span>
                      )}
                    </div>
                    {review.title && <h4 className="font-semibold text-white text-sm mb-1">{review.title}</h4>}
                    <p className="text-carbon-300 text-sm leading-relaxed">{review.content}</p>
                    <p className="text-carbon-500 text-xs mt-3">{review.authorName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div id="inquiry" className="max-w-2xl mx-auto mb-16">
            <div className="text-center mb-8">
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Interested?</span>
              <h2 className="font-display text-3xl font-bold text-white mt-2">Request This Part</h2>
            </div>
            <InquiryForm productId={product.id} productName={product.name} prefillBrand={product.brands[0]} prefillModel={product.models[0]} />
          </div>
          {related.length > 0 && <RelatedProducts products={related} />}
          <RecentlyViewed currentId={product.id} />
        </div>
      </div>
    </>
  );
}
