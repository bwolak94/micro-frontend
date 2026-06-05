import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SalesChart from './SalesChart';

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

describe('SalesChart', () => {
  it('renders loading state initially', () => {
    render(<SalesChart range="30d" onRangeChange={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByRole('status', { name: 'Loading sales data...' })).toBeInTheDocument();
  });

  it('renders all range buttons', () => {
    render(<SalesChart range="30d" onRangeChange={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByRole('button', { name: '7D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '90D' })).toBeInTheDocument();
  });

  it('marks active range button as pressed', () => {
    render(<SalesChart range="30d" onRangeChange={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByRole('button', { name: '30D' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '7D' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onRangeChange when a range button is clicked', () => {
    const onRangeChange = vi.fn();
    render(<SalesChart range="30d" onRangeChange={onRangeChange} />, {
      wrapper: createWrapper(),
    });
    fireEvent.click(screen.getByRole('button', { name: '7D' }));
    expect(onRangeChange).toHaveBeenCalledWith('7d');
  });

  it('renders chart after data loads', async () => {
    render(<SalesChart range="30d" onRangeChange={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  it('has accessible section landmark', () => {
    render(<SalesChart range="30d" onRangeChange={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByRole('region', { name: 'Sales Chart' })).toBeInTheDocument();
  });

  it('renders Revenue heading', () => {
    render(<SalesChart range="30d" onRangeChange={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByRole('heading', { name: 'Revenue' })).toBeInTheDocument();
  });
});
