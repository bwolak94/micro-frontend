import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LoginForm from './LoginForm';

const onSuccess = vi.fn();

const mockFetch = (ok: boolean, body: unknown) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve(body),
    }),
  );

describe('LoginForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders email and password fields', () => {
    render(<LoginForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Email address'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await screen.findByText('Please enter a valid email address');
  });

  it('shows validation error when password is too short', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await screen.findByText('Password must be at least 8 characters');
  });

  it('calls onSuccess with user data on successful login', async () => {
    const user = userEvent.setup();
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test', role: 'admin' as const };
    mockFetch(true, { user: mockUser });
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockUser));
  });

  it('shows server error on failed login', async () => {
    const user = userEvent.setup();
    mockFetch(false, { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' });
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await screen.findByText('Invalid credentials');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    // Never resolves — simulates pending request
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => undefined)));
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await screen.findByText('Signing in...');
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
  });
});
