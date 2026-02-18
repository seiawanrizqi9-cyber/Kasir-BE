import { CategoryRepository } from "@/repositories/category.repository";
import { ErrorHandler } from "@/middlewares/error.middleware";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }
    return category;
  }

  async createCategory(data: { name: string; description?: string }) {
    // Check if category name already exists
    const existing = await this.categoryRepository.findByName(data.name);
    if (existing) {
      throw new ErrorHandler("Category name already exists", 400);
    }

    return this.categoryRepository.create(data);
  }

  async updateCategory(
    id: string,
    data: { name?: string; description?: string },
  ) {
    // Check if category exists
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    // If updating name, check if it's already taken by another category
    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepository.findByName(data.name);
      if (existing) {
        throw new ErrorHandler("Category name already exists", 400);
      }
    }

    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    // Check if category has products
    const categoryWithCount = (await this.categoryRepository.findById(
      id,
    )) as any;
    if (
      categoryWithCount &&
      categoryWithCount._count &&
      categoryWithCount._count.products > 0
    ) {
      throw new ErrorHandler(
        "Cannot delete category with associated products",
        400,
      );
    }

    return this.categoryRepository.delete(id);
  }
}
