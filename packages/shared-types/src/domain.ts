export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'admin' | 'manager' | 'viewer';
}

export interface AuthTokenPayload {
  readonly sub: string;
  readonly email: string;
  readonly role: User['role'];
  readonly iat: number;
  readonly exp: number;
}
