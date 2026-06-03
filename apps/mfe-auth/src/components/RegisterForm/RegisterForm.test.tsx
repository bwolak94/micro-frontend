import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RegisterForm from './RegisterForm';

const onSuccess = vi.fn();

const mockFetch = (ok: boolean, body: unknown) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve(body),
    }),
  );

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = {},
) => {
  const values = {
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'securepass123',
    confirmPassword: 'securepass123',
    ...overrides,
  };
  await user.type(screen.getByLabelText('Full name'), values.name);
  await user.type(screen.getByLabelText('Email address'), values.email);
  await user.type(screen.getByLabelText('Password'), values.password);
  await user.type(screen.getByLabelText('Confirm password'), values.confirmPassword);
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders all required fields', () => {
    render(<RegisterForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
  });

  it('shows error when name is too short', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Full name'), 'A');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await screen.findByText('Name must be at least 2 characters');
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={onSuccess} />);

    await fillForm(user, { confirmPassword: 'differentpass' });
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await screen.findByText("Passwords don't match");
  });

  it('calls onSuccess with user data on successful registration', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '2',
      email: 'alice@example.com',
      name: 'Alice Smith',
      role: 'manager' as const,
    };
    mockFetch(true, { user: mockUser });
    render(<RegisterForm onSuccess={onSuccess} />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockUser));
  });

  it('shows server error when registration fails', async () => {
    const user = userEvent.setup();
    mockFetch(false, { statusCode: 409, message: 'Email already in use', error: 'Conflict' });
    render(<RegisterForm onSuccess={onSuccess} />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await screen.findByText('Email already in use');
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
