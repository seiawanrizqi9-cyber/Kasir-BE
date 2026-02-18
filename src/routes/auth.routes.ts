import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validation.middleware";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { registerSchema, loginSchema } from "@/validators/auth.validator";
import { Role } from "@prisma/client";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

// Public routes
router.post("/login", validate(loginSchema), authController.login);

// Protected routes
router.post(
  "/register",
  authenticate,
  authorize([Role.ADMIN]),
  validate(registerSchema),
  authController.register,
);

router.get("/me", authenticate, authController.getCurrentUser);

export default router;
