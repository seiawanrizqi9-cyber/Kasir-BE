import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nama produk minimal 2 karakter"),
    serialNumber: z.string().min(1, "Nomor seri wajib diisi"),
    price: z.number().positive("Harga harus lebih dari 0"),
    categoryId: z.string().uuid("ID kategori tidak valid"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID produk tidak valid"),
  }),
  body: z.object({
    name: z.string().min(2, "Nama produk minimal 2 karakter").optional(),
    serialNumber: z.string().min(1, "Nomor seri tidak boleh kosong").optional(),
    price: z.number().positive("Harga harus lebih dari 0").optional(),
    categoryId: z.string().uuid("ID kategori tidak valid").optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID produk tidak valid"),
  }),
});

export const getBySerialSchema = z.object({
  params: z.object({
    serialNumber: z.string().min(1, "Nomor seri tidak boleh kosong"),
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

export const calculateSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          serialNumber: z.string().min(1, "Nomor seri tidak boleh kosong"),
          qty: z.number().int().min(1, "Jumlah minimal 1"),
        }),
      )
      .min(1, "Minimal 1 item untuk dihitung"),
  }),
});
