import { Router } from "express";
import { ProductController } from "#/modules/product/product.controller";
import { validate } from "#/middlewares/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getBySerialSchema,
  listProductsSchema,
  calculateSchema,
} from "#/modules/product/product.validator";

const router = Router();
const productController = new ProductController();

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
 *     summary: Ambil semua produk (dengan pagination & pencarian)
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
 *           format: uuid
 *     responses:
 *       200:
 *         description: Daftar produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/", validate(listProductsSchema), productController.getAll);

/**
 * @swagger
 * /api/products/calculate:
 *   post:
 *     tags: [Products]
 *     summary: Hitung total harga otomatis dari daftar nomor seri
 *     description: Kirim daftar nomor seri beserta jumlahnya, API akan mengembalikan detail harga dan grand total secara otomatis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - serialNumber
 *                     - qty
 *                   properties:
 *                     serialNumber:
 *                       type: string
 *                     qty:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       200:
 *         description: Hasil perhitungan total harga
 */
router.post(
  "/calculate",
  validate(calculateSchema),
  productController.calculate,
);

/**
 * @swagger
 * /api/products/serial/{serialNumber}:
 *   get:
 *     tags: [Products]
 *     summary: Ambil produk berdasarkan nomor seri
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Nomor seri unik produk
 *     responses:
 *       200:
 *         description: Detail produk ditemukan
 *       404:
 *         description: Produk tidak ditemukan
 */
router.get(
  "/serial/:serialNumber",
  validate(getBySerialSchema),
  productController.getBySerialNumber,
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Ambil produk berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detail produk
 *       404:
 *         description: Produk tidak ditemukan
 */
router.get("/:id", validate(getProductSchema), productController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Tambah produk baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - serialNumber
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
 */
router.post("/", validate(createProductSchema), productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update produk
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
 */
router.put("/:id", validate(updateProductSchema), productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Hapus produk
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 */
router.delete("/:id", validate(getProductSchema), productController.delete);

export default router;
