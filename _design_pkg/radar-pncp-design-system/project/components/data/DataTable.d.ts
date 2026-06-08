import * as React from 'react';

export interface DataTableColumn {
  /** Row object key this column reads. */
  key: string;
  /** Column header text. */
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Render cell with mono tabular figures (valores, datas, scores). */
  mono?: boolean;
  /** Emphasize cell text (strong color/weight). */
  strong?: boolean;
  /** Fixed column width (CSS value). */
  width?: string;
  /** Custom cell renderer. */
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: any[];
  /** Makes rows hoverable + clickable. */
  onRowClick?: (row: any, index: number) => void;
  getRowKey?: (row: any, index: number) => React.Key;
}

/** Dense, sticky-header table — full edital lists, documentos exigidos, composição de custos. Use `mono` columns for numbers. */
export function DataTable(props: DataTableProps): JSX.Element;
