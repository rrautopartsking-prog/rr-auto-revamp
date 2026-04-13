"use client";

import { motion } from "framer-motion";
import type { Product, Category } from "@/types";
import { ProductCard } from "./product-card";

interface Props {
  products: (Product & { category: Category })[];
}

export function RelatedProducts({ products }: Props) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">You May Also Need</span>
        <h2 className="font-display text-2xl font-bold text-white mt-2">Related Parts</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
