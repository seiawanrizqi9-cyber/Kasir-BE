import { prisma } from "#/config/database";
import { Prisma } from "@prisma/client";

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

const productWithCategory = Prisma.validator<Prisma.ProductInclude>()({
  category: { select: { id: true, name: true } },
});

export class ProductRepository {
  async findAll(filters: ProductFilters) {
    const { page = 1, limit = 10, search, categoryId } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: productWithCategory,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: productWithCategory,
    });
  }

  // 🔥 GANTI dari serialNumber → code
  async findByCode(code: string) {
    return prisma.product.findUnique({
      where: { code },
      include: productWithCategory,
    });
  }

  async create(data: {
    name: string;
    code: string;
    codeType: "INTERNAL" | "BARCODE";
    price: number;
    categoryId: string;
  }) {
    return prisma.product.create({
      data,
      include: productWithCategory,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      code?: string;
      codeType?: "INTERNAL" | "BARCODE";
      price?: number;
      categoryId?: string;
    },
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: productWithCategory,
    });
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}
