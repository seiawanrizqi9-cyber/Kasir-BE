import { Router } from "express";
import { ProductController } from "#/controllers/product.controller";
import { validate } from "#/middlewares/validation.middleware";
import { authenticate, authorize } from "#/middlewares/auth.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  listProductsSchema,
} from "#/validators/product.validator";
import { Role } from "@prisma/client";

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

// All routes require authentication
router.use(authenticate);

router.get("/", validate(listProductsSchema), productController.getAll);
router.get("/:id", validate(getProductSchema), productController.getById);

// Admin only routes
router.post(
  "/",
  authorize([Role.ADMIN]),
  validate(createProductSchema),
  productController.create,
);

router.put(
  "/:id",
  authorize([Role.ADMIN]),
  validate(updateProductSchema),
  productController.update,
);

router.delete(
  "/:id",
  authorize([Role.ADMIN]),
  validate(getProductSchema),
  productController.delete,
);

export default router;
