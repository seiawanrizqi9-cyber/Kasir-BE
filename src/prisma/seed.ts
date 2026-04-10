import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting to seed database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Makanan" },
      update: {},
      create: {
        name: "Makanan",
        description: "Produk makanan dan snack",
      },
    }),
    prisma.category.upsert({
      where: { name: "Minuman" },
      update: {},
      create: {
        name: "Minuman",
        description: "Produk minuman segar",
      },
    }),
    prisma.category.upsert({
      where: { name: "Electronic" },
      update: {},
      create: {
        name: "Electronic",
        description: "Gadget and accessories",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  const products = await Promise.all([
    // Makanan
    prisma.product.upsert({
      where: { serialNumber: "8991002101012" },
      update: {},
      create: {
        name: "Indomie Goreng",
        price: 3500,
        serialNumber: "8991002101012",
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { serialNumber: "8992753900023" },
      update: {},
      create: {
        name: "Chitato Sapi Panggang",
        price: 8000,
        serialNumber: "8992753900023",
        categoryId: categories[0].id,
      },
    }),
    // Minuman
    prisma.product.upsert({
      where: { serialNumber: "8993175101011" },
      update: {},
      create: {
        name: "Aqua 600ml",
        price: 4000,
        serialNumber: "8993175101011",
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { serialNumber: "8997008240015" },
      update: {},
      create: {
        name: "Teh Botol Sosro",
        price: 5000,
        serialNumber: "8997008240015",
        categoryId: categories[1].id,
      },
    }),
    // Electronic
    prisma.product.upsert({
      where: { serialNumber: "SN-MAC-001" },
      update: {},
      create: {
        name: "Macbook Air M2",
        price: 18000000,
        serialNumber: "SN-MAC-001",
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { serialNumber: "SN-IPH-015" },
      update: {},
      create: {
        name: "iPhone 15 Pro",
        price: 20000000,
        serialNumber: "SN-IPH-015",
        categoryId: categories[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
