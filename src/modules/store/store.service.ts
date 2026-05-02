import { StoreRepository } from "./store.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class StoreService {
  private repo = new StoreRepository();

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new ErrorHandler("Email already registered", 400);
    }

    const hashed = await bcrypt.hash(data.password, 10);

    return this.repo.create({
      ...data,
      password: hashed,
    });
  }

  async login(data: { email: string; password: string }) {
    const store = await this.repo.findByEmail(data.email);
    if (!store) throw new ErrorHandler("Store not found", 404);

    const isMatch = await bcrypt.compare(data.password, store.password);
    if (!isMatch) throw new ErrorHandler("Invalid password", 401);

    const token = jwt.sign({ id: store.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return { token };
  }

  async getById(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new ErrorHandler("Store not found", 404);
    return store;
  }
}
