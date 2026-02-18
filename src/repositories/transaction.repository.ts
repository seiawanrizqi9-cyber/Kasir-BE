import { prisma } from "@/config/database";
import { Transaction, Prisma, PaymentMethod } from "@prisma/client";
import { PaginatedResponse } from "@/types";

export interface TransactionFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  paymentMethod?: PaymentMethod;
  userId?: string;
}

export interface CreateTransactionData {
  userId: string;
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export class TransactionRepository {
  async findAll(
    filters: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      paymentMethod,
      userId,
    } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      ...(userId && { userId }),
      ...(paymentMethod && { paymentMethod }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                barcode: true,
                cost: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateTransactionData) {
    const total = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const changeAmount = data.paymentAmount - total;

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    return prisma.$transaction(async (tx) => {
      // Create transaction with items
      const transaction = await tx.transaction.create({
        data: {
          invoiceNumber,
          userId: data.userId,
          total,
          paymentMethod: data.paymentMethod,
          paymentAmount: data.paymentAmount,
          changeAmount,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.unitPrice * item.quantity,
            })),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update stock for all products
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return transaction;
    });
  }

  async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const prefix = `INV-${year}${month}${day}`;

    // Get last invoice number for today
    const lastInvoice = await prisma.transaction.findFirst({
      where: {
        invoiceNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(
        lastInvoice.invoiceNumber.split("-").pop() || "0",
      );
      sequence = lastSequence + 1;
    }

    return `${prefix}-${String(sequence).padStart(4, "0")}`;
  }

  // Statistics queries
  async getSalesStats(startDate: Date, endDate: Date) {
    const result = await prisma.transaction.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalSales: result._sum.total || 0,
      totalTransactions: result._count.id || 0,
    };
  }

  async getProductPerformance(
    startDate: Date,
    endDate: Date,
    limit: number = 10,
  ) {
    const result = await prisma.transactionItem.groupBy({
      by: ["productId"],
      where: {
        transaction: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          subtotal: "desc",
        },
      },
      take: limit,
    });

    const productIds = result.map((r) => r.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        cost: true,
      },
    });

    return result.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const profit =
        (item._sum.subtotal || 0) -
        (product?.cost || 0) * (item._sum.quantity || 0);

      return {
        productId: item.productId,
        productName: product?.name || "Unknown",
        totalQuantity: item._sum.quantity || 0,
        totalSales: item._sum.subtotal || 0,
        totalProfit: profit,
      };
    });
  }
}
