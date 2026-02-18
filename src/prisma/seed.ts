import { PrismaClient, Role, PaymentMethod } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting to seed database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kasir.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@kasir.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create cashier user
  const cashierPassword = await bcrypt.hash("cashier123", 10);
  const cashier = await prisma.user.upsert({
    where: { email: "cashier@kasir.com" },
    update: {},
    create: {
      name: "Kasir 1",
      email: "cashier@kasir.com",
      password: cashierPassword,
      role: Role.CASHIER,
    },
  });
  console.log("✅ Created cashier user:", cashier.email);

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
      where: { name: "Alat Tulis" },
      update: {},
      create: {
        name: "Alat Tulis",
        description: "Produk alat tulis kantor",
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  const products = await Promise.all([
    // Makanan
    prisma.product.upsert({
      where: { barcode: "8991002101012" },
      update: {},
      create: {
        name: "Indomie Goreng",
        description: "Mie instan rasa goreng",
        price: 3500,
        cost: 2500,
        stock: 100,
        barcode: "8991002101012",
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { barcode: "8992753900023" },
      update: {},
      create: {
        name: "Chitato Sapi Panggang",
        description: "Keripik kentang rasa sapi panggang",
        price: 8000,
        cost: 6000,
        stock: 50,
        barcode: "8992753900023",
        categoryId: categories[0].id,
      },
    }),
    // Minuman
    prisma.product.upsert({
      where: { barcode: "8993175101011" },
      update: {},
      create: {
        name: "Aqua 600ml",
        description: "Air mineral kemasan",
        price: 4000,
        cost: 3000,
        stock: 150,
        barcode: "8993175101011",
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { barcode: "8997008240015" },
      update: {},
      create: {
        name: "Teh Botol Sosro",
        description: "Teh kemasan botol",
        price: 5000,
        cost: 3500,
        stock: 80,
        barcode: "8997008240015",
        categoryId: categories[1].id,
      },
    }),
    // Alat Tulis
    prisma.product.upsert({
      where: { barcode: "8888003100104" },
      update: {},
      create: {
        name: "Pulpen Joyko",
        description: "Pulpen tinta hitam",
        price: 3000,
        cost: 2000,
        stock: 200,
        barcode: "8888003100104",
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { barcode: "8888003200205" },
      update: {},
      create: {
        name: "Buku Tulis Sidu",
        description: "Buku tulis 38 lembar",
        price: 5000,
        cost: 3500,
        stock: 100,
        barcode: "8888003200205",
        categoryId: categories[2].id,
      },
    }),
  ]);
  console.log(`✅ Created ${products.length} products`);

  // Create sample transactions
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const transaction1 = await prisma.transaction.create({
    data: {
      invoiceNumber: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-0001`,
      userId: cashier.id,
      total: 15500,
      paymentMethod: PaymentMethod.CASH,
      paymentAmount: 20000,
      changeAmount: 4500,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: 3500,
            subtotal: 7000,
          },
          {
            productId: products[2].id,
            quantity: 1,
            unitPrice: 4000,
            subtotal: 4000,
          },
          {
            productId: products[4].id,
            quantity: 1,
            unitPrice: 3000,
            subtotal: 3000,
          },
        ],
      },
    },
  });

  // Update stock after transaction
  await prisma.product.update({
    where: { id: products[0].id },
    data: { stock: { decrement: 2 } },
  });
  await prisma.product.update({
    where: { id: products[2].id },
    data: { stock: { decrement: 1 } },
  });
  await prisma.product.update({
    where: { id: products[4].id },
    data: { stock: { decrement: 1 } },
  });

  console.log("✅ Created sample transaction:", transaction1.invoiceNumber);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📋 Login credentials:");
  console.log("Admin - Email: admin@kasir.com, Password: admin123");
  console.log("Cashier - Email: cashier@kasir.com, Password: cashier123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
