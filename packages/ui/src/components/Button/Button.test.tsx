import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and aria-busy when loading', () => {
    render(<Button isLoading>Loading</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    ['primary', 'bg-blue-600'],
    ['secondary', 'bg-gray-200'],
    ['ghost', 'bg-transparent'],
    ['destructive', 'bg-red-600'],
  ] as const)('applies %s variant class', (variant, expectedClass) => {
    render(<Button variant={variant}>btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(expectedClass);
  });

  it.each([
    ['sm', 'px-3'],
    ['md', 'px-4'],
    ['lg', 'px-6'],
  ] as const)('applies %s size class', (size, expectedClass) => {
    render(<Button size={size}>btn</Button>);
    expect(screen.getByRole('button')).toHaveClass(expectedClass);
  });
});
