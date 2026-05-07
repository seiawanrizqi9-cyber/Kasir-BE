/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management API
 */

import { Router } from "express";

import { requireStore } from "#/middlewares/requireStore.middleware";
import { authMiddleware } from "#/modules/auth/auth.middleware";

import { CategoryController } from "./category.controller";

const router = Router();
const controller = new CategoryController();

router.use(authMiddleware, requireStore);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
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
 *                 example: Minuman
 *               description:
 *                 type: string
 *                 example: Semua produk minuman
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/", controller.create);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category list fetched
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
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
 *         description: Category deleted
 */
router.delete("/:id", controller.delete);

export default router;
