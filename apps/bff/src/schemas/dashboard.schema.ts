import { z } from 'zod';

export const salesQuerySchema = z.object({
  range: z.enum(['7d', '30d', '90d']).default('30d'),
});

export const ordersQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type SalesQuery = z.infer<typeof salesQuerySchema>;
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
