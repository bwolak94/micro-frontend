import type { User } from '@portfolio/shared-types';

export interface RegisterFormProps {
  readonly onSuccess: (user: User) => void;
}

export interface RegisterFormValues {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
}
