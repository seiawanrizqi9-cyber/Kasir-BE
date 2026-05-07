import { TransactionRepository } from "./transaction.repository";

export class TransactionService {
  private repo = new TransactionRepository();

  /**
   * 🔥 CREATE TRANSACTION (dari cart frontend)
   */
  async create(data: {
    storeId: string;
    items: {
      productId: string;
      name: string;
      price: number;
      qty: number;
    }[];
  }) {
    // hitung subtotal & total
    const itemsWithSubtotal = data.items.map((item) => ({
      ...item,
      subtotal: item.price * item.qty,
    }));

    const total = itemsWithSubtotal.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    return this.repo.create({
      storeId: data.storeId,
      total,
      items: itemsWithSubtotal,
    });
  }

  findAll(storeId: string) {
    return this.repo.findAll(storeId);
  }
}