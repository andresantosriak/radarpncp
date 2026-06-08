import * as React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon name in kebab-case (e.g. "alarm-clock", "chevron-down"). */
  name: string;
  /** Pixel size of the square icon. @default 18 */
  size?: number;
  /** SVG stroke width. @default 2 */
  strokeWidth?: number;
}

/**
 * Brand icon — renders a Lucide glyph as a React-owned inline SVG (safe across
 * re-renders). Requires the Lucide UMD global to be present on the page
 * (the design system standardizes on Lucide, 2px stroke). Inherits `currentColor`.
 */
export function Icon(props: IconProps): JSX.Element;
