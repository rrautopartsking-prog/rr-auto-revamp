"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildSearchParams } from "@/lib/utils";

export interface SearchState {
  brand: string;
  model: string;
  year: string;
  fuelType: string;
  countrySpec: string;
  query: string;
}

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchState>({
    brand: searchParams.get("brand") || "",
    model: searchParams.get("model") || "",
    year: searchParams.get("year") || "",
    fuelType: searchParams.get("fuelType") || "",
    countrySpec: searchParams.get("countrySpec") || "",
    query: searchParams.get("query") || "",
  });

  const updateFilter = useCallback((key: keyof SearchState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const search = useCallback(() => {
    const params = buildSearchParams({
      brand: filters.brand || undefined,
      model: filters.model || undefined,
      year: filters.year ? Number(filters.year) : undefined,
      fuelType: filters.fuelType || undefined,
      countrySpec: filters.countrySpec || undefined,
      query: filters.query || undefined,
    });
    router.push(`/products?${params}`);
  }, [filters, router]);

  const reset = useCallback(() => {
    setFilters({ brand: "", model: "", year: "", fuelType: "", countrySpec: "", query: "" });
  }, []);

  return { filters, updateFilter, search, reset };
}
