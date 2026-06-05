import { eventBus } from '@portfolio/event-bus';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { dashboardClient } from '../api/dashboardClient';

import type { Product } from '@portfolio/shared-types';
import type { UseQueryResult } from '@tanstack/react-query';

export const RECENT_PRODUCTS_QUERY_KEY = ['dashboard', 'products', 'recent'] as const;

export function useRecentProducts(): UseQueryResult<readonly Product[]> {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = eventBus.on('product:updated', () => {
      void queryClient.invalidateQueries({ queryKey: RECENT_PRODUCTS_QUERY_KEY });
    });
    return unsubscribe;
  }, [queryClient]);

  return useQuery({
    queryKey: RECENT_PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const response = await dashboardClient.getRecentProducts();
      return response.data;
    },
    staleTime: 30_000,
  });
}
