import { Response, NextFunction } from "express";
import { TransactionService } from "@/services/transaction.service";
import { ResponseUtil } from "@/utils/response";
import { AuthRequest } from "@/types";
import { PaymentMethod } from "@prisma/client";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * @swagger
   * /api/transactions:
   *   get:
   *     tags: [Transactions]
   *     summary: Get all transactions with filters
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: paymentMethod
   *         schema:
   *           type: string
   *           enum: [CASH, DEBIT, CREDIT, EWALLET]
   *     responses:
   *       200:
   *         description: Paginated transactions list
   */
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        paymentMethod: req.query.paymentMethod as PaymentMethod,
        userId: req.query.userId as string,
      };
      const transactions =
        await this.transactionService.getAllTransactions(filters);
      return ResponseUtil.success(
        res,
        "Transactions retrieved successfully",
        transactions,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/transactions/{id}:
   *   get:
   *     tags: [Transactions]
   *     summary: Get transaction by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Transaction details with items
   *       404:
   *         description: Transaction not found
   */
  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const transaction = await this.transactionService.getTransactionById(id);
      return ResponseUtil.success(
        res,
        "Transaction retrieved successfully",
        transaction,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/transactions:
   *   post:
   *     tags: [Transactions]
   *     summary: Create new transaction
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - paymentMethod
   *               - paymentAmount
   *               - items
   *             properties:
   *               paymentMethod:
   *                 type: string
   *                 enum: [CASH, DEBIT, CREDIT, EWALLET]
   *               paymentAmount:
   *                 type: number
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     productId:
   *                       type: string
   *                     quantity:
   *                       type: integer
   *     responses:
   *       201:
   *         description: Transaction created
   *       400:
   *         description: Insufficient stock or payment
   */
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const transaction = await this.transactionService.createTransaction({
        userId: req.user.id,
        ...req.body,
      });

      return ResponseUtil.created(
        res,
        "Transaction created successfully",
        transaction,
      );
    } catch (error) {
      return next(error);
    }
  };
}
