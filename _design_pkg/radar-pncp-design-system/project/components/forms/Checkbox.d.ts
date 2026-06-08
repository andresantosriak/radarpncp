import * as React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Main label text. */
  label?: React.ReactNode;
  /** Secondary description below the label. */
  description?: string;
  /** `checkbox` (default) or `radio` — same visual family. */
  type?: 'checkbox' | 'radio';
}

/** Checkbox / radio with optional description — filter lists, settings, alert channels. Set `type="radio"` for single-choice. */
export function Checkbox(props: CheckboxProps): JSX.Element;
