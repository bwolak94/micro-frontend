import type { LoginBody, RegisterBody } from '../../schemas/auth.schema';
import type { AuthService } from '../../services/auth/auth.service.types';

export interface AuthRoutesOpts {
  authService: AuthService;
}

export interface LoginRoute {
  Body: LoginBody;
}

export interface RegisterRoute {
  Body: RegisterBody;
}
