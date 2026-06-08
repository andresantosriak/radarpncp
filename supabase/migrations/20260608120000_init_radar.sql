-- Radar PNCP — schema inicial: oportunidades + análises por IA (LLM lê o edital).
-- Tabela + RLS + índices na mesma migration (regra do projeto).

create extension if not exists "pgcrypto";

-- ============================================================
-- oportunidades — cache de editais analisados (vindos do PNCP)
-- ============================================================
create table if not exists public.oportunidades (
  id                uuid primary key default gen_random_uuid(),
  controle_pncp     text not null unique,         -- numeroControlePNCP
  cnpj              text,
  ano               int,
  sequencial        int,
  orgao             text,
  cidade            text,
  estado            text,
  titulo            text,
  objeto            text,
  modalidade        text,
  valor_estimado    numeric,
  data_publicacao   date,
  data_encerramento date,
  link              text,
  status            text,
  score_heuristico  int,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- analises_ia — resultado da análise por LLM sobre o PDF do edital
-- ============================================================
create table if not exists public.analises_ia (
  id              uuid primary key default gen_random_uuid(),
  oportunidade_id uuid references public.oportunidades(id) on delete cascade,
  controle_pncp   text not null,
  modelo          text not null,
  score_ia        int,
  recomendacao    text,
  resumo          text,
  por_que_combina jsonb not null default '[]'::jsonb,
  por_que_nao     jsonb not null default '[]'::jsonb,
  documentos      jsonb not null default '[]'::jsonb,
  custos          jsonb not null default '[]'::jsonb,
  custo_total     text,
  proposta_min    text,
  proposta_ideal  text,
  margem          text,
  risco           text,
  concorrencia    text,
  burocracia      text,
  chance          text,
  fonte_pdf       text,    -- url do documento lido
  texto_chars     int,     -- nº de caracteres extraídos do PDF
  created_at      timestamptz not null default now()
);

-- ---- índices (colunas usadas em filtro/join/order) ----
create index if not exists idx_oportunidades_controle on public.oportunidades (controle_pncp);
create index if not exists idx_oportunidades_status    on public.oportunidades (status);
create index if not exists idx_analises_oportunidade   on public.analises_ia (oportunidade_id);
create index if not exists idx_analises_controle       on public.analises_ia (controle_pncp);
create index if not exists idx_analises_created        on public.analises_ia (created_at desc);

-- ---- trigger updated_at ----
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_oportunidades_updated on public.oportunidades;
create trigger trg_oportunidades_updated
  before update on public.oportunidades
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS — leitura pública (editais públicos, sem PII); escrita só
-- via service_role (Edge Function), que ignora RLS por padrão.
-- ============================================================
alter table public.oportunidades enable row level security;
alter table public.analises_ia   enable row level security;

drop policy if exists "oportunidades_select_public" on public.oportunidades;
create policy "oportunidades_select_public" on public.oportunidades
  for select to anon, authenticated using (true);

drop policy if exists "analises_select_public" on public.analises_ia;
create policy "analises_select_public" on public.analises_ia
  for select to anon, authenticated using (true);
