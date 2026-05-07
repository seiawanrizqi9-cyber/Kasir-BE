import { Request, Response, NextFunction } from "express";
import { TransactionService } from "./transaction.service";
import { ResponseUtil } from "#/utils/response";

export class TransactionController {
  private service = new TransactionService();

  /**
   * 🔥 checkout / bayar
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.storeId!;

      const result = await this.service.create({
        storeId,
        items: req.body.items,
      });

      ResponseUtil.success(res, "Transaction created", result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * 📊 riwayat transaksi
   */
  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.storeId!;

      const result = await this.service.findAll(storeId);

      ResponseUtil.success(res, "Transactions fetched", result);
    } catch (err) {
      next(err);
    }
  };
}