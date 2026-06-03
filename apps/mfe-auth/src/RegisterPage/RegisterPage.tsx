import { Link } from 'react-router-dom';

import RegisterForm from '../components/RegisterForm/RegisterForm';

import type { RegisterPageProps } from '@portfolio/shared-types';
import type { FC } from 'react';

const RegisterPage: FC<RegisterPageProps> = ({ onRegisterSuccess }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
    <div className="w-full max-w-md">
      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Join the admin panel</p>
        </div>

        <RegisterForm onSuccess={onRegisterSuccess} />

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
);

export default RegisterPage;
