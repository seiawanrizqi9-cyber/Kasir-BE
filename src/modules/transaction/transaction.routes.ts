/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management API
 */

import { Router } from "express";

import { authMiddleware } from "#/modules/auth/auth.middleware";
import { requireStore } from "#/middlewares/requireStore.middleware";

import { TransactionController } from "./transaction.controller";

const router = Router();
const controller = new TransactionController();

router.use(authMiddleware, requireStore);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     qty:
 *                       type: number
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
router.post("/", controller.create);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction list fetched
 */
router.get("/", controller.findAll);

export default router;
