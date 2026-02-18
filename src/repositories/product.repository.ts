import { prisma } from "@/config/database";
import { Product, Prisma } from "@prisma/client";
import { PaginatedResponse } from "@/types";

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}

export class ProductRepository {
  async findAll(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      isActive = true,
    } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive,
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { barcode: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
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

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { barcode },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    cost?: number;
    stock?: number;
    barcode?: string;
    image?: string;
    categoryId: string;
  }): Promise<Product> {
    return prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  async delete(id: string): Promise<Product> {
    // Soft delete
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
