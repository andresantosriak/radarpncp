import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` = teal brand action; `secondary` = bordered surface; `ghost` = text-only; `danger` = destructive. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Control height. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Icon node rendered before the label (e.g. a Lucide <i data-lucide> or <svg>). */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Show a spinner and block interaction. */
  loading?: boolean;
  /** Render as a different element/component (e.g. 'a'). @default 'button' */
  as?: any;
  children?: React.ReactNode;
}

/**
 * Primary action button for Radar PNCP. Use one primary per view (the main
 * decision, e.g. "Analisar oportunidade"); secondary/ghost for everything else.
 */
export function Button(props: ButtonProps): JSX.Element;
