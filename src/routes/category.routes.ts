import { Router } from "express";
import { CategoryController } from "#/controllers/category.controller";
import { validate } from "#/middlewares/validation.middleware";
import { authenticate, authorize } from "#/middlewares/auth.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} from "#/validators/category.validator";
import { Role } from "@prisma/client";

const router = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

// All routes require authentication
router.use(authenticate);

router.get("/", categoryController.getAll);
router.get("/:id", validate(getCategorySchema), categoryController.getById);

// Admin only routes
router.post(
  "/",
  authorize([Role.ADMIN]),
  validate(createCategorySchema),
  categoryController.create,
);

router.put(
  "/:id",
  authorize([Role.ADMIN]),
  validate(updateCategorySchema),
  categoryController.update,
);

router.delete(
  "/:id",
  authorize([Role.ADMIN]),
  validate(getCategorySchema),
  categoryController.delete,
);

export default router;
