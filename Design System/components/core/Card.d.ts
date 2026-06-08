import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Apply default inner padding. @default true */
  padded?: boolean;
  /** Resting shadow depth. @default 'sm' */
  elevation?: 'none' | 'sm' | 'md';
  /** Lift + deepen shadow on hover (for clickable cards). */
  interactive?: boolean;
  /** Left brand accent stripe. */
  accent?: boolean;
  /** Optional header title. */
  title?: React.ReactNode;
  /** Optional header subtitle under the title. */
  subtitle?: React.ReactNode;
  /** Node pinned to the top-right of the header (menu, badge). */
  action?: React.ReactNode;
  children?: React.ReactNode;
}

/** Generic surface container — the base for dashboard panels, stat blocks and detail sections. */
export function Card(props: CardProps): JSX.Element;
