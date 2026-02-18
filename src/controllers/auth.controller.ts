import { Response, NextFunction } from "express";
import { AuthService } from "#/services/auth.service";
import { ResponseUtil } from "#/utils/response";
import { AuthRequest } from "#/types";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new user
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *               role:
   *                 type: string
   *                 enum: [ADMIN, CASHIER]
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Email already registered
   */
  register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      return ResponseUtil.created(res, "User registered successfully", result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [Authentication]
   *     summary: Login user
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      return ResponseUtil.success(res, "Login successful", result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     tags: [Authentication]
   *     summary: Get current user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user data
   *       401:
   *         description: Unauthorized
   */
  getCurrentUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }
      const user = await this.authService.getCurrentUser(req.user.id);
      return ResponseUtil.success(res, "User data retrieved", user);
    } catch (error) {
      return next(error);
    }
  };
}
