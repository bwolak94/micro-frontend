import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import MFEErrorBoundary from './MFEErrorBoundary';

const ThrowingChild = () => {
  throw new Error('Module federation load failure');
};

describe('MFEErrorBoundary', () => {
  beforeAll(() => {
    // Suppress console.error noise from React error boundary
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('renders children when there is no error', () => {
    render(
      <MFEErrorBoundary name="mfe-products">
        <div>healthy content</div>
      </MFEErrorBoundary>,
    );
    expect(screen.getByText('healthy content')).toBeInTheDocument();
  });

  it('renders MFEUnavailable with the MFE name when child throws', () => {
    render(
      <MFEErrorBoundary name="mfe-products">
        <ThrowingChild />
      </MFEErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('mfe-products is unavailable');
  });

  it('renders custom fallback when provided', () => {
    render(
      <MFEErrorBoundary name="mfe-products" fallback={<div>custom fallback</div>}>
        <ThrowingChild />
      </MFEErrorBoundary>,
    );
    expect(screen.getByText('custom fallback')).toBeInTheDocument();
  });
});
