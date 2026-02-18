import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    description: z.string().optional(),
    price: z.number().positive("Price must be a positive number"),
    cost: z
      .number()
      .nonnegative("Cost must be a non-negative number")
      .optional()
      .default(0),
    stock: z
      .number()
      .int()
      .nonnegative("Stock must be a non-negative integer")
      .optional()
      .default(0),
    barcode: z.string().optional(),
    image: z.string().url("Invalid image URL").optional(),
    categoryId: z.string().uuid("Invalid category ID"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    cost: z
      .number()
      .nonnegative("Cost must be a non-negative number")
      .optional(),
    stock: z
      .number()
      .int()
      .nonnegative("Stock must be a non-negative integer")
      .optional(),
    barcode: z.string().optional(),
    image: z.string().url("Invalid image URL").optional(),
    categoryId: z.string().uuid("Invalid category ID").optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});
