import { Request, Response } from "express";
import { StoreService } from "./store.service";

export class StoreController {
  private service: StoreService;

  constructor() {
    this.service = new StoreService();
  }

  register = async (req: Request, res: Response) => {
    const result = await this.service.register(req.body);

    res.status(201).json({
      success: true,
      message: "Store berhasil dibuat",
      data: result,
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await this.service.login(email, password);

    res.json({
      success: true,
      message: "Login berhasil",
      data: result,
    });
  };
}