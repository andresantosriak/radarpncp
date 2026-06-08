/* Radar PNCP — App shell: sidebar + topbar chrome, client-side routing, theme
 * toggle (dark = command-center default), and live PNCP data with graceful demo
 * fallback. Holds the persisted state (palavras-chave, alertas, descartados) and
 * the search query, and wires them into the screens. */
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Edital, FilterId, Route } from './lib/types'
import { DEFAULT_KEYWORDS } from './lib/keywords'
import { matchesKeywords } from './lib/scoring'
import { normalize } from './lib/text'
import { useRadar } from './hooks/useRadar'
import { useLocalState } from './hooks/useLocalState'
import { Icon } from './components/Icon'
import { OpportunityCard } from './components/OpportunityCard'
import { Toast } from './components/Toast'
import { ProposalDialog } from './components/ProposalDialog'
import { Sidebar } from './screens/Sidebar'
import { Topbar, type Theme } from './screens/Topbar'
import { Dashboard } from './screens/Dashboard'
import { Detail } from './screens/Detail'
import { ConfigScreen, type AlertChannels, DEFAULT_ALERTS } from './screens/ConfigScreen'

const ROUTE_TITLE: Record<Route, string> = {
  radar: 'Radar de oportunidades',
  urgentes: 'Urgentes',
  descartados: 'Descartados',
  palavras: 'Palavras-chave',
  alertas: 'Alertas',
  empresa: 'Perfil da empresa',
}

function applySearch(list: Edital[], q: string): Edital[] {
  const nq = normalize(q).trim()
  if (!nq) return list
  return list.filter((e) =>
    normalize(`${e.titulo} ${e.orgao} ${e.cidade} ${e.modalidade} ${e.objetoCurto}`).includes(nq),
  )
}

export function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [route, setRoute] = useState<Route>('radar')
  const [filter, setFilter] = useState<FilterId>('todos')
  const [opId, setOpId] = useState<string | null>(null)
  const [dialog, setDialog] = useState(false)
  const [toast, setToast] = useState(false)
  const [search, setSearch] = useState('')

  // v2: vocabulário ampliado (substitui as 16 palavras antigas salvas no browser)
  const [keywords, setKeywords] = useLocalState<string[]>('radar.keywords.v2', DEFAULT_KEYWORDS)
  const [alerts, setAlerts] = useLocalState<AlertChannels>('radar.alerts', DEFAULT_ALERTS)
  const [dismissed, setDismissed] = useLocalState<string[]>('radar.dismissed', [])

  const { data, isLoading, isFetching, refetch } = useRadar()
  const allEditais = data?.editais ?? []
  const source = data?.source ?? 'demo'

  // filtro por palavras-chave monitoradas (cliente) — editável na tela de config
  const byKeyword = (e: Edital) => keywords.length === 0 || matchesKeywords(e.titulo, keywords)

  // Deriva o edital aberto dos dados atuais — assim ele acompanha refetch e
  // some (volta ao radar) se sair do conjunto após uma atualização.
  const op = useMemo(() => allEditais.find((e) => e.id === opId) ?? null, [allEditais, opId])

  const dismissedSet = useMemo(() => new Set(dismissed), [dismissed])
  const isDismissed = (id: string) => dismissedSet.has(id)
  const toggleDismiss = (id: string) =>
    setDismissed((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (isLoading) return
    const t = setTimeout(() => setToast(true), 800)
    return () => clearTimeout(t)
  }, [isLoading])

  // counts (sidebar) — independentes da busca, para estabilidade
  const activeAll = allEditais.filter((e) => !isDismissed(e.id) && e.status !== 'baixa')
  const counts = {
    radar: activeAll.length,
    urgentes: activeAll.filter((e) => e.urgente).length,
    descartados: allEditais.filter((e) => isDismissed(e.id) || e.status === 'baixa').length,
  }

  // listas exibidas — busca + palavras-chave monitoradas
  const searched = applySearch(allEditais, search).filter(byKeyword)
  const activeEditais = searched.filter((e) => !isDismissed(e.id))
  const descartadosEditais = searched.filter((e) => isDismissed(e.id) || e.status === 'baixa')

  const openOp = (o: Edital) => {
    setOpId(o.id)
    document.getElementById('scrollArea')?.scrollTo(0, 0)
  }

  const onNav = (id: Route) => {
    setOpId(null)
    setRoute(id)
    if (id === 'radar') setFilter('todos')
    if (id === 'urgentes') setFilter('urgentes')
  }

  let crumb: ReactNode
  if (op) {
    crumb = (
      <div className="crumb">
        <span>Radar</span>
        <Icon name="chevron-right" size={14} />
        <b>Oportunidade</b>
      </div>
    )
  } else {
    crumb = (
      <div className="crumb">
        <b>{ROUTE_TITLE[route]}</b>
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar active={op ? 'radar' : route} onNav={onNav} counts={counts} />
      <div className="main">
        <Topbar
          crumb={crumb}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          search={search}
          onSearchChange={setSearch}
          source={source}
        />
        <div className="scroll" id="scrollArea">
          {source === 'demo' && !isLoading && (
            <div
              style={{
                margin: '16px 28px 0',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'var(--warning-soft)',
                color: 'var(--warning-fg)',
                border: '1px solid color-mix(in oklab, var(--warning) 30%, transparent)',
                borderRadius: 'var(--radius-md)',
                fontSize: 13.5,
                lineHeight: 1.45,
              }}
            >
              <Icon name="circle-alert" size={18} />
              <span style={{ flex: 1 }}>
                <b>Modo demonstração — dados fictícios.</b> A API do PNCP não respondeu agora, então o radar
                mostra 5 editais de exemplo (valores redondos, sem link real). Os dados reais aparecem quando o
                PNCP responde.
              </span>
              <button
                onClick={() => refetch()}
                style={{
                  flex: 'none',
                  border: '1px solid currentColor',
                  background: 'transparent',
                  color: 'inherit',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {isFetching ? 'Tentando…' : 'Tentar ao vivo'}
              </button>
            </div>
          )}
          {op ? (
            <Detail
              op={op}
              onBack={() => setOpId(null)}
              onGenerate={() => setDialog(true)}
              dismissed={isDismissed(op.id)}
              onToggleDismiss={() => toggleDismiss(op.id)}
            />
          ) : route === 'descartados' ? (
            <div className="page">
              <div className="page-head">
                <div>
                  <div className="page-title">Descartados</div>
                  <div className="page-sub">
                    Editais sem aderência ao portfólio ou descartados por você.
                  </div>
                </div>
              </div>
              {descartadosEditais.length ? (
                <div className="opp-list">
                  {descartadosEditais.map((o) => (
                    <OpportunityCard key={o.id} op={o} onOpen={openOp} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <Icon name="archive" size={32} />
                  <span>Nada descartado por aqui.</span>
                </div>
              )}
            </div>
          ) : route === 'palavras' || route === 'alertas' || route === 'empresa' ? (
            <ConfigScreen
              which={route}
              keywords={keywords}
              onKeywordsChange={setKeywords}
              alerts={alerts}
              onAlertsChange={setAlerts}
            />
          ) : (
            <Dashboard
              editais={activeEditais}
              onOpen={openOp}
              filter={filter}
              setFilter={setFilter}
              isLoading={isLoading}
              isFetching={isFetching}
              onRefresh={() => refetch()}
              source={source}
            />
          )}
        </div>
      </div>
      <ProposalDialog open={dialog} onClose={() => setDialog(false)} op={op} />
      <Toast show={toast} onClose={() => setToast(false)} />
    </div>
  )
}
