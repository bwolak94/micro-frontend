import type { RegisterPageProps } from '@portfolio/shared-types';
import type { FC } from 'react';

const MockRegisterPage: FC<RegisterPageProps> = ({ onRegisterSuccess }) => (
  <div data-testid="mock-register-page">
    <button
      onClick={() =>
        onRegisterSuccess({
          id: '2',
          email: 'new@example.com',
          name: 'New User',
          role: 'viewer',
        })
      }
    >
      Mock Register
    </button>
  </div>
);

export default MockRegisterPage;
