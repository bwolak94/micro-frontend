import type { MetricCardProps } from './MetricCard.types';
import type { FC } from 'react';

const MetricCard: FC<MetricCardProps> = ({ title, value, trend, formatter }) => {
  const displayValue = formatter !== undefined ? formatter(value) : String(value);
  const hasTrend = trend !== undefined;
  const isPositive = hasTrend && trend >= 0;

  return (
    <div
      className="db-rounded-lg db-border db-border-gray-200 db-bg-white db-p-6 db-shadow-sm dark:db-border-gray-700 dark:db-bg-gray-800"
      role="region"
      aria-label={title}
    >
      <p className="db-text-sm db-font-medium db-text-gray-500 dark:db-text-gray-400">{title}</p>
      <p className="db-mt-2 db-text-3xl db-font-bold db-text-gray-900 dark:db-text-white">
        {displayValue}
      </p>
      {hasTrend && (
        <p
          className={`db-mt-1 db-text-sm db-font-medium ${
            isPositive
              ? 'db-text-green-600 dark:db-text-green-400'
              : 'db-text-red-600 dark:db-text-red-400'
          }`}
          aria-label={`Trend: ${isPositive ? '+' : ''}${trend}%`}
        >
          {isPositive ? '+' : ''}
          {trend}%
        </p>
      )}
    </div>
  );
};

MetricCard.displayName = 'MetricCard';

export default MetricCard;
