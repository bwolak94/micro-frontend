import type { Order } from '@portfolio/shared-types';

export type SalesRange = '7d' | '30d' | '90d';

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface DashboardRepo {
  getTotalRevenue(): Promise<number>;
  getTotalOrders(): Promise<number>;
  getTotalProducts(): Promise<number>;
  getTotalUsers(): Promise<number>;
  getSalesData(startDate: Date): Promise<SalesDataPoint[]>;
  getRecentOrders(limit: number): Promise<Order[]>;
}

export interface DashboardService {
  getMetrics(): Promise<DashboardMetrics>;
  getSalesData(range: SalesRange): Promise<SalesDataPoint[]>;
  getRecentOrders(limit: number): Promise<Order[]>;
}
