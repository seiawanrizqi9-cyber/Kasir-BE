import { prisma } from "#/config/database";

export class CategoryRepository {
  create(data: { name: string; description?: string; storeId: string }) {
    return prisma.category.create({ data });
  }

  findAll(storeId: string) {
    return prisma.category.findMany({
      where: { storeId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findAllByStore(storeId: string) {
    return prisma.category.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
