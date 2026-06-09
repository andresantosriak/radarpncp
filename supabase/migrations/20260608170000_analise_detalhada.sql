-- Radar PNCP — novos campos na análise IA para leitura profunda do edital.
-- Aditiva e idempotente (ADD COLUMN IF NOT EXISTS).

alter table public.analises_ia
  add column if not exists requisitos_tecnicos jsonb not null default '[]'::jsonb,
  add column if not exists prazos             jsonb not null default '[]'::jsonb,
  add column if not exists criterio_julgamento text;
