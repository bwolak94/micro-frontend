import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '../../providers/AuthProvider/AuthProvider';
import { ThemeContext } from '../../providers/ThemeProvider/ThemeProvider';

import AppShell from './AppShell';

import type { AuthContextValue } from '../../providers/AuthProvider/AuthProvider.types';
import type { ThemeContextValue } from '../../providers/ThemeProvider/ThemeProvider.types';
import type { User } from '@portfolio/shared-types';

const mockUser: User = { id: '1', email: 'a@b.com', name: 'Alice', role: 'admin' };

const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider
    value={
      {
        user: mockUser,
        token: null,
        status: 'authenticated',
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      } satisfies AuthContextValue
    }
  >
    <ThemeContext.Provider
      value={
        {
          theme: 'light',
          toggleTheme: vi.fn(),
        } satisfies ThemeContextValue
      }
    >
      {children}
    </ThemeContext.Provider>
  </AuthContext.Provider>
);

const renderAppShell = () => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <Providers>
          <AppShell />
        </Providers>
      ),
      children: [{ index: true, element: <div>page content</div> }],
    },
  ]);
  return render(<RouterProvider router={router} />);
};

describe('AppShell', () => {
  it('renders the sidebar and topbar', () => {
    renderAppShell();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the page content via Outlet', () => {
    renderAppShell();
    expect(screen.getByText('page content')).toBeInTheDocument();
  });

  it('renders main content landmark', () => {
    renderAppShell();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('toggles sidebar collapse when menu button is clicked', async () => {
    const user = userEvent.setup();
    renderAppShell();

    await user.click(screen.getByRole('button', { name: 'Toggle navigation menu' }));

    // After collapse, labels should be hidden
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
