/* Radar PNCP — App shell: sidebar + topbar chrome, client-side routing, theme
 * toggle (dark = command-center default), and live PNCP data with graceful demo
 * fallback. Holds the persisted state (palavras-chave, alertas, descartados) and
 * the search query, and wires them into the screens.
 *
 * New-opportunity toast: when live data loads, we diff against a localStorage
 * set of already-seen IDs. First load populates the baseline silently; subsequent
 * loads show a real toast for genuinely new relevant opportunities. */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Edital, Route, SortId, RadarFilters } from './lib/types'
import { triggerColeta } from './lib/db'
import type { ToastData } from './components/Toast'
import { matchesKeywords } from './lib/scoring'
import { normalize } from './lib/text'
import { useRadar } from './hooks/useRadar'
import { useKeywords } from './hooks/useKeywords'
import { useEmpresaPerfil } from './hooks/useEmpresaPerfil'
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
  const [sort, setSort] = useState<SortId>('recentes')
  const [radarFilters, setRadarFilters] = useState<RadarFilters>({
    modalidade: '',
    estado: '',
    faixaValor: '',
    aderencia: '',
    urgente: null,
    mostrarEncerrados: false,
  })
  const [opId, setOpId] = useState<string | null>(null)
  const [dialog, setDialog] = useState(false)
  const [toast, setToast] = useState(false)
  const [toastData, setToastData] = useState<ToastData | undefined>(undefined)
  const [coletando, setColetando] = useState(false)
  const [search, setSearch] = useState('')

  // keywords: fonte de verdade é a tabela `keywords` no Supabase
  const { keywords, add: addKw, remove: removeKw } = useKeywords()
  // perfil da empresa: fonte de verdade é a tabela `empresa_perfil` no Supabase
  const { perfil, update: perfilUpdate } = useEmpresaPerfil()
  const [alerts, setAlerts] = useLocalState<AlertChannels>('radar.alerts', DEFAULT_ALERTS)
  const [dismissed, setDismissed] = useLocalState<string[]>('radar.dismissed', [])
  const [seenIds, setSeenIds] = useLocalState<string[]>('radar.seenIds', [])

  const { data, isLoading, isFetching, refetch } = useRadar({
    mostrarEncerrados: radarFilters.mostrarEncerrados,
    orderByPrazo: sort === 'prazo',
  })
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

  const showToast = useCallback((d: ToastData) => {
    setToastData(d)
    setToast(true)
  }, [])

  const openOp = useCallback((o: Edital) => {
    setOpId(o.id)
    document.getElementById('scrollArea')?.scrollTo(0, 0)
  }, [])

  // --- New-opportunity detection (live data only) ---
  // Ref prevents re-firing within the same data identity
  const lastCheckedRef = useRef<string | null>(null)

  useEffect(() => {
    if (isLoading || source !== 'live') return
    // Build a stable fingerprint for this data load
    const fingerprint = allEditais.map((e) => e.id).join(',')
    if (fingerprint === lastCheckedRef.current) return
    lastCheckedRef.current = fingerprint

    // Relevant = not dismissed, status not 'baixa'
    const relevant = allEditais.filter((e) => e.status !== 'baixa' && !dismissedSet.has(e.id))
    const currentIds = relevant.map((e) => e.id)

    // First-ever load (no baseline): populate silently
    if (seenIds.length === 0) {
      setSeenIds(currentIds)
      return
    }

    const seenSet = new Set(seenIds)
    const newOps = relevant.filter((e) => !seenSet.has(e.id))

    if (newOps.length === 0) {
      // Still sync: add any new IDs from current load (e.g. after refetch)
      const merged = Array.from(new Set([...seenIds, ...currentIds]))
      if (merged.length !== seenIds.length) setSeenIds(merged)
      return
    }

    // Pick the best new opportunity (highest score)
    const best = newOps.reduce((a, b) => (b.score > a.score ? b : a), newOps[0])

    const toastPayload: ToastData =
      newOps.length === 1
        ? {
            title: `Nova oportunidade · score ${best.score}`,
            message: `${best.objetoCurto} · ${best.valor} · prazo ${best.prazo}`,
            tone: 'info',
            onClick: () => openOp(best),
          }
        : {
            title: `${newOps.length} novas oportunidades`,
            message: `Melhor: ${best.objetoCurto} · score ${best.score}`,
            tone: 'info',
            onClick: () => openOp(best),
          }

    // Show the toast after a short delay for UX
    const t = setTimeout(() => showToast(toastPayload), 800)

    // Mark as seen
    setSeenIds((prev) => Array.from(new Set([...prev, ...newOps.map((e) => e.id)])))

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, source, allEditais, dismissedSet])

  const handleColetar = async () => {
    if (coletando) return
    setColetando(true)
    const result = await triggerColeta()
    setColetando(false)
    if (!result.ok || result.varridos === 0) {
      showToast({
        title: 'PNCP não respondeu agora',
        message: result.error || 'Limite de acessos atingido. Tente em alguns minutos.',
        tone: 'warning',
      })
      return
    }
    await refetch()
    showToast({
      title: 'Radar atualizado',
      message: `${result.varridos ?? 0} editais varridos · ${result.upserted ?? 0} novos gravados`,
      tone: 'success',
    })
  }

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

  const onNav = (id: Route) => {
    setOpId(null)
    if (id === 'urgentes') {
      // navigate to radar with urgente filter pre-set
      setRoute('radar')
      setRadarFilters({ modalidade: '', estado: '', faixaValor: '', aderencia: '', urgente: true, mostrarEncerrados: false })
    } else {
      setRoute(id)
      if (id === 'radar') {
        // reset filters when navigating back to radar
        setRadarFilters({ modalidade: '', estado: '', faixaValor: '', aderencia: '', urgente: null, mostrarEncerrados: false })
      }
    }
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
              onAddKeyword={(t) => addKw.mutate(t)}
              onRemoveKeyword={(t) => removeKw.mutate(t)}
              alerts={alerts}
              onAlertsChange={setAlerts}
              perfil={perfil}
              perfilUpdate={perfilUpdate}
              onToast={showToast}
            />
          ) : (
            <Dashboard
              editais={activeEditais}
              onOpen={openOp}
              sort={sort}
              setSort={setSort}
              filters={radarFilters}
              setFilters={setRadarFilters}
              isLoading={isLoading}
              isFetching={isFetching}
              onRefresh={() => refetch()}
              source={source}
              coletando={coletando}
              onColetar={handleColetar}
            />
          )}
        </div>
      </div>
      <ProposalDialog open={dialog} onClose={() => setDialog(false)} op={op} />
      <Toast show={toast} onClose={() => setToast(false)} data={toastData} />
    </div>
  )
}
