import { Suspense, type FC } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../layout/AppShell/AppShell';
import AuthRemote from '../remotes/AuthRemote';
import DashboardRemote from '../remotes/DashboardRemote';

import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

const ProductsPlaceholder: FC = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Products</h1>
    <p className="mt-2 text-gray-500 dark:text-gray-400">Coming in Task 05 (Vue MFE)</p>
  </div>
);

// Route wrappers connect mfe-auth pages to shell's AuthContext
const LoginRoute: FC = () => {
  const { login } = useAuth();
  return (
    <Suspense fallback={<LoadingSpinner label="Loading login..." />}>
      <AuthRemote.LoginPage onLoginSuccess={(user) => login(user, '')} />
    </Suspense>
  );
};

const RegisterRoute: FC = () => {
  const { login } = useAuth();
  return (
    <Suspense fallback={<LoadingSpinner label="Loading register..." />}>
      <AuthRemote.RegisterPage onRegisterSuccess={(user) => login(user, '')} />
    </Suspense>
  );
};

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardRemote.DashboardPage /> },
        { path: 'products', element: <ProductsPlaceholder /> },
      ],
    },
    { path: '/login', element: <LoginRoute /> },
    { path: '/register', element: <RegisterRoute /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);
