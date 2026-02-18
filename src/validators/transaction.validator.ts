import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const createTransactionSchema = z.object({
  body: z.object({
    paymentMethod: z.nativeEnum(PaymentMethod),
    paymentAmount: z.number().positive("Payment amount must be positive"),
    items: z
      .array(
        z.object({
          productId: z.string().uuid("Invalid product ID"),
          quantity: z
            .number()
            .int()
            .positive("Quantity must be a positive integer"),
        }),
      )
      .min(1, "At least one item is required"),
  }),
});

export const getTransactionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid transaction ID"),
  }),
});

export const listTransactionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    userId: z.string().uuid().optional(),
  }),
});
