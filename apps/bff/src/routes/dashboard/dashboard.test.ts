import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildBaseApp, cookieHeader, signTestToken } from '../../test/helpers';

import { dashboardRoutes } from './dashboard.routes';

import type {
  DashboardService,
  DashboardMetrics,
} from '../../services/dashboard/dashboard.service.types';
import type { Order } from '@portfolio/shared-types';
import type { FastifyInstance } from 'fastify';

const mockMetrics: DashboardMetrics = {
  totalRevenue: 12500,
  totalOrders: 42,
  totalProducts: 20,
  totalUsers: 5,
};

const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    items: [],
    total: 99.99,
    status: 'delivered',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function createMockDashboardService(overrides: Partial<DashboardService> = {}): DashboardService {
  return {
    getMetrics: vi.fn(async () => mockMetrics),
    getSalesData: vi.fn(async () => [{ date: '2024-01-01', revenue: 500, orders: 5 }]),
    getRecentOrders: vi.fn(async () => mockOrders),
    ...overrides,
  };
}

describe('Dashboard Routes', () => {
  let app: FastifyInstance;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    dashboardService = createMockDashboardService();
    app = await buildBaseApp();
    await app.register(dashboardRoutes, { dashboardService });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  function authToken(): string {
    return signTestToken(app, { sub: 'user-1', role: 'viewer' });
  }

  describe('GET /api/dashboard/metrics', () => {
    it('returns 200 with metrics when authenticated', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/dashboard/metrics',
        headers: { cookie: cookieHeader(authToken()) },
      });
      expect(res.statusCode).toBe(200);
      const body = res.json<DashboardMetrics>();
      expect(body.totalOrders).toBe(42);
      expect(body.totalRevenue).toBe(12500);
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/dashboard/metrics' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/dashboard/sales', () => {
    it('returns 200 with sales data for default range', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/dashboard/sales',
        headers: { cookie: cookieHeader(authToken()) },
      });
      expect(res.statusCode).toBe(200);
      const body = res.json<{ data: unknown[] }>();
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('returns 200 with sales data for 7d range', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/dashboard/sales?range=7d',
        headers: { cookie: cookieHeader(authToken()) },
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/dashboard/orders', () => {
    it('returns 200 with recent orders', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/dashboard/orders',
        headers: { cookie: cookieHeader(authToken()) },
      });
      expect(res.statusCode).toBe(200);
      const body = res.json<{ data: Order[] }>();
      expect(body.data).toHaveLength(1);
    });
  });
});
