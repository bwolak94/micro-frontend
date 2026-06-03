import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuthProvider, { AuthContext } from './AuthProvider';

import type { User } from '@portfolio/shared-types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'admin' };

const TestConsumer = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) return <div>no-context</div>;
  return (
    <div>
      <span data-testid="status">{ctx.status}</span>
      <span data-testid="is-authenticated">{String(ctx.isAuthenticated)}</span>
      <span data-testid="is-loading">{String(ctx.isLoading)}</span>
      <span data-testid="user">{ctx.user?.email ?? 'none'}</span>
      <button onClick={() => ctx.login(mockUser, 'tok')}>login</button>
      <button onClick={ctx.logout}>logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) }),
    );
  });

  it('starts in loading state before session check resolves', () => {
    // Use a pending promise so the effect never resolves during this assertion
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => undefined)));
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('status')).toHaveTextContent('loading');
  });

  it('transitions to unauthenticated when session check fails', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await screen.findByText('false', { selector: '[data-testid="is-loading"]' });
    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('sets user and token on login', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await screen.findByText('false', { selector: '[data-testid="is-loading"]' });

    act(() => {
      screen.getByText('login').click();
    });

    expect(screen.getByTestId('status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
  });

  it('clears user on logout', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await screen.findByText('false', { selector: '[data-testid="is-loading"]' });

    act(() => {
      screen.getByText('login').click();
    });
    act(() => {
      screen.getByText('logout').click();
    });

    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  it('restores session when /api/auth/me succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await screen.findByText('authenticated', { selector: '[data-testid="status"]' });
    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
  });
});
