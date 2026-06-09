-- Radar PNCP — diagnostico_coleta: telemetria de classificacao IA do coletor.
-- Registra TODOS os resultados da analise (capturados + descartados).
-- Tabela append-only no MVP; upsert por (fonte, excerpt_hash).

create table if not exists public.diagnostico_coleta (
  id              uuid        primary key default gen_random_uuid(),
  fonte           text        not null,
  territory_id    text,
  gazette_date    date,
  excerpt_hash    text        not null,
  territory_name  text,
  state_code      text,
  gazette_url     text,
  eh_licitacao    boolean,
  relevante       boolean,
  score           int,
  justificativa   text,
  objeto          text,
  orgao           text,
  modalidade      text,
  valor_estimado  numeric,
  prazo           text,
  capturado       boolean     not null default false,
  motivo_descarte text        check (motivo_descarte in (
                                'nao_e_licitacao',
                                'nao_relevante',
                                'score_abaixo_threshold',
                                'erro_ia'
                              ) or motivo_descarte is null),
  dados_brutos    jsonb,
  created_at      timestamptz not null default now(),

  constraint uq_diagnostico_fonte_hash unique (fonte, excerpt_hash)
);

-- RLS
alter table public.diagnostico_coleta enable row level security;

create policy diagnostico_select_public on public.diagnostico_coleta
  for select to anon, authenticated using (true);

-- Indices
create index if not exists idx_diagnostico_created
  on public.diagnostico_coleta (created_at desc);

create index if not exists idx_diagnostico_motivo
  on public.diagnostico_coleta (motivo_descarte);

create index if not exists idx_diagnostico_score
  on public.diagnostico_coleta (score);

create index if not exists idx_diagnostico_fonte
  on public.diagnostico_coleta (fonte);

create index if not exists idx_diagnostico_capturado
  on public.diagnostico_coleta (capturado);
