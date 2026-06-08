import { Suspense, type FC } from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../layout/AppShell/AppShell';
import AuthRemote from '../remotes/AuthRemote';
import DashboardRemote from '../remotes/DashboardRemote';
import ProductsRemote from '../remotes/ProductsRemote';

import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

// Route wrappers connect mfe-auth pages to shell's AuthContext
const LoginRoute: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingSpinner label="Loading login..." />}>
      <AuthRemote.LoginPage
        onLoginSuccess={(user) => {
          login(user, '');
          void navigate('/dashboard');
        }}
      />
    </Suspense>
  );
};

const RegisterRoute: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingSpinner label="Loading register..." />}>
      <AuthRemote.RegisterPage
        onRegisterSuccess={(user) => {
          login(user, '');
          void navigate('/dashboard');
        }}
      />
    </Suspense>
  );
};

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
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
        { path: 'products/*', element: <ProductsRemote /> },
      ],
    },
    { path: '/login', element: <LoginRoute /> },
    { path: '/register', element: <RegisterRoute /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);
