"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content: string;
  authorName: string;
  authorEmail: string;
}

interface Props {
  reviews: Review[];
}

export function TestimonialsSection({ reviews }: Props) {
  // Show max 6 reviews
  const displayReviews = reviews.slice(0, 6);

  if (displayReviews.length === 0) return null;

  return (
    <section className="py-20 bg-carbon-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Testimonials</span>
          <h2 className="section-title text-white mt-2">What Our Clients Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-lg p-6 relative"
            >
              <Quote size={32} className="text-gold/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-gold fill-gold" />
                ))}
              </div>
              {review.title && (
                <h4 className="font-semibold text-white text-sm mb-2">{review.title}</h4>
              )}
              <p className="text-carbon-300 text-sm leading-relaxed mb-6">&ldquo;{review.content}&rdquo;</p>
              <div>
                <div className="font-display font-semibold text-white text-sm">{review.authorName}</div>
                <div className="text-carbon-500 text-xs mt-0.5">{review.authorEmail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
