import type { User } from '@portfolio/shared-types';

export interface LoginFormProps {
  readonly onSuccess: (user: User) => void;
}

export interface LoginFormValues {
  readonly email: string;
  readonly password: string;
}
