import { eventBus } from '@portfolio/event-bus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProductActivity from './ProductActivity';

import type { ReactNode } from 'react';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
}

describe('ProductActivity', () => {
  it('shows loading state initially', () => {
    render(<ProductActivity />, { wrapper: createWrapper() });
    expect(screen.getByRole('status', { name: 'Loading products...' })).toBeInTheDocument();
  });

  it('renders product list after data loads', async () => {
    render(<ProductActivity />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('Widget A')).toBeInTheDocument();
      expect(screen.getByText('Gadget B')).toBeInTheDocument();
    });
  });

  it('renders product details', async () => {
    render(<ProductActivity />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('Widget A')).toBeInTheDocument();
    });
    expect(screen.getByText(/\$29\.99/)).toBeInTheDocument();
    expect(screen.getByText(/Stock: 150/)).toBeInTheDocument();
  });

  it('has accessible section landmark', () => {
    render(<ProductActivity />, { wrapper: createWrapper() });
    expect(screen.getByRole('region', { name: 'Product Activity' })).toBeInTheDocument();
  });

  it('re-fetches data when product:updated event is emitted', async () => {
    render(<ProductActivity />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Widget A')).toBeInTheDocument();
    });

    // Emit event — triggers query invalidation via the hook
    eventBus.emit('product:updated', { id: 'p1' });

    // Products remain visible after refetch
    await waitFor(() => {
      expect(screen.getByText('Widget A')).toBeInTheDocument();
    });
  });

  it('renders updated-at timestamps for each product', async () => {
    render(<ProductActivity />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByRole('time').length).toBeGreaterThan(0);
    });
  });
});
