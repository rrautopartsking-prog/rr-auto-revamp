const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { key: "contact_map_embed" },
    update: { value: "https://maps.google.com/maps?q=The+Auto+Stores,+1390,+Nicholson+Rd,+Kashmere+Gate,+Delhi,+110006&z=18&output=embed" },
    create: { key: "contact_map_embed", value: "https://maps.google.com/maps?q=The+Auto+Stores,+1390,+Nicholson+Rd,+Kashmere+Gate,+Delhi,+110006&z=18&output=embed" },
  });

  await prisma.siteSettings.upsert({
    where: { key: "contact_map_url" },
    update: { value: "https://www.google.com/maps?q=The+Auto+Stores,+1390,+Nicholson+Rd,+Kashmere+Gate,+Delhi,+110006&ftid=0x390cfd08a2c48f6d:0x5c612834156b268c&entry=gps" },
    create: { key: "contact_map_url", value: "https://www.google.com/maps?q=The+Auto+Stores,+1390,+Nicholson+Rd,+Kashmere+Gate,+Delhi,+110006&ftid=0x390cfd08a2c48f6d:0x5c612834156b268c&entry=gps" },
  });

  console.log("Map embed and URL updated in DB");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
