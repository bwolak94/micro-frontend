import { Badge, Spinner } from '@portfolio/ui';

import { useRecentOrders } from '../../hooks/useRecentOrders';

import type { RecentOrdersProps } from './RecentOrders.types';
import type { OrderStatus } from '@portfolio/shared-types';
import type { BadgeVariant } from '@portfolio/ui';
import type { FC } from 'react';

const STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const DEFAULT_LIMIT = 10;

const RecentOrders: FC<RecentOrdersProps> = ({ limit = DEFAULT_LIMIT }) => {
  const { data: orders, isLoading, isError, refetch } = useRecentOrders(limit);

  return (
    <section
      aria-label="Recent Orders"
      className="db-rounded-lg db-border db-border-gray-200 db-bg-white db-p-6 db-shadow-sm dark:db-border-gray-700 dark:db-bg-gray-800"
    >
      <h2 className="db-mb-4 db-text-lg db-font-semibold db-text-gray-900 dark:db-text-white">
        Recent Orders
      </h2>

      {isLoading && (
        <div className="db-flex db-h-48 db-items-center db-justify-center">
          <Spinner label="Loading orders..." />
        </div>
      )}

      {isError && (
        <div className="db-flex db-h-48 db-flex-col db-items-center db-justify-center db-gap-3">
          <p className="db-text-sm db-text-red-600 dark:db-text-red-400">Failed to load orders</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="db-rounded db-bg-blue-600 db-px-4 db-py-2 db-text-sm db-text-white hover:db-bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && orders !== undefined && (
        <div className="db-overflow-x-auto">
          <table className="db-w-full db-text-sm">
            <thead>
              <tr className="db-border-b db-border-gray-200 dark:db-border-gray-700">
                <th
                  scope="col"
                  className="db-pb-3 db-text-left db-font-medium db-text-gray-500 dark:db-text-gray-400"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="db-pb-3 db-text-left db-font-medium db-text-gray-500 dark:db-text-gray-400"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="db-pb-3 db-text-left db-font-medium db-text-gray-500 dark:db-text-gray-400"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="db-pb-3 db-text-left db-font-medium db-text-gray-500 dark:db-text-gray-400"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="db-border-b db-border-gray-100 dark:db-border-gray-800"
                >
                  <td className="db-py-3 db-font-mono db-text-gray-700 dark:db-text-gray-300">
                    {order.id}
                  </td>
                  <td className="db-py-3 db-text-gray-900 dark:db-text-white">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="db-py-3">
                    <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
                  </td>
                  <td className="db-py-3 db-text-gray-500 dark:db-text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

RecentOrders.displayName = 'RecentOrders';

export default RecentOrders;
