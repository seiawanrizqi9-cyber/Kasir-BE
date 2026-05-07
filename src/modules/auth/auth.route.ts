/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

import { Router } from "express";
import { AuthController } from "./auth.controller";


const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login using Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: google-id-token
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Invalid Google token
 */
router.post("/google", controller.googleLogin);

export default router;
