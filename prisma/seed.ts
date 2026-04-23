import { PrismaClient, Role, ProductStatus, ProductTag } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin users
  const superAdmin = await prisma.user.upsert({
    where: { email: "rrautopartsking@gmail.com" },
    update: {},
    create: {
      email: "rrautopartsking@gmail.com",
      name: "Super Admin",
      passwordHash: await bcrypt.hash("Admin@123!", 12),
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("✅ Admin user created:", superAdmin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "engine-parts" },
      update: {},
      create: {
        name: "Engine Parts",
        slug: "engine-parts",
        description: "High-performance engine components",
        icon: "⚙️",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "suspension" },
      update: {},
      create: {
        name: "Suspension",
        slug: "suspension",
        description: "Precision suspension systems",
        icon: "🔧",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "brakes" },
      update: {},
      create: {
        name: "Brakes",
        slug: "brakes",
        description: "Premium braking systems",
        icon: "🛑",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "body-parts" },
      update: {},
      create: {
        name: "Body Parts",
        slug: "body-parts",
        description: "Exterior body components",
        icon: "🚗",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "electrical" },
      update: {},
      create: {
        name: "Electrical",
        slug: "electrical",
        description: "Electrical systems and components",
        icon: "⚡",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "transmission" },
      update: {},
      create: {
        name: "Transmission",
        slug: "transmission",
        description: "Gearbox and drivetrain parts",
        icon: "🔩",
        sortOrder: 6,
      },
    }),
  ]);

  console.log("✅ Categories created:", categories.length);

  // Sample products
  await prisma.product.upsert({
    where: { slug: "porsche-911-turbo-engine-mount" },
    update: {},
    create: {
      name: "Porsche 911 Turbo Engine Mount",
      slug: "porsche-911-turbo-engine-mount",
      description: "OEM engine mount for Porsche 911 Turbo. Precision engineered for optimal performance and vibration dampening.",
      shortDesc: "OEM engine mount — perfect fitment guaranteed",
      sku: "POR-911T-EM-001",
      status: ProductStatus.AVAILABLE,
      tag: ProductTag.OEM,
      images: [],
      categoryId: categories[0].id,
      brands: ["Porsche"],
      models: ["911 Turbo", "911 Turbo S"],
      years: [2019, 2020, 2021, 2022, 2023],
      variants: ["Turbo", "Turbo S"],
      fuelTypes: ["Petrol"],
      countrySpecs: ["GCC", "Euro"],
      isFeatured: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "bmw-m5-carbon-ceramic-brake-kit" },
    update: {},
    create: {
      name: "BMW M5 Carbon Ceramic Brake Kit",
      slug: "bmw-m5-carbon-ceramic-brake-kit",
      description: "Performance carbon ceramic brake kit for BMW M5. Exceptional stopping power with reduced weight.",
      shortDesc: "Carbon ceramic — track-grade stopping power",
      sku: "BMW-M5-CCB-001",
      status: ProductStatus.AVAILABLE,
      tag: ProductTag.PERFORMANCE,
      images: [],
      categoryId: categories[2].id,
      brands: ["BMW"],
      models: ["M5", "M5 Competition"],
      years: [2018, 2019, 2020, 2021, 2022, 2023],
      variants: ["M5", "M5 Competition"],
      fuelTypes: ["Petrol"],
      countrySpecs: ["GCC", "Euro", "US"],
      isFeatured: true,
    },
  });

  // Site settings
  const settings = [
    { key: "site_name", value: "RR Auto Revamp" },
    { key: "site_tagline", value: "Premium Automotive Parts" },
    { key: "contact_phone", value: "+971 XX XXX XXXX" },
    { key: "contact_email", value: "rrautopartsking@gmail.com" },
    { key: "contact_address", value: "Dubai, UAE" },
    { key: "whatsapp_number", value: "+971XXXXXXXXX" },
    { key: "google_analytics_id", value: "" },
    { key: "meta_pixel_id", value: "" },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Site settings created");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
