import { CategoryRepository } from "#/modules/category/category.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";

export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new ErrorHandler("Kategori tidak ditemukan", 404);
    }

    return category;
  }

  async createCategory(data: { name: string; description?: string }) {
    const existing = await this.categoryRepository.findByName(data.name);

    if (existing) {
      throw new ErrorHandler("Nama kategori sudah digunakan", 400);
    }

    return this.categoryRepository.create(data);
  }

  async updateCategory(
    id: string,
    data: { name?: string; description?: string },
  ) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new ErrorHandler("Kategori tidak ditemukan", 404);
    }

    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepository.findByName(data.name);

      if (existing) {
        throw new ErrorHandler("Nama kategori sudah digunakan", 400);
      }
    }

    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new ErrorHandler("Kategori tidak ditemukan", 404);
    }

    // 🔥 proteksi penting
    if ((category as any)._count?.products > 0) {
      throw new ErrorHandler(
        "Tidak bisa menghapus kategori yang masih memiliki produk",
        400,
      );
    }

    return this.categoryRepository.delete(id);
  }
}
