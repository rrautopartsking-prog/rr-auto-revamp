"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Product, Category } from "@/types";
import type { SearchFilters } from "@/types/api";
import { buildSearchParams } from "@/lib/utils";

interface Props {
  products: (Product & { category: Category })[];
  total: number;
  page: number;
  limit: number;
  filters: SearchFilters;
}

export function ProductsGrid({ products, total, page, limit, filters }: Props) {
  const totalPages = Math.ceil(total / limit);

  if (!products.length) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="font-display text-xl text-white mb-2">No parts found</h3>
        <p className="text-carbon-400 text-sm">Try adjusting your filters or submit an inquiry for custom sourcing.</p>
        <Link href="/contact" className="btn-gold inline-flex mt-6">Submit Inquiry</Link>
      </div>
    );
  }

  const getPageUrl = (p: number) => {
    const params = buildSearchParams({ ...filters, page: p });
    return `/products?${params}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link href={getPageUrl(page - 1)} className="w-9 h-9 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold hover:border-gold/30 transition-all">
              <ChevronLeft size={16} />
            </Link>
          )}

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p}
                href={getPageUrl(p)}
                className={`w-9 h-9 rounded-sm flex items-center justify-center text-sm transition-all ${
                  p === page
                    ? "bg-gold text-carbon-950 font-semibold"
                    : "glass text-carbon-400 hover:text-gold hover:border-gold/30"
                }`}
              >
                {p}
              </Link>
            );
          })}

          {page < totalPages && (
            <Link href={getPageUrl(page + 1)} className="w-9 h-9 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold hover:border-gold/30 transition-all">
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
