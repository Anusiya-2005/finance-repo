import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['Viewer', 'Analyst', 'Admin']),
  isActive: z.boolean().optional(),
});

export const recordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }).transform((val) => new Date(val)),
  notes: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
});
