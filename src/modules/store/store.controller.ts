import { Request, Response, NextFunction } from "express";
import { StoreService } from "./store.service";
import { ResponseUtil } from "#/utils/response";

export class StoreController {
  private service = new StoreService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.register(req.body);
      ResponseUtil.success(res, "Store registered", result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body);
      ResponseUtil.success(res, "Login success", result);
    } catch (err) {
      next(err);
    }
  };

  getJoinCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.storeId;
      if (!storeId) throw new Error("User not in store");

      const result = await this.service.getJoinCode(storeId);

      ResponseUtil.success(res, "Join code fetched", result);
    } catch (err) {
      next(err);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.storeId;
      if (!storeId) throw new Error("User not in store");

      const result = await this.service.getById(storeId);
      ResponseUtil.success(res, "Store fetched", result);
    } catch (err) {
      next(err);
    }
  };
}
