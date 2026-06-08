import { http, HttpResponse } from 'msw';

import { mockProducts } from './products';

import type { Order } from '@portfolio/shared-types';

interface SalesDataPoint {
  date: string;
  revenue: number;
}

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  newUsers: number;
}

const now = new Date();

const mockSalesData: SalesDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(now);
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().slice(0, 10),
    revenue: 1000 + i * 120,
  };
});

const mockMetrics: DashboardMetrics = {
  totalRevenue: 142_350,
  totalOrders: 1_284,
  activeProducts: 86,
  newUsers: 34,
};

const mockOrders: Order[] = [
  {
    id: 'ord-001',
    userId: 'usr-1',
    items: [{ productId: 'p1', productName: 'Widget A', quantity: 2, unitPrice: 29.99 }],
    total: 59.98,
    status: 'delivered',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-02T10:00:00Z',
  },
  {
    id: 'ord-002',
    userId: 'usr-2',
    items: [{ productId: 'p2', productName: 'Gadget B', quantity: 1, unitPrice: 149.99 }],
    total: 149.99,
    status: 'processing',
    createdAt: '2024-05-03T09:00:00Z',
    updatedAt: '2024-05-03T09:00:00Z',
  },
];

export const dashboardHandlers = [
  http.get('/api/dashboard/sales', ({ request }) => {
    const url = new URL(request.url);
    const range = url.searchParams.get('range') ?? '30d';
    return HttpResponse.json({ data: mockSalesData, range });
  }),

  http.get('/api/dashboard/orders', () => {
    return HttpResponse.json({ data: mockOrders });
  }),

  http.get('/api/dashboard/metrics', () => {
    return HttpResponse.json({ data: mockMetrics });
  }),

  http.get('/api/dashboard/products/recent', () => {
    return HttpResponse.json({ data: mockProducts.slice(0, 2) });
  }),
];
