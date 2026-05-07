/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

import { Router } from "express";

import { requireStore } from "#/middlewares/requireStore.middleware";
import { authMiddleware } from "#/modules/auth/auth.middleware";

import { ProductController } from "./product.controller";

const router = Router();
const controller = new ProductController();

router.use(authMiddleware, requireStore);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product
 *     tags: [Products]
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
 *               - code
 *               - codeType
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Indomie Goreng
 *               code:
 *                 type: string
 *                 example: 8992388112233
 *               codeType:
 *                 type: string
 *                 enum: [INTERNAL, BARCODE]
 *               price:
 *                 type: number
 *                 example: 3500
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", controller.create);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search by product name
 *         example: indomie
 *     responses:
 *       200:
 *         description: Product list fetched successfully
 */
router.get("/search", controller.search);

/**
 * @swagger
 * /products/code/{code}:
 *   get:
 *     summary: Find product by barcode or serial number
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: 8992388112233
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/code/:code", controller.findByCode);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", controller.delete);

export default router;
