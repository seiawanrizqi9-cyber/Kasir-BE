import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { ResponseUtil } from "#/utils/response";

export class UserController {
  private service = new UserService();

  joinStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.userId;
      const { code } = req.body;

      const result = await this.service.joinStoreByCode(userId, code);

      ResponseUtil.success(res, "Joined store", result);
    } catch (err) {
      next(err);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.storeId;

      const result = await this.service.getMyStoreUsers(storeId);

      ResponseUtil.success(res, "Users fetched", result);
    } catch (err) {
      next(err);
    }
  };
}