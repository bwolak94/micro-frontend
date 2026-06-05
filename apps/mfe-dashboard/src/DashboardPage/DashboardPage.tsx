import { Spinner } from '@portfolio/ui';
import { useState, type FC } from 'react';

import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import MetricCard from '../widgets/MetricCard/MetricCard';
import ProductActivity from '../widgets/ProductActivity/ProductActivity';
import RecentOrders from '../widgets/RecentOrders/RecentOrders';
import SalesChart from '../widgets/SalesChart/SalesChart';

import type { DashboardPageProps } from './DashboardPage.types';
import type { SalesRange } from '../api/dashboardClient.types';

const METRIC_SKELETON_KEYS = ['revenue', 'orders', 'products', 'users'] as const;

const formatCurrency = (value: number | string): string =>
  `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

const DashboardPage: FC<DashboardPageProps> = () => {
  const [range, setRange] = useState<SalesRange>('30d');
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();

  return (
    <div className="db-space-y-6 db-p-6" aria-label="Dashboard">
      {/* Metric Cards */}
      <div
        className="db-grid db-grid-cols-1 db-gap-4 sm:db-grid-cols-2 xl:db-grid-cols-4"
        aria-label="KPI metrics"
      >
        {metricsLoading || metrics === undefined ? (
          METRIC_SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="db-flex db-h-32 db-items-center db-justify-center db-rounded-lg db-border db-border-gray-200 db-bg-white dark:db-border-gray-700 dark:db-bg-gray-800"
            >
              <Spinner label="Loading metric..." />
            </div>
          ))
        ) : (
          <>
            <MetricCard
              title="Total Revenue"
              value={metrics.totalRevenue}
              formatter={formatCurrency}
            />
            <MetricCard title="Total Orders" value={metrics.totalOrders} />
            <MetricCard title="Active Products" value={metrics.activeProducts} />
            <MetricCard title="New Users" value={metrics.newUsers} />
          </>
        )}
      </div>

      {/* Sales Chart */}
      <SalesChart range={range} onRangeChange={setRange} />

      {/* Orders + Activity */}
      <div className="db-grid db-grid-cols-1 db-gap-6 lg:db-grid-cols-2">
        <RecentOrders limit={10} />
        <ProductActivity />
      </div>
    </div>
  );
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
