# Stories: Filtro de Prazo no Radar PNCP

**Tipo:** Bug fix
**PRD:** docs/radar-pncp-prd-filtro-prazo.md

---

## US-FP01: Filtro de prazo no coletor PNCP

**Como** usuario do Radar PNCP
**Quero** que o coletor marque automaticamente editais com prazo vencido como encerrados
**Para** ver apenas oportunidades nas quais ainda posso enviar proposta

**Contexto:** O coletor `coletar-pncp` busca editais por data de publicacao (janela de 45 dias) e faz upsert em `oportunidades`. Hoje, editais com `dataEncerramentoProposta` ja passada sao inseridos como ativos.

**Criterios de Aceite — Happy Path:**
- [ ] Dado que o coletor recebeu um edital com `dataEncerramentoProposta = 2026-05-01` e hoje e `2026-06-09`, quando fizer o upsert, entao o campo `encerrado` deve ser `true`
- [ ] Dado que o coletor recebeu um edital com `dataEncerramentoProposta = 2026-07-15`, quando fizer o upsert, entao o campo `encerrado` deve ser `false`
- [ ] Dado que o coletor recebeu um edital com `dataEncerramentoProposta = null`, quando fizer o upsert, entao o campo `encerrado` deve ser `false`
- [ ] Dado que o coletor recebeu um edital com `dataEncerramentoProposta` igual a data de hoje, quando fizer o upsert, entao o campo `encerrado` deve ser `false` (prazo encerra no fim do dia)

**Criterios de Aceite — Edge Cases:**
- [ ] Dado que um edital ja existe no banco com `encerrado = false` e e re-coletado com prazo agora vencido, quando o upsert executar, entao `encerrado` deve ser atualizado para `true`
- [ ] A janela de busca (45 dias) e a frequencia do cron NAO sao alteradas
- [ ] O filtro de aderencia (keywords + score) permanece inalterado — o `encerrado` e calculado apos o filtro de aderencia, nao antes

**Fora do escopo:**
- Alterar o coletor `coletar-querido-diario` (prazo nao estruturado)
- Deletar editais encerrados (apenas marcar)

**Prioridade:** Alta
**Tamanho:** P (<=1d)
**Dependencias:** Schema (US-FP03 deve ser aplicada antes ou na mesma sprint)

---

## US-FP02: Limpeza de dados existentes

**Como** usuario do Radar PNCP
**Quero** que editais ja coletados com prazo vencido sejam marcados como encerrados
**Para** que o dashboard reflita o estado correto imediatamente apos o deploy

**Contexto:** Existem ~22 editais no banco com `data_encerramento < hoje` que nunca foram marcados. A coluna `encerrado` sera adicionada com default `false`, entao esses registros ficariam incorretamente como ativos sem esta limpeza.

**Criterios de Aceite — Happy Path:**
- [ ] Dado que a migration foi aplicada, quando executar `SELECT count(*) FROM oportunidades WHERE encerrado = true`, entao o resultado deve ser >= 22 (editais com prazo vencido)
- [ ] Dado que um edital tem `data_encerramento IS NULL`, quando a migration executar, entao `encerrado` permanece `false`
- [ ] Dado que um edital tem `data_encerramento >= CURRENT_DATE`, quando a migration executar, entao `encerrado` permanece `false`

**Criterios de Aceite — Edge Cases:**
- [ ] A migration e idempotente — re-aplicar nao causa erro nem altera dados ja corretos
- [ ] Nenhum registro e deletado — apenas UPDATE de `encerrado`
- [ ] A migration inclui comentario SQL com SELECT count de preview para auditoria

**Fora do escopo:**
- DELETE de registros encerrados
- Alteracao de score ou status de aderencia dos editais afetados

**Prioridade:** Alta
**Tamanho:** P (<=1d)
**Dependencias:** US-FP03 (schema deve existir)

---

## US-FP03: Schema — coluna `encerrado` e indice

**Como** desenvolvedor
**Quero** que a tabela `oportunidades` tenha a coluna `encerrado` com indice
**Para** suportar o filtro de prazo no coletor e no frontend

**Criterios de Aceite:**
- [ ] `ALTER TABLE oportunidades ADD COLUMN IF NOT EXISTS encerrado boolean NOT NULL DEFAULT false`
- [ ] `CREATE INDEX IF NOT EXISTS idx_oportunidades_encerrado ON oportunidades (encerrado)`
- [ ] `UPDATE oportunidades SET encerrado = true WHERE data_encerramento IS NOT NULL AND data_encerramento < CURRENT_DATE` (limpeza de dados existentes — combina com US-FP02)
- [ ] Migration atomica: coluna + indice + update na mesma migration
- [ ] Migration nomeada `20260609_add_encerrado_flag.sql`

**Prioridade:** Alta (bloqueante para US-FP01 e US-FP02)
**Tamanho:** P (<=1d)
**Dependencias:** Nenhuma

---

## US-FP04: Frontend — ocultar encerrados e ordenacao por urgencia

**Como** usuario do Radar PNCP
**Quero** ver apenas editais com prazo aberto no dashboard, com opcao de mostrar encerrados e ordenar por urgencia
**Para** focar meu tempo nas oportunidades que ainda posso disputar

**Contexto:** A funcao `fetchOportunidades` em `src/lib/db.ts` faz `SELECT * ... ORDER BY data_publicacao.desc` sem filtrar por `encerrado`. O dashboard exibe tudo misturado.

**Criterios de Aceite — Happy Path:**
- [ ] Dado que o dashboard carregou, quando exibir a lista de editais, entao editais com `encerrado = true` NAO aparecem por padrao
- [ ] Dado que o usuario clicou em "Mostrar encerrados" (toggle/checkbox), quando a lista recarregar, entao editais encerrados aparecem com opacidade reduzida + badge "Encerrado"
- [ ] Dado que o usuario selecionou ordenacao "Prazo (mais urgentes)", quando a lista recarregar, entao os editais sao ordenados por `data_encerramento ASC NULLS LAST` (prazo mais proximo primeiro, sem prazo por ultimo)

**Criterios de Aceite — Edge Cases:**
- [ ] Estado vazio: se nao ha editais ativos (todos encerrados), exibir mensagem "Nenhuma oportunidade ativa encontrada. Ative 'Mostrar encerrados' para ver o historico."
- [ ] Estado de loading: manter skeleton/spinner existente (sem mudanca)
- [ ] Estado de erro: manter tratamento existente (sem mudanca)
- [ ] Editais sem `data_encerramento` (campo `prazo: '—'`): aparecem normalmente na lista ativa, ficam por ultimo na ordenacao por urgencia

**Fora do escopo:**
- Filtros avancados por data (date picker, range)
- Notificacoes de prazo proximo
- Alteracao no card de detalhe (tela Detail)

**Prioridade:** Media
**Tamanho:** M (2-3d)
**Dependencias:** US-FP03 (schema), US-FP01 (coletor populando `encerrado`)
