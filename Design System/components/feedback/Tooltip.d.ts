import * as React from 'react';

export interface TooltipProps {
  /** Tooltip text/content. */
  content: React.ReactNode;
  placement?: 'top' | 'bottom';
  children?: React.ReactNode;
}

/** Hover/focus tooltip — explains score criteria, abbreviations, icon-only actions. CSS-driven, no JS state. */
export function Tooltip(props: TooltipProps): JSX.Element;
