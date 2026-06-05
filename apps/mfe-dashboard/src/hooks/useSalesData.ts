import { useQuery } from '@tanstack/react-query';

import { dashboardClient } from '../api/dashboardClient';

import type { SalesDataPoint, SalesRange } from '../api/dashboardClient.types';
import type { UseQueryResult } from '@tanstack/react-query';

export const SALES_DATA_QUERY_KEY = (range: SalesRange) => ['dashboard', 'sales', range] as const;

export function useSalesData(range: SalesRange): UseQueryResult<readonly SalesDataPoint[]> {
  return useQuery({
    queryKey: SALES_DATA_QUERY_KEY(range),
    queryFn: async () => {
      const response = await dashboardClient.getSalesData(range);
      return response.data;
    },
    staleTime: 60_000,
  });
}
