/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

import { Router } from "express";

import { authMiddleware } from "#/modules/auth/auth.middleware";
import { requireStore } from "#/middlewares/requireStore.middleware";

import { UserController } from "./user.controller";

const router = Router();
const controller = new UserController();

router.use(authMiddleware);

/**
 * @swagger
 * /users/join:
 *   post:
 *     summary: Join store using join code
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: cmabc123xyz
 *     responses:
 *       200:
 *         description: Successfully joined store
 */
router.post("/join", controller.joinStore);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users in current store
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list fetched
 */
router.get("/", requireStore, controller.getUsers);

export default router;
