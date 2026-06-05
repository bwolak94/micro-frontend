import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthError } from '../../services/auth/auth.service.types';
import { buildBaseApp, cookieHeader, signTestToken } from '../../test/helpers';

import { authRoutes } from './auth.routes';

import type { AuthService } from '../../services/auth/auth.service.types';
import type { User } from '@portfolio/shared-types';
import type { FastifyInstance } from 'fastify';

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'viewer',
};

function createMockAuthService(overrides: Partial<AuthService> = {}): AuthService {
  return {
    verifyCredentials: vi.fn(async () => mockUser),
    createUser: vi.fn(async () => ({ ...mockUser, id: 'user-new' })),
    getUserById: vi.fn(async () => mockUser),
    ...overrides,
  };
}

describe('Auth Routes', () => {
  let app: FastifyInstance;
  let authService: AuthService;

  beforeEach(async () => {
    authService = createMockAuthService();
    app = await buildBaseApp();
    await app.register(authRoutes, { authService });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('returns 200 and sets cookie on valid credentials', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'test@example.com', password: 'password123' },
      });
      expect(res.statusCode).toBe(200);
      const body = res.json<{ user: User }>();
      expect(body.user.email).toBe('test@example.com');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('returns 401 on invalid credentials', async () => {
      authService = createMockAuthService({
        verifyCredentials: vi.fn(async () => {
          throw new AuthError('Invalid email or password');
        }),
      });
      app = await buildBaseApp();
      await app.register(authRoutes, { authService });
      await app.ready();

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'test@example.com', password: 'wrong' },
      });
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 on invalid body', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'not-an-email' },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/register', () => {
    it('returns 201 and sets cookie on valid registration', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'New User', email: 'new@example.com', password: 'password123' },
      });
      expect(res.statusCode).toBe(201);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('returns 409 when email already in use', async () => {
      authService = createMockAuthService({
        createUser: vi.fn(async () => {
          throw new AuthError('Email already in use', 409);
        }),
      });
      app = await buildBaseApp();
      await app.register(authRoutes, { authService });
      await app.ready();

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'Test', email: 'test@example.com', password: 'password123' },
      });
      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('returns 200 and clears the cookie', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/auth/logout' });
      expect(res.statusCode).toBe(200);
      const cookie = res.headers['set-cookie'] as string | undefined;
      expect(cookie).toBeDefined();
      expect(cookie).toContain('token=;');
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns 200 with user when authenticated', async () => {
      const token = signTestToken(app, { sub: 'user-1' });
      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { cookie: cookieHeader(token) },
      });
      expect(res.statusCode).toBe(200);
      const body = res.json<{ user: User }>();
      expect(body.user.id).toBe('user-1');
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/auth/me' });
      expect(res.statusCode).toBe(401);
    });

    it('returns 404 when user not found', async () => {
      authService = createMockAuthService({ getUserById: vi.fn(async () => null) });
      app = await buildBaseApp();
      await app.register(authRoutes, { authService });
      await app.ready();

      const token = signTestToken(app, { sub: 'ghost' });
      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { cookie: cookieHeader(token) },
      });
      expect(res.statusCode).toBe(404);
    });
  });
});
