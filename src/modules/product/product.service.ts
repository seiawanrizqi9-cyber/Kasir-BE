import { ProductRepository, ProductFilters } from "./product.repository";
import { CategoryRepository } from "../category/category.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async getAllProducts(filters: ProductFilters) {
    return this.productRepository.findAll(filters);
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ErrorHandler("Produk tidak ditemukan", 404);
    }
    return product;
  }

  // 🔥 FIXED
  async getProductByCode(code: string) {
    const product = await this.productRepository.findByCode(code);
    if (!product) {
      throw new ErrorHandler(
        `Produk dengan code "${code}" tidak ditemukan`,
        404,
      );
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    code: string;
    codeType: "INTERNAL" | "BARCODE";
    price: number;
    categoryId: string;
  }) {
    // cek kategori
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new ErrorHandler("Kategori tidak ditemukan", 404);
    }

    // cek duplikat code
    const existing = await this.productRepository.findByCode(data.code);
    if (existing) {
      throw new ErrorHandler("Code sudah digunakan produk lain", 400);
    }

    return this.productRepository.create(data);
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      code?: string;
      codeType?: "INTERNAL" | "BARCODE";
      price?: number;
      categoryId?: string;
    },
  ) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ErrorHandler("Produk tidak ditemukan", 404);
    }

    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new ErrorHandler("Kategori tidak ditemukan", 404);
      }
    }

    // cek duplikat code saat update
    if (data.code && data.code !== product.code) {
      const existing = await this.productRepository.findByCode(data.code);
      if (existing) {
        throw new ErrorHandler("Code sudah digunakan produk lain", 400);
      }
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ErrorHandler("Produk tidak ditemukan", 404);
    }
    return this.productRepository.delete(id);
  }

  // 🔥 CORE KASIR
  async calculateTotal(items: Array<{ code: string; qty: number }>) {
    const result = [];
    let grandTotal = 0;

    for (const item of items) {
      const product = await this.productRepository.findByCode(item.code);

      if (!product) {
        throw new ErrorHandler(
          `Produk dengan code "${item.code}" tidak ditemukan`,
          404,
        );
      }

      if (item.qty < 1) {
        throw new ErrorHandler(`Qty untuk "${item.code}" minimal 1`, 400);
      }

      const subtotal = product.price * item.qty;
      grandTotal += subtotal;

      result.push({
        code: product.code,
        name: product.name,
        category: product.category.name,
        price: product.price,
        qty: item.qty,
        subtotal,
      });
    }

    return {
      items: result,
      grandTotal,
    };
  }
}
