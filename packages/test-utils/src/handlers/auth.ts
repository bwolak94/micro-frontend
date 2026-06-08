import { http, HttpResponse } from 'msw';

import type { LoginResponse, RegisterResponse } from '@portfolio/shared-types';

const mockUser = {
  id: 'user-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
};

const mockViewer = {
  id: 'user-2',
  email: 'viewer@example.com',
  name: 'Viewer User',
  role: 'viewer' as const,
};

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.password === 'wrong') {
      return HttpResponse.json(
        { statusCode: 401, message: 'Invalid email or password', error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = body.email === mockViewer.email ? mockViewer : mockUser;
    const response: LoginResponse = { user };
    return HttpResponse.json(response);
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string };

    if (body.email === 'taken@example.com') {
      return HttpResponse.json(
        { statusCode: 409, message: 'Email already in use', error: 'Conflict' },
        { status: 409 },
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name,
      role: 'viewer' as const,
    };
    const response: RegisterResponse = { user: newUser };
    return HttpResponse.json(response, { status: 201 });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const cookie = request.headers.get('cookie') ?? '';
    if (!cookie.includes('token=')) {
      return HttpResponse.json(
        { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' },
        { status: 401 },
      );
    }
    return HttpResponse.json({ user: mockUser });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),
];
