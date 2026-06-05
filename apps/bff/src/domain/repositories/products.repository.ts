import { and, count, eq, ilike } from 'drizzle-orm';

import { products } from '../schema';

import type { ProductRepo } from '../../services/products/products.service.types';
import type { Database } from '../db';
import type { DbProduct, NewDbProduct } from '../schema';
import type { ProductCategory } from '@portfolio/shared-types';

export function createProductsRepository(db: Database): ProductRepo {
  return {
    async findAll({ page, pageSize, search, category }) {
      const conditions = [];
      if (search !== undefined) {
        conditions.push(ilike(products.name, `%${search}%`));
      }
      if (category !== undefined) {
        conditions.push(eq(products.category, category));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [rows, [countResult]] = await Promise.all([
        db
          .select()
          .from(products)
          .where(where)
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.select({ count: count() }).from(products).where(where),
      ]);

      return { rows, total: Number(countResult?.count ?? 0) };
    },

    async findById(id: string) {
      const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
      return result[0] ?? null;
    },

    async insert(data: NewDbProduct) {
      const result = await db.insert(products).values(data).returning();
      const created = result[0];
      if (created === undefined) throw new Error('Failed to insert product');
      return created;
    },

    async update(id: string, data: Partial<NewDbProduct>) {
      const result = await db
        .update(products)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();
      return (result[0] as DbProduct | undefined) ?? null;
    },

    async remove(id: string) {
      const result = await db.delete(products).where(eq(products.id, id)).returning();
      return result.length > 0;
    },
  };
}

export function createProductsRepositoryForCategory(_category: ProductCategory): ProductRepo {
  throw new Error('Not implemented — use createProductsRepository with a category filter');
}
