import type { DashboardMetrics, SalesDataPoint } from '../api/dashboardClient.types';
import type { Order, Product } from '@portfolio/shared-types';

const now = new Date();

export const mockSalesData: readonly SalesDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(now);
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().slice(0, 10),
    revenue: Math.floor(Math.random() * 5000) + 1000,
  };
});

export const mockMetrics: DashboardMetrics = {
  totalRevenue: 142_350,
  totalOrders: 1_284,
  activeProducts: 86,
  newUsers: 34,
};

export const mockOrders: readonly Order[] = [
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
  {
    id: 'ord-003',
    userId: 'usr-3',
    items: [{ productId: 'p3', productName: 'Book C', quantity: 3, unitPrice: 12.5 }],
    total: 37.5,
    status: 'pending',
    createdAt: '2024-05-04T11:00:00Z',
    updatedAt: '2024-05-04T11:00:00Z',
  },
];

export const mockRecentProducts: readonly Product[] = [
  {
    id: 'p1',
    name: 'Widget A',
    description: 'A great widget',
    price: 29.99,
    category: 'electronics',
    stock: 150,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Gadget B',
    description: 'An amazing gadget',
    price: 149.99,
    category: 'electronics',
    stock: 42,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-05-02T00:00:00Z',
  },
];
