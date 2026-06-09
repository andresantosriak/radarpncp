# PRD (Bug Fix): Filtro de Prazo no Radar PNCP

**Status:** Aprovado
**Versao:** 1.0
**Data:** 2026-06-09
**Tipo:** Bug fix

## TL;DR

O coletor `coletar-pncp` busca editais por data de publicacao (janela de 45 dias) mas nao filtra por data de encerramento de proposta. Resultado: editais com prazo vencido sao exibidos como oportunidades ativas. Dos 50 editais coletados em abril/2026, apenas 2 tem prazo aberto, 22 ja venceram e 26 nao informam prazo.

## Problema

- **O que acontece hoje:** O coletor faz upsert de todos os editais que passam no filtro de aderencia (keywords + score), independente de o prazo para envio de propostas ja ter encerrado. O frontend exibe todos sem distincao.
- **Para quem:** Usuario do Radar PNCP que busca oportunidades ativas de licitacao.
- **Impacto:** ~44% dos editais exibidos ja estao vencidos (22/50). O usuario perde tempo analisando oportunidades que nao pode mais disputar. Isso corroi a confianca no radar.

## Causa Raiz

Arquivo `supabase/functions/coletar-pncp/index.ts`, linhas 177-227: o loop `editais.forEach` monta o payload de upsert usando `e.dataEncerramentoProposta` apenas para popular `data_encerramento` e calcular `urgente`, mas **nunca descarta** editais com prazo ja vencido.

O frontend (`src/lib/db.ts`, funcao `fetchOportunidades`) faz `SELECT * ... ORDER BY data_publicacao.desc` sem filtrar por data de encerramento ou status.

## Decisoes

### D1 — Editais sem data de encerramento: MANTER

26 dos 50 editais (52%) nao informam `dataEncerramentoProposta` na API do PNCP. Descartar esses editais significaria perder mais da metade das oportunidades reais. Muitos editais legitimos (dispensas, credenciamentos, inexigibilidades) nao publicam prazo ou tem prazo indeterminado.

**Decisao:** Editais sem data de encerramento sao mantidos normalmente. O filtro de prazo aplica-se **apenas** a editais que informam data e cuja data ja passou.

### D2 — Coluna `status`: nao sobrescrever score de aderencia

A coluna `status` hoje armazena scores de aderencia (`boa`, `forte`, `possivel`). Sobrescrever com `encerrado` perderia informacao de relevancia. Uma flag booleana separada e mais limpa e preserva ambas as dimensoes.

**Decisao:** Adicionar coluna `encerrado boolean not null default false` na tabela `oportunidades`. O status de aderencia permanece intacto. O coletor seta `encerrado = true` ao detectar prazo vencido. O frontend usa essa flag para filtrar/segregar.

### D3 — Frontend: ocultar encerrados por padrao com toggle

**Decisao:** O dashboard oculta editais encerrados por padrao. Um toggle/checkbox "Mostrar encerrados" permite visualiza-los (para referencia ou analise historica). Editais encerrados aparecem com visual diferenciado (opacidade reduzida + badge "Encerrado").

### D4 — Ordenacao: manter data_publicacao como padrao

**Decisao:** Manter ordenacao por `data_publicacao DESC` como padrao (usuario espera ver "mais recentes"). Adicionar opcao de ordenacao por "Prazo (mais urgentes)" que ordena por `data_encerramento ASC NULLS LAST` — editais com prazo proximo aparecem primeiro, sem prazo ficam por ultimo.

### D5 — Querido Diario: nao aplicavel

O coletor `coletar-querido-diario` extrai `prazo` como texto livre via IA (ex: "30 dias", "ate 15/07"). Nao ha campo estruturado de data de encerramento. Filtrar por data exigiria parsing de texto livre, que e fragil e propenso a erros.

**Decisao:** Nenhuma alteracao no coletor Querido Diario. Documentar como "nao aplicavel — prazo nao estruturado".

## Criterios de Aceite

### CA-1: Coletor `coletar-pncp`

- [ ] Antes do upsert, verificar se `dataEncerramentoProposta` esta preenchido E se a data e anterior a `new Date()` (hoje)
- [ ] Se prazo vencido: setar `encerrado = true` no payload de upsert
- [ ] Se prazo nao informado (null): setar `encerrado = false` (manter como ativo)
- [ ] Se prazo futuro ou hoje: setar `encerrado = false`
- [ ] A janela de busca (45 dias) NAO deve ser alterada — o filtro e no momento do upsert, nao na consulta a API
- [ ] Editais com prazo vencido continuam sendo coletados (upsert normal) — apenas marcados como encerrados

### CA-2: Limpeza de dados existentes

- [ ] Migration SQL: `UPDATE oportunidades SET encerrado = true WHERE data_encerramento IS NOT NULL AND data_encerramento < CURRENT_DATE`
- [ ] Antes de aplicar: executar `SELECT count(*) FROM oportunidades WHERE data_encerramento IS NOT NULL AND data_encerramento < CURRENT_DATE` como preview
- [ ] NAO deletar registros — apenas marcar como encerrados
- [ ] Editais sem `data_encerramento` permanecem com `encerrado = false`

### CA-3: Frontend — query e exibicao

- [ ] `fetchOportunidades` em `src/lib/db.ts`: adicionar filtro `encerrado=eq.false` por padrao na query REST
- [ ] Adicionar toggle "Mostrar encerrados" no Dashboard que remove o filtro
- [ ] Quando encerrados visiveis: aplicar opacidade reduzida + badge "Encerrado"
- [ ] Adicionar opcao de ordenacao "Prazo (mais urgentes)": `order=data_encerramento.asc.nullslast`

### CA-4: Schema

- [ ] Migration: `ALTER TABLE oportunidades ADD COLUMN IF NOT EXISTS encerrado boolean NOT NULL DEFAULT false`
- [ ] Indice: `CREATE INDEX IF NOT EXISTS idx_oportunidades_encerrado ON oportunidades (encerrado)`
- [ ] UPDATE de dados existentes na mesma migration (conforme CA-2)

### CA-5: Querido Diario

- [ ] Nenhuma alteracao no coletor `coletar-querido-diario` — prazo nao estruturado, filtro nao aplicavel

## Requisitos Nao-Funcionais

- **Performance:** O filtro `WHERE encerrado = false` com indice deve manter latencia <200ms com ate 10.000 registros
- **Retrocompatibilidade:** A coluna `encerrado` tem default `false` — todos os registros existentes sem data de encerramento continuam visiveis sem migration de dados complexa
- **Idempotencia:** Re-executar o coletor nao deve alterar o estado de editais ja marcados (upsert com `encerrado` calculado a cada execucao garante consistencia)

## Fora do Escopo

| Item | Motivo |
|------|--------|
| Reabrir edital encerrado automaticamente | Casos de republicacao sao raros; complexidade nao justifica no bug fix |
| Notificacao de prazo proximo (push/email) | Feature futura, nao bug fix |
| Filtro de prazo no Querido Diario | Prazo e texto livre da IA, sem data estruturada |
| Dedup cross-fonte de editais encerrados | Fora do escopo deste fix (decisao pre-existente aceita duplicacao cross-fonte) |

## Historico de Versoes

| Versao | Data | Mudanca |
|--------|------|---------|
| 1.0 | 2026-06-09 | Versao inicial — bug fix filtro de prazo |
