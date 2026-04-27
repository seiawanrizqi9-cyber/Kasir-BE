import { Request, Response, NextFunction } from "express";
import { CategoryService } from "#/modules/category/category.service";
import { ResponseUtil } from "#/utils/response";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return ResponseUtil.success(res, "Kategori berhasil diambil", categories);
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params["id"] as string,
      );
      return ResponseUtil.success(res, "Kategori berhasil diambil", category);
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(
        req.body as { name: string; description?: string },
      );
      return ResponseUtil.created(
        res,
        "Kategori berhasil ditambahkan",
        category,
      );
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.updateCategory(
        req.params["id"] as string,
        req.body as { name?: string; description?: string },
      );
      return ResponseUtil.success(res, "Kategori berhasil diupdate", category);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(req.params["id"] as string);
      return ResponseUtil.success(res, "Kategori berhasil dihapus");
    } catch (error) {
      return next(error);
    }
  };
}
