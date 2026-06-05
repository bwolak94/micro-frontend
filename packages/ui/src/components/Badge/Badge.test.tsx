import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies default variant classes when no variant specified', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-gray-100');
  });

  it.each([
    ['success', 'bg-green-100'],
    ['warning', 'bg-yellow-100'],
    ['error', 'bg-red-100'],
    ['info', 'bg-blue-100'],
  ] as const)('applies %s variant class', (variant, expectedClass) => {
    render(<Badge variant={variant}>{variant}</Badge>);
    expect(screen.getByText(variant)).toHaveClass(expectedClass);
  });

  it('accepts custom className', () => {
    render(<Badge className="extra-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('extra-class');
  });
});
