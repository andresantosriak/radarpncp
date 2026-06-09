// Radar PNCP — Edge Function: coletar-querido-diario (piloto multi-fonte)
// Varre diários oficiais municipais via API Querido Diário, filtra com IA
// (gpt-4o-mini) para descartar ruído e gravar apenas licitações relevantes.
//
// Parâmetros opcionais (query ou body):
//   ?dias=7       janela de publicação (default 7)
//   ?max=15       teto de gazettes processadas (default 15, máximo 30)
//
// Segredos: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { statusFromScore } from '../_shared/scoring.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? ''
const OPENAI_MODEL = 'gpt-4o-mini'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY =
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY') ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } })

const QD_BASE = 'https://api.queridodiario.ok.org.br/gazettes'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Core keywords for gazette full-text search (combined into a single query
// to minimize requests). These are the strongest signals for relevant
// procurements matching the company profile.
const QD_SEARCH_TERMS = [
  'chatbot',
  'inteligência artificial',
  'assistente virtual',
  'software sob demanda',
  'atendimento digital',
  'automação de atendimento',
]

interface Gazette {
  territory_id: string
  date: string
  url: string
  txt_url: string
  territory_name: string
  state_code: string
  excerpts: string[]
  is_extra_edition: boolean
}

interface IAResult {
  ehLicitacao: boolean
  relevante: boolean
  objeto: string
  orgao: string
  modalidade: string
  valorEstimado: number | null
  prazo: string | null
  score: number
  justificativa: string
}

/** sha256 hex of a string (first N chars). */
async function hashN(text: string, len: number): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, len)
}

/** sha256 hex of a string (first 8 chars). */
async function hash8(text: string): Promise<string> {
  return hashN(text, 8)
}

/** sha256 hex of a string (first 16 chars) — used for excerpt_hash in diagnostico_coleta. */
async function hash16(text: string): Promise<string> {
  return hashN(text, 16)
}

/** Build deterministic synthetic ID: QD:<ibge>:<date>:<hash8>.
 *  Uses a stable source field (gazette URL) so repeated collections
 *  of the same gazette always produce the same ID → idempotent upsert. */
async function syntheticId(territoryId: string, date: string, stableKey: string): Promise<string> {
  const h = await hash8(stableKey)
  return `QD:${territoryId}:${date}:${h}`
}

/** YYYY-MM-DD for N days ago. */
function daysAgo(n: number): string {
  const d = new Date(Date.now() - n * 86_400_000)
  return d.toISOString().slice(0, 10)
}

/** Fetch gazettes from Querido Diário API for a given search term. */
async function fetchGazettes(query: string, since: string, size: number): Promise<Gazette[]> {
  const params = new URLSearchParams({
    querystring: query,
    published_since: since,
    sort_by: 'descending_date',
    size: String(size),
  })
  const res = await fetch(`${QD_BASE}?${params}`, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(12_000),
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data?.gazettes ?? []) as Gazette[]
}

/** Download txt_url content (already-extracted text), truncated around excerpts. */
async function fetchGazetteText(txtUrl: string): Promise<string> {
  if (!txtUrl) return ''
  try {
    const res = await fetch(txtUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) return ''
    const text = await res.text()
    // Truncate to ~8000 chars to stay within LLM budget
    return text.slice(0, 8_000)
  } catch {
    return ''
  }
}

/** Ask GPT-4o-mini whether a gazette excerpt is a real, relevant procurement. */
async function classifyWithIA(
  excerpts: string[],
  fullText: string,
  portfolioTexto: string,
): Promise<IAResult> {
  const system = `Você é um classificador de licitações públicas. Sua tarefa: dado um trecho de diário oficial municipal e o perfil de uma empresa de tecnologia, decidir se o trecho contém uma LICITAÇÃO / PREGÃO / DISPENSA / CHAMAMENTO PÚBLICO REAL E RELEVANTE ao perfil da empresa.

PERFIL DA EMPRESA:
${portfolioTexto}

REGRAS:
- ehLicitacao=true SOMENTE se houver um processo licitatório/dispensa/chamamento CONCRETO (número, objeto, órgão).
- Menções soltas como "implantação de chatbot" em contexto de notícia/relatório/ata sem processo = ehLicitacao=false.
- relevante=true SOMENTE se o objeto da licitação se encaixa no perfil da empresa (TI, software, IA, automação, chatbot, etc.).
- Licitações de obras, material de consumo, medicamentos, veículos = relevante=false.
- score: 0-100 de aderência ao perfil. Abaixo de 50 = pouco relevante.

Responda APENAS um JSON:
{
  "ehLicitacao": boolean,
  "relevante": boolean,
  "objeto": "descrição curta do objeto (max 200 chars)",
  "orgao": "nome do órgão licitante",
  "modalidade": "Pregão Eletrônico | Dispensa | Concorrência | Chamamento Público | Outro",
  "valorEstimado": number | null,
  "prazo": "YYYY-MM-DD" | null,
  "score": number,
  "justificativa": "1 frase curta em PT-BR explicando por que classificou assim"
}`

  const excerptBlock = excerpts.length > 0
    ? `TRECHOS QUE CASARAM A BUSCA:\n${excerpts.map((e, i) => `[${i + 1}] ${e}`).join('\n\n')}`
    : ''
  const textBlock = fullText ? `\nTEXTO DO DIÁRIO (parcial):\n${fullText}` : ''

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(30_000),
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `${excerptBlock}${textBlock}` },
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`)
  const data = await res.json()
  const parsed = JSON.parse(data?.choices?.[0]?.message?.content ?? '{}')
  return {
    ehLicitacao: Boolean(parsed.ehLicitacao),
    relevante: Boolean(parsed.relevante),
    objeto: String(parsed.objeto ?? '').slice(0, 200),
    orgao: String(parsed.orgao ?? 'Órgão municipal'),
    modalidade: String(parsed.modalidade ?? 'Outro'),
    valorEstimado: typeof parsed.valorEstimado === 'number' ? parsed.valorEstimado : null,
    prazo: typeof parsed.prazo === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.prazo) ? parsed.prazo : null,
    score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
    justificativa: String(parsed.justificativa ?? '').slice(0, 500),
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  try {
    if (!OPENAI_API_KEY) return json({ ok: false, error: 'OPENAI_API_KEY não configurada' }, 500)

    const url = new URL(req.url)
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const dias = Number(url.searchParams.get('dias') ?? body.dias ?? 7)
    const maxGazettes = Math.min(30, Math.max(1, Number(url.searchParams.get('max') ?? body.max ?? 15)))

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

    // --- Read keywords + portfolio from DB (same pattern as coletar-pncp) ---
    let searchTerms = QD_SEARCH_TERMS
    try {
      const { data: kwRows } = await supabase
        .from('keywords')
        .select('termo')
        .eq('ativo', true)
        .order('termo')
      if (kwRows && kwRows.length > 0) {
        // Use only the strongest terms to avoid noise in gazette search
        const coreSet = new Set(['chatbot', 'inteligência artificial', 'assistente virtual',
          'software sob demanda', 'atendimento digital', 'automação de atendimento',
          'atendimento automatizado', 'agente virtual'])
        const core = kwRows.filter((r: { termo: string }) =>
          coreSet.has(r.termo.toLowerCase())
        ).map((r: { termo: string }) => r.termo)
        if (core.length > 0) searchTerms = core
      }
    } catch (_) {
      // fallback to hardcoded terms
    }

    let portfolioTexto = ''
    try {
      const { data: perfilRows } = await supabase
        .from('empresa_perfil')
        .select('portfolio_texto')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .limit(1)
      if (perfilRows && perfilRows.length > 0) {
        portfolioTexto = (perfilRows[0] as { portfolio_texto: string }).portfolio_texto ?? ''
      }
    } catch (_) {
      // empty string — IA will work with excerpts only
    }
    if (!portfolioTexto) {
      portfolioTexto =
        'Automações, agentes de IA, chatbots, assistentes virtuais, atendimento automatizado e digital, ' +
        'integrações de sistemas e APIs, desenvolvimento e licenciamento de software sob demanda, ' +
        'dashboards, BI, SaaS, transformação digital.'
    }

    // --- Fetch gazettes (combine strong keywords, dedupe) ---
    const since = daysAgo(dias)
    const allGazettes: Gazette[] = []
    const seen = new Set<string>()

    // Use combined query for efficiency — fewer API calls
    const combinedQuery = searchTerms.slice(0, 6).join(' OR ')
    try {
      const results = await fetchGazettes(combinedQuery, since, maxGazettes)
      for (const g of results) {
        const key = `${g.territory_id}:${g.date}:${g.url}`
        if (!seen.has(key)) {
          seen.add(key)
          allGazettes.push(g)
        }
      }
    } catch (_) {
      // API may fail — continue with whatever we have
    }

    // If combined query returned few results, try individual strong terms
    if (allGazettes.length < 3) {
      for (const term of searchTerms.slice(0, 3)) {
        if (allGazettes.length >= maxGazettes) break
        try {
          const results = await fetchGazettes(term, since, 5)
          for (const g of results) {
            const key = `${g.territory_id}:${g.date}:${g.url}`
            if (!seen.has(key)) {
              seen.add(key)
              allGazettes.push(g)
            }
          }
        } catch (_) { /* next term */ }
      }
    }

    // Enforce hard ceiling
    const candidates = allGazettes.slice(0, maxGazettes)

    // --- Classify each gazette with IA ---
    let gravadas = 0
    let descartadasRuido = 0
    let erros = 0

    // Diagnostics counters (task 1.5)
    const diagnostico = {
      total_analisados: 0,
      capturados: 0,
      descartados: 0,
      motivos: {
        nao_e_licitacao: 0,
        nao_relevante: 0,
        score_abaixo_threshold: 0,
        erro_ia: 0,
        erro_gravacao: 0,
      },
    }

    /** Upsert a single row into diagnostico_coleta. Failures are logged, never block the loop. */
    async function persistDiagnostico(row: Record<string, unknown>): Promise<void> {
      try {
        await supabase
          .from('diagnostico_coleta')
          .upsert(row, { onConflict: 'fonte,excerpt_hash' })
      } catch (e) {
        console.error('[diagnostico] upsert failed:', (e as Error).message)
      }
    }

    for (const g of candidates) {
      // excerpt_hash: sha256 truncated 16 hex, based on gazette URL (stable source)
      const excerptHash = await hash16(g.url)

      // Shared context fields for diagnostico_coleta
      const diagBase: Record<string, unknown> = {
        fonte: 'querido-diario',
        territory_id: g.territory_id || null,
        gazette_date: g.date || null,
        excerpt_hash: excerptHash,
        territory_name: g.territory_name || null,
        state_code: g.state_code || null,
        gazette_url: g.url || null,
        dados_brutos: { excerpts: g.excerpts ?? [], is_extra_edition: g.is_extra_edition },
      }

      let result: IAResult | null = null
      try {
        // Build context: excerpts first, fetch full text only if excerpts are thin
        const excerptText = (g.excerpts ?? []).join('\n\n')
        let fullText = ''
        if (excerptText.length < 500 && g.txt_url) {
          fullText = await fetchGazetteText(g.txt_url)
        }

        result = await classifyWithIA(g.excerpts ?? [], fullText, portfolioTexto)
      } catch (e) {
        // IA error — persist as erro_ia in diagnostico_coleta (task 1.2)
        erros++
        diagnostico.total_analisados++
        diagnostico.descartados++
        diagnostico.motivos.erro_ia++
        await persistDiagnostico({
          ...diagBase,
          eh_licitacao: null,
          relevante: null,
          score: null,
          justificativa: `Erro IA: ${(e as Error).message}`,
          objeto: null,
          orgao: null,
          modalidade: null,
          valor_estimado: null,
          prazo: null,
          capturado: false,
          motivo_descarte: 'erro_ia',
        })
        continue
      }

      diagnostico.total_analisados++

      // IA classification fields shared by capture and discard rows
      const diagIA: Record<string, unknown> = {
        eh_licitacao: result.ehLicitacao,
        relevante: result.relevante,
        score: result.score,
        justificativa: result.justificativa || null,
        objeto: result.objeto || null,
        orgao: result.orgao || null,
        modalidade: result.modalidade || null,
        valor_estimado: result.valorEstimado,
        prazo: result.prazo || null,
      }

      // --- Discard path (task 1.2) ---
      if (!result.ehLicitacao || !result.relevante || result.score < 50) {
        descartadasRuido++
        diagnostico.descartados++

        let motivo: string
        if (!result.ehLicitacao) {
          motivo = 'nao_e_licitacao'
          diagnostico.motivos.nao_e_licitacao++
        } else if (!result.relevante) {
          motivo = 'nao_relevante'
          diagnostico.motivos.nao_relevante++
        } else {
          motivo = 'score_abaixo_threshold'
          diagnostico.motivos.score_abaixo_threshold++
        }

        await persistDiagnostico({
          ...diagBase,
          ...diagIA,
          capturado: false,
          motivo_descarte: motivo,
        })
        continue
      }

      // --- Capture path (task 1.3) ---
      // Build upsert row for oportunidades (hash based on g.url — stable across collections)
      const controlId = await syntheticId(g.territory_id, g.date, g.url)
      const opRow = {
        controle_pncp: controlId,
        fonte: 'querido-diario',
        orgao: result.orgao,
        cidade: g.territory_name || null,
        estado: g.state_code || null,
        titulo: result.objeto,
        objeto: result.objeto,
        objeto_curto: result.objeto.slice(0, 60),
        modalidade: result.modalidade,
        valor_estimado: result.valorEstimado ?? 0,
        data_publicacao: g.date || null,
        data_encerramento: result.prazo || null,
        link: g.url || null,
        status: statusFromScore(result.score),
        score_heuristico: result.score,
        tags: ['querido-diário'],
        urgente: false,
        coletado_em: new Date().toISOString(),
      }

      const { error: opError } = await supabase
        .from('oportunidades')
        .upsert(opRow, { onConflict: 'controle_pncp' })

      if (!opError) {
        gravadas++
        diagnostico.capturados++

        // Persist capture in diagnostico_coleta (only after successful oportunidades upsert)
        await persistDiagnostico({
          ...diagBase,
          ...diagIA,
          capturado: true,
          motivo_descarte: null,
        })
      } else {
        // oportunidades upsert failed — persist as descarte in diagnostico_coleta (W2/W3 fix)
        erros++
        diagnostico.descartados++
        diagnostico.motivos.erro_gravacao++
        console.error('[oportunidades] upsert failed:', opError.message)

        await persistDiagnostico({
          ...diagBase,
          ...diagIA,
          justificativa: `Erro gravação: ${opError.message}`,
          capturado: false,
          motivo_descarte: 'erro_gravacao',
        })
      }
    }

    return json({
      ok: true,
      gazettesVarridas: candidates.length,
      candidatas: candidates.length - descartadasRuido - erros,
      gravadas,
      descartadasRuido,
      erros,
      fonte: 'querido-diario',
      keywordsCount: searchTerms.length,
      params: { dias, max: maxGazettes, since },
      diagnostico,
    })
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message ?? e) }, 500)
  }
})
