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
      throw new ErrorHandler("Product not found", 404);
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    cost?: number;
    stock?: number;
    barcode?: string;
    image?: string;
    categoryId: string;
  }) {
    // Validate category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    // Check if barcode already exists
    if (data.barcode) {
      const existing = await this.productRepository.findByBarcode(data.barcode);
      if (existing) {
        throw new ErrorHandler("Barcode already exists", 400);
      }
    }

    return this.productRepository.create(data);
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      cost?: number;
      stock?: number;
      barcode?: string;
      image?: string;
      categoryId?: string;
      isActive?: boolean;
    },
  ) {
    // Check if product exists
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    // Validate category if provided
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new ErrorHandler("Category not found", 404);
      }
    }

    // Check if barcode is unique
    if (data.barcode && data.barcode !== product.barcode) {
      const existing = await this.productRepository.findByBarcode(data.barcode);
      if (existing) {
        throw new ErrorHandler("Barcode already exists", 400);
      }
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    // Soft delete
    return this.productRepository.delete(id);
  }
}
