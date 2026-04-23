"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import type { Product, Category } from "@/types";
import { ProductCard } from "@/components/products/product-card";

interface Props {
  products: (Product & { category: Category })[];
}

export function FeaturedProducts({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="py-20 bg-carbon-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Handpicked</span>
            <h2 className="section-title text-white mt-2">Featured Parts</h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-gold text-sm hover:gap-3 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="btn-ghost-gold inline-flex items-center gap-2">
            View All Parts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
