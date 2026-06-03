import type { ReactNode } from 'react';

export interface CardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export type CardHeaderProps = CardProps;
export type CardContentProps = CardProps;
export type CardFooterProps = CardProps;
