import { Request, Response, NextFunction } from "express";
import { CategoryService } from "#/services/category.service";
import { ResponseUtil } from "#/utils/response";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     tags: [Categories]
   *     summary: Ambil semua kategori
   *     responses:
   *       200:
   *         description: Daftar kategori
   */
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return ResponseUtil.success(res, "Kategori berhasil diambil", categories);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Ambil kategori berdasarkan ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Detail kategori
   *       404:
   *         description: Kategori tidak ditemukan
   */
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

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     tags: [Categories]
   *     summary: Tambah kategori baru
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Kategori berhasil ditambahkan
   */
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

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     tags: [Categories]
   *     summary: Update kategori
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Kategori berhasil diupdate
   */
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

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     tags: [Categories]
   *     summary: Hapus kategori
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Kategori berhasil dihapus
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(req.params["id"] as string);
      return ResponseUtil.success(res, "Kategori berhasil dihapus");
    } catch (error) {
      return next(error);
    }
  };
}
