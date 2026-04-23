import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const brand = searchParams.get("brand");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (brand) where.brand = { contains: brand, mode: "insensitive" };

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const headers = [
    "ID", "Type", "Status", "Score", "Name", "Email", "Phone", "Company",
    "Country", "Brand", "Model", "Year", "Variant", "Fuel Type", "Country Spec",
    "Chassis No.", "Part Name", "Part Number", "Quantity", "Message", "Source", "Created At",
  ];

  const rows = leads.map((l) => [
    l.id, l.type, l.status, l.score, l.name, l.email, l.phone,
    l.company || "", l.country || "", l.brand || "", l.model || "",
    l.year || "", l.variant || "", l.fuelType || "", l.countrySpec || "",
    l.chassisNumber || "", l.partName || "", l.partNumber || "",
    l.quantity || "", l.message?.replace(/,/g, ";") || "",
    l.source || "", l.createdAt.toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
