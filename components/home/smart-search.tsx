"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { CAR_BRANDS, getModelsForBrand, generateYears, FUEL_TYPES, COUNTRY_SPECS } from "@/lib/car-data";
import { buildSearchParams } from "@/lib/utils";

const steps = ["Brand", "Model", "Year", "Fuel Type", "Country Spec"];

export function SmartSearch() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    countrySpec: "",
  });

  const models = filters.brand ? getModelsForBrand(filters.brand) : [];
  const years = generateYears();

  const handleSearch = () => {
    const params = buildSearchParams({
      brand: filters.brand,
      model: filters.model,
      year: filters.year ? Number(filters.year) : undefined,
      fuelType: filters.fuelType,
      countrySpec: filters.countrySpec,
    });
    router.push(`/products?${params}`);
  };

  const SelectField = ({
    label,
    value,
    onChange,
    options,
    disabled,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    disabled?: boolean;
  }) => (
    <div className="relative flex-1 min-w-[140px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-carbon-800/80 border border-carbon-600 text-white appearance-none px-4 py-3 pr-8 rounded-sm text-sm focus:border-gold focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-400 pointer-events-none" />
    </div>
  );

  return (
    <section className="relative z-20 -mt-8 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-dark rounded-lg p-6 md:p-8 border border-white/10 shadow-premium"
        >
          <div className="flex items-center gap-2 mb-6">
            <Search size={18} className="text-gold" />
            <h2 className="font-display font-semibold text-white tracking-wide">Find Your Part</h2>
            <span className="text-carbon-500 text-sm ml-2">— Select your vehicle details</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 items-end">
            <SelectField label="Brand" value={filters.brand}
              onChange={(v) => setFilters({ ...filters, brand: v, model: "" })} options={CAR_BRANDS} />
            <SelectField label="Model" value={filters.model}
              onChange={(v) => setFilters({ ...filters, model: v })} options={models} disabled={!filters.brand} />
            <SelectField label="Year" value={filters.year}
              onChange={(v) => setFilters({ ...filters, year: v })} options={years.map(String)} />
            <SelectField label="Fuel Type" value={filters.fuelType}
              onChange={(v) => setFilters({ ...filters, fuelType: v })} options={FUEL_TYPES} />
            <SelectField label="Country Spec" value={filters.countrySpec}
              onChange={(v) => setFilters({ ...filters, countrySpec: v })} options={COUNTRY_SPECS} />
            <motion.button onClick={handleSearch} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-gold flex items-center justify-center gap-2 col-span-2 sm:col-span-3 lg:col-span-1 whitespace-nowrap">
              <Search size={16} /> Search Parts
            </motion.button>
          </div>

          {/* Quick brand pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-carbon-500 text-xs self-center">Popular:</span>
            {["BMW", "Mercedes-Benz", "Porsche", "Land Rover", "Toyota"].map((brand) => (
              <button
                key={brand}
                onClick={() => setFilters({ ...filters, brand, model: "" })}
                className={`text-xs px-3 py-1 rounded-sm border transition-all duration-200 ${
                  filters.brand === brand
                    ? "border-gold text-gold bg-gold/10"
                    : "border-carbon-600 text-carbon-400 hover:border-gold/50 hover:text-white"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
