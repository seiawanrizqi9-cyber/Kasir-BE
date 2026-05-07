import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "#/auth/auth.middleware";
import { requireStore } from "#/middlewares/requireStore.middleware";

``
const router = Router();
const controller = new ProductController();

router.use(authMiddleware, requireStore);

router.post("/", controller.create);
router.get("/code/:code", controller.findByCode);
router.get("/search", controller.search);
router.delete("/:id", controller.delete);

export default router;
