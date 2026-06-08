import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name — initials are derived when no image. */
  name?: string;
  /** Image URL; falls back to initials. */
  src?: string;
  /** Preset size or a pixel number. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** `circle` for people, `square` for orgs/logos. @default 'circle' */
  shape?: 'circle' | 'square';
  tone?: 'brand' | 'gold' | 'neutral';
}

/** User or órgão avatar — initials by default, image when provided. Use `square` for órgãos públicos. */
export function Avatar(props: AvatarProps): JSX.Element;
