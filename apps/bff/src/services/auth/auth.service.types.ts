import type { DbUser, NewDbUser } from '../../domain/schema';
import type { User } from '@portfolio/shared-types';

export interface UserRepo {
  findByEmail(email: string): Promise<DbUser | null>;
  findById(id: string): Promise<DbUser | null>;
  insert(data: NewDbUser): Promise<DbUser>;
}

export interface AuthService {
  verifyCredentials(email: string, password: string): Promise<User>;
  createUser(name: string, email: string, password: string): Promise<User>;
  getUserById(userId: string): Promise<User | null>;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 401,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
