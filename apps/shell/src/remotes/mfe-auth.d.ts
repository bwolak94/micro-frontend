import type { LoginPageProps, RegisterPageProps } from '@portfolio/shared-types';
import type { FC } from 'react';

declare module 'mfeAuth/LoginPage' {
  const LoginPage: FC<LoginPageProps>;
  export default LoginPage;
}

declare module 'mfeAuth/RegisterPage' {
  const RegisterPage: FC<RegisterPageProps>;
  export default RegisterPage;
}
