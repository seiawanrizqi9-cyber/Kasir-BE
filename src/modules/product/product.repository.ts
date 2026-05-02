import { prisma } from "#/config/database";

export class ProductRepository {
  create(data: {
    name: string;
    code: string;
    codeType: "INTERNAL" | "BARCODE";
    price: number;
    categoryId: string;
    storeId: string;
  }) {
    return prisma.product.create({ data });
  }

  findByCode(code: string, storeId: string) {
    return prisma.product.findFirst({
      where: { code, storeId },
    });
  }

  searchByName(name: string, storeId: string) {
    return prisma.product.findMany({
      where: {
        storeId,
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      take: 10,
    });
  }

  findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}
