import * as React from 'react';

export interface ToastProps {
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'gold';
  title?: React.ReactNode;
  message?: React.ReactNode;
  /** Override the leading icon. */
  icon?: React.ReactNode;
  /** When provided, shows a close button. */
  onClose?: () => void;
}

/** Notification card — "Nova oportunidade encontrada", "Proposta gerada", errors. `gold` tone for high-score finds. */
export function Toast(props: ToastProps): JSX.Element;
