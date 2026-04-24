"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Tag, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import type { Product, Category } from "@/types";
import { cn } from "@/lib/utils";
import { ShareProduct } from "@/components/products/share-product";

interface Props {
  product: Product & { category: Category };
}

const statusConfig = {
  AVAILABLE: { icon: CheckCircle, label: "Available", color: "text-green-400" },
  ON_REQUEST: { icon: Clock, label: "On Request", color: "text-yellow-400" },
  OUT_OF_STOCK: { icon: XCircle, label: "Out of Stock", color: "text-red-400" },
};

const tagColors = {
  OEM: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  USED: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  AFTERMARKET: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  PERFORMANCE: "bg-red-400/10 text-red-400 border-red-400/20",
};

export function ProductInfo({ product }: Props) {
  const status = statusConfig[product.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-carbon-500">
        <Link href="/products" className="hover:text-gold transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-gold transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-carbon-400">{product.name}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className={cn("text-xs px-3 py-1 rounded-sm border font-medium", tagColors[product.tag])}>
          {product.tag}
        </span>
        {product.isFeatured && (
          <span className="text-xs px-3 py-1 rounded-sm bg-gold/10 text-gold border border-gold/20">
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
          {product.name}
        </h1>
        {product.sku && (
          <p className="text-carbon-500 text-sm mt-2 font-mono">SKU: {product.sku}</p>
        )}
      </div>

      {/* Status */}
      <div className={cn("flex items-center gap-2 text-sm font-medium", status.color)}>
        <StatusIcon size={16} />
        {status.label}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-carbon-300 leading-relaxed">{product.description}</p>
      )}

      {/* Compatibility */}
      <div className="glass rounded-lg p-5 space-y-3">
        <h3 className="font-display font-semibold text-white text-sm tracking-wide">Vehicle Compatibility</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {product.brands.length > 0 && (
            <div>
              <span className="text-carbon-500 text-xs">Brands</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.brands.map((b) => (
                  <span key={b} className="text-xs bg-carbon-800 text-carbon-300 px-2 py-0.5 rounded-sm">{b}</span>
                ))}
              </div>
            </div>
          )}
          {product.models.length > 0 && (
            <div>
              <span className="text-carbon-500 text-xs">Models</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.models.map((m) => (
                  <span key={m} className="text-xs bg-carbon-800 text-carbon-300 px-2 py-0.5 rounded-sm">{m}</span>
                ))}
              </div>
            </div>
          )}
          {product.years.length > 0 && (
            <div>
              <span className="text-carbon-500 text-xs">Years</span>
              <p className="text-carbon-300 text-xs mt-1">
                {Math.min(...product.years)} – {Math.max(...product.years)}
              </p>
            </div>
          )}
          {product.fuelTypes.length > 0 && (
            <div>
              <span className="text-carbon-500 text-xs">Fuel Type</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.fuelTypes.map((f) => (
                  <span key={f} className="text-xs bg-carbon-800 text-carbon-300 px-2 py-0.5 rounded-sm">{f}</span>
                ))}
              </div>
            </div>
          )}
          {product.countrySpecs.length > 0 && (
            <div>
              <span className="text-carbon-500 text-xs">Country Spec</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.countrySpecs.map((cs) => (
                  <span key={cs} className="text-xs bg-carbon-800 text-carbon-300 px-2 py-0.5 rounded-sm">{cs}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 flex-wrap items-center">
        <a href="#inquiry" className="btn-gold flex items-center gap-2 flex-1 justify-center">
          Request This Part <ArrowRight size={16} />
        </a>
        <a
          href={`https://wa.me/rrautorevamp?text=${encodeURIComponent(`Hi, I'm interested in: ${product.name} (SKU: ${product.sku || "N/A"})`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25D366]/10 border border-[#25D366]/30 rounded-sm flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <ShareProduct name={product.name} slug={product.slug} />
      </div>
    </motion.div>
  );
}
