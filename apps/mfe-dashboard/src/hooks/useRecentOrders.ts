import { useQuery } from '@tanstack/react-query';

import { dashboardClient } from '../api/dashboardClient';

import type { Order } from '@portfolio/shared-types';
import type { UseQueryResult } from '@tanstack/react-query';

export const RECENT_ORDERS_QUERY_KEY = (limit: number) => ['dashboard', 'orders', limit] as const;

export function useRecentOrders(limit: number): UseQueryResult<readonly Order[]> {
  return useQuery({
    queryKey: RECENT_ORDERS_QUERY_KEY(limit),
    queryFn: async () => {
      const response = await dashboardClient.getRecentOrders(limit);
      return response.data;
    },
    staleTime: 30_000,
  });
}
