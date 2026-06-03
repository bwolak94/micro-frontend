import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

import ProtectedRoute from './ProtectedRoute';

import type { AuthContextValue } from '../../providers/AuthProvider/AuthProvider.types';

const buildAuthCtx = (overrides: Partial<AuthContextValue>): AuthContextValue => ({
  user: null,
  token: null,
  status: 'unauthenticated',
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

const renderRoute = (authCtx: AuthContextValue) =>
  render(
    <AuthContext.Provider value={authCtx}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>protected content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('ProtectedRoute', () => {
  it('redirects to /login when unauthenticated', () => {
    renderRoute(buildAuthCtx({ isAuthenticated: false }));
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    renderRoute(
      buildAuthCtx({
        isAuthenticated: true,
        status: 'authenticated',
        user: { id: '1', email: 'a@b.com', name: 'Alice', role: 'admin' },
      }),
    );
    expect(screen.getByText('protected content')).toBeInTheDocument();
  });

  it('shows loading spinner while auth is being resolved', () => {
    renderRoute(buildAuthCtx({ isLoading: true, status: 'loading' }));
    expect(screen.getByRole('status', { name: /checking authentication/i })).toBeInTheDocument();
    expect(screen.queryByText('login page')).not.toBeInTheDocument();
  });
});
