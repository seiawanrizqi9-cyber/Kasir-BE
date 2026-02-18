import { Response } from "express";
import { ApiResponse } from "@/types";

export class ResponseUtil {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    errors?: any,
    statusCode: number = 400,
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, message: string, data?: T) {
    return this.success(res, message, data, 201);
  }

  static unauthorized(res: Response, message: string = "Unauthorized") {
    return this.error(res, message, null, 401);
  }

  static forbidden(res: Response, message: string = "Forbidden") {
    return this.error(res, message, null, 403);
  }

  static notFound(res: Response, message: string = "Resource not found") {
    return this.error(res, message, null, 404);
  }

  static serverError(
    res: Response,
    message: string = "Internal server error",
    errors?: any,
  ) {
    return this.error(res, message, errors, 500);
  }
}
