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
  title: "RR Auto Revamp — Premium Car Spare Parts in Delhi, India",
  description:
    "Buy OEM, aftermarket & performance car spare parts in Delhi. 9, The Auto Stores, 1390 Nicholson Rd, Kashmere Gate. BMW, Mercedes, Audi, Maruti, Hyundai & more. Call +91 84481 76091.",
  keywords: [
    "car spare parts Delhi", "auto parts Kashmere Gate", "OEM car parts Delhi",
    "imported car parts Delhi", "BMW parts Delhi", "Mercedes parts Delhi",
  ],
  alternates: { canonical: "https://rrautorevamp.com" },
  openGraph: {
    title: "RR Auto Revamp — Premium Car Spare Parts Delhi",
    description: "OEM, aftermarket & performance car parts at 9, The Auto Stores, 1390 Nicholson Rd, Kashmere Gate, Delhi.",
    url: "https://rrautorevamp.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "RR Auto Revamp" }],
  },
};

async function getHomeData() {
  if (!isDbConnected()) {
    return {
      categories: mockCategories,
      featuredProducts: mockProducts.filter((p) => p.isFeatured),
      reviews: [],
    };
  }
  const { prisma } = await import("@/lib/prisma");
  const [categories, featuredProducts, reviews] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 6 }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      take: 6,
    }),
    prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, rating: true, title: true, content: true, authorName: true, authorEmail: true },
    }),
  ]);
  return { categories, featuredProducts, reviews };
}

export default async function HomePage() {
  const { categories, featuredProducts, reviews } = await getHomeData();

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: "RR Auto Revamp",
    description: "Premium OEM, aftermarket and performance car spare parts in Delhi.",
    url: "https://rrautorevamp.com",
    telephone: "+918448176091",
    address: {
      "@type": "PostalAddress",
      streetAddress: "9, The Auto Stores, 1390, Nicholson Rd",
      addressLocality: "Kashmere Gate",
      addressRegion: "Delhi",
      postalCode: "110006",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.6639,
      longitude: 77.2273,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: [
      "https://www.instagram.com/rr_auto_revamp/",
    ],
    priceRange: "₹₹",
    image: "https://rrautorevamp.com/og-image.jpg",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <HeroSection />
      <SmartSearch />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <TrustIndicators />
      <TestimonialsSection reviews={reviews} />
      <CTASection />
    </>
  );
}
