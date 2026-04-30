import { prisma } from "#/config/database";

export class StoreRepository {
  async findByEmail(email: string) {
    return prisma.store.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.store.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return prisma.store.create({
      data,
    });
  }
}