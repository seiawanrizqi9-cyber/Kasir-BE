import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ResponseUtil } from "#/utils/response";

interface JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return ResponseUtil.unauthorized(res, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return ResponseUtil.unauthorized(res, "Invalid token format");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return ResponseUtil.unauthorized(res, "Invalid or expired token");
  }
};
