import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const checkoutSchema = z.object({
  txHash: z.string().min(1, "Transaction hash is required"),
  totalAmount: z.number().or(z.string().transform(Number)),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1, "At least one item is required"),
  address: z.any() // Can be refined later if needed
});
