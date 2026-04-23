"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
}

const defaultIcons: Record<string, string> = {
  "engine-parts": "⚙️",
  "suspension": "🔧",
  "brakes": "🛑",
  "body-parts": "🚗",
  "electrical": "⚡",
  "transmission": "🔩",
};

export function CategoryShowcase({ categories }: Props) {
  return (
    <section className="py-20 bg-carbon-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Browse By</span>
          <h2 className="section-title text-white mt-2">Part Categories</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group block glass rounded-lg p-6 text-center hover:border-gold/30 hover:shadow-gold transition-all duration-300"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon || defaultIcons[cat.slug] || "🔩"}
                </div>
                <h3 className="font-display font-semibold text-white text-sm tracking-wide group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-carbon-500 text-xs mt-1 line-clamp-2">{cat.description}</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
