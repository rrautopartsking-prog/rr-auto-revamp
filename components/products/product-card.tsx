"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Tag, Eye, MessageSquare } from "lucide-react";
import type { Product, Category } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product & { category: Category };
}

const statusColors = {
  AVAILABLE: "text-green-400 bg-green-400/10 border-green-400/20",
  ON_REQUEST: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  OUT_OF_STOCK: "text-red-400 bg-red-400/10 border-red-400/20",
};

const statusLabels = {
  AVAILABLE: "Available",
  ON_REQUEST: "On Request",
  OUT_OF_STOCK: "Out of Stock",
};

const tagColors = {
  OEM: "text-blue-400 bg-blue-400/10",
  USED: "text-orange-400 bg-orange-400/10",
  AFTERMARKET: "text-purple-400 bg-purple-400/10",
  PERFORMANCE: "text-red-400 bg-red-400/10",
};

export function ProductCard({ product }: Props) {
  const mainImage = product.images[0];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group glass rounded-lg overflow-hidden hover:border-gold/30 hover:shadow-gold transition-all duration-300"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-carbon-800 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center carbon-bg">
            <span className="text-4xl opacity-20">🔩</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 to-transparent" />

        {/* Tag badge */}
        <div className={cn("absolute top-3 left-3 text-xs px-2 py-1 rounded-sm font-medium", tagColors[product.tag])}>
          {product.tag}
        </div>

        {/* Featured badge */}
        {product.isFeatured && (
          <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-sm bg-gold/20 text-gold border border-gold/30">
            Featured
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display font-semibold text-white text-sm leading-tight group-hover:text-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-carbon-500 text-xs">{product.category.name}</span>
          {product.sku && (
            <>
              <span className="text-carbon-700">·</span>
              <span className="text-carbon-500 text-xs font-mono">{product.sku}</span>
            </>
          )}
        </div>

        {/* Brands */}
        {product.brands.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.brands.slice(0, 3).map((brand) => (
              <span key={brand} className="text-xs px-2 py-0.5 bg-carbon-800 text-carbon-300 rounded-sm">
                {brand}
              </span>
            ))}
            {product.brands.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-carbon-800 text-carbon-500 rounded-sm">
                +{product.brands.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className={cn("text-xs px-2 py-1 rounded-sm border", statusColors[product.status])}>
            {statusLabels[product.status]}
          </span>

          <Link
            href={`/products/${product.slug}#inquiry`}
            className="text-xs text-gold hover:text-gold-light flex items-center gap-1 transition-colors"
          >
            <MessageSquare size={12} />
            Inquire
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
