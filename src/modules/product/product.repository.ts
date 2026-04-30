import { CodeType, Prisma } from "@prisma/client";
import { prisma } from "../../config/database";

export interface ProductFilters {
  search?: string;
  categoryId?: string;
}

const productWithCategory = Prisma.validator<Prisma.ProductInclude>()({
  category: { select: { id: true, name: true } },
});

export class ProductRepository {
  async findById(id: string) {
      return prisma.product.findUnique({
        where: { id },
        include: productWithCategory,
      });
  }

  async findByCode(code: string) {
    return prisma.product.findUnique({
      where: { code },
      include: productWithCategory,
    })
  }

  async findAll(filters: ProductFilters) {
    const where: Prisma.ProductWhereInput = {
      ...(filters.categoryId && {categoryId: filters.categoryId}),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { code: { contains: filters.search, mode: "insensitive" } },
        ],
      })
    }

    return prisma.product.findMany({
      where,
      include: productWithCategory,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: {
    name: string;
    code: string;
    codeType: CodeType;
    price: number;
    categoryId: string;
  }) {
    return prisma.product.create({
      data,
      include: productWithCategory,
    })
  }

  async update(id: string, data: {
    name?: string;
    code?: string;
    codeType?: CodeType
    price?: number
    categoryId?: string
  },
) {
  return prisma.product.update({
    where: { id },
    data,
    include: productWithCategory,
  })
}

async delete(id: string) {
  return prisma.product.delete({
    where: { id },
  })
}
}