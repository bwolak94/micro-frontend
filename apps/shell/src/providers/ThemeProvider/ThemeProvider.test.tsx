import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import ThemeProvider, { ThemeContext } from './ThemeProvider';

const TestConsumer = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return <div>no-context</div>;
  return (
    <div>
      <span data-testid="theme">{ctx.theme}</span>
      <button onClick={ctx.toggleTheme}>toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light theme when no preference is stored', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('restores theme from localStorage', () => {
    localStorage.setItem('mfe-portfolio:theme', 'dark');
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles theme from light to dark', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('toggle').click();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('adds dark class to document root when dark', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('toggle').click();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists toggled theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('toggle').click();
    });

    expect(localStorage.getItem('mfe-portfolio:theme')).toBe('dark');
  });
});
