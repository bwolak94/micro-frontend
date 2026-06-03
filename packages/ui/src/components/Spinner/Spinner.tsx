import { clsx } from 'clsx';

import type { SpinnerProps, SpinnerSize } from './Spinner.types';
import type { FC } from 'react';

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-2',
  xl: 'h-12 w-12 border-4',
};

const Spinner: FC<SpinnerProps> = ({ size = 'md', label = 'Loading...', className }) => (
  <div role="status" aria-label={label} className={clsx('inline-flex items-center', className)}>
    <div
      className={clsx(
        'animate-spin rounded-full border-gray-300 border-t-blue-600',
        'dark:border-gray-600 dark:border-t-blue-400',
        SIZE_CLASSES[size],
      )}
      aria-hidden="true"
    />
    <span className="sr-only">{label}</span>
  </div>
);

Spinner.displayName = 'Spinner';

export { Spinner };
