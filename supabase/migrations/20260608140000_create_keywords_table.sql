-- Radar PNCP — tabela keywords: fonte de verdade das palavras-chave
-- monitoradas pelo radar. Substitui localStorage (frontend) e a constante
-- DEFAULT_KEYWORDS (src/lib/keywords.ts). O coletor diario (Edge Function
-- coletar-pncp) consulta esta tabela para filtrar editais.
--
-- Migration atomica: CREATE TABLE + RLS + policies + indice + trigger + seed.

-- ============================================================
-- keywords — termos que o radar monitora no PNCP
-- ============================================================
create table if not exists public.keywords (
  id         uuid        primary key default gen_random_uuid(),
  termo      text        not null unique,   -- texto com acentos, case original
  ativo      boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- indice (filtragem por status ativo/inativo) ----
-- A constraint UNIQUE em `termo` ja gera indice implicito.
create index if not exists idx_keywords_ativo on public.keywords (ativo);

-- ---- trigger updated_at ----
-- Reutiliza public.set_updated_at() criada em init_radar.sql.
drop trigger if exists trg_keywords_updated on public.keywords;
create trigger trg_keywords_updated
  before update on public.keywords
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS — CRUD aberto para anon (projeto sem autenticacao).
--
-- ATENCAO: SE autenticacao for adicionada no futuro, as policies
-- de INSERT, UPDATE e DELETE devem ser restringidas para
-- authenticated (ou role especifico). Manter apenas SELECT
-- aberto para anon se necessario.
-- ============================================================
alter table public.keywords enable row level security;

-- SELECT: leitura publica (anon + authenticated)
drop policy if exists "keywords_select_public" on public.keywords;
create policy "keywords_select_public" on public.keywords
  for select to anon, authenticated using (true);

-- INSERT: escrita publica (anon + authenticated)
-- TODO[auth]: restringir para authenticated quando auth for implementado
drop policy if exists "keywords_insert_public" on public.keywords;
create policy "keywords_insert_public" on public.keywords
  for insert to anon, authenticated with check (true);

-- UPDATE: escrita publica (anon + authenticated)
-- TODO[auth]: restringir para authenticated quando auth for implementado
drop policy if exists "keywords_update_public" on public.keywords;
create policy "keywords_update_public" on public.keywords
  for update to anon, authenticated using (true) with check (true);

-- DELETE: escrita publica (anon + authenticated)
-- TODO[auth]: restringir para authenticated quando auth for implementado
drop policy if exists "keywords_delete_public" on public.keywords;
create policy "keywords_delete_public" on public.keywords
  for delete to anon, authenticated using (true);

-- ============================================================
-- Seed — 26 palavras-chave reais extraidas de DEFAULT_KEYWORDS
-- (src/lib/keywords.ts). Idempotente via ON CONFLICT.
-- ============================================================
insert into public.keywords (termo) values
  ('inteligência artificial'),
  ('chatbot'),
  ('assistente virtual'),
  ('atendimento digital'),
  ('atendimento automatizado'),
  ('automação'),
  ('software'),
  ('licenciamento de software'),
  ('desenvolvimento de sistema'),
  ('sistema de informação'),
  ('sistema'),
  ('integração de sistemas'),
  ('integração'),
  ('aplicativo'),
  ('plataforma'),
  ('dashboard'),
  ('business intelligence'),
  ('SaaS'),
  ('transformação digital'),
  ('workflow'),
  ('tecnologia da informação'),
  ('informática'),
  ('gestão eletrônica'),
  ('prontuário eletrônico'),
  ('portal do cidadão'),
  ('central de atendimento')
on conflict (termo) do nothing;
