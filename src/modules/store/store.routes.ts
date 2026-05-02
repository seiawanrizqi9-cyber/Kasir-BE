import { Router } from "express";
import { StoreController } from "./store.controller";

const router = Router();
const controller = new StoreController();

router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;