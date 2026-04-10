import { Router } from "express";
import { CategoryController } from "#/controllers/category.controller";
import { validate } from "#/middlewares/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} from "#/validators/category.validator";

const router = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori barang
 */

router.get("/", categoryController.getAll);
router.get("/:id", validate(getCategorySchema), categoryController.getById);
router.post("/", validate(createCategorySchema), categoryController.create);
router.put("/:id", validate(updateCategorySchema), categoryController.update);
router.delete("/:id", validate(getCategorySchema), categoryController.delete);

export default router;
