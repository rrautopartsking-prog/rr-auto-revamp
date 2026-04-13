import { z } from "zod";

export const leadSchema = z.object({
  type: z.enum(["PRODUCT_INQUIRY", "GENERAL_INQUIRY", "BULK_INQUIRY"]).default("GENERAL_INQUIRY"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Invalid phone number").max(20),
  company: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1).optional(),
  variant: z.string().max(100).optional(),
  fuelType: z.string().max(50).optional(),
  countrySpec: z.string().max(50).optional(),
  chassisNumber: z.string().max(50).optional(),
  partName: z.string().max(200).optional(),
  partNumber: z.string().max(100).optional(),
  quantity: z.number().int().min(1).max(10000).optional(),
  message: z.string().max(2000).optional(),
  productId: z.string().optional(),
  source: z.string().max(100).optional(),
});

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  description: z.string().max(5000).optional(),
  shortDesc: z.string().max(500).optional(),
  sku: z.string().max(100).optional(),
  status: z.enum(["AVAILABLE", "ON_REQUEST", "OUT_OF_STOCK"]).default("AVAILABLE"),
  tag: z.enum(["OEM", "USED", "AFTERMARKET", "PERFORMANCE"]).default("OEM"),
  images: z.array(z.string()).default([]),
  categoryId: z.string().min(1, "Category is required"),
  brands: z.array(z.string()).default([]),
  models: z.array(z.string()).default([]),
  years: z.array(z.number()).default([]),
  variants: z.array(z.string()).default([]),
  fuelTypes: z.array(z.string()).default([]),
  countrySpecs: z.array(z.string()).default([]),
  metaTitle: z.string().max(200).optional(),
  metaDesc: z.string().max(500).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const blogPostSchema = z.object({
  title: z.string().min(2).max(300),
  slug: z.string().min(2).max(300).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().max(100).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDesc: z.string().max(500).optional(),
  isPublished: z.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().min(10).max(2000),
  authorName: z.string().min(2).max(100),
  authorEmail: z.string().email(),
  productId: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
