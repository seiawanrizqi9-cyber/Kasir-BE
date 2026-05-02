import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authMiddleware } from "#/middlewares/auth.middleware";

const router = Router();
const controller = new TransactionController();

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.getAll);

export default router;