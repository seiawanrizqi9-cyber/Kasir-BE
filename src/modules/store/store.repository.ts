import { prisma } from "#/config/database";

export class StoreRepository {
  findByEmail(email: string) {
    return prisma.store.findUnique({ where: { email } });
  }

  findById(id: string) {
    return prisma.store.findUnique({ where: { id } });
  }

  create(data: { name: string; email: string; password: string }) {
    return prisma.store.create({ data });
  }
}
