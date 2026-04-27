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

// Ambil semua produk
router.get("/", validate(listProductsSchema), productController.getAll);

// Hitung total harga otomatis (harus sebelum /:id agar tidak konflik)
router.post(
  "/calculate",
  validate(calculateSchema),
  productController.calculate,
);

// Cari produk berdasarkan nomor seri
router.get(
  "/serial/:serialNumber",
  validate(getBySerialSchema),
  productController.getBySerialNumber,
);

// Ambil produk berdasarkan ID
router.get("/:id", validate(getProductSchema), productController.getById);

// Tambah produk baru
router.post("/", validate(createProductSchema), productController.create);

// Update produk
router.put("/:id", validate(updateProductSchema), productController.update);

// Hapus produk
router.delete("/:id", validate(getProductSchema), productController.delete);

export default router;
