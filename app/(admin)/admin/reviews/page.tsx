import { ReviewsManager } from "@/components/admin/reviews-manager";

export const dynamic = "force-dynamic";
import { isDbConnected } from "@/lib/db";

const mockReviews = [
  { id: "rev-1", status: "PENDING" as const, rating: 5, title: "Excellent quality parts", content: "Got the BMW brake kit and it fits perfectly. Highly recommend RR Auto Revamp.", authorName: "Rajesh Kumar", authorEmail: "rajesh@example.com", isVerified: false, productId: "2", product: { name: "BMW M5 Carbon Ceramic Brake Kit" }, createdAt: new Date("2024-03-01"), updatedAt: new Date("2024-03-01") },
  { id: "rev-2", status: "APPROVED" as const, rating: 4, title: "Fast delivery, good service", content: "Ordered the Porsche engine mount. Arrived in 3 days. Quality is as described.", authorName: "Sunita Verma", authorEmail: "sunita@example.com", isVerified: true, productId: "1", product: { name: "Porsche 911 Turbo Engine Mount" }, createdAt: new Date("2024-02-20"), updatedAt: new Date("2024-02-21") },
  { id: "rev-3", status: "PENDING" as const, rating: 5, title: "Best auto parts supplier in Delhi", content: "Have been sourcing parts from RR Auto Revamp for 2 years. Never disappointed.", authorName: "Mohit Agarwal", authorEmail: "mohit@garagepro.in", isVerified: false, productId: null, product: null, createdAt: new Date("2024-03-05"), updatedAt: new Date("2024-03-05") },
];

async function getReviews() {
  if (!isDbConnected()) return mockReviews;
  const { prisma } = await import("@/lib/prisma");
  return prisma.review.findMany({ include: { product: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Reviews</h1>
        <p className="text-carbon-400 text-sm mt-1">{reviews.length} total reviews</p>
      </div>
      <ReviewsManager reviews={reviews} />
    </div>
  );
}
