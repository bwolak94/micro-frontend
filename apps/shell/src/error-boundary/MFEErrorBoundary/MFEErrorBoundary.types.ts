import type { ReactNode } from 'react';

export interface MFEErrorBoundaryProps {
  readonly name: string;
  readonly fallback?: ReactNode;
  readonly children: ReactNode;
}

export interface MFEErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}
