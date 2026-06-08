// Radar PNCP — Edge Function: analisar-edital
// Lê o PDF do edital no PNCP, extrai o texto, analisa com LLM (GPT-4o) cruzando
// com o portfólio da AI Solution, persiste e devolve a análise estruturada.
//
// Segredos (server-side apenas): OPENAI_API_KEY (set via `supabase secrets`),
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (injetados pela plataforma).
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { extractText, getDocumentProxy } from 'https://esm.sh/unpdf@0.12.1'
import { unzipSync } from 'https://esm.sh/fflate@0.8.2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? ''
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY =
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY') ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

const PERFIL = `EMPRESA (perfil de comparação):
AI Solution Exp LTDA - ME · CNPJ 53.075.641/0001-71.
Atua com: automações, agentes de IA, chatbots, assistentes virtuais, atendimento automatizado
(n8n, Make, WhatsApp/Evolution API), integrações de sistemas e APIs, dashboards, BI, SaaS sob demanda,
desenvolvimento e licenciamento de software customizável (CNAE principal). Empresa pequena (ME).`

const RUBRICA = `Faixas de aderência (score 0-100): 0-39 baixa, 40-69 possível, 70-84 boa, 85-100 muito forte.
Composição de custos (a IA NÃO chuta preço — compõe): horas técnicas, implantação/setup de integrações,
infraestrutura + LLM, suporte/manutenção; aplique margem e derive a proposta (faixa segura) e um mínimo saudável.`

const SCHEMA = `Responda APENAS um JSON (pt-BR, sentence-case, sem emoji, números literais "R$ 62.000") com as chaves:
{
 "score": number 0-100,
 "recomendacao": "Participar — ... | Analisar — ... | Descartar — ..." (1 frase),
 "resumo": "2-4 frases do que o órgão quer e do encaixe com a AI Solution",
 "porQueCombina": ["..."],            // 0-5 itens
 "porQueNao": ["..."],                // 1-4 itens (riscos/atenção)
 "documentos": ["..."],               // certidões/atestados exigidos pelo edital
 "custos": [{"item":"...","valor":"R$ ..."}],   // composição
 "custoTotal": "R$ ...",
 "propostaMin": "R$ ...",             // mínimo saudável
 "propostaIdeal": "R$ X – Y",         // faixa recomendada
 "margem": "NN%",
 "risco": "Baixo|Médio|Alto",
 "concorrencia": "Baixa|Média|Alta",
 "burocracia": "Baixa|Média|Alta",
 "chance": "Alta|Média|Baixa"
}`

function statusFromScore(s: number): string {
  if (s >= 85) return 'forte'
  if (s >= 70) return 'boa'
  if (s >= 40) return 'possivel'
  return 'baixa'
}
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const asStr = (v: unknown, d = '—'): string => (typeof v === 'string' && v.trim() ? v : d)

const isPdf = (b: Uint8Array) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46
const isZip = (b: Uint8Array) => b[0] === 0x50 && b[1] === 0x4b

async function pdfToText(buf: Uint8Array): Promise<string> {
  try {
    const pdf = await getDocumentProxy(buf)
    const { text } = await extractText(pdf, { mergePages: true })
    return (Array.isArray(text) ? text.join('\n') : String(text ?? '')).trim()
  } catch {
    return ''
  }
}

// Extrai texto de um arquivo do PNCP: PDF direto, ou ZIP contendo PDF(s).
async function extractFromBuffer(buf: Uint8Array): Promise<string> {
  if (isPdf(buf)) return pdfToText(buf)
  if (isZip(buf)) {
    try {
      const entries = unzipSync(buf)
      let best = ''
      for (const name of Object.keys(entries)) {
        if (!/\.pdf$/i.test(name)) continue
        const inner = entries[name]
        if (!isPdf(inner)) continue
        const t = await pdfToText(inner)
        if (t.length > best.length) best = t
        if (best.length > 1500) break
      }
      return best
    } catch {
      return ''
    }
  }
  return ''
}

async function fetchPdfText(cnpj: string, ano: number | string, seq: number | string) {
  const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${cnpj}/compras/${ano}/${seq}/arquivos`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) return { text: '', fonte: '' }
  const arquivos = (await res.json()) as Array<Record<string, string>>
  if (!Array.isArray(arquivos) || arquivos.length === 0) return { text: '', fonte: '' }
  // prioriza edital/termo de referência/projeto básico; tenta até 5 arquivos
  const rank = (a: Record<string, string>) => {
    const s = `${a.titulo ?? ''} ${a.tipoDocumentoNome ?? ''}`
    if (/edital|refer[eê]ncia|projeto b[aá]sico|termo de refer/i.test(s)) return 0
    if (/dispensa|termo|anexo|contrato/i.test(s)) return 1
    return 2
  }
  const cands = [...arquivos].sort((x, y) => rank(x) - rank(y)).slice(0, 5)
  let best = { text: '', fonte: '' }
  for (const a of cands) {
    if (!a.url) continue
    try {
      const doc = await fetch(a.url)
      if (!doc.ok) continue
      const buf = new Uint8Array(await doc.arrayBuffer())
      const t = await extractFromBuffer(buf)
      if (t.length > best.text.length) best = { text: t.slice(0, 24000), fonte: a.url }
      if (best.text.length > 1500) break
    } catch {
      /* tenta o próximo arquivo */
    }
  }
  return best
}

async function analisarComIA(edital: Record<string, unknown>, pdfText: string) {
  const system = `Você é o analista do Radar PNCP da AI Solution Exp. Decida "participar ou não" de licitações.\n${PERFIL}\n${RUBRICA}\n${SCHEMA}`
  const user = `EDITAL
Órgão: ${edital.orgao ?? ''} — ${edital.cidade ?? ''}/${edital.estado ?? ''}
Modalidade: ${edital.modalidade ?? ''}
Valor estimado: ${edital.valorEstimado ? `R$ ${edital.valorEstimado}` : 'não informado'}
Objeto: ${edital.objeto ?? edital.titulo ?? ''}

TEXTO DO EDITAL (extraído do PDF; pode estar truncado):
${pdfText || '(PDF sem texto extraível — analise pelo objeto e metadados acima)'}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content ?? '{}'
  const p = JSON.parse(content)
  const score = Math.max(0, Math.min(100, Math.round(Number(p.score) || 0)))
  return {
    score,
    status: statusFromScore(score),
    recomendacao: asStr(p.recomendacao, ''),
    resumo: asStr(p.resumo, ''),
    porQueCombina: asArray(p.porQueCombina).map((x) => String(x)),
    porQueNao: asArray(p.porQueNao).map((x) => String(x)),
    documentos: asArray(p.documentos).map((x) => String(x)),
    custos: asArray(p.custos)
      .map((c) => (c as Record<string, unknown>))
      .map((c) => ({ item: asStr(c.item, ''), valor: asStr(c.valor, '—') })),
    custoTotal: asStr(p.custoTotal),
    propostaMin: asStr(p.propostaMin),
    propostaIdeal: asStr(p.propostaIdeal),
    margem: asStr(p.margem),
    risco: asStr(p.risco),
    concorrencia: asStr(p.concorrencia),
    burocracia: asStr(p.burocracia),
    chance: asStr(p.chance),
    modelo: OPENAI_MODEL,
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'método não permitido' }, 405)
  if (!OPENAI_API_KEY) return json({ error: 'OPENAI_API_KEY não configurada' }, 500)

  try {
    const body = await req.json().catch(() => ({}))
    const { cnpj, ano, sequencial, controle } = body
    if (!cnpj || !ano || !sequencial || !controle) {
      return json({ error: 'faltam cnpj, ano, sequencial ou controle' }, 400)
    }

    const supabase = SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY) : null

    // cache: devolve análise existente (a menos que body.force === true)
    if (supabase && !body.force) {
      const { data: cached } = await supabase
        .from('analises_ia')
        .select('*')
        .eq('controle_pncp', controle)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cached) {
        return json({
          score: cached.score_ia,
          status: statusFromScore(cached.score_ia ?? 0),
          recomendacao: cached.recomendacao,
          resumo: cached.resumo,
          porQueCombina: cached.por_que_combina,
          porQueNao: cached.por_que_nao,
          documentos: cached.documentos,
          custos: cached.custos,
          custoTotal: cached.custo_total,
          propostaMin: cached.proposta_min,
          propostaIdeal: cached.proposta_ideal,
          margem: cached.margem,
          risco: cached.risco,
          concorrencia: cached.concorrencia,
          burocracia: cached.burocracia,
          chance: cached.chance,
          modelo: cached.modelo,
          fontePdf: cached.fonte_pdf,
          textoChars: cached.texto_chars,
          lidoDoPdf: (cached.texto_chars ?? 0) > 200,
          cache: true,
        })
      }
    }

    const { text: pdfText, fonte } = await fetchPdfText(cnpj, ano, sequencial)
    const analysis = await analisarComIA(body, pdfText)

    if (supabase) {
      const { data: opp } = await supabase
        .from('oportunidades')
        .upsert(
          {
            controle_pncp: controle,
            cnpj: String(cnpj),
            ano: Number(ano),
            sequencial: Number(sequencial),
            orgao: body.orgao ?? null,
            cidade: body.cidade ?? null,
            estado: body.estado ?? null,
            titulo: body.titulo ?? null,
            objeto: body.objeto ?? body.titulo ?? null,
            modalidade: body.modalidade ?? null,
            valor_estimado: Number(body.valorEstimado) || 0,
            data_publicacao: body.dataPublicacao ?? null,
            data_encerramento: body.dataEncerramento ?? null,
            link: body.link ?? null,
            status: analysis.status,
            score_heuristico: body.scoreHeuristico ?? null,
          },
          { onConflict: 'controle_pncp' },
        )
        .select('id')
        .single()

      await supabase.from('analises_ia').insert({
        oportunidade_id: opp?.id ?? null,
        controle_pncp: controle,
        modelo: analysis.modelo,
        score_ia: analysis.score,
        recomendacao: analysis.recomendacao,
        resumo: analysis.resumo,
        por_que_combina: analysis.porQueCombina,
        por_que_nao: analysis.porQueNao,
        documentos: analysis.documentos,
        custos: analysis.custos,
        custo_total: analysis.custoTotal,
        proposta_min: analysis.propostaMin,
        proposta_ideal: analysis.propostaIdeal,
        margem: analysis.margem,
        risco: analysis.risco,
        concorrencia: analysis.concorrencia,
        burocracia: analysis.burocracia,
        chance: analysis.chance,
        fonte_pdf: fonte,
        texto_chars: pdfText.length,
      })
    }

    return json({ ...analysis, fontePdf: fonte, textoChars: pdfText.length, lidoDoPdf: pdfText.length > 200, cache: false })
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500)
  }
})
