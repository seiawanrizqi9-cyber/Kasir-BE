import { Request, Response, NextFunction } from "express";

import { ResponseUtil } from "#/utils/response";

import { AuthService } from "./auth.service";

export class AuthController {
  private service = new AuthService();

  googleLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { idToken } = req.body;

      const result = await this.service.loginWithGoogle(idToken);

      ResponseUtil.success(
        res,
        "Login successful",
        result
      );
    } catch (err) {
      next(err);
    }
  };
}