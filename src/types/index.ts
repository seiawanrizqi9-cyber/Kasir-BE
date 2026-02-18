import { Request } from "express";
import { Role } from "@prisma/client";

// Authenticated user interface
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

// Extend Express Request with user
export interface AuthRequest extends Request {
  user?: AuthUser;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Statistics types
export interface DashboardStats {
  today: {
    sales: number;
    transactions: number;
    profit: number;
  };
  thisWeek: {
    sales: number;
    transactions: number;
    profit: number;
  };
  thisMonth: {
    sales: number;
    transactions: number;
    profit: number;
  };
}

export interface SalesReport {
  date: string;
  totalSales: number;
  totalTransactions: number;
  totalProfit: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalSales: number;
  totalProfit: number;
}
