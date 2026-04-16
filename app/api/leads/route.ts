import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { scoreLeadFromData } from "@/lib/utils";
import type { ApiResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const score = scoreLeadFromData({
      phone: data.phone,
      company: data.company,
      quantity: data.quantity,
      chassisNumber: data.chassisNumber,
      partNumber: data.partNumber,
    });

    // Save to database
    const lead = await prisma.lead.create({
      data: {
        ...data,
        score,
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
        source: data.source || "website",
      },
    });

    // Fire notifications in background — never block the response
    setImmediate(async () => {
      try {
        const { sendLeadNotificationEmail, sendLeadConfirmationEmail } = await import("@/lib/email");
        await Promise.allSettled([
          sendLeadNotificationEmail({
            name: data.name, email: data.email, phone: data.phone,
            brand: data.brand, model: data.model, year: data.year,
            partName: data.partName, message: data.message, type: data.type,
          }),
          sendLeadConfirmationEmail({
            name: data.name, email: data.email, phone: data.phone, type: data.type,
          }),
        ]);
      } catch (e) {
        console.error("Email error:", e);
      }

      try {
        const { sendWhatsAppAlert } = await import("@/lib/whatsapp");
        await sendWhatsAppAlert({
          name: data.name, phone: data.phone, brand: data.brand,
          model: data.model, year: data.year, partName: data.partName, type: data.type,
        });
      } catch (e) {
        console.error("WhatsApp error:", e);
      }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: lead.id },
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const status = searchParams.get("status");
  const score = searchParams.get("score");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (score) where.score = score;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { product: { select: { name: true, slug: true } } },
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json<ApiResponse>({
    success: true,
    data: leads,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}
