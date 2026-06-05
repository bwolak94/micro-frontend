import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly id: string;
  readonly error?: string;
  readonly helperText?: string;
}
