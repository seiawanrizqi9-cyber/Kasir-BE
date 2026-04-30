import { z } from "zod";

// ENUM harus sama dengan Prisma
export const codeTypeEnum = z.enum(["INTERNAL", "BARCODE"]);

// Create Product
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama produk wajib diisi"),
    code: z.string().min(1, "Code wajib diisi"),
    codeType: codeTypeEnum,
    price: z.number().int().positive("Harga harus lebih dari 0"),
    categoryId: z.string().uuid("Category ID harus UUID"),
  }),
});

// Update Product
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    codeType: codeTypeEnum.optional(),
    price: z.number().int().positive().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

// Get by ID
export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

// Get by CODE (ini penting untuk kasir 🔥)
export const getByCodeSchema = z.object({
  params: z.object({
    code: z.string().min(1),
  }),
});

// List + filter
export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

// Calculate (fitur utama kasir 💰)
export const calculateSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        code: z.string().min(1),
        qty: z.number().int().min(1),
      }),
    ),
  }),
});