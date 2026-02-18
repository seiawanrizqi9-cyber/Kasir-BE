import { Router } from "express";
import { TransactionController } from "@/controllers/transaction.controller";
import { validate } from "@/middlewares/validation.middleware";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  createTransactionSchema,
  getTransactionSchema,
  listTransactionsSchema,
} from "@/validators/transaction.validator";

const router = Router();
const transactionController = new TransactionController();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management endpoints
 */

// All routes require authentication
router.use(authenticate);

router.get("/", validate(listTransactionsSchema), transactionController.getAll);
router.get(
  "/:id",
  validate(getTransactionSchema),
  transactionController.getById,
);
router.post(
  "/",
  validate(createTransactionSchema),
  transactionController.create,
);

export default router;
