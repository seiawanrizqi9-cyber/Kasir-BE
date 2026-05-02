import { StoreRepository } from "./store.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";
import bcrypt from "bcrypt";

export class StoreService {
  private repo = new StoreRepository();

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
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

  async getById(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new ErrorHandler("Store not found", 404);
    return store;
  }
}