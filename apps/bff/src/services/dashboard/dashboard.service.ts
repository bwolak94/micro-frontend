import type { DashboardRepo, DashboardService, SalesRange } from './dashboard.service.types';

const RANGE_DAYS: Record<SalesRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export function createDashboardService(repo: DashboardRepo): DashboardService {
  return {
    async getMetrics() {
      const [totalRevenue, totalOrders, totalProducts, totalUsers] = await Promise.all([
        repo.getTotalRevenue(),
        repo.getTotalOrders(),
        repo.getTotalProducts(),
        repo.getTotalUsers(),
      ]);
      return { totalRevenue, totalOrders, totalProducts, totalUsers };
    },

    async getSalesData(range: SalesRange) {
      const days = RANGE_DAYS[range];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      return repo.getSalesData(startDate);
    },

    async getRecentOrders(limit: number) {
      return repo.getRecentOrders(limit);
    },
  };
}
