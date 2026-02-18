import { Response, NextFunction } from "express";
import { JwtUtil } from "#/utils/jwt";
import { ResponseUtil } from "#/utils/response";
import { AuthRequest } from "#/types";
import { Role } from "@prisma/client";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ResponseUtil.unauthorized(res, "No token provided");
      return;
    }

    const token = authHeader.substring(7);
    const decoded = JwtUtil.verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role as Role,
    };

    next();
  } catch (error) {
    ResponseUtil.unauthorized(res, "Invalid or expired token");
    return;
  }
};

export const authorize = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtil.unauthorized(res, "Authentication required");
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ResponseUtil.forbidden(
        res,
        "You do not have permission to access this resource",
      );
      return;
    }

    next();
  };
};
