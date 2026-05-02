import { ProductRepository } from "./product.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";

export class ProductService {
  private repo = new ProductRepository();

  create(data: {
    name: string;
    code: string;
    codeType: "INTERNAL" | "BARCODE";
    price: number;
    categoryId: string;
    storeId: string;
  }) {
    return this.repo.create(data);
  }

  /**
   * 🔥 CORE: scan barcode
   */
  async findByCode(code: string, storeId: string) {
    const product = await this.repo.findByCode(code, storeId);
    if (!product) throw new ErrorHandler("Product not found", 404);
    return product;
  }

  /**
   * 🔍 fallback search
   */
  searchByName(name: string, storeId: string) {
    return this.repo.searchByName(name, storeId);
  }

  async delete(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new ErrorHandler("Product not found", 404);
    return this.repo.delete(id);
  }
}
