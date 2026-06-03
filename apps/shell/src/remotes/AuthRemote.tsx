import { lazy, Suspense, type FC } from 'react';

import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import MFEErrorBoundary from '../error-boundary/MFEErrorBoundary/MFEErrorBoundary';

import type { LoginPageProps, RegisterPageProps } from '@portfolio/shared-types';

const RemoteLoginPage = lazy<FC<LoginPageProps>>(() => import('mfeAuth/LoginPage'));

const RemoteRegisterPage = lazy<FC<RegisterPageProps>>(() => import('mfeAuth/RegisterPage'));

const LoginPage: FC<LoginPageProps> = (props) => (
  <MFEErrorBoundary name="mfe-auth">
    <Suspense fallback={<LoadingSpinner label="Loading auth module..." />}>
      <RemoteLoginPage {...props} />
    </Suspense>
  </MFEErrorBoundary>
);

const RegisterPage: FC<RegisterPageProps> = (props) => (
  <MFEErrorBoundary name="mfe-auth">
    <Suspense fallback={<LoadingSpinner label="Loading auth module..." />}>
      <RemoteRegisterPage {...props} />
    </Suspense>
  </MFEErrorBoundary>
);

const AuthRemote = { LoginPage, RegisterPage } as const;
export default AuthRemote;
