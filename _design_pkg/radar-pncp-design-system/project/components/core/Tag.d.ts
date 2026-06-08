import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Selected filter state (brand-soft). */
  selected?: boolean;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** When provided, renders a removable "×" affordance. */
  onRemove?: (e: any) => void;
  onClick?: (e: any) => void;
  children?: React.ReactNode;
}

/**
 * Keyword / filter chip — the saved search terms ("chatbot", "automação"),
 * active filters, and required-document tags. Clickable when `onClick`,
 * removable when `onRemove`.
 */
export function Tag(props: TagProps): JSX.Element;
