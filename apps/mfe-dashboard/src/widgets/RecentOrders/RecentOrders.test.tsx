import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RecentOrders from './RecentOrders';

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

describe('RecentOrders', () => {
  it('shows loading state initially', () => {
    render(<RecentOrders />, { wrapper: createWrapper() });
    expect(screen.getByRole('status', { name: 'Loading orders...' })).toBeInTheDocument();
  });

  it('renders order rows after data loads', async () => {
    render(<RecentOrders />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('ord-001')).toBeInTheDocument();
      expect(screen.getByText('ord-002')).toBeInTheDocument();
      expect(screen.getByText('ord-003')).toBeInTheDocument();
    });
  });

  it('renders status badges for each order', async () => {
    render(<RecentOrders />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('delivered')).toBeInTheDocument();
      expect(screen.getByText('processing')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  it('formats order total as currency', async () => {
    render(<RecentOrders />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('$59.98')).toBeInTheDocument();
      expect(screen.getByText('$149.99')).toBeInTheDocument();
    });
  });

  it('has accessible section landmark', () => {
    render(<RecentOrders />, { wrapper: createWrapper() });
    expect(screen.getByRole('region', { name: 'Recent Orders' })).toBeInTheDocument();
  });

  it('renders table column headers', async () => {
    render(<RecentOrders />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'Order ID' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Total' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
    });
  });
});
