/* Radar PNCP — maps a raw PNCP contratação into a scored, analyzed Edital.
 * Returns null when the object doesn't match the portfolio (not an opportunity). */
import type { Edital } from '../types'
import type { PncpContratacao } from './types'
import { computeAderencia } from '../scoring'
import { buildAnalysis } from '../analysis'
import { termLabel } from '../keywords'
import { formatBRL, formatDateISO, parseDate, pncpEditalLink } from '../format'
import { titleCase } from '../text'

const SETE_DIAS = 7 * 86_400_000

function isUrgente(prazoISO: string | null | undefined): boolean {
  if (!prazoISO) return false
  const prazo = parseDate(prazoISO).getTime()
  if (Number.isNaN(prazo)) return false
  const delta = prazo - Date.now()
  return delta >= 0 && delta <= SETE_DIAS
}

export function pncpToEdital(raw: PncpContratacao): Edital | null {
  const objeto = raw.objetoCompra || ''
  const controle = raw.numeroControlePNCP || ''
  const aderencia = computeAderencia(objeto, controle)
  if (!aderencia) return null

  const valorNum = Math.max(0, Math.round(raw.valorTotalEstimado || 0))
  const valor = formatBRL(valorNum)
  const cidade = raw.unidadeOrgao?.municipioNome || '—'
  const estado = raw.unidadeOrgao?.ufSigla || ''
  const orgao = raw.orgaoEntidade?.razaoSocial
    ? titleCase(raw.orgaoEntidade.razaoSocial)
    : raw.unidadeOrgao?.nomeUnidade || 'Órgão público'
  const modalidade = raw.modalidadeNome || 'Dispensa'
  const prazoISO = raw.dataEncerramentoProposta || null

  const analysis = buildAnalysis({
    objeto,
    orgao,
    cidade,
    estado,
    modalidade,
    valorNum,
    valor,
    score: aderencia.score,
    status: aderencia.status,
    tags: aderencia.tags,
    hasCore: aderencia.hasCore,
  })

  return {
    id: 'pncp-' + controle.replace(/[^a-z0-9]/gi, ''),
    orgao,
    cidade,
    estado,
    titulo: objeto.trim(),
    objetoCurto: aderencia.tags.slice(0, 3).map(termLabel).join(' · ') || objeto.slice(0, 60),
    modalidade,
    publicado: formatDateISO(raw.dataPublicacaoPncp),
    prazo: prazoISO ? formatDateISO(prazoISO) : '—',
    valor,
    valorNum,
    score: aderencia.score,
    status: aderencia.status,
    urgente: isUrgente(prazoISO),
    encerrado: false,
    tags: aderencia.tags.map(termLabel),
    link: pncpEditalLink(controle),
    pncp: {
      cnpj: raw.orgaoEntidade?.cnpj ?? '',
      ano: raw.anoCompra ?? 0,
      sequencial: raw.sequencialCompra ?? 0,
      controle,
    },
    ...analysis,
  }
}
