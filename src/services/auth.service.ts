import bcrypt from "bcrypt";
import { UserRepository } from "#/repositories/user.repository";
import { JwtUtil } from "#/utils/jwt";
import { Role } from "@prisma/client";
import { ErrorHandler } from "#/middlewares/error.middleware";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ErrorHandler("Email already registered", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate token
    const token = JwtUtil.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ErrorHandler("Invalid email or password", 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ErrorHandler("User account is inactive", 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorHandler("Invalid email or password", 401);
    }

    // Generate token
    const token = JwtUtil.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
