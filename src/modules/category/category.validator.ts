import { z } from "zod";

// Create Category
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    description: z.string().optional(),
  }),
});

// Update Category
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("ID harus berupa UUID"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
});

// Get/Delete by ID
export const getCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("ID harus berupa UUID"),
  }),
});
