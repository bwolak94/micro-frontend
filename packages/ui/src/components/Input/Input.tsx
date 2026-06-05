import { clsx } from 'clsx';

import type { InputProps } from './Input.types';
import type { FC } from 'react';

const Input: FC<InputProps> = ({ label, id, error, helperText, className, ...props }) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy =
    clsx(
      error !== undefined && errorId,
      helperText !== undefined && error === undefined && helperId,
    ) || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error !== undefined}
        aria-describedby={describedBy}
        className={clsx(
          'rounded-md border px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white',
          error !== undefined
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600',
          className,
        )}
        {...props}
      />
      {error !== undefined && (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText !== undefined && error === undefined && (
        <p id={helperId} className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

Input.displayName = 'Input';

export { Input };
