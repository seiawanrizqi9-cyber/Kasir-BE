import { Response, NextFunction } from "express";
import { CategoryService } from "@/services/category.service";
import { ResponseUtil } from "@/utils/response";
import { AuthRequest } from "@/types";

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
   *     summary: Get all categories
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of categories
   */
  getAll = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return ResponseUtil.success(
        res,
        "Categories retrieved successfully",
        categories,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Get category by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Category details
   *       404:
   *         description: Category not found
   */
  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const category = await this.categoryService.getCategoryById(id);
      return ResponseUtil.success(
        res,
        "Category retrieved successfully",
        category,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     tags: [Categories]
   *     summary: Create new category (Admin only)
   *     security:
   *       - bearerAuth: []
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
   *         description: Category created
   *       400:
   *         description: Name already exists
   */
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      return ResponseUtil.created(
        res,
        "Category created successfully",
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
   *     summary: Update category (Admin only)
   *     security:
   *       - bearerAuth: []
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
   *         description: Category updated
   *       404:
   *         description: Category not found
   */
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const category = await this.categoryService.updateCategory(id, req.body);
      return ResponseUtil.success(
        res,
        "Category updated successfully",
        category,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     tags: [Categories]
   *     summary: Delete category (Admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Category deleted
   *       400:
   *         description: Category has products
   *       404:
   *         description: Category not found
   */
  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await this.categoryService.deleteCategory(id);
      return ResponseUtil.success(res, "Category deleted successfully");
    } catch (error) {
      return next(error);
    }
  };
}
