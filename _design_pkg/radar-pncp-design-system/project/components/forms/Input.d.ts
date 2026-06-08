import * as React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field label above the control. */
  label?: string;
  /** Helper text below (hidden when `error` is set). */
  hint?: string;
  /** Error message — turns the field red. */
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: 'sm' | 'md';
}

/** Labelled text input — search, valores, keywords, settings. Pass `iconLeft` (e.g. a search glyph) for search fields. */
export function Input(props: InputProps): JSX.Element;
