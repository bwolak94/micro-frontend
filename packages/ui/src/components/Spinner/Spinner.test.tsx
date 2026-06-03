import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByRole('status', { name: 'Fetching data' })).toBeInTheDocument();
  });

  it('renders screen-reader text for the label', () => {
    render(<Spinner label="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it.each([
    ['sm', 'h-4'],
    ['md', 'h-6'],
    ['lg', 'h-8'],
    ['xl', 'h-12'],
  ] as const)('applies %s size class to spinner circle', (size, expectedClass) => {
    render(<Spinner size={size} />);
    const circle = screen.getByRole('status').querySelector('[aria-hidden="true"]');
    expect(circle).toHaveClass(expectedClass);
  });

  it('accepts custom className on wrapper', () => {
    render(<Spinner className="my-spinner" />);
    expect(screen.getByRole('status')).toHaveClass('my-spinner');
  });
});
