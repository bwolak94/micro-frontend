import type { User } from './domain';

export interface LoginPageProps {
  readonly onLoginSuccess: (user: User) => void;
}

export interface RegisterPageProps {
  readonly onRegisterSuccess: (user: User) => void;
}
