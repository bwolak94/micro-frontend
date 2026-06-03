import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MFEUnavailable from './MFEUnavailable';

describe('MFEUnavailable', () => {
  it('renders the MFE name in the heading', () => {
    render(<MFEUnavailable name="mfe-products" />);
    expect(screen.getByRole('heading')).toHaveTextContent('mfe-products is unavailable');
  });

  it('renders the alert role for screen readers', () => {
    render(<MFEUnavailable name="mfe-auth" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<MFEUnavailable name="mfe-auth" />);
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('renders retry button and calls onRetry when clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<MFEUnavailable name="mfe-auth" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
