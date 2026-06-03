import type { LoginPageProps } from '@portfolio/shared-types';
import type { FC } from 'react';

const MockLoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => (
  <div data-testid="mock-login-page">
    <button
      onClick={() =>
        onLoginSuccess({ id: '1', email: 'test@example.com', name: 'Test User', role: 'admin' })
      }
    >
      Mock Login
    </button>
  </div>
);

export default MockLoginPage;
