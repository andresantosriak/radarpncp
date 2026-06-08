import * as React from 'react';

/**
 * Props for the opportunity card.
 * @startingPoint section="Radar" subtitle="Card de oportunidade (edital)" viewport="640x200"
 */
export interface OpportunityCardProps {
  /** Órgão público (e.g. "Prefeitura de Sobral"). */
  orgao?: string;
  /** Objeto da contratação — the headline. */
  titulo: string;
  cidade?: string;
  estado?: string;
  /** Modalidade badge (e.g. "Dispensa eletrônica"). */
  modalidade?: string;
  /** Formatted value string (e.g. "R$ 62.000"). */
  valor?: string;
  /** Deadline string (e.g. "14/06/2026"). */
  prazo?: string;
  /** Aderência score 0–100 — drives the gauge and accent color. */
  score: number;
  /** Status override; otherwise derived from the score band. */
  status?: 'forte' | 'boa' | 'possivel' | 'baixa';
  /** One-line recommendation from the IA. */
  recomendacao?: string;
  /** Flags the gold "Urgente" badge. */
  urgente?: boolean;
  onClick?: () => void;
}

/**
 * The core radar object — one edital/oportunidade. Shows status, modality,
 * órgão, objeto, valor, prazo, the recommendation and the aderência gauge.
 * Composes ScoreGauge + Badge.
 */
export function OpportunityCard(props: OpportunityCardProps): JSX.Element;
