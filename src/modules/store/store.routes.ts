/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management API
 */

import { Router } from "express";

import { authMiddleware } from "#/modules/auth/auth.middleware";
import { requireStore } from "#/middlewares/requireStore.middleware";

import { StoreController } from "./store.controller";

const router = Router();
const controller = new StoreController();

router.use(authMiddleware, requireStore);

/**
 * @swagger
 * /stores/join-code:
 *   get:
 *     summary: Get store join code
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Join code fetched successfully
 */
router.get("/join-code", controller.getJoinCode);

export default router;