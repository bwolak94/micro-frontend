import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createProductsService } from './products.service';

import type { ProductRepo } from './products.service.types';
import type { DbProduct } from '../../domain/schema';
import type { ProductCategory } from '@portfolio/shared-types';

function makeDbProduct(overrides: Partial<DbProduct> = {}): DbProduct {
  return {
    id: 'prod-1',
    name: 'Widget A',
    description: 'A great widget',
    price: 29.99,
    category: 'electronics',
    stock: 100,
    imageUrl: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}

function createMockProductRepo(initial: DbProduct[] = []): ProductRepo {
  const store: DbProduct[] = [...initial];
  return {
    findAll: vi.fn(async ({ page, pageSize, search, category }) => {
      let rows = [...store];
      if (search !== undefined) {
        rows = rows.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      }
      if (category !== undefined) {
        rows = rows.filter((p) => p.category === category);
      }
      const start = (page - 1) * pageSize;
      return { rows: rows.slice(start, start + pageSize), total: rows.length };
    }),
    findById: vi.fn(async (id) => store.find((p) => p.id === id) ?? null),
    insert: vi.fn(async (data) => {
      const product: DbProduct = {
        id: `prod-${Date.now()}`,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock ?? 0,
        imageUrl: data.imageUrl ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.push(product);
      return product;
    }),
    update: vi.fn(async (id, data) => {
      const idx = store.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      const existing = store[idx];
      if (existing === undefined) return null;
      const updated: DbProduct = { ...existing, ...data, updatedAt: new Date() };
      store[idx] = updated;
      return updated;
    }),
    remove: vi.fn(async (id) => {
      const idx = store.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      store.splice(idx, 1);
      return true;
    }),
  };
}

describe('ProductsService', () => {
  let productRepo: ProductRepo;

  beforeEach(() => {
    productRepo = createMockProductRepo([
      makeDbProduct({ id: 'prod-1', name: 'Widget A', category: 'electronics' }),
      makeDbProduct({ id: 'prod-2', name: 'Book B', category: 'books' }),
    ]);
  });

  it('returns paginated products', async () => {
    const service = createProductsService(productRepo);
    const result = await service.getProducts({ page: 1, pageSize: 10 });
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
  });

  it('filters products by search term', async () => {
    const service = createProductsService(productRepo);
    const result = await service.getProducts({ page: 1, pageSize: 10, search: 'Widget' });
    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.name).toBe('Widget A');
  });

  it('filters products by category', async () => {
    const service = createProductsService(productRepo);
    const result = await service.getProducts({
      page: 1,
      pageSize: 10,
      category: 'books' as ProductCategory,
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.category).toBe('books');
  });

  it('returns product by id', async () => {
    const service = createProductsService(productRepo);
    const product = await service.getProduct('prod-1');
    expect(product).not.toBeNull();
    expect(product?.id).toBe('prod-1');
  });

  it('returns null for unknown id', async () => {
    const service = createProductsService(productRepo);
    const product = await service.getProduct('nonexistent');
    expect(product).toBeNull();
  });

  it('creates a product', async () => {
    const service = createProductsService(productRepo);
    const created = await service.createProduct({
      name: 'New Product',
      description: 'Desc',
      price: 9.99,
      category: 'food' as ProductCategory,
      stock: 50,
    });
    expect(created.name).toBe('New Product');
    expect(created.price).toBe(9.99);
  });

  it('updates a product', async () => {
    const service = createProductsService(productRepo);
    const updated = await service.updateProduct('prod-1', { name: 'Updated Widget' });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Updated Widget');
  });

  it('deletes a product', async () => {
    const service = createProductsService(productRepo);
    const result = await service.deleteProduct('prod-1');
    expect(result).toBe(true);
    expect(await service.getProduct('prod-1')).toBeNull();
  });
});
