"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { CAR_BRANDS, FUEL_TYPES, COUNTRY_SPECS } from "@/lib/car-data";
import type { Category } from "@/types";
import type { SearchFilters } from "@/types/api";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  currentFilters: SearchFilters;
}

const TAGS = ["OEM", "USED", "AFTERMARKET", "PERFORMANCE"];
const STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "ON_REQUEST", label: "On Request" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
];

export function ProductFilters({ categories, currentFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams();
    const current = { ...currentFilters, [key]: value, page: 1 };
    Object.entries(current).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) {
        params.set(k, String(v));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  const hasFilters = Object.entries(currentFilters).some(
    ([k, v]) => k !== "page" && k !== "limit" && v
  );

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-carbon-800 pb-4 mb-4">
      <h3 className="font-display font-semibold text-white text-sm mb-3 tracking-wide">{title}</h3>
      {children}
    </div>
  );

  const content = (
    <div className="space-y-0">
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 mb-4 transition-colors"
        >
          <X size={12} /> Clear all filters
        </button>
      )}

      <FilterSection title="Category">
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", currentFilters.category === cat.slug ? undefined : cat.slug)}
              className={cn(
                "w-full text-left text-sm px-3 py-2 rounded-sm transition-all duration-200",
                currentFilters.category === cat.slug
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-carbon-400 hover:text-white hover:bg-carbon-800"
              )}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <select
          value={currentFilters.brand || ""}
          onChange={(e) => updateFilter("brand", e.target.value || undefined)}
          className="w-full bg-carbon-800 border border-carbon-600 text-white text-sm px-3 py-2 rounded-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Brands</option>
          {CAR_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </FilterSection>

      <FilterSection title="Part Type">
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => updateFilter("tag", currentFilters.tag === tag ? undefined : tag)}
              className={cn(
                "text-xs px-3 py-1 rounded-sm border transition-all duration-200",
                currentFilters.tag === tag
                  ? "border-gold text-gold bg-gold/10"
                  : "border-carbon-600 text-carbon-400 hover:border-gold/50"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="space-y-1">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateFilter("status", currentFilters.status === s.value ? undefined : s.value)}
              className={cn(
                "w-full text-left text-sm px-3 py-2 rounded-sm transition-all duration-200",
                currentFilters.status === s.value
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-carbon-400 hover:text-white hover:bg-carbon-800"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Fuel Type">
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((ft) => (
            <button
              key={ft}
              onClick={() => updateFilter("fuelType", currentFilters.fuelType === ft ? undefined : ft)}
              className={cn(
                "text-xs px-3 py-1 rounded-sm border transition-all duration-200",
                currentFilters.fuelType === ft
                  ? "border-gold text-gold bg-gold/10"
                  : "border-carbon-600 text-carbon-400 hover:border-gold/50"
              )}
            >
              {ft}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Country Spec">
        <div className="flex flex-wrap gap-2">
          {COUNTRY_SPECS.map((cs) => (
            <button
              key={cs}
              onClick={() => updateFilter("countrySpec", currentFilters.countrySpec === cs ? undefined : cs)}
              className={cn(
                "text-xs px-3 py-1 rounded-sm border transition-all duration-200",
                currentFilters.countrySpec === cs
                  ? "border-gold text-gold bg-gold/10"
                  : "border-carbon-600 text-carbon-400 hover:border-gold/50"
              )}
            >
              {cs}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between glass rounded-lg px-4 py-3 mb-4 text-white"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal size={16} className="text-gold" />
          Filters {hasFilters && <span className="text-gold text-xs">(active)</span>}
        </span>
        <ChevronDown size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block glass rounded-lg p-5">{content}</div>

      {/* Mobile expanded */}
      {isOpen && (
        <div className="lg:hidden glass rounded-lg p-5 mb-4">{content}</div>
      )}
    </>
  );
}
