import { clsx } from 'clsx';

import type { LoadingSpinnerProps } from './LoadingSpinner.types';
import type { FC } from 'react';

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
} as const;

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ label = 'Loading...', size = 'md' }) => (
  <div role="status" aria-label={label} className="flex items-center justify-center p-4">
    <div
      className={clsx(
        'animate-spin rounded-full border-gray-200 border-t-blue-600',
        SIZE_CLASSES[size],
      )}
      aria-hidden="true"
    />
    <span className="sr-only">{label}</span>
  </div>
);

export default LoadingSpinner;
