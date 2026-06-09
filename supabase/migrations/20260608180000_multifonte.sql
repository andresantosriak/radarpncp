-- Radar PNCP — multi-fonte: preparar oportunidades para receber editais
-- de multiplas fontes alem do PNCP (ex: Querido Diario, ComprasNet).
--
-- Migration aditiva e idempotente (add column if not exists, create index
-- if not exists). Nao altera RLS — a coluna nova herda as policies da tabela.
--
-- ============================================================
-- ESTRATEGIA DE CHAVE UNICA POR FONTE
-- ============================================================
-- A coluna `controle_pncp` continua como chave unica universal.
-- Para fontes que nao possuem numeroControlePNCP, o coletor gera
-- um ID SINTETICO DETERMINISTICO no mesmo campo, com prefixo da fonte:
--
--   PNCP:           valor original do PNCP (sem prefixo, retrocompativel)
--   Querido Diario: QD:<territory_id>:<YYYY-MM-DD>:<hash8>
--                   hash8 = primeiros 8 hex de sha256(titulo_ou_objeto)
--                   Exemplo: QD:3550308:2026-06-01:a1b2c3d4
--
-- O hash e calculado sobre um campo estavel do edital (titulo/objeto),
-- garantindo idempotencia: coletas repetidas geram o mesmo id sintetico,
-- permitindo upsert por controle_pncp sem duplicacao.
--
-- Cada coletor e responsavel por gerar o id sintetico de forma estavel.
-- O formato do prefixo para novas fontes segue o padrao:
--   <SIGLA_FONTE>:<identificador_natural>:<hash8>
--
-- ============================================================
-- DEDUP CROSS-FONTE (decisao de piloto)
-- ============================================================
-- Um mesmo edital pode aparecer no PNCP e em outra fonte (ex: Querido
-- Diario publica o mesmo certame no diario oficial municipal). Sem
-- identificador comum entre fontes, a dedup automatica cross-fonte e
-- inviavel sem matching semantico (comparacao de textos/embeddings).
--
-- DECISAO PILOTO: aceitar duplicacao cross-fonte. A coluna `fonte`
-- permite filtrar e distinguir origens. Dedup semantico cross-fonte
-- fica para fase futura (matching por embedding + titulo + orgao + datas).
-- ============================================================

-- Coluna: identifica a origem do edital
alter table public.oportunidades
  add column if not exists fonte text not null default 'pncp';

comment on column public.oportunidades.fonte is
  'Origem do edital. Valores: ''pncp'' (Portal Nacional de Contratacoes Publicas), '
  '''querido-diario'' (Querido Diario — diarios oficiais municipais). '
  'Novas fontes adicionam novos valores. O coletor de cada fonte gera o '
  'controle_pncp com prefixo sintetico quando a fonte nao possui numeroControlePNCP.';

-- Indice: queries filtram por fonte (dashboard, contagens, export)
create index if not exists idx_oportunidades_fonte
  on public.oportunidades (fonte);
