"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, cn } from "@/lib/utils";
import type { Review } from "@/types";

interface Props {
  reviews: (Review & { product: { name: string } | null })[];
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  APPROVED: "text-green-400 bg-green-400/10",
  REJECTED: "text-red-400 bg-red-400/10",
  SPAM: "text-carbon-400 bg-carbon-400/10",
};

export function ReviewsManager({ reviews }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState("PENDING");

  const updateReview = async (id: string, status: string) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Review ${status.toLowerCase()}`);
      router.refresh();
    } else {
      toast.error("Update failed");
    }
  };

  const filtered = filter === "ALL" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {["ALL", "PENDING", "APPROVED", "REJECTED", "SPAM"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-sm border transition-all",
              filter === s ? "border-gold text-gold bg-gold/10" : "border-carbon-600 text-carbon-400 hover:border-gold/50"
            )}
          >
            {s} {s !== "ALL" && `(${reviews.filter((r) => r.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="glass rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "text-gold fill-gold" : "text-carbon-600"} />
                    ))}
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-sm", statusColors[review.status])}>
                    {review.status}
                  </span>
                  {review.product && (
                    <span className="text-xs text-carbon-500">on {review.product.name}</span>
                  )}
                </div>
                {review.title && <h4 className="font-semibold text-white text-sm mb-1">{review.title}</h4>}
                <p className="text-carbon-300 text-sm">{review.content}</p>
                <div className="mt-2 text-carbon-500 text-xs">
                  {review.authorName} · {review.authorEmail} · {formatDate(review.createdAt)}
                </div>
              </div>

              {review.status === "PENDING" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => updateReview(review.id, "APPROVED")}
                    className="w-8 h-8 bg-green-400/10 border border-green-400/20 rounded-sm flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-all"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => updateReview(review.id, "REJECTED")}
                    className="w-8 h-8 bg-red-400/10 border border-red-400/20 rounded-sm flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-all"
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={() => updateReview(review.id, "SPAM")}
                    className="w-8 h-8 bg-carbon-400/10 border border-carbon-400/20 rounded-sm flex items-center justify-center text-carbon-400 hover:bg-carbon-400/20 transition-all"
                  >
                    <AlertTriangle size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-carbon-500 py-10">No reviews in this category</div>
        )}
      </div>
    </div>
  );
}
