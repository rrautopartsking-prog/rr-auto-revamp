"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { cn, formatDate } from "@/lib/utils";
import type { Product, Category } from "@/types";

interface Props {
  products: (Product & { category: Category })[];
  total: number;
  page: number;
  limit: number;
  categories: Category[];
  currentFilters: Record<string, string | undefined>;
}

const statusColors = {
  AVAILABLE: "text-green-400 bg-green-400/10",
  ON_REQUEST: "text-yellow-400 bg-yellow-400/10",
  OUT_OF_STOCK: "text-red-400 bg-red-400/10",
};

export function AdminProductsTable({ products, total, page, limit, categories, currentFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(total / limit);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries({ ...currentFilters, [key]: value, page: "1" }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Product deleted"); router.refresh(); }
    else toast.error("Delete failed");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass rounded-lg p-3 lg:p-4 flex flex-wrap gap-2 lg:gap-3">
        <input type="text" placeholder="Search name, SKU..." defaultValue={currentFilters.search}
          onKeyDown={(e) => { if (e.key === "Enter") updateFilter("search", (e.target as HTMLInputElement).value); }}
          className="input-premium text-sm py-2 flex-1 min-w-[140px]" />
        <select value={currentFilters.category || ""} onChange={(e) => updateFilter("category", e.target.value)}
          className="bg-carbon-800 border border-carbon-600 text-white text-xs lg:text-sm px-2 lg:px-3 py-2 rounded-sm focus:border-gold focus:outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={currentFilters.status || ""} onChange={(e) => updateFilter("status", e.target.value)}
          className="bg-carbon-800 border border-carbon-600 text-white text-xs lg:text-sm px-2 lg:px-3 py-2 rounded-sm focus:border-gold focus:outline-none">
          <option value="">All Status</option>
          {["AVAILABLE", "ON_REQUEST", "OUT_OF_STOCK"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block glass rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-carbon-800">
              <tr>
                {["Product", "Category", "Tag", "Status", "Brands", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-carbon-500 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800">
              {products.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-carbon-500 py-10">No products found</td></tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-carbon-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-carbon-800 rounded-sm overflow-hidden shrink-0">
                        {product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-carbon-600 text-xs">🔩</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white line-clamp-1">{product.name}</div>
                        {product.sku && <div className="text-carbon-500 text-xs font-mono">{product.sku}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-carbon-300">{product.category.name}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-carbon-800 text-carbon-300 px-2 py-0.5 rounded-sm">{product.tag}</span></td>
                  <td className="px-4 py-3"><span className={cn("text-xs px-2 py-0.5 rounded-sm", statusColors[product.status])}>{product.status}</span></td>
                  <td className="px-4 py-3 text-carbon-400 text-xs">{product.brands.slice(0, 2).join(", ")}{product.brands.length > 2 ? "..." : ""}</td>
                  <td className="px-4 py-3 text-carbon-500 text-xs">{formatDate(product.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-carbon-400 hover:text-gold transition-colors"><Edit size={14} /></Link>
                      <button onClick={() => handleDelete(product.id, product.name)} className="text-carbon-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {products.length === 0 ? (
          <div className="text-center text-carbon-500 py-10 glass rounded-lg">No products found</div>
        ) : products.map((product) => (
          <div key={product.id} className="glass rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-carbon-800 rounded-sm overflow-hidden shrink-0">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} width={56} height={56} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-carbon-600">🔩</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm line-clamp-2">{product.name}</p>
                <p className="text-carbon-500 text-xs mt-0.5">{product.category.name}{product.sku ? ` · ${product.sku}` : ""}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-carbon-800 text-carbon-300 px-2 py-0.5 rounded-sm">{product.tag}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-sm", statusColors[product.status])}>{product.status}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-carbon-400 hover:text-gold transition-colors"><Edit size={15} /></Link>
                <button onClick={() => handleDelete(product.id, product.name)} className="p-2 text-carbon-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-carbon-500 text-xs">Page {page} of {totalPages} · {total} total</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`${pathname}?page=${page - 1}`} className="w-8 h-8 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold">
                <ChevronLeft size={14} />
              </Link>
            )}
            {page < totalPages && (
              <Link href={`${pathname}?page=${page + 1}`} className="w-8 h-8 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold">
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
