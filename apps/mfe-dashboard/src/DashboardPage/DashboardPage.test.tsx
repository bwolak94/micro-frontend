import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import DashboardPage from './DashboardPage';

import type { ReactNode } from 'react';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

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

describe('DashboardPage', () => {
  it('renders initial loading states', () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('renders SalesChart region', () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('region', { name: 'Sales Chart' })).toBeInTheDocument();
  });

  it('renders RecentOrders region', () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('region', { name: 'Recent Orders' })).toBeInTheDocument();
  });

  it('renders ProductActivity region', () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('region', { name: 'Product Activity' })).toBeInTheDocument();
  });

  it('renders metric cards after metrics load', async () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Total Revenue' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Total Orders' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Active Products' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'New Users' })).toBeInTheDocument();
    });
  });

  it('formats total revenue as currency', async () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('$142,350')).toBeInTheDocument();
    });
  });

  it('changes sales chart range when range button is clicked', async () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    const btn7d = screen.getByRole('button', { name: '7D' });
    fireEvent.click(btn7d);
    expect(btn7d).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders all range selector buttons in SalesChart', () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: '7D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '90D' })).toBeInTheDocument();
  });
});
