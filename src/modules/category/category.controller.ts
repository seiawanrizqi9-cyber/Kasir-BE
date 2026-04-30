import { Request, Response } from "express";
import { CategoryService } from "#/modules/category/category.service";

export class CategoryController {
  private service = new CategoryService();

  getAll = async (_req: Request, res: Response) => {
    const categories = await this.service.getAllCategories();

    res.json({
      success: true,
      message: "Daftar kategori",
      data: categories,
    });
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID kategori tidak valid",
      });
    }

    const category = await this.service.getCategoryById(id);

    res.json({
      success: true,
      message: "Kategori ditemukan",
      data: category,
    });
  };

  create = async (req: Request, res: Response) => {
    const category = await this.service.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
      data: category,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID kategori tidak valid",
      });
    }

    const category = await this.service.updateCategory(id, req.body);

    res.json({
      success: true,
      message: "Kategori berhasil diupdate",
      data: category,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID kategori tidak valid",
      });
    }

    await this.service.deleteCategory(id);

    res.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  };
}
