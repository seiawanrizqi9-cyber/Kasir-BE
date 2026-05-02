import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "#modules/auth/auth.middleware";

const router = Router();
const controller = new UserController();

router.use(authMiddleware);

router.post("/join", controller.joinStore);
router.get("/", controller.getUsers);

export default router;
