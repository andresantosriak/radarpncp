import * as React from 'react';

export interface DialogProps {
  /** Controls visibility. */
  open: boolean;
  /** Called on scrim click, close button, or Esc. */
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Footer node — typically Buttons (Cancelar / confirm). */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/** Modal dialog — confirmar descarte, gerar proposta, editar perfil da empresa. Put actions in `footer`. */
export function Dialog(props: DialogProps): JSX.Element | null;
