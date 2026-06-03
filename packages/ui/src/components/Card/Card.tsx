import { clsx } from 'clsx';

import type { CardContentProps, CardFooterProps, CardHeaderProps, CardProps } from './Card.types';
import type { FC } from 'react';

const Card: FC<CardProps> = ({ children, className }) => (
  <div
    className={clsx(
      'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
      className,
    )}
  >
    {children}
  </div>
);
Card.displayName = 'Card';

const CardHeader: FC<CardHeaderProps> = ({ children, className }) => (
  <div className={clsx('border-b border-gray-200 px-6 py-4 dark:border-gray-700', className)}>
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';

const CardContent: FC<CardContentProps> = ({ children, className }) => (
  <div className={clsx('px-6 py-4', className)}>{children}</div>
);
CardContent.displayName = 'CardContent';

const CardFooter: FC<CardFooterProps> = ({ children, className }) => (
  <div className={clsx('border-t border-gray-200 px-6 py-4 dark:border-gray-700', className)}>
    {children}
  </div>
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
