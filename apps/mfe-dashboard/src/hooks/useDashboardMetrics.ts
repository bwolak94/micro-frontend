import { useQuery } from '@tanstack/react-query';

import { dashboardClient } from '../api/dashboardClient';

import type { DashboardMetrics } from '../api/dashboardClient.types';
import type { UseQueryResult } from '@tanstack/react-query';

export const DASHBOARD_METRICS_QUERY_KEY = ['dashboard', 'metrics'] as const;

export function useDashboardMetrics(): UseQueryResult<DashboardMetrics> {
  return useQuery({
    queryKey: DASHBOARD_METRICS_QUERY_KEY,
    queryFn: async () => {
      const response = await dashboardClient.getMetrics();
      return response.data;
    },
    staleTime: 60_000,
  });
}
