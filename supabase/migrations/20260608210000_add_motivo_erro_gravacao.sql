-- Add 'erro_gravacao' to motivo_descarte CHECK constraint in diagnostico_coleta.
-- Needed when oportunidades upsert fails but the excerpt was classified successfully by IA.
-- The original CHECK (4 values) was applied in 20260608190000 — this ALTER extends it.

alter table public.diagnostico_coleta
  drop constraint if exists diagnostico_coleta_motivo_descarte_check;

alter table public.diagnostico_coleta
  add constraint diagnostico_coleta_motivo_descarte_check
    check (motivo_descarte in (
      'nao_e_licitacao',
      'nao_relevante',
      'score_abaixo_threshold',
      'erro_ia',
      'erro_gravacao'
    ) or motivo_descarte is null);
