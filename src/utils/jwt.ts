import jwt from "jsonwebtoken";
import { AuthUser } from "#/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class JwtUtil {
  static generateToken(user: AuthUser): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Type workaround for jsonwebtoken expiresIn
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as any);
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
