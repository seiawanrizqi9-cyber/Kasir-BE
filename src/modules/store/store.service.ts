import { StoreRepository } from "./store.repository";
import { ErrorHandler } from "#/middlewares/error.middleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class StoreService {
  private storeRepository: StoreRepository;

  constructor() {
    this.storeRepository = new StoreRepository();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const existing = await this.storeRepository.findByEmail(data.email);

    if (existing) {
      throw new ErrorHandler("Email sudah digunakan", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const store = await this.storeRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return store;
  }

  async login(email: string, password: string) {
    const store = await this.storeRepository.findByEmail(email);

    if (!store) {
      throw new ErrorHandler("Email tidak ditemukan", 404);
    }

    const isMatch = await bcrypt.compare(password, store.password);

    if (!isMatch) {
      throw new ErrorHandler("Password salah", 400);
    }

    const token = jwt.sign(
      { storeId: store.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return {
      token,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
      },
    };
  }
}