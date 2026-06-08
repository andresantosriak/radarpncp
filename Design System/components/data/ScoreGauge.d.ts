import * as React from 'react';

/**
 * Props for the aderência gauge.
 * @startingPoint section="Radar" subtitle="Score de aderência 0–100" viewport="200x140"
 */
export interface ScoreGaugeProps {
  /** Aderência score 0–100. Band color is derived automatically. */
  value: number;
  /** Diameter in px. @default 84 */
  size?: number;
  /** Ring thickness. @default 8 */
  stroke?: number;
  /** Show the band caption under the gauge. @default true */
  showLabel?: boolean;
  /** Override the caption text (defaults to the band name). */
  caption?: string;
}

/**
 * Circular aderência gauge — the signature radar metric. Color follows the
 * score bands: 0–39 baixa (red), 40–69 possível (amber), 70–84 boa (teal),
 * 85–100 muito forte (green). Exports `scoreBand(v)` helper too.
 */
export function ScoreGauge(props: ScoreGaugeProps): JSX.Element;

export function scoreBand(v: number): { key: string; color: string; label: string };
