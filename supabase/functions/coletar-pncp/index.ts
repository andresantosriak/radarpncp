// Radar PNCP — Edge Function: coletar-pncp (coleta server-side, agendável)
// Varre o PNCP (várias modalidades, paginação ampla), pontua a aderência ao
// portfólio e faz upsert em `oportunidades`. Enhancements opcionais por query:
//   ?dias=45&paginas=8        janela e profundidade da varredura
//   ?semantico=1             também embeda (pgvector) e inclui matches semânticos
//   ?analisar=5              dispara análise IA (analisar-edital) nos top N (custo OpenAI)
import { createClient } from 'jsr:@supabase/supabase-js@2'
import {
  computeAderencia,
  matchesKeywords,
  statusFromScore,
  termLabel,
  DEFAULT_KEYWORDS,
  normalize,
} from '../_shared/scoring.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? ''
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

const MODALIDADES = [6, 8, 4, 9, 12] // pregão elet., dispensa, concorrência elet., inexigibilidade, credenciamento
const PERFIL =
  'Automações, agentes de IA, chatbots e assistentes virtuais, atendimento automatizado e digital, integrações de sistemas e APIs, desenvolvimento e licenciamento de software sob demanda, dashboards, BI, SaaS, transformação digital, portais e central de atendimento ao cidadão.'

const small = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o'])
const titleCase = (s: string) =>
  (s || '').toLowerCase().split(/\s+/).map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ').trim()
function pncpLink(controle: string): string {
  const m = /^(\d+)-\d+-(\d+)\/(\d+)$/.exec(controle || '')
  return m ? `https://pncp.gov.br/app/editais/${m[1]}/${m[3]}/${parseInt(m[2], 10)}` : 'https://pncp.gov.br/app/editais'
}
/** Check if deadline has already passed (date-only comparison, UTC). */
function isEncerrado(prazoISO: string | null): boolean {
  if (!prazoISO) return false
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(prazoISO)
  if (!m) return false
  const deadline = `${m[1]}-${m[2]}-${m[3]}`
  const today = new Date().toISOString().slice(0, 10)
  return deadline < today
}

function isUrgente(prazoISO: string | null): boolean {
  if (!prazoISO) return false
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(prazoISO)
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : new Date(prazoISO).getTime()
  if (Number.isNaN(d)) return false
  const delta = d - Date.now()
  return delta >= 0 && delta <= 5 * 86_400_000
}

function ymd(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

async function scanPncp(dias: number, paginas: number) {
  const hoje = new Date()
  const di = ymd(new Date(hoje.getTime() - dias * 86_400_000))
  const df = ymd(hoje)
  const jobs: { mod: number; pag: number }[] = []
  for (const mod of MODALIDADES) for (let pag = 1; pag <= paginas; pag++) jobs.push({ mod, pag })
  const settled = await Promise.allSettled(
    jobs.map(async ({ mod, pag }) => {
      const url =
        `https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=${di}&dataFinal=${df}` +
        `&codigoModalidadeContratacao=${mod}&pagina=${pag}&tamanhoPagina=50`
      const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(12000) })
      if (!res.ok || res.status === 204) return []
      const txt = await res.text()
      return txt ? ((JSON.parse(txt) as { data?: unknown[] }).data ?? []) : []
    }),
  )
  const all: Record<string, unknown>[] = []
  for (const r of settled) if (r.status === 'fulfilled') all.push(...(r.value as Record<string, unknown>[]))
  return all
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0
}
async function embed(inputs: string[]): Promise<number[][]> {
  const out: number[][] = []
  for (let i = 0; i < inputs.length; i += 1000) {
    const chunk = inputs.slice(i, i + 1000).map((s) => s.slice(0, 1000) || ' ')
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: chunk }),
    })
    if (!res.ok) throw new Error(`embeddings HTTP ${res.status}`)
    const data = await res.json()
    for (const d of data.data) out[i + d.index] = d.embedding
  }
  return out
}
// cosine ~0.20 (irrelevante) → 0 ; ~0.50 (forte) → 100
const semScore = (cos: number) => Math.max(0, Math.min(100, Math.round(((cos - 0.2) / 0.3) * 100)))

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  try {
    const url = new URL(req.url)
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const dias = Number(url.searchParams.get('dias') ?? body.dias ?? 45)
    const paginas = Math.min(20, Number(url.searchParams.get('paginas') ?? body.paginas ?? 8))
    const semantico = (url.searchParams.get('semantico') ?? String(body.semantico ?? '')) === '1' ||
      body.semantico === true
    const analisar = Number(url.searchParams.get('analisar') ?? body.analisar ?? 0)

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

    // keywords: fonte de verdade é a tabela `keywords` (ativo=true)
    let activeKeywords: string[] = DEFAULT_KEYWORDS
    let keywordsSource: 'db' | 'fallback' = 'fallback'
    try {
      const { data: kwRows, error: kwErr } = await supabase
        .from('keywords')
        .select('termo')
        .eq('ativo', true)
        .order('termo')
      if (!kwErr && kwRows && kwRows.length > 0) {
        activeKeywords = kwRows.map((r: { termo: string }) => r.termo)
        keywordsSource = 'db'
      }
    } catch (_) {
      // fallback silencioso — usa DEFAULT_KEYWORDS
    }

    // perfil da empresa: fonte de verdade é a tabela `empresa_perfil`
    let activePerfil: string = PERFIL
    let perfilSource: 'db' | 'fallback' = 'fallback'
    try {
      const { data: perfilRows, error: perfilErr } = await supabase
        .from('empresa_perfil')
        .select('portfolio_texto')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .limit(1)
      if (!perfilErr && perfilRows && perfilRows.length > 0) {
        const txt = (perfilRows[0] as { portfolio_texto: string }).portfolio_texto
        if (txt && txt.trim().length > 0) {
          activePerfil = txt.trim()
          perfilSource = 'db'
        }
      }
    } catch (_) {
      // fallback silencioso — usa const PERFIL
    }

    const raw = await scanPncp(dias, paginas)

    // dedupe por controle
    const byId = new Map<string, Record<string, unknown>>()
    for (const e of raw) {
      const id = String(e.numeroControlePNCP ?? '')
      if (id && !byId.has(id)) byId.set(id, e)
    }
    const editais = [...byId.values()]

    // scoring por palavra-chave
    type Row = Record<string, unknown> & { controle: string; objeto: string; score: number | null; sem: number | null }
    const rows: Row[] = []
    let profEmb: number[] | null = null
    let objEmbs: number[][] = []
    if (semantico && OPENAI_API_KEY) {
      try {
        ;[profEmb] = await embed([activePerfil])
        objEmbs = await embed(editais.map((e) => String(e.objetoCompra ?? '')))
      } catch (_) {
        profEmb = null
      }
    }

    editais.forEach((e, i) => {
      const objeto = String(e.objetoCompra ?? '')
      const controle = String(e.numeroControlePNCP ?? '')
      const ad = computeAderencia(objeto, controle)
      let sem: number | null = null
      let emb: number[] | null = null
      if (profEmb && objEmbs[i]) {
        sem = semScore(cosine(profEmb, objEmbs[i]))
        emb = objEmbs[i]
      }
      const kw = matchesKeywords(objeto, activeKeywords)
      // oportunidade se: aderência por palavra-chave OU forte similaridade semântica
      const isOpp = (ad && kw) || (sem !== null && sem >= 62)
      if (!isOpp) return
      const score = ad ? ad.score : sem ?? 0
      const status = ad ? ad.status : statusFromScore(score)
      const tags = ad ? ad.tags.map(termLabel) : ['semântico']
      const orgao = e.orgaoEntidade ? titleCase(String((e.orgaoEntidade as Record<string, string>).razaoSocial ?? '')) : 'Órgão público'
      const uni = (e.unidadeOrgao ?? {}) as Record<string, string>
      const prazoISO = (e.dataEncerramentoProposta as string) ?? null
      const encerrado = isEncerrado(prazoISO)
      rows.push({
        controle,
        objeto,
        score,
        sem,
        _row: {
          controle_pncp: controle,
          cnpj: String((e.orgaoEntidade as Record<string, string>)?.cnpj ?? ''),
          ano: Number(e.anoCompra) || null,
          sequencial: Number(e.sequencialCompra) || null,
          orgao,
          cidade: uni.municipioNome ?? null,
          estado: uni.ufSigla ?? null,
          titulo: objeto.trim(),
          objeto,
          objeto_curto: (ad ? ad.tags.slice(0, 3).map(termLabel).join(' · ') : '') || objeto.slice(0, 60),
          modalidade: String(e.modalidadeNome ?? 'Dispensa'),
          valor_estimado: Number(e.valorTotalEstimado) || 0,
          data_publicacao: ((e.dataPublicacaoPncp as string) ?? '').slice(0, 10) || null,
          data_encerramento: (prazoISO ?? '').slice(0, 10) || null,
          link: pncpLink(controle),
          status,
          score_heuristico: ad ? ad.score : null,
          score_semantico: sem,
          tags,
          urgente: !encerrado && isUrgente(prazoISO),
          encerrado,
          embedding: emb,
          coletado_em: new Date().toISOString(),
        },
      })
    })

    // upsert em lotes
    let upserted = 0
    const payload = rows.map((r) => (r as Record<string, unknown>)._row)
    for (let i = 0; i < payload.length; i += 200) {
      const chunk = payload.slice(i, i + 200)
      const { error } = await supabase.from('oportunidades').upsert(chunk, { onConflict: 'controle_pncp' })
      if (!error) upserted += chunk.length
    }

    // análise IA em lote nos top N (opcional)
    let analisados = 0
    if (analisar > 0 && OPENAI_API_KEY) {
      const top = [...rows].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, analisar)
      for (const r of top) {
        const row = (r as Record<string, unknown>)._row as Record<string, unknown>
        try {
          const res = await fetch(`${SUPABASE_URL}/functions/v1/analisar-edital`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${SERVICE_KEY}`, apikey: SERVICE_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cnpj: row.cnpj, ano: row.ano, sequencial: row.sequencial, controle: row.controle_pncp,
              orgao: row.orgao, cidade: row.cidade, estado: row.estado, modalidade: row.modalidade,
              valorEstimado: row.valor_estimado, objeto: row.objeto, titulo: row.titulo, link: row.link,
              scoreHeuristico: row.score_heuristico,
            }),
          })
          if (res.ok) analisados++
        } catch (_) { /* segue */ }
      }
    }

    return json({
      ok: true,
      varridos: editais.length,
      oportunidades: rows.length,
      upserted,
      semantico,
      analisados,
      keywordsSource,
      keywordsCount: activeKeywords.length,
      perfilSource,
      params: { dias, paginas, modalidades: MODALIDADES },
    })
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message ?? e) }, 500)
  }
})
