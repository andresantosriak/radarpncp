import * as React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  /** Options as strings or {value,label}. Alternatively pass <option> children. */
  options?: (string | SelectOption)[];
  size?: 'sm' | 'md';
}

/** Native select with brand chevron — modalidade, estado, ordenação, status filters. */
export function Select(props: SelectProps): JSX.Element;
