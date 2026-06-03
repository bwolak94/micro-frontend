import { clsx } from 'clsx';

import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';
import type { FC } from 'react';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
  secondary:
    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}) => (
  <button
    disabled={disabled ?? isLoading}
    aria-busy={isLoading}
    className={clsx(
      'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    )}
    {...props}
  >
    {isLoading && (
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />
    )}
    {children}
  </button>
);

Button.displayName = 'Button';

export { Button };
