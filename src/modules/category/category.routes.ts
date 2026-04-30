import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validate } from "#/middlewares/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} from "./category.validator";

const router = Router();
const controller = new CategoryController();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori barang
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Ambil semua kategori
 *     responses:
 *       200:
 *         description: Berhasil mengambil kategori
 */
router.get("/", controller.getAll);

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
 *           format: uuid
 */
router.get("/:id", validate(getCategorySchema), controller.getById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Tambah kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */
router.post("/", validate(createCategorySchema), controller.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update kategori
 */
router.put("/:id", validate(updateCategorySchema), controller.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Hapus kategori
 */
router.delete("/:id", validate(getCategorySchema), controller.delete);

export default router;
