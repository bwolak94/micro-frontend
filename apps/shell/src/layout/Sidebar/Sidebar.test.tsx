import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Sidebar from './Sidebar';

const renderSidebar = (props = {}) =>
  render(
    <MemoryRouter>
      <Sidebar {...props} />
    </MemoryRouter>,
  );

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    renderSidebar();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
  });

  it('renders the brand name when not collapsed', () => {
    renderSidebar();
    expect(screen.getByText('MFE Portfolio')).toBeInTheDocument();
  });

  it('hides labels and brand when collapsed', () => {
    renderSidebar({ isCollapsed: true });
    expect(screen.queryByText('MFE Portfolio')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('has accessible navigation landmark', () => {
    renderSidebar();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });
});
