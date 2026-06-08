import * as React from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional inline label. */
  label?: React.ReactNode;
}

/** On/off toggle — alert channels, monitoring on/off, settings preferences. */
export function Switch(props: SwitchProps): JSX.Element;
