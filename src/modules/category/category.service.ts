import { CategoryRepository } from "./category.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";

export class CategoryService {
  private repo = new CategoryRepository();

  create(data: { name: string; description?: string; storeId: string }) {
    return this.repo.create(data);
  }

  getAll(storeId: string) {
    return this.repo.findAllByStore(storeId);
  }

  async delete(id: string) {
    const category = await this.repo.findById(id);
    if (!category) throw new ErrorHandler("Category not found", 404);

    return this.repo.delete(id);
  }
}
