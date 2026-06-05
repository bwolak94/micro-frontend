import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAuthService } from './auth.service';
import { AuthError } from './auth.service.types';

import type { UserRepo } from './auth.service.types';
import type { DbUser } from '../../domain/schema';

const HASHED_PASSWORD = await bcrypt.hash('password123', 1);

function makeDbUser(overrides: Partial<DbUser> = {}): DbUser {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: HASHED_PASSWORD,
    role: 'viewer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}

function createMockUserRepo(initial: DbUser[] = []): UserRepo {
  const store = [...initial];
  return {
    findByEmail: vi.fn(async (email) => store.find((u) => u.email === email) ?? null),
    findById: vi.fn(async (id) => store.find((u) => u.id === id) ?? null),
    insert: vi.fn(async (data) => {
      const user: DbUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role ?? 'viewer',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.push(user);
      return user;
    }),
  };
}

describe('AuthService', () => {
  let userRepo: UserRepo;

  beforeEach(() => {
    userRepo = createMockUserRepo([makeDbUser()]);
  });

  describe('verifyCredentials', () => {
    it('returns user on valid credentials', async () => {
      const service = createAuthService(userRepo);
      const user = await service.verifyCredentials('test@example.com', 'password123');
      expect(user.email).toBe('test@example.com');
      expect(user.id).toBe('user-1');
    });

    it('throws AuthError on wrong password', async () => {
      const service = createAuthService(userRepo);
      await expect(service.verifyCredentials('test@example.com', 'wrongpassword')).rejects.toThrow(
        AuthError,
      );
    });

    it('throws AuthError when user not found', async () => {
      const service = createAuthService(userRepo);
      await expect(service.verifyCredentials('nobody@example.com', 'password123')).rejects.toThrow(
        AuthError,
      );
    });
  });

  describe('createUser', () => {
    it('creates and returns a new user', async () => {
      const service = createAuthService(createMockUserRepo());
      const user = await service.createUser('New User', 'new@example.com', 'password123');
      expect(user.email).toBe('new@example.com');
      expect(user.name).toBe('New User');
      expect(user.role).toBe('viewer');
    });

    it('throws AuthError 409 when email already in use', async () => {
      const service = createAuthService(userRepo);
      const err = await service
        .createUser('Test User', 'test@example.com', 'password123')
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(AuthError);
      expect((err as AuthError).statusCode).toBe(409);
    });
  });

  describe('getUserById', () => {
    it('returns user when found', async () => {
      const service = createAuthService(userRepo);
      const user = await service.getUserById('user-1');
      expect(user).not.toBeNull();
      expect(user?.id).toBe('user-1');
    });

    it('returns null when user not found', async () => {
      const service = createAuthService(userRepo);
      const user = await service.getUserById('nonexistent');
      expect(user).toBeNull();
    });
  });
});
