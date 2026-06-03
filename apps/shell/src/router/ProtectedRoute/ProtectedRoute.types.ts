import type { ReactNode } from 'react';

export interface ProtectedRouteProps {
  readonly children: ReactNode;
  readonly redirectTo?: string;
}
