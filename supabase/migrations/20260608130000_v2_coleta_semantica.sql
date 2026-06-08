-- Radar PNCP — v2: coleta server-side, busca semântica (pgvector) e cron.

create extension if not exists vector;
create extension if not exists pg_net;
create extension if not exists pg_cron;

-- Colunas extras em oportunidades para a coleta automática + semântica.
alter table public.oportunidades
  add column if not exists tags            jsonb   not null default '[]'::jsonb,
  add column if not exists objeto_curto    text,
  add column if not exists urgente         boolean not null default false,
  add column if not exists score_semantico int,        -- similaridade IA 0-100
  add column if not exists embedding       vector(1536),
  add column if not exists coletado_em     timestamptz not null default now();

create index if not exists idx_oportunidades_score
  on public.oportunidades (score_heuristico desc nulls last);
