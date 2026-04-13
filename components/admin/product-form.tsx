"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { productSchema, type ProductInput } from "@/lib/validations";
import { CAR_BRANDS, FUEL_TYPES, COUNTRY_SPECS, generateYears } from "@/lib/car-data";
import type { Category, Product } from "@/types";

interface Props {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || "",
      shortDesc: product.shortDesc || "",
      sku: product.sku || "",
      status: product.status,
      tag: product.tag,
      categoryId: product.categoryId,
      brands: product.brands,
      models: product.models,
      years: product.years,
      fuelTypes: product.fuelTypes,
      countrySpecs: product.countrySpecs,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    } : { status: "AVAILABLE", tag: "OEM", isActive: true, isFeatured: false },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (data.success) {
          setImages((prev) => [...prev, data.data.url]);
        }
      }
      toast.success("Images uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      const payload = { ...data, images };
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const MultiSelect = ({ field, options, label }: { field: keyof ProductInput; options: string[]; label: string }) => {
    const current = (watch(field) as string[]) || [];
    return (
      <div>
        <label className="text-xs text-carbon-400 mb-1 block">{label}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {current.map((item) => (
            <span key={item} className="flex items-center gap-1 text-xs bg-gold/10 text-gold border border-gold/20 px-2 py-1 rounded-sm">
              {item}
              <button type="button" onClick={() => setValue(field, current.filter((i) => i !== item) as never)}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <select
          onChange={(e) => {
            if (e.target.value && !current.includes(e.target.value)) {
              setValue(field, [...current, e.target.value] as never);
            }
            e.target.value = "";
          }}
          className="bg-carbon-800 border border-carbon-600 text-white text-sm px-3 py-2 rounded-sm focus:border-gold focus:outline-none w-full"
        >
          <option value="">Add {label}...</option>
          {options.filter((o) => !current.includes(o)).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Images */}
      <div className="glass rounded-lg p-5">
        <h3 className="font-display font-semibold text-white mb-4">Images</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden">
              <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" sizes="80px" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 border-2 border-dashed border-carbon-600 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 transition-colors">
            {uploading ? <Loader2 size={16} className="animate-spin text-gold" /> : <Upload size={16} className="text-carbon-400" />}
            <span className="text-xs text-carbon-500 mt-1">Upload</span>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Basic info */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-carbon-400 mb-1 block">Product Name *</label>
            <input {...register("name")} className="input-premium" placeholder="e.g. BMW M5 Engine Mount" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">SKU</label>
            <input {...register("sku")} className="input-premium" placeholder="BMW-M5-EM-001" />
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Category *</label>
            <select {...register("categoryId")} className="input-premium">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Status</label>
            <select {...register("status")} className="input-premium">
              <option value="AVAILABLE">Available</option>
              <option value="ON_REQUEST">On Request</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Tag</label>
            <select {...register("tag")} className="input-premium">
              <option value="OEM">OEM</option>
              <option value="USED">Used</option>
              <option value="AFTERMARKET">Aftermarket</option>
              <option value="PERFORMANCE">Performance</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-carbon-400 mb-1 block">Short Description</label>
            <input {...register("shortDesc")} className="input-premium" placeholder="One-line summary" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-carbon-400 mb-1 block">Full Description</label>
            <textarea {...register("description")} rows={4} className="input-premium resize-none" placeholder="Detailed description..." />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("isFeatured")} className="accent-gold" />
            <span className="text-sm text-carbon-300">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("isActive")} className="accent-gold" />
            <span className="text-sm text-carbon-300">Active</span>
          </label>
        </div>
      </div>

      {/* Compatibility */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">Vehicle Compatibility</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MultiSelect field="brands" options={CAR_BRANDS} label="Brands" />
          <MultiSelect field="fuelTypes" options={FUEL_TYPES} label="Fuel Types" />
          <MultiSelect field="countrySpecs" options={COUNTRY_SPECS} label="Country Specs" />
        </div>
      </div>

      {/* SEO */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">SEO</h3>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Meta Title</label>
          <input {...register("metaTitle")} className="input-premium" placeholder="SEO title" />
        </div>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Meta Description</label>
          <textarea {...register("metaDesc")} rows={2} className="input-premium resize-none" placeholder="SEO description" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isLoading} className="btn-gold flex items-center gap-2">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {product ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost-gold">
          Cancel
        </button>
      </div>
    </form>
  );
}
