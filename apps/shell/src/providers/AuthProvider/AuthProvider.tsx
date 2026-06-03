import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  type FC,
  type PropsWithChildren,
} from 'react';

import type { AuthAction, AuthContextValue, AuthState } from './AuthProvider.types';
import type { User } from '@portfolio/shared-types';

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'loading',
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token, status: 'authenticated' };
    case 'RESTORE':
      return { ...state, user: action.payload.user, token: null, status: 'authenticated' };
    case 'LOGOUT':
      return { user: null, token: null, status: 'unauthenticated' };
    default:
      return state;
  }
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount by checking the httpOnly cookie via the BFF
  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = (await response.json()) as { user: User };
          dispatch({ type: 'RESTORE', payload: { user: data.user } });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch {
        // BFF not yet running — default to unauthenticated
        dispatch({ type: 'LOGOUT' });
      }
    };

    void checkSession();
  }, []);

  const login = useCallback((user: User, token: string) => {
    dispatch({ type: 'LOGIN', payload: { user, token } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: state.status === 'authenticated',
    isLoading: state.status === 'loading',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
