import type { Metadata } from "next";
import { AboutPageClient } from "@/components/about/about-page-client";
import { defaultAboutData } from "@/app/api/about/route";
import { isDbConnected } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us — RR Auto Revamp",
  description:
    "Learn the story behind RR Auto Revamp — India's most trusted automotive parts sourcing partner. Built by gearheads, for gearheads.",
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
