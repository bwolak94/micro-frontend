import { describe, expect, it, vi } from 'vitest';

import { createDashboardService } from './dashboard.service';

import type { DashboardRepo, SalesDataPoint } from './dashboard.service.types';
import type { Order } from '@portfolio/shared-types';

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    userId: 'user-1',
    items: [],
    total: 99.99,
    status: 'delivered',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockDashboardRepo(overrides: Partial<DashboardRepo> = {}): DashboardRepo {
  return {
    getTotalRevenue: vi.fn(async () => 12500.5),
    getTotalOrders: vi.fn(async () => 42),
    getTotalProducts: vi.fn(async () => 20),
    getTotalUsers: vi.fn(async () => 5),
    getSalesData: vi.fn(
      async (): Promise<SalesDataPoint[]> => [
        { date: '2024-01-01', revenue: 500, orders: 5 },
        { date: '2024-01-02', revenue: 750, orders: 8 },
      ],
    ),
    getRecentOrders: vi.fn(async () => [makeOrder(), makeOrder({ id: 'order-2' })]),
    ...overrides,
  };
}

describe('DashboardService', () => {
  it('returns aggregated metrics', async () => {
    const service = createDashboardService(createMockDashboardRepo());
    const metrics = await service.getMetrics();
    expect(metrics.totalRevenue).toBe(12500.5);
    expect(metrics.totalOrders).toBe(42);
    expect(metrics.totalProducts).toBe(20);
    expect(metrics.totalUsers).toBe(5);
  });

  it('fetches sales data for 7d range', async () => {
    const repo = createMockDashboardRepo();
    const service = createDashboardService(repo);
    const data = await service.getSalesData('7d');
    expect(Array.isArray(data)).toBe(true);
    expect(repo.getSalesData).toHaveBeenCalled();
  });

  it('fetches sales data for 30d range', async () => {
    const service = createDashboardService(createMockDashboardRepo());
    const data = await service.getSalesData('30d');
    expect(data.length).toBeGreaterThan(0);
  });

  it('fetches sales data for 90d range', async () => {
    const service = createDashboardService(createMockDashboardRepo());
    const data = await service.getSalesData('90d');
    expect(data.length).toBeGreaterThan(0);
  });

  it('returns recent orders', async () => {
    const service = createDashboardService(createMockDashboardRepo());
    const orders = await service.getRecentOrders(10);
    expect(orders).toHaveLength(2);
  });
});
