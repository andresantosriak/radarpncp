-- Radar PNCP — tabela empresa_perfil: fonte de verdade do perfil da empresa.
-- Substitui o objeto `empresa` hardcoded em data.ts e a constante PERFIL no
-- coletor (coletar-pncp/index.ts). Linha UNICA (singleton): o frontend edita
-- e o coletor le para alimentar o scoring semantico.
--
-- Migration atomica: CREATE TABLE + RLS + policies + trigger + seed.

-- ============================================================
-- empresa_perfil — configuracao singleton da empresa
-- ============================================================
create table if not exists public.empresa_perfil (
  id               uuid        primary key default '00000000-0000-0000-0000-000000000001'::uuid
                               check (id = '00000000-0000-0000-0000-000000000001'::uuid),
  razao_social     text        not null,
  cnpj             text        not null,
  area             text        not null,   -- descricao curta da area de atuacao
  portfolio_texto  text        not null,   -- texto longo que alimenta embeddings semanticos do coletor
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.empresa_perfil is
  'Singleton: perfil da empresa. Maximo 1 linha, garantido pelo CHECK no id.';

-- ---- trigger updated_at ----
-- Reutiliza public.set_updated_at() criada em init_radar.sql.
drop trigger if exists trg_empresa_perfil_updated on public.empresa_perfil;
create trigger trg_empresa_perfil_updated
  before update on public.empresa_perfil
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS — CRUD aberto para anon (projeto sem autenticacao).
--
-- ATENCAO: SE autenticacao for adicionada no futuro, as policies
-- de INSERT, UPDATE e DELETE devem ser restringidas para
-- authenticated (ou role especifico). Manter apenas SELECT
-- aberto para anon se necessario.
-- ============================================================
alter table public.empresa_perfil enable row level security;

-- SELECT: leitura publica (anon + authenticated)
drop policy if exists "empresa_perfil_select_public" on public.empresa_perfil;
create policy "empresa_perfil_select_public" on public.empresa_perfil
  for select to anon, authenticated using (true);

-- INSERT: escrita publica (anon + authenticated)
-- TODO[auth]: restringir para authenticated quando auth for implementado
drop policy if exists "empresa_perfil_insert_public" on public.empresa_perfil;
create policy "empresa_perfil_insert_public" on public.empresa_perfil
  for insert to anon, authenticated with check (true);

-- UPDATE: escrita publica (anon + authenticated)
-- TODO[auth]: restringir para authenticated quando auth for implementado
drop policy if exists "empresa_perfil_update_public" on public.empresa_perfil;
create policy "empresa_perfil_update_public" on public.empresa_perfil
  for update to anon, authenticated using (true) with check (true);

-- DELETE: escrita publica (anon + authenticated)
-- TODO[auth]: restringir para authenticated quando auth for implementado
drop policy if exists "empresa_perfil_delete_public" on public.empresa_perfil;
create policy "empresa_perfil_delete_public" on public.empresa_perfil
  for delete to anon, authenticated using (true);

-- ============================================================
-- Seed — 1 linha com dados reais da AI Solution, extraidos de
-- src/lib/data.ts (empresa) e coletar-pncp/index.ts (PERFIL).
-- Idempotente via ON CONFLICT.
-- ============================================================
insert into public.empresa_perfil (razao_social, cnpj, area, portfolio_texto)
values (
  'AI Solution Exp LTDA - ME',
  '53.075.641/0001-71',
  'Automações, agentes de IA, integrações e atendimento automatizado',
  'Automações, agentes de IA, chatbots e assistentes virtuais, atendimento automatizado e digital, integrações de sistemas e APIs, desenvolvimento e licenciamento de software sob demanda, dashboards, BI, SaaS, transformação digital, portais e central de atendimento ao cidadão.'
)
on conflict (id) do nothing;
