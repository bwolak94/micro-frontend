import type { Order, Product } from '@portfolio/shared-types';

export interface SalesDataPoint {
  readonly date: string;
  readonly revenue: number;
}

export type SalesRange = '7d' | '30d' | '90d';

export interface DashboardMetrics {
  readonly totalRevenue: number;
  readonly totalOrders: number;
  readonly activeProducts: number;
  readonly newUsers: number;
}

export interface GetSalesDataResponse {
  readonly data: readonly SalesDataPoint[];
  readonly range: SalesRange;
}

export interface GetRecentOrdersResponse {
  readonly data: readonly Order[];
}

export interface GetMetricsResponse {
  readonly data: DashboardMetrics;
}

export interface GetRecentProductsResponse {
  readonly data: readonly Product[];
}
