import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { ResponseUtil } from "#/utils/response";
import { ErrorHandler } from "#middlewares/error.middleware";

export class ProductController {
  private service = new ProductService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user.id;

      const result = await this.service.create({
        ...req.body,
        storeId,
      });

      ResponseUtil.success(res, "Product created", result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * 🔥 endpoint scan barcode
   */
  findByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const storeId = req.user.id;
      if (typeof code !== "string") throw new ErrorHandler("Invalid Code", 400);

      const result = await this.service.findByCode(code, storeId);

      ResponseUtil.success(res, "Product found", result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * 🔍 search by name
   */
  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query;
      const storeId = req.user.id;

      const result = await this.service.searchByName(String(name), storeId);

      ResponseUtil.success(res, "Products fetched", result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string") throw new ErrorHandler("Invalid ID", 400);

      await this.service.delete(id);
      ResponseUtil.success(res, "Product deleted");
    } catch (err) {
      next(err);
    }
  };
}
