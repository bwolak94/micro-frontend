import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import RegisterPage from './RegisterPage';

const renderRegisterPage = (onRegisterSuccess = vi.fn()) =>
  render(
    <MemoryRouter>
      <RegisterPage onRegisterSuccess={onRegisterSuccess} />
    </MemoryRouter>,
  );

describe('RegisterPage', () => {
  it('renders the page heading', () => {
    renderRegisterPage();
    expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument();
  });

  it('renders the register form with all fields', () => {
    renderRegisterPage();
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
  });

  it('renders a link back to the login page', () => {
    renderRegisterPage();
    const loginLink = screen.getByRole('link', { name: 'Sign in' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
