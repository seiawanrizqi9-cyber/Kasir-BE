import {
  ProductRepository,
  ProductFilters,
} from "#/repositories/product.repository";
import { CategoryRepository } from "#/repositories/category.repository";
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

  async getProductBySerialNumber(serialNumber: string) {
    const product =
      await this.productRepository.findBySerialNumber(serialNumber);
    if (!product) {
      throw new ErrorHandler(
        `Produk dengan nomor seri "${serialNumber}" tidak ditemukan`,
        404,
      );
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    serialNumber: string;
    price: number;
    categoryId: string;
  }) {
    // Validasi kategori ada
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new ErrorHandler("Kategori tidak ditemukan", 404);
    }

    // Cek duplikasi nomor seri
    const existing = await this.productRepository.findBySerialNumber(
      data.serialNumber,
    );
    if (existing) {
      throw new ErrorHandler("Nomor seri sudah digunakan produk lain", 400);
    }

    return this.productRepository.create(data);
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      serialNumber?: string;
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

    if (data.serialNumber && data.serialNumber !== product.serialNumber) {
      const existing = await this.productRepository.findBySerialNumber(
        data.serialNumber,
      );
      if (existing) {
        throw new ErrorHandler("Nomor seri sudah digunakan produk lain", 400);
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

  /**
   * Hitung total harga dari daftar nomor seri + jumlah masing-masing.
   * Mengembalikan detail tiap item dan grand total.
   */
  async calculateTotal(
    items: Array<{ serialNumber: string; qty: number }>,
  ): Promise<{
    items: Array<{
      serialNumber: string;
      name: string;
      category: string;
      price: number;
      qty: number;
      subtotal: number;
    }>;
    grandTotal: number;
  }> {
    const result = [];
    let grandTotal = 0;

    for (const item of items) {
      const product = await this.productRepository.findBySerialNumber(
        item.serialNumber,
      );
      if (!product) {
        throw new ErrorHandler(
          `Produk dengan nomor seri "${item.serialNumber}" tidak ditemukan`,
          404,
        );
      }
      if (item.qty < 1) {
        throw new ErrorHandler(
          `Jumlah untuk "${item.serialNumber}" harus minimal 1`,
          400,
        );
      }

      const subtotal = product.price * item.qty;
      grandTotal += subtotal;

      result.push({
        serialNumber: product.serialNumber,
        name: product.name,
        category: product.category.name,
        price: product.price,
        qty: item.qty,
        subtotal,
      });
    }

    return { items: result, grandTotal };
  }
}
