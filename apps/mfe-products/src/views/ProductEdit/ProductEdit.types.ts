import type { ProductCategory } from '@portfolio/shared-types';
import type { z } from 'zod';

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  'electronics',
  'clothing',
  'food',
  'books',
  'other',
] as const;

export interface ProductFormValues {
  readonly name: string;
  readonly description: string;
  readonly category: ProductCategory;
  readonly price: number;
  readonly stock: number;
}

export type ProductSchema = z.ZodObject<{
  name: z.ZodString;
  description: z.ZodString;
  category: z.ZodEnum<[ProductCategory, ...ProductCategory[]]>;
  price: z.ZodNumber;
  stock: z.ZodNumber;
}>;
