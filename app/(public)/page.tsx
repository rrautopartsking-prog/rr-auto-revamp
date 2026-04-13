import { HeroSection } from "@/components/home/hero-section";
import { SmartSearch } from "@/components/home/smart-search";

export const dynamic = "force-dynamic";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustIndicators } from "@/components/home/trust-indicators";
import { CTASection } from "@/components/home/cta-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RR Auto Revamp — Premium Automotive Parts",
  description: "Source premium OEM, aftermarket, and performance automotive parts. Trusted by enthusiasts and garages across India.",
};

async function getHomeData() {
  if (!isDbConnected()) {
    return {
      categories: mockCategories,
      featuredProducts: mockProducts.filter((p) => p.isFeatured),
    };
  }
  const { prisma } = await import("@/lib/prisma");
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 6 }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      take: 6,
    }),
  ]);
  return { categories, featuredProducts };
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData();
  return (
    <>
      <HeroSection />
      <SmartSearch />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <TrustIndicators />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
