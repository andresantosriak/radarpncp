import * as React from 'react';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional count pill (e.g. number of editais in this filter). */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled active value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** `underline` (page sections) or `pill` (compact segmented). @default 'underline' */
  variant?: 'underline' | 'pill';
  className?: string;
}

/** Tab bar — dashboard filters (Melhores / Urgentes / Acima de R$50k / Descartados) and detail-view sections. Supports count pills. */
export function Tabs(props: TabsProps): JSX.Element;
