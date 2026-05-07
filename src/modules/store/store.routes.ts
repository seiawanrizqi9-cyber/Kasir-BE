import { Router } from "express";
import { StoreController } from "./store.controller";
import { authMiddleware } from "#/modules/auth/auth.middleware";

const router = Router();
const controller = new StoreController();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/join-code", authMiddleware, controller.getJoinCode);

export default router;