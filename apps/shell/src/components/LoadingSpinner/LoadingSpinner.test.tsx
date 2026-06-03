import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<LoadingSpinner label="Fetching data" />);
    expect(screen.getByRole('status', { name: 'Fetching data' })).toBeInTheDocument();
  });

  it('renders screen-reader text', () => {
    render(<LoadingSpinner label="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });
});
