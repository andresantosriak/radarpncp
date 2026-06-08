import * as React from 'react';

export interface StatCardProps {
  /** Metric name, e.g. "Oportunidades ativas". */
  label: string;
  /** Big value (string or number) — rendered in mono tabular figures. */
  value: React.ReactNode;
  /** Icon node shown top-right. */
  icon?: React.ReactNode;
  /** Icon tint. @default 'brand' */
  tone?: 'brand' | 'gold' | 'danger' | 'info';
  /** Change figure, e.g. "+12". */
  delta?: string;
  /** Direction of the delta. @default 'up' */
  deltaDir?: 'up' | 'down';
  /** Trailing subtext, e.g. "vs. semana passada". */
  sub?: string;
}

/** Dashboard KPI tile — counts, totals, urgent items. The value uses mono tabular figures. */
export function StatCard(props: StatCardProps): JSX.Element;
