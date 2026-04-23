"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

interface RecentProduct {
  id: string;
  slug: string;
  name: string;
  image?: string;
  brand?: string;
}

const STORAGE_KEY = "rr_recently_viewed";
const MAX_ITEMS = 6;

export function trackProductView(product: RecentProduct) {
  try {
    const existing: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = existing.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const stored: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setProducts(stored.filter((p) => p.id !== currentId).slice(0, 4));
    } catch {}
  }, [currentId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gold" />
        <h3 className="font-display font-semibold text-white text-sm tracking-wide">Recently Viewed</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`}
            className="glass rounded-lg overflow-hidden hover:border-gold/30 transition-all group">
            <div className="aspect-[4/3] bg-carbon-800 relative overflow-hidden">
              {p.image ? (
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl opacity-20">🔩</span>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-gold transition-colors">{p.name}</p>
              {p.brand && <p className="text-carbon-500 text-xs mt-0.5">{p.brand}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
