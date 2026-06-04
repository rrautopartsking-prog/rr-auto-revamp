import type { Metadata } from "next";
import { AboutPageClient } from "@/components/about/about-page-client";
import { defaultAboutData } from "@/app/api/about/route";
import { isDbConnected } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About RR Auto Revamp — Car Parts Shop Delhi | Kashmere Gate",
  description:
    "RR Auto Revamp at Shop 58, Sehgal Motor Market, Kashmere Gate, Delhi. Trusted supplier of OEM & aftermarket spare parts for BMW, Mercedes, Audi, Maruti and all brands since years.",
  alternates: { canonical: "https://rrautorevamp.com/about" },
  openGraph: {
    title: "About RR Auto Revamp — Delhi's Trusted Auto Parts Supplier",
    description: "Shop 58, Sehgal Motor Market, Kashmere Gate, Delhi. OEM & aftermarket parts for all brands.",
    url: "https://rrautorevamp.com/about",
  },
};

async function getAboutData() {
  if (!isDbConnected()) return defaultAboutData;
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.siteSettings.findUnique({ where: { key: "about_page_data" } });
    if (row) return { ...defaultAboutData, ...JSON.parse(row.value) };
    return defaultAboutData;
  } catch {
    return defaultAboutData;
  }
}

export default async function AboutPage() {
  const data = await getAboutData();
  return <AboutPageClient data={data} />;
}
