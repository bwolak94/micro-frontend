import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders with label associated to input', () => {
    render(<Input id="email" label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Input id="name" label="Name" helperText="Enter your full name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('renders error message with role alert', () => {
    render(<Input id="email" label="Email" error="Invalid email" />);
    const errorEl = screen.getByRole('alert');
    expect(errorEl).toHaveTextContent('Invalid email');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input id="email" label="Email" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid without error', () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not render helper text when error is also present', () => {
    render(<Input id="email" label="Email" error="Invalid" helperText="We need your email" />);
    expect(screen.queryByText('We need your email')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid');
  });

  it('associates aria-describedby with error id', () => {
    render(<Input id="email" label="Email" error="Bad format" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('forwards additional props to the input element', () => {
    render(<Input id="age" label="Age" type="number" placeholder="Enter age" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('placeholder', 'Enter age');
  });
});
