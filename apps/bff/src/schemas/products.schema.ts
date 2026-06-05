import { z } from 'zod';

const PRODUCT_CATEGORIES = ['electronics', 'clothing', 'food', 'books', 'other'] as const;

export const productCategorySchema = z.enum(PRODUCT_CATEGORIES);

export const createProductBodySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().positive(),
  category: productCategorySchema,
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
});

export const updateProductBodySchema = createProductBodySchema.partial();

export const productParamsSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
});

export const productsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  category: productCategorySchema.optional(),
});

export type CreateProductBody = z.infer<typeof createProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
export type ProductsQuery = z.infer<typeof productsQuerySchema>;
