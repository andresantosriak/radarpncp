import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `ghost` (default), `outline`, or `solid` (brand fill). */
  variant?: 'ghost' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  /** Toggled/selected state (brand-soft background). */
  active?: boolean;
  /** Accessible label — required, surfaced as aria-label + tooltip. */
  label: string;
  /** The icon node (Lucide <i data-lucide> or <svg>). */
  children?: React.ReactNode;
}

/** Square icon-only button for toolbars, table row actions, and the topbar. Always pass `label`. */
export function IconButton(props: IconButtonProps): JSX.Element;
