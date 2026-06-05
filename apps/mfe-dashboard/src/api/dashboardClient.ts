import { createApiClient } from '@portfolio/api-client';

import type {
  GetMetricsResponse,
  GetRecentOrdersResponse,
  GetRecentProductsResponse,
  GetSalesDataResponse,
  SalesRange,
} from './dashboardClient.types';

const apiClient = createApiClient({ baseUrl: '/api' });

export const dashboardClient = {
  getSalesData: (range: SalesRange): Promise<GetSalesDataResponse> =>
    apiClient.get<GetSalesDataResponse>(`/dashboard/sales?range=${range}`),

  getRecentOrders: (limit: number): Promise<GetRecentOrdersResponse> =>
    apiClient.get<GetRecentOrdersResponse>(`/dashboard/orders?limit=${limit}`),

  getMetrics: (): Promise<GetMetricsResponse> =>
    apiClient.get<GetMetricsResponse>('/dashboard/metrics'),

  getRecentProducts: (): Promise<GetRecentProductsResponse> =>
    apiClient.get<GetRecentProductsResponse>('/dashboard/products/recent'),
} as const;
