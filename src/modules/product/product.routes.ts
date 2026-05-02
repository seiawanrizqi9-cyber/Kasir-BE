import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "#modules/auth/auth.middleware";

const router = Router();
const controller = new ProductController();

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/code/:code", controller.findByCode);
router.get("/search", controller.search);
router.delete("/:id", controller.delete);

export default router;
