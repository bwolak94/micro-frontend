import { useContext } from 'react';

import { ThemeContext } from '../providers/ThemeProvider/ThemeProvider';

import type { ThemeContextValue } from '../providers/ThemeProvider/ThemeProvider.types';

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
