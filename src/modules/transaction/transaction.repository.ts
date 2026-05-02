import { prisma } from "#/config/database";

export class TransactionRepository {
  create(data: {
    storeId: string;
    total: number;
    items: {
      productId: string;
      name: string;
      price: number;
      qty: number;
      subtotal: number;
    }[];
  }) {
    return prisma.transaction.create({
      data: {
        storeId: data.storeId,
        total: data.total,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
      },
    });
  }

  findAllByStore(storeId: string) {
    return prisma.transaction.findMany({
      where: { storeId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }
}