import { ErrorHandler } from "#middlewares/error.middleware";
import { ProductRepository } from "./product.repository";
import { CategoryRepository } from "../category/category.repository";
import { CodeType } from "@prisma/client";

export class ProductService {
  private productRepository = new ProductRepository();
  private categoryRepository = new CategoryRepository();

  async getProductByCode(code: string) {
    const product = await this.productRepository.findByCode(code);

    if (!product) {
      throw new ErrorHandler(
        `Product dengan kode "${code}" tidak ditemukan`,
        404,
        "NOT_FOUND"
      );
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    code: string;
    codeType: CodeType;
    categoryId: string;
    price: number;
  }) {
    
    const category = await this.categoryRepository.findById(data.categoryId)
    if (!category) {
      throw new ErrorHandler("Kategori tidak ditemukan", 404, "NOT_FOUND")
    }

    const existing = await this.productRepository.findByCode(data.code)
    if (existing) {
      throw new ErrorHandler(`Produk dengan kode ${data.code} sudah ada`, 400, "BAD_REQUEST")
    }

    return this.productRepository.create(data)
  }

  async calculateTotal(
    items: Array<{code: string, quantity: number}>
  ) {
    const result = []
    let grandTotal = 0;

    for (const item of items) {
      const product = await this.productRepository.findByCode(item.code)

      if(!product) {
        throw new ErrorHandler(`Produk dengan kode ${item.code} tidak ditemukan`, 404, "NOT_FOUND")
      }

      if (item.quantity < 1) {
        throw new ErrorHandler(`Jumlah quantity untuk produk ${item.code} minimal 1`, 400, "BAD_REQUEST")
      }

      const subTotal = product.price * item.quantity
      grandTotal += subTotal

      result.push({
        code: product.code,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subTotal
      })
    }

    return {
      items: result,
      grandTotal
    }
  }
}