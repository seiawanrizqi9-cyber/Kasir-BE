import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "@/utils/response";

export class ErrorHandler extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number = 500, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (
  err: Error | ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ErrorHandler) {
    return ResponseUtil.error(res, err.message, err.errors, err.statusCode);
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    return ResponseUtil.error(res, "Database error occurred", err.message, 400);
  }

  // Validation errors
  if (err.name === "ZodError") {
    return ResponseUtil.error(res, "Validation error", err, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return ResponseUtil.unauthorized(res, "Invalid or expired token");
  }

  // Default server error
  console.error("Unhandled error:", err);
  return ResponseUtil.serverError(
    res,
    "Internal server error",
    process.env.NODE_ENV === "development" ? err.message : undefined,
  );
};
