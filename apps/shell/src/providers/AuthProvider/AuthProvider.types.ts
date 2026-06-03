import type { User } from '@portfolio/shared-types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  readonly user: User | null;
  readonly token: string | null;
  readonly status: AuthStatus;
}

export interface AuthContextValue extends AuthState {
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly login: (user: User, token: string) => void;
  readonly logout: () => void;
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE'; payload: { user: User } };
