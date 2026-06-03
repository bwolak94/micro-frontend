import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import LoginPage from './LoginPage';

const renderLoginPage = (onLoginSuccess = vi.fn()) =>
  render(
    <MemoryRouter>
      <LoginPage onLoginSuccess={onLoginSuccess} />
    </MemoryRouter>,
  );

describe('LoginPage', () => {
  it('renders the page heading', () => {
    renderLoginPage();
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the login form', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders a link to the register page', () => {
    renderLoginPage();
    const registerLink = screen.getByRole('link', { name: 'Create one' });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
