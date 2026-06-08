import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone, mapped to semantic tokens. */
  tone?: 'neutral' | 'brand' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'md' | 'lg';
  /** Filled instead of soft. */
  solid?: boolean;
  /** Show a leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}

/**
 * Small status pill — opportunity status (Forte / Possível / Descartado),
 * modality, "Novo", urgency. Soft by default; use `solid` sparingly for emphasis.
 */
export function Badge(props: BadgeProps): JSX.Element;
