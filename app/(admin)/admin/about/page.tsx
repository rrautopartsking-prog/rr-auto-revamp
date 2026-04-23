import { AboutEditor } from "@/components/admin/about-editor";
import { defaultAboutData } from "@/app/api/about/route";
import { isDbConnected } from "@/lib/db";

export const dynamic = "force-dynamic";

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

export default async function AdminAboutPage() {
  const data = await getAboutData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">About Page Editor</h1>
        <p className="text-carbon-400 text-sm mt-1">
          Manage all content on the public About Us page
        </p>
      </div>
      <AboutEditor initialData={data} />
    </div>
  );
}
