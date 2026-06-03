import { Navigate } from 'react-router-dom';

import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

import type { ProtectedRouteProps } from './ProtectedRoute.types';
import type { FC } from 'react';

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner label="Checking authentication..." />;
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  return children;
};

export default ProtectedRoute;
