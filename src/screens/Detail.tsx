/* Radar PNCP — Opportunity detail + análise. Mostra a análise heurística por
 * padrão e permite "Analisar com IA" (Edge Function lê o PDF do edital e usa
 * GPT-4o-mini); quando a IA responde, a tela passa a refletir a análise do LLM.
 * Análises já persistidas são carregadas automaticamente ao abrir a oportunidade. */
import { useEffect, useState } from 'react'
import type { Edital } from '../lib/types'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'
import { Pill } from '../components/Pill'
import { Gauge } from '../components/Gauge'
import { KV } from '../components/KV'
import { scoreBand } from '../components/score'
import type { PillTone } from '../components/Pill'
import { analisarEditalIA, fetchAnaliseSalva, iaDisponivel, type AnaliseIA } from '../lib/ai'

const FONTE_LABEL: Record<string, [PillTone, string]> = {
  pncp: ['info', 'PNCP'],
  'querido-diario': ['gold', 'Diário Oficial'],
}

type DetailTab = 'resumo' | 'docs' | 'custos'

export interface DetailProps {
  op: Edital
  onBack: () => void
  onGenerate: () => void
  dismissed: boolean
  onToggleDismiss: () => void
}

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'resumo', label: 'Resumo' },
  { id: 'docs', label: 'Documentos' },
  { id: 'custos', label: 'Custos & proposta' },
]

function decisionLabel(recomendacao: string): string {
  if (recomendacao.startsWith('Descartar')) return 'Descartar'
  if (recomendacao.startsWith('Participar')) return 'Participar'
  return 'Analisar'
}

function chanceColor(chance: string): string {
  if (chance === 'Alta') return 'var(--success)'
  if (chance === 'Média') return 'var(--warning-fg)'
  return 'var(--danger-fg)'
}

function formatDate(iso: string | undefined): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return ''
  }
}

export function Detail({ op, onBack, onGenerate, dismissed, onToggleDismiss }: DetailProps) {
  const [tab, setTab] = useState<DetailTab>('resumo')
  const [ia, setIa] = useState<AnaliseIA | null>(null)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaErr, setIaErr] = useState<string | null>(null)

  // on opportunity change: reset then try to load saved analysis
  useEffect(() => {
    setIa(null)
    setIaErr(null)
    setTab('resumo')

    if (!op.pncp || !iaDisponivel()) return

    let cancelled = false
    fetchAnaliseSalva(op.pncp.controle).then((saved) => {
      if (!cancelled && saved) setIa(saved)
    })
    return () => { cancelled = true }
  }, [op.id])

  // view = raw PNCP data (op) + IA overlay when available
  const view: Edital = ia
    ? {
        ...op,
        score: ia.score,
        recomendacao: ia.recomendacao,
        resumo: ia.resumo,
        porQueCombina: ia.porQueCombina,
        porQueNao: ia.porQueNao,
        documentos: ia.documentos,
        custos: ia.custos,
        custoTotal: ia.custoTotal,
        propostaMin: ia.propostaMin,
        propostaIdeal: ia.propostaIdeal,
        margem: ia.margem,
        risco: ia.risco,
        concorrencia: ia.concorrencia,
        burocracia: ia.burocracia,
        chance: ia.chance as Edital['chance'],
      }
    : op

  const band = scoreBand(view.score)
  const adherenceLabel = band.label === 'Muito forte' ? 'Forte aderência' : `${band.label} aderência`
  const canIA = Boolean(op.pncp) && iaDisponivel()

  const runIA = async (force = false) => {
    setIaLoading(true)
    setIaErr(null)
    try {
      setIa(await analisarEditalIA(op, force))
    } catch (e) {
      setIaErr((e as Error).message)
    } finally {
      setIaLoading(false)
    }
  }

  const analysisDate = ia?.analisadoEm ? formatDate(ia.analisadoEm) : ''

  return (
    <div className="page">
      <button className="icon-btn-ghost" onClick={onBack} style={{ marginBottom: 14, marginLeft: -8 }}>
        <Icon name="arrow-left" />
        Voltar ao radar
      </button>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <Pill tone={band.tone} dot>
          {adherenceLabel}
        </Pill>
        {op.encerrado && (
          <Pill tone="danger">Prazo encerrado</Pill>
        )}
        {op.urgente && (
          <Pill tone="gold" solid>
            Urgente
          </Pill>
        )}
        <Pill tone="neutral">{op.modalidade}</Pill>
        {op.fonte && (() => {
          const [ft, fl] = FONTE_LABEL[op.fonte] ?? ['neutral', op.fonte]
          return <Pill tone={ft}>{fl}</Pill>
        })()}
        {ia && (
          <Pill tone="brand">
            <Icon name="sparkles" size={12} />
            Análise por IA
          </Pill>
        )}
      </div>
      <div className="page-title" style={{ maxWidth: 760 }}>
        {op.titulo}
      </div>
      <div className="page-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="landmark" size={15} />
        {op.orgao} · {op.cidade}/{op.estado} · publicado {op.publicado}
      </div>

      <div style={{ height: 22 }} />
      <div className="detail-grid">
        <div>
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 22,
              background: 'var(--bg-subtle)',
              padding: 4,
              borderRadius: 'var(--radius-md)',
              width: 'fit-content',
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  appearance: 'none',
                  border: 0,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: tab === t.id ? 'var(--surface)' : 'transparent',
                  color: tab === t.id ? 'var(--text-strong)' : 'var(--text-muted)',
                  boxShadow: tab === t.id ? 'var(--shadow-xs)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'resumo' && (
            <div>
              <div className="section">
                <h3>
                  <Icon name="sparkles" />
                  {ia
                    ? `Análise da IA (${ia.modelo}${
                        ia.lidoDoPdf ? ` · leu o edital, ${(ia.textoChars ?? 0).toLocaleString('pt-BR')} caracteres` : ' · pelo objeto, sem PDF legível'
                      })`
                    : 'Resumo da IA'}
                </h3>
                {analysisDate && (
                  <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: '4px 0 8px' }}>
                    Analisada por IA em {analysisDate}
                  </p>
                )}
                <p className="prose">{view.resumo}</p>
              </div>

              {/* Critério de julgamento */}
              {ia?.criterioJulgamento && (
                <div className="section">
                  <h3 style={{ fontSize: 15 }}>
                    <Icon name="scale" />
                    Critério de julgamento
                  </h3>
                  <p className="prose">{ia.criterioJulgamento}</p>
                </div>
              )}

              <div className="section two-col">
                <div>
                  <h3 style={{ fontSize: 15 }}>
                    <Icon name="circle-check" style={{ color: 'var(--success)' }} />
                    Por que combina
                  </h3>
                  <ul className="reason pos">
                    {view.porQueCombina.length ? (
                      view.porQueCombina.map((r, i) => (
                        <li key={i}>
                          <Icon name="check" />
                          {r}
                        </li>
                      ))
                    ) : (
                      <li style={{ color: 'var(--text-subtle)' }}>—</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: 15 }}>
                    <Icon name="circle-alert" style={{ color: 'var(--danger)' }} />
                    Pontos de atenção
                  </h3>
                  <ul className="reason neg">
                    {view.porQueNao.length ? (
                      view.porQueNao.map((r, i) => (
                        <li key={i}>
                          <Icon name="x" />
                          {r}
                        </li>
                      ))
                    ) : (
                      <li style={{ color: 'var(--text-subtle)' }}>—</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Prazos */}
              {ia && ia.prazos.length > 0 && (
                <div className="section">
                  <h3 style={{ fontSize: 15 }}>
                    <Icon name="calendar-clock" />
                    Prazos e datas-chave
                  </h3>
                  <ul className="reason pos">
                    {ia.prazos.map((p, i) => (
                      <li key={i}>
                        <Icon name="calendar" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requisitos técnicos */}
              {ia && ia.requisitosTecnicos.length > 0 && (
                <div className="section">
                  <h3 style={{ fontSize: 15 }}>
                    <Icon name="clipboard-list" />
                    Requisitos técnicos de habilitação
                  </h3>
                  <ul className="reason neg">
                    {ia.requisitosTecnicos.map((r, i) => (
                      <li key={i}>
                        <Icon name="file-check" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === 'docs' && (
            <div className="section">
              <h3>
                <Icon name="file-check" />
                Documentos e certidões exigidos
              </h3>
              {view.documentos.length ? (
                <div className="doclist">
                  {view.documentos.map((d, i) => (
                    <div className="docrow" key={i}>
                      <Icon name="file-text" />
                      {d}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="prose" style={{ color: 'var(--text-subtle)' }}>
                  Edital sem aderência — análise documental não aplicável.
                </p>
              )}
            </div>
          )}

          {tab === 'custos' && (
            <div className="section">
              <h3>
                <Icon name="calculator" />
                Composição de custos
              </h3>
              {view.custos.length ? (
                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: 'var(--surface)',
                  }}
                >
                  {view.custos.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: 14,
                      }}
                    >
                      <span style={{ color: 'var(--text-body)' }}>{c.item}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>
                        {c.valor}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      fontSize: 14,
                      fontWeight: 700,
                      background: 'var(--bg-subtle)',
                    }}
                  >
                    <span style={{ color: 'var(--text-strong)' }}>Custo operacional previsto</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' }}>{view.custoTotal}</span>
                  </div>
                </div>
              ) : (
                <p className="prose" style={{ color: 'var(--text-subtle)' }}>
                  Sem composição de custos para este edital.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: score panel */}
        <div className="score-panel">
          {canIA &&
            (ia ? (
              <button
                onClick={() => runIA(true)}
                disabled={iaLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--brand-soft-fg)',
                  background: 'var(--brand-soft)',
                  border: '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  cursor: iaLoading ? 'default' : 'pointer',
                  width: '100%',
                }}
              >
                <Icon name="sparkles" size={14} />
                {iaLoading
                  ? 'Reanalisando…'
                  : `Analisado por IA (${ia.lidoDoPdf ? 'leu o edital' : 'pelo objeto'}) · reanalisar`}
              </button>
            ) : (
              <Button
                variant="primary"
                onClick={() => runIA(false)}
                iconLeft={<Icon name="sparkles" size={17} />}
                style={{ width: '100%' }}
              >
                {iaLoading ? 'Lendo o edital com IA…' : 'Analisar com IA'}
              </Button>
            ))}
          {!op.pncp && (
            <div style={{ fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center' }}>
              Análise por IA disponível nas oportunidades ao vivo do PNCP.
            </div>
          )}
          {iaErr && (
            <div style={{ fontSize: 12, color: 'var(--danger-fg)', lineHeight: 1.4 }}>{iaErr}</div>
          )}

          <div className="big-gauge">
            <Gauge value={view.score} size={120} stroke={11} showLabel={false} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: band.color,
              }}
            >
              {decisionLabel(view.recomendacao)}
            </span>
          </div>
          <div>
            <KV k="Valor estimado" v={op.valor} />
            <KV k="Prazo final" v={op.prazo} color="var(--warning-fg)" />
            <KV k="Risco jurídico" v={view.risco} />
            <KV k="Concorrência" v={view.concorrencia} />
            <KV k="Burocracia" v={view.burocracia} />
            <KV k="Chance de vitória" v={view.chance} color={chanceColor(view.chance)} />
          </div>
          {view.propostaIdeal !== '—' && (
            <div className="proposal">
              <div className="lbl">Proposta recomendada</div>
              <div className="amount">{view.propostaIdeal}</div>
              <div className="range">
                Mínimo saudável {view.propostaMin} · margem {view.margem}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              variant="primary"
              onClick={onGenerate}
              iconLeft={<Icon name="file-signature" size={17} />}
              style={{ width: '100%' }}
            >
              Gerar proposta
            </Button>
            {op.link ? (
              <Button
                variant="secondary"
                onClick={() => window.open(op.link, '_blank', 'noopener')}
                iconLeft={<Icon name="external-link" size={16} />}
                style={{ width: '100%' }}
              >
                {op.fonte === 'querido-diario' ? 'Ver diário oficial' : 'Ver no PNCP'}
              </Button>
            ) : (
              <Button
                variant="secondary"
                iconLeft={<Icon name="external-link" size={16} />}
                style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
              >
                {op.fonte === 'querido-diario' ? 'Ver diário oficial' : 'Ver no PNCP'} (demonstração)
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onToggleDismiss}
              iconLeft={<Icon name={dismissed ? 'archive' : 'x'} size={16} />}
              style={{ width: '100%' }}
            >
              {dismissed ? 'Restaurar oportunidade' : 'Descartar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
