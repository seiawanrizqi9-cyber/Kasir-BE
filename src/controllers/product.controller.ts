import { Response, NextFunction } from "express";
import { ProductService } from "@/services/product.service";
import { ResponseUtil } from "@/utils/response";
import { AuthRequest } from "@/types";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @swagger
   * /api/products:
   *   get:
   *     tags: [Products]
   *     summary: Get all products with pagination and search
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: categoryId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Paginated products list
   */
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
      };
      const products = await this.productService.getAllProducts(filters);
      return ResponseUtil.success(
        res,
        "Products retrieved successfully",
        products,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Get product by ID
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
   *         description: Product details
   *       404:
   *         description: Product not found
   */
  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.getProductById(id);
      return ResponseUtil.success(
        res,
        "Product retrieved successfully",
        product,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products:
   *   post:
   *     tags: [Products]
   *     summary: Create new product (Admin only)
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
   *               - price
   *               - categoryId
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               cost:
   *                 type: number
   *               stock:
   *                 type: integer
   *               barcode:
   *                 type: string
   *               image:
   *                 type: string
   *               categoryId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Product created
   */
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.createProduct(req.body);
      return ResponseUtil.created(res, "Product created successfully", product);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     tags: [Products]
   *     summary: Update product (Admin only)
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
   *               price:
   *                 type: number
   *               cost:
   *                 type: number
   *               stock:
   *                 type: integer
   *               barcode:
   *                 type: string
   *               image:
   *                 type: string
   *               categoryId:
   *                 type: string
   *               isActive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Product updated
   */
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.updateProduct(id, req.body);
      return ResponseUtil.success(res, "Product updated successfully", product);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     tags: [Products]
   *     summary: Soft delete product (Admin only)
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
   *         description: Product deleted
   */
  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await this.productService.deleteProduct(id);
      return ResponseUtil.success(res, "Product deleted successfully");
    } catch (error) {
      return next(error);
    }
  };
}
