import { Link } from 'react-router-dom';

import LoginForm from '../components/LoginForm/LoginForm';

import type { LoginPageProps } from '@portfolio/shared-types';
import type { FC } from 'react';

const LoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => (
  <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
    <div className="w-full max-w-md">
      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Access the admin panel</p>
        </div>

        <LoginForm onSuccess={onLoginSuccess} />

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  </main>
);

export default LoginPage;
