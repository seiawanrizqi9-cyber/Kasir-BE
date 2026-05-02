import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authMiddleware } from "#modules/auth/auth.middleware";

const router = Router();
const controller = new CategoryController();

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.delete("/:id", controller.delete);

export default router;
