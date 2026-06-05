import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MetricCard from './MetricCard';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title="Total Revenue" value={142350} />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('142350')).toBeInTheDocument();
  });

  it('formats value with provided formatter', () => {
    const formatter = (v: number | string) => `$${Number(v).toLocaleString()}`;
    render(<MetricCard title="Revenue" value={142350} formatter={formatter} />);
    expect(screen.getByText('$142,350')).toBeInTheDocument();
  });

  it('renders positive trend', () => {
    render(<MetricCard title="Orders" value={100} trend={12} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('renders negative trend', () => {
    render(<MetricCard title="Orders" value={100} trend={-5} />);
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('does not render trend when not provided', () => {
    render(<MetricCard title="Products" value={86} />);
    expect(screen.queryByRole('region', { name: /trend/i })).not.toBeInTheDocument();
  });

  it('has accessible region label', () => {
    render(<MetricCard title="New Users" value={34} />);
    expect(screen.getByRole('region', { name: 'New Users' })).toBeInTheDocument();
  });
});
