import {
  TransactionRepository,
  TransactionFilters,
} from "#/repositories/transaction.repository";
import { ProductRepository } from "#/repositories/product.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";
import { PaymentMethod } from "@prisma/client";

interface CreateTransactionInput {
  userId: string;
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.productRepository = new ProductRepository();
  }

  async getAllTransactions(filters: TransactionFilters) {
    return this.transactionRepository.findAll(filters);
  }

  async getTransactionById(id: string) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new ErrorHandler("Transaction not found", 404);
    }
    return transaction;
  }

  async createTransaction(data: CreateTransactionInput) {
    // Validate all products and check stock
    const productsData = [];
    let total = 0;

    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new ErrorHandler(
          `Product with ID ${item.productId} not found`,
          404,
        );
      }

      if (!product.isActive) {
        throw new ErrorHandler(`Product ${product.name} is not active`, 400);
      }

      if (product.stock < item.quantity) {
        throw new ErrorHandler(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          400,
        );
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;

      productsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // Validate payment amount
    if (data.paymentAmount < total) {
      throw new ErrorHandler(
        `Insufficient payment. Total: ${total}, Paid: ${data.paymentAmount}`,
        400,
      );
    }

    // Create transaction
    return this.transactionRepository.create({
      userId: data.userId,
      paymentMethod: data.paymentMethod,
      paymentAmount: data.paymentAmount,
      items: productsData,
    });
  }
}
