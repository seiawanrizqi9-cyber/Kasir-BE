import { Router } from "express";
import { ProductController } from "./product.controller";
import { validate } from "#/middlewares/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getByCodeSchema,
  listProductsSchema,
  calculateSchema,
} from "./product.validator";

const router = Router();
const controller = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Manajemen produk kasir
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Ambil semua produk
 */
router.get("/", validate(listProductsSchema), controller.getAll);

/**
 * @swagger
 * /api/products/code/{code}:
 *   get:
 *     tags: [Products]
 *     summary: Ambil produk berdasarkan code (barcode / internal)
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/code/:code", validate(getByCodeSchema), controller.getByCode);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Ambil produk berdasarkan ID
 */
router.get("/:id", validate(getProductSchema), controller.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Tambah produk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, codeType, price, categoryId]
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               codeType:
 *                 type: string
 *                 enum: [INTERNAL, BARCODE]
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 */
router.post("/", validate(createProductSchema), controller.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update produk
 */
router.put("/:id", validate(updateProductSchema), controller.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Hapus produk
 */
router.delete("/:id", validate(getProductSchema), controller.delete);

/**
 * 🔥 FITUR UTAMA KASIR
 */
/**
 * @swagger
 * /api/products/calculate:
 *   post:
 *     tags: [Products]
 *     summary: Hitung total belanja dari scan barcode
 *     description: Input daftar code + qty → auto hitung total
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     qty:
 *                       type: number
 *     responses:
 *       200:
 *         description: Hasil perhitungan total belanja
 */
router.post("/calculate", validate(calculateSchema), controller.calculate);

export default router;
