/* Radar PNCP — análise derivada de um edital real.
 * A API do PNCP entrega objeto, valor, modalidade, datas e órgão; daqui o radar
 * compõe a análise que o painel mostra: resumo, por que combina / atenção,
 * documentos prováveis, composição de custos, proposta sugerida e leitura de
 * risco/concorrência/chance. Tudo por regra determinística (a análise por LLM
 * sobre o PDF do edital é a camada plugável futura — ver README). */
import type { Chance, Custo, Edital, EditalStatus } from './types'
import { formatBRL, formatMilhar } from './format'
import { termLabel } from './keywords'

/** Campos que a análise gera (o restante do Edital vem do mapper). */
export type EditalAnalysis = Pick<
  Edital,
  | 'recomendacao'
  | 'resumo'
  | 'porQueCombina'
  | 'porQueNao'
  | 'documentos'
  | 'custos'
  | 'custoTotal'
  | 'margem'
  | 'propostaMin'
  | 'propostaIdeal'
  | 'risco'
  | 'concorrencia'
  | 'burocracia'
  | 'chance'
>

export interface AnalysisInput {
  objeto: string
  orgao: string
  cidade: string
  estado: string
  modalidade: string
  valorNum: number
  valor: string
  score: number
  status: EditalStatus
  tags: string[]
  hasCore: boolean
}

const TAG_REASON: Record<string, string> = {
  chatbot: 'Objeto cita chatbot — atendimento automatizado é entrega direta da AI Solution.',
  'inteligencia artificial': 'Demanda explícita de inteligência artificial — núcleo do portfólio.',
  'assistente virtual': 'Assistente virtual conversacional — domínio da AI Solution.',
  'agente virtual': 'Agente virtual — domínio direto de IA conversacional.',
  'atendimento digital': 'Atendimento digital ao cidadão — caso de uso recorrente.',
  'atendimento automatizado': 'Atendimento automatizado — competência central.',
  automacao: 'Automação de processos — competência central da AI Solution.',
  'atendimento ao cidadao': 'Atendimento ao cidadão — caso de uso direto.',
  software: 'Desenvolvimento/licenciamento de software — CNAE principal compatível.',
  'desenvolvimento de sistema': 'Desenvolvimento de sistema sob demanda — escopo típico da AI Solution.',
  'desenvolvimento de software': 'Desenvolvimento de software — CNAE principal compatível.',
  'integracao de sistemas': 'Integração de sistemas e APIs — especialidade técnica.',
  'licenciamento de software': 'Licenciamento de software — modelo recorrente da AI Solution.',
  'central de atendimento': 'Central de atendimento — caso de uso direto de automação.',
  'portal do cidadao': 'Portal do cidadão — atendimento digital aplicado.',
  aplicativo: 'Aplicativo — entrega dentro do escopo de desenvolvimento.',
  'plataforma digital': 'Plataforma digital — aderente ao portfólio.',
  'business intelligence': 'BI e dashboards são entregáveis recorrentes.',
  'transformacao digital': 'Transformação digital — guarda-chuva do que a AI Solution entrega.',
  'tecnologia da informacao': 'Serviço de TI — compatível com o CNAE da empresa.',
  saas: 'Modelo SaaS — aderente ao portfólio.',
  'prontuario eletronico': 'Sistema de prontuário — integração e desenvolvimento.',
  'sistema de informacao': 'Sistema de informação — dentro do escopo de desenvolvimento.',
  'gestao eletronica': 'Gestão eletrônica de processos — automação aplicada.',
  dashboard: 'Dashboards são entregáveis recorrentes da AI Solution.',
  plataforma: 'Plataforma — aderente ao modelo de produto da AI Solution.',
  workflow: 'Automação de workflow — competência central.',
  sistema: 'Sistema de informação — dentro do escopo de desenvolvimento.',
  integracao: 'Integração entre sistemas — especialidade técnica.',
  portal: 'Portal/central de atendimento — caso de uso direto.',
  informatica: 'Serviço de TI/informática — compatível com o CNAE da empresa.',
}

function chanceFromScore(score: number): Chance {
  if (score >= 80) return 'Alta'
  if (score >= 58) return 'Média'
  return 'Baixa'
}

function isPregao(m: string): boolean {
  return /preg(a|ã)o/i.test(m)
}
function isConcorrencia(m: string): boolean {
  return /concorr/i.test(m)
}

function buildDocumentos(modalidade: string): string[] {
  if (isPregao(modalidade) || isConcorrencia(modalidade)) {
    return [
      'Atestado de capacidade técnica',
      'Balanço patrimonial',
      'Certidões fiscais e trabalhistas',
      'Garantia de proposta',
      'Proposta comercial assinada',
    ]
  }
  return ['Certidão negativa federal', 'Certidão FGTS', 'Contrato social', 'Proposta comercial assinada']
}

function buildCustos(valorNum: number): { custos: Custo[]; custoTotal: string; total: number } {
  const total = Math.round(valorNum * 0.4)
  // Abaixo de um custo mínimo significativo (valor não informado ou irrisório)
  // não há composição confiável — tudo vira "—" e mantém a invariante da proposta.
  if (total < 100) return { custos: [], custoTotal: '—', total: 0 }
  // Última linha = resto, para a coluna fechar exatamente com o total exibido.
  const a = Math.round(total * 0.5)
  const b = Math.round(total * 0.2)
  const c = Math.round(total * 0.15)
  const d = total - a - b - c
  const custos: Custo[] = [
    { item: 'Horas técnicas (implantação)', valor: formatBRL(a) },
    { item: 'Setup de integrações / APIs', valor: formatBRL(b) },
    { item: 'Infraestrutura + LLM', valor: formatBRL(c) },
    { item: 'Suporte e manutenção', valor: formatBRL(d) },
  ]
  return { custos, custoTotal: formatBRL(total), total }
}

export function buildAnalysis(input: AnalysisInput): EditalAnalysis {
  const { objeto, orgao, cidade, estado, modalidade, valorNum, valor, score, status, tags, hasCore } = input

  const reasons: string[] = []
  for (const t of tags) {
    const r = TAG_REASON[t]
    if (r && !reasons.includes(r)) reasons.push(r)
    if (reasons.length >= 4) break
  }

  const porQueNao: string[] = []
  if (isPregao(modalidade)) porQueNao.push('Pregão costuma exigir atestado de capacidade técnica e equipe dedicada.')
  if (isConcorrencia(modalidade)) porQueNao.push('Concorrência tem exigências de habilitação mais rígidas.')
  if (valorNum > 0 && valorNum < 20000) porQueNao.push('Valor estimado baixo para o escopo — avaliar margem mínima.')
  if (valorNum > 500000) porQueNao.push('Porte elevado pode exigir garantia e capacidade comprovada.')
  if (!hasCore) porQueNao.push('Aderência parcial — confirmar o escopo real no termo de referência.')
  if (valorNum <= 0) porQueNao.push('Valor não informado no PNCP — orçar pela composição estimada.')
  if (porQueNao.length === 0) porQueNao.push('Confirmar exigências documentais no termo de referência.')

  const { custos, custoTotal, total } = buildCustos(valorNum)
  let margem = '—'
  let propostaMin = '—'
  let propostaIdeal = '—'
  if (total > 0) {
    // proposta sobre a base de preço (não de custo): custoTotal < propostaMin < ideal-lo
    margem = score >= 80 ? '35%' : score >= 60 ? '30%' : '25%'
    const lo = Math.round(valorNum * 0.78)
    const hi = Math.round(valorNum * 0.9)
    propostaMin = formatBRL(Math.round(lo * 0.96))
    propostaIdeal = `${formatBRL(lo)} – ${formatMilhar(hi)}`
  }

  const topLabels = tags.slice(0, 2).map(termLabel)
  const compat = topLabels.length ? `objeto compatível com ${topLabels.join(' e ')}` : 'objeto aderente ao portfólio'
  let recomendacao: string
  if (status === 'baixa') recomendacao = 'Descartar — aderência fraca ao portfólio da AI Solution.'
  else if (score >= 80) recomendacao = `Participar — ${compat}.`
  else recomendacao = `Analisar — ${compat}, validar exigências do edital.`

  const resumo =
    `${orgao} (${cidade}/${estado}) pretende contratar: ${objeto.trim()}. ` +
    `Modalidade ${modalidade}; valor estimado ${valor}. ` +
    `Aderência cruzada automaticamente com o portfólio da AI Solution.`

  return {
    recomendacao,
    resumo,
    porQueCombina: reasons,
    porQueNao: porQueNao.slice(0, 3),
    documentos: buildDocumentos(modalidade),
    custos,
    custoTotal,
    margem,
    propostaMin,
    propostaIdeal,
    risco: valorNum > 500000 ? 'Alto' : isPregao(modalidade) || isConcorrencia(modalidade) ? 'Médio' : 'Baixo',
    concorrencia: valorNum > 200000 ? 'Alta' : valorNum > 50000 ? 'Média' : 'Baixa',
    burocracia: isConcorrencia(modalidade) ? 'Alta' : isPregao(modalidade) ? 'Média' : 'Baixa',
    chance: chanceFromScore(score),
  }
}
