import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildBaseApp, cookieHeader, signTestToken } from '../../test/helpers';

import { productsRoutes } from './products.routes';

import type { ProductsService } from '../../services/products/products.service.types';
import type { Product } from '@portfolio/shared-types';
import type { FastifyInstance } from 'fastify';

const TEST_PRODUCT_UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

const mockProduct: Product = {
  id: TEST_PRODUCT_UUID,
  name: 'Widget A',
  description: 'A great widget',
  price: 29.99,
  category: 'electronics',
  stock: 100,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

function createMockProductsService(overrides: Partial<ProductsService> = {}): ProductsService {
  return {
    getProducts: vi.fn(async () => ({
      data: [mockProduct],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    })),
    getProduct: vi.fn(async () => mockProduct),
    createProduct: vi.fn(async () => mockProduct),
    updateProduct: vi.fn(async () => mockProduct),
    deleteProduct: vi.fn(async () => true),
    ...overrides,
  };
}

describe('Products Routes', () => {
  let app: FastifyInstance;
  let productsService: ProductsService;

  beforeEach(async () => {
    productsService = createMockProductsService();
    app = await buildBaseApp();
    await app.register(productsRoutes, { productsService });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  function adminToken(): string {
    return signTestToken(app, { sub: 'user-1', role: 'admin' });
  }

  function viewerToken(): string {
    return signTestToken(app, { sub: 'user-2', role: 'viewer' });
  }

  describe('GET /api/products', () => {
    it('returns 200 with products when authenticated', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/products',
        headers: { cookie: cookieHeader(adminToken()) },
      });
      expect(res.statusCode).toBe(200);
      const body = res.json<{ data: Product[] }>();
      expect(body.data).toHaveLength(1);
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/products' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns 200 with product when found', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/products/${TEST_PRODUCT_UUID}`,
        headers: { cookie: cookieHeader(adminToken()) },
      });
      expect(res.statusCode).toBe(200);
    });

    it('returns 404 when product not found', async () => {
      productsService = createMockProductsService({ getProduct: vi.fn(async () => null) });
      app = await buildBaseApp();
      await app.register(productsRoutes, { productsService });
      await app.ready();

      const token = signTestToken(app, { sub: 'user-1' });
      const res = await app.inject({
        method: 'GET',
        url: `/api/products/${'a'.repeat(8)}-${'b'.repeat(4)}-${'c'.repeat(4)}-${'d'.repeat(4)}-${'e'.repeat(12)}`,
        headers: { cookie: cookieHeader(token) },
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/products', () => {
    const newProduct = {
      name: 'New Widget',
      description: 'Description',
      price: 19.99,
      category: 'electronics',
      stock: 50,
    };

    it('returns 201 for admin user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: cookieHeader(adminToken()) },
        payload: newProduct,
      });
      expect(res.statusCode).toBe(201);
    });

    it('returns 403 for viewer user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: cookieHeader(viewerToken()) },
        payload: newProduct,
      });
      expect(res.statusCode).toBe(403);
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        payload: newProduct,
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('returns 200 for admin user', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: `/api/products/${TEST_PRODUCT_UUID}`,
        headers: { cookie: cookieHeader(adminToken()) },
        payload: { name: 'Updated Widget' },
      });
      expect(res.statusCode).toBe(200);
    });

    it('returns 403 for viewer user', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: `/api/products/${TEST_PRODUCT_UUID}`,
        headers: { cookie: cookieHeader(viewerToken()) },
        payload: { name: 'Updated' },
      });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('returns 200 for admin user', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: `/api/products/${TEST_PRODUCT_UUID}`,
        headers: { cookie: cookieHeader(adminToken()) },
      });
      expect(res.statusCode).toBe(200);
    });

    it('returns 404 when product not found', async () => {
      productsService = createMockProductsService({ deleteProduct: vi.fn(async () => false) });
      app = await buildBaseApp();
      await app.register(productsRoutes, { productsService });
      await app.ready();

      const token = signTestToken(app, { sub: 'user-1', role: 'admin' });
      const res = await app.inject({
        method: 'DELETE',
        url: `/api/products/${TEST_PRODUCT_UUID}`,
        headers: { cookie: cookieHeader(token) },
      });
      expect(res.statusCode).toBe(404);
    });
  });
});
