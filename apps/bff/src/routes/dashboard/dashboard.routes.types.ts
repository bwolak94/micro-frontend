import type { OrdersQuery, SalesQuery } from '../../schemas/dashboard.schema';
import type { DashboardService } from '../../services/dashboard/dashboard.service.types';

export interface DashboardRoutesOpts {
  dashboardService: DashboardService;
}

export interface SalesRoute {
  Querystring: SalesQuery;
}

export interface OrdersRoute {
  Querystring: OrdersQuery;
}
