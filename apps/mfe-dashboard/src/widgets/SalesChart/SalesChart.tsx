import { Spinner } from '@portfolio/ui';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useSalesData } from '../../hooks/useSalesData';

import type { SalesChartProps } from './SalesChart.types';
import type { SalesRange } from '../../api/dashboardClient.types';
import type { FC } from 'react';

const RANGE_OPTIONS: readonly { readonly label: string; readonly value: SalesRange }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
] as const;

const SalesChart: FC<SalesChartProps> = ({ range, onRangeChange }) => {
  const { data, isLoading, isError, refetch } = useSalesData(range);

  return (
    <section
      aria-label="Sales Chart"
      className="db-rounded-lg db-border db-border-gray-200 db-bg-white db-p-6 db-shadow-sm dark:db-border-gray-700 dark:db-bg-gray-800"
    >
      <div className="db-mb-4 db-flex db-items-center db-justify-between">
        <h2 className="db-text-lg db-font-semibold db-text-gray-900 dark:db-text-white">Revenue</h2>
        <div role="group" aria-label="Date range">
          {RANGE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => onRangeChange(value)}
              aria-pressed={range === value}
              className={`db-ml-1 db-rounded db-px-3 db-py-1 db-text-sm db-font-medium db-transition-colors ${
                range === value
                  ? 'db-bg-blue-600 db-text-white'
                  : 'db-bg-gray-100 db-text-gray-600 hover:db-bg-gray-200 dark:db-bg-gray-700 dark:db-text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="db-flex db-h-64 db-items-center db-justify-center">
          <Spinner label="Loading sales data..." size="lg" />
        </div>
      )}

      {isError && (
        <div className="db-flex db-h-64 db-flex-col db-items-center db-justify-center db-gap-3">
          <p className="db-text-sm db-text-red-600 dark:db-text-red-400">
            Failed to load sales data
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="db-rounded db-bg-blue-600 db-px-4 db-py-2 db-text-sm db-text-white hover:db-bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && data !== undefined && (
        <div className="db-h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[...data]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#bfdbfe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

SalesChart.displayName = 'SalesChart';

export default SalesChart;
