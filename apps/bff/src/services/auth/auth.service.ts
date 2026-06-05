import bcrypt from 'bcryptjs';

import { AuthError } from './auth.service.types';

import type { AuthService, UserRepo } from './auth.service.types';
import type { DbUser } from '../../domain/schema';
import type { User } from '@portfolio/shared-types';

const SALT_ROUNDS = 10;

function mapToUser(db: DbUser): User {
  return {
    id: db.id,
    email: db.email,
    name: db.name,
    role: db.role as User['role'],
  };
}

export function createAuthService(users: UserRepo): AuthService {
  return {
    async verifyCredentials(email: string, password: string): Promise<User> {
      const found = await users.findByEmail(email);
      if (found === null) {
        throw new AuthError('Invalid email or password');
      }
      const valid = await bcrypt.compare(password, found.passwordHash);
      if (!valid) {
        throw new AuthError('Invalid email or password');
      }
      return mapToUser(found);
    },

    async createUser(name: string, email: string, password: string): Promise<User> {
      const existing = await users.findByEmail(email);
      if (existing !== null) {
        throw new AuthError('Email already in use', 409);
      }
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const created = await users.insert({ name, email, passwordHash });
      return mapToUser(created);
    },

    async getUserById(userId: string): Promise<User | null> {
      const found = await users.findById(userId);
      return found !== null ? mapToUser(found) : null;
    },
  };
}
