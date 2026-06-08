/* Radar PNCP — raw shapes from the official PNCP consultation API
 * (/api/consulta/v1/contratacoes/publicacao). Subset of the fields the radar
 * uses; the real payload has more. */

export interface PncpOrgaoEntidade {
  cnpj?: string
  razaoSocial?: string
  poderId?: string
  esferaId?: string
}

export interface PncpUnidadeOrgao {
  ufNome?: string
  ufSigla?: string
  municipioNome?: string
  nomeUnidade?: string
  codigoIbge?: string
}

export interface PncpContratacao {
  numeroControlePNCP: string
  objetoCompra: string
  modalidadeNome: string
  modalidadeId?: number
  valorTotalEstimado?: number | null
  dataPublicacaoPncp?: string | null
  dataAberturaProposta?: string | null
  dataEncerramentoProposta?: string | null
  situacaoCompraNome?: string
  orgaoEntidade?: PncpOrgaoEntidade
  unidadeOrgao?: PncpUnidadeOrgao
  anoCompra?: number
  sequencialCompra?: number
}

export interface PncpPage {
  data: PncpContratacao[]
  totalRegistros: number
  totalPaginas: number
  numeroPagina: number
  paginasRestantes: number
  empty: boolean
}
