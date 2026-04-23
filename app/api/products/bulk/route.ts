import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface CSVRow {
  name: string;
  sku?: string;
  categorySlug: string;
  status?: string;
  tag?: string;
  brands?: string;
  models?: string;
  years?: string;
  fuelTypes?: string;
  countrySpecs?: string;
  description?: string;
  shortDesc?: string;
  isFeatured?: string;
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { rows } = await req.json() as { rows: CSVRow[] };

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const row of rows.slice(0, 500)) {
    try {
      if (!row.name || !row.categorySlug) {
        errors.push(`Row "${row.name || "unknown"}": missing name or categorySlug`);
        failed++;
        continue;
      }

      const category = await prisma.category.findUnique({ where: { slug: row.categorySlug } });
      if (!category) {
        errors.push(`Row "${row.name}": category "${row.categorySlug}" not found`);
        failed++;
        continue;
      }

      const slug = slugify(row.name);
      const existing = await prisma.product.findUnique({ where: { slug } });
      const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

      await prisma.product.create({
        data: {
          name: row.name,
          slug: finalSlug,
          sku: row.sku || undefined,
          categoryId: category.id,
          status: (row.status as "AVAILABLE" | "ON_REQUEST" | "OUT_OF_STOCK") || "AVAILABLE",
          tag: (row.tag as "OEM" | "USED" | "AFTERMARKET" | "PERFORMANCE") || "OEM",
          brands: row.brands ? row.brands.split(";").map((s) => s.trim()) : [],
          models: row.models ? row.models.split(";").map((s) => s.trim()) : [],
          years: row.years ? row.years.split(";").map((s) => parseInt(s.trim())).filter(Boolean) : [],
          fuelTypes: row.fuelTypes ? row.fuelTypes.split(";").map((s) => s.trim()) : [],
          countrySpecs: row.countrySpecs ? row.countrySpecs.split(";").map((s) => s.trim()) : [],
          description: row.description || undefined,
          shortDesc: row.shortDesc || undefined,
          isFeatured: row.isFeatured === "true",
          images: [],
        },
      });

      success++;
    } catch (err) {
      errors.push(`Row "${row.name}": ${err instanceof Error ? err.message : "Unknown error"}`);
      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    data: { success, failed, errors },
  });
}
