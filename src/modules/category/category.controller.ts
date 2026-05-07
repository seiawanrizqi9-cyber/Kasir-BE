import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { ResponseUtil } from "#/utils/response";
import { ErrorHandler } from "#/middlewares/error.middleware";

export class CategoryController {
  private service = new CategoryService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.storeId;

      const result = await this.service.create({
        ...req.body,
        storeId,
      });

      ResponseUtil.success(res, "Category created", result);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user.storeId;

    if (!storeId) {
      throw new ErrorHandler("Store not found", 400);
    }

    const result = await this.service.findAll(storeId);

    ResponseUtil.success(
      res,
      "Categories fetched successfully",
      result
    );
  } catch (err) {
    next(err);
  }
};

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.storeId;

      const result = await this.service.getAll(storeId!);
      ResponseUtil.success(res, "Categories fetched", result);
    } catch (err) {
      next(err);  
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string") throw new ErrorHandler("Invalid ID", 400);

      await this.service.delete(id);
      ResponseUtil.success(res, "Category deleted");
    } catch (err) {
      next(err);
    }
  };
}
