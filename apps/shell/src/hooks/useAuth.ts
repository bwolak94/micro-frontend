import { useContext } from 'react';

import { AuthContext } from '../providers/AuthProvider/AuthProvider';

import type { AuthContextValue } from '../providers/AuthProvider/AuthProvider.types';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
