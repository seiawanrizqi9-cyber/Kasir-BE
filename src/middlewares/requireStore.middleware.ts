import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "#/utils/response";

export const requireStore = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.storeId) {
    return ResponseUtil.error(
      res,
      "Anda harus join ke suatu store terlebih dahulu",
      null,
      400
    );
  }

  next();
};