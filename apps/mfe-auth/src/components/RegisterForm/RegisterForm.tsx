import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { register as registerUser } from '../../api/authClient';

import type { RegisterFormProps, RegisterFormValues } from './RegisterForm.types';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const RegisterForm: FC<RegisterFormProps> = ({ onSuccess }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setServerError(null);
    try {
      const response = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      onSuccess(response.user);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const fieldClass =
    'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Full name
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={fieldClass}
        />
        {errors.name && (
          <p id="name-error" role="alert" className={errorClass}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email" className={labelClass}>
          Email address
        </label>
        <input
          {...register('email')}
          id="reg-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'reg-email-error' : undefined}
          className={fieldClass}
        />
        {errors.email && (
          <p id="reg-email-error" role="alert" className={errorClass}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-password" className={labelClass}>
          Password
        </label>
        <input
          {...register('password')}
          id="reg-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'reg-password-error' : undefined}
          className={fieldClass}
        />
        {errors.password && (
          <p id="reg-password-error" role="alert" className={errorClass}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm password
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          className={fieldClass}
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" role="alert" className={errorClass}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
};

export default RegisterForm;
