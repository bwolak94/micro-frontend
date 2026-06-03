import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '../../providers/AuthProvider/AuthProvider';
import { ThemeContext } from '../../providers/ThemeProvider/ThemeProvider';

import Topbar from './Topbar';

import type { AuthContextValue } from '../../providers/AuthProvider/AuthProvider.types';
import type { ThemeContextValue } from '../../providers/ThemeProvider/ThemeProvider.types';
import type { User } from '@portfolio/shared-types';

const mockUser: User = { id: '1', email: 'a@b.com', name: 'Alice', role: 'admin' };

const buildAuthCtx = (overrides: Partial<AuthContextValue> = {}): AuthContextValue => ({
  user: mockUser,
  token: null,
  status: 'authenticated',
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

const buildThemeCtx = (overrides: Partial<ThemeContextValue> = {}): ThemeContextValue => ({
  theme: 'light',
  toggleTheme: vi.fn(),
  ...overrides,
});

const renderTopbar = (auth = buildAuthCtx(), theme = buildThemeCtx()) =>
  render(
    <AuthContext.Provider value={auth}>
      <ThemeContext.Provider value={theme}>
        <Topbar />
      </ThemeContext.Provider>
    </AuthContext.Provider>,
  );

describe('Topbar', () => {
  it('displays the logged-in user name', () => {
    renderTopbar();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('calls logout when sign-out button is clicked', async () => {
    const user = userEvent.setup();
    const logout = vi.fn();
    renderTopbar(buildAuthCtx({ logout }));

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(logout).toHaveBeenCalledOnce();
  });

  it('calls toggleTheme when theme button is clicked', async () => {
    const user = userEvent.setup();
    const toggleTheme = vi.fn();
    renderTopbar(buildAuthCtx(), buildThemeCtx({ toggleTheme }));

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));

    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it('shows "Switch to dark mode" button in light theme', () => {
    renderTopbar(buildAuthCtx(), buildThemeCtx({ theme: 'light' }));
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('shows "Switch to light mode" button in dark theme', () => {
    renderTopbar(buildAuthCtx(), buildThemeCtx({ theme: 'dark' }));
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
