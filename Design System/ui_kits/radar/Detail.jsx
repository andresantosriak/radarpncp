/* Radar PNCP UI kit — Opportunity detail + AI analysis. */
function KV({ k, v, color }) {
  return <div className="kv"><span className="k">{k}</span><span className="v" style={color ? { color } : undefined}>{v}</span></div>;
}

function Detail({ op, onBack, onGenerate }) {
  const [tab, setTab] = React.useState('resumo');
  const tabs = [
    { id: 'resumo', label: 'Resumo' },
    { id: 'docs', label: 'Documentos' },
    { id: 'custos', label: 'Custos & proposta' },
  ];
  return (
    <div className="page">
      <button className="icon-btn-ghost" onClick={onBack} style={{ marginBottom: 14, marginLeft: -8 }}><Icon name="arrow-left" />Voltar ao radar</button>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <Pill tone={scoreBand(op.score).tone} dot>{scoreBand(op.score).label === 'Muito forte' ? 'Forte aderência' : scoreBand(op.score).label + ' aderência'}</Pill>
        {op.urgente && <Pill tone="gold" solid>Urgente</Pill>}
        <Pill tone="neutral">{op.modalidade}</Pill>
      </div>
      <div className="page-title" style={{ maxWidth: 760 }}>{op.titulo}</div>
      <div className="page-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="landmark" style={{width:15,height:15}} />{op.orgao} · {op.cidade}/{op.estado} · publicado {op.publicado}</div>

      <div style={{ height: 22 }} />
      <div className="detail-grid">
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 22, background: 'var(--bg-subtle)', padding: 4, borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ appearance: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, padding: '7px 14px', borderRadius: 'var(--radius-sm)', background: tab===t.id?'var(--surface)':'transparent', color: tab===t.id?'var(--text-strong)':'var(--text-muted)', boxShadow: tab===t.id?'var(--shadow-xs)':'none' }}>{t.label}</button>
            ))}
          </div>

          {tab === 'resumo' && (
            <div>
              <div className="section">
                <h3><Icon name="sparkles" />Resumo da IA</h3>
                <p className="prose">{op.resumo}</p>
              </div>
              <div className="section two-col">
                <div>
                  <h3 style={{ fontSize: 15 }}><Icon name="circle-check" style={{ color: 'var(--success)' }} />Por que combina</h3>
                  <ul className="reason pos">
                    {op.porQueCombina.length ? op.porQueCombina.map((r, i) => <li key={i}><Icon name="check" />{r}</li>) : <li style={{ color: 'var(--text-subtle)' }}>—</li>}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: 15 }}><Icon name="circle-alert" style={{ color: 'var(--danger)' }} />Pontos de atenção</h3>
                  <ul className="reason neg">
                    {op.porQueNao.map((r, i) => <li key={i}><Icon name="x" />{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'docs' && (
            <div className="section">
              <h3><Icon name="file-check" />Documentos e certidões exigidos</h3>
              {op.documentos.length ? (
                <div className="doclist">
                  {op.documentos.map((d, i) => <div className="docrow" key={i}><Icon name="file-text" />{d}</div>)}
                </div>
              ) : <p className="prose" style={{ color: 'var(--text-subtle)' }}>Edital sem aderência — análise documental não aplicável.</p>}
            </div>
          )}

          {tab === 'custos' && (
            <div className="section">
              <h3><Icon name="calculator" />Composição de custos</h3>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface)' }}>
                {op.custos.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-body)' }}>{c.item}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{c.valor}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', fontSize: 14, fontWeight: 700, background: 'var(--bg-subtle)' }}>
                  <span style={{ color: 'var(--text-strong)' }}>Custo operacional previsto</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' }}>{op.custoTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: score panel */}
        <div className="score-panel">
          <div className="big-gauge">
            <Gauge value={op.score} size={120} stroke={11} showLabel={false} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: scoreBand(op.score).color }}>{op.recomendacao.startsWith('Descartar') ? 'Descartar' : op.recomendacao.startsWith('Participar') ? 'Participar' : 'Analisar'}</span>
          </div>
          <div>
            <KV k="Valor estimado" v={op.valor} />
            <KV k="Prazo final" v={op.prazo} color="var(--warning-fg)" />
            <KV k="Risco jurídico" v={op.risco} />
            <KV k="Concorrência" v={op.concorrencia} />
            <KV k="Burocracia" v={op.burocracia} />
            <KV k="Chance de vitória" v={op.chance} color={op.chance==='Alta'?'var(--success)':op.chance==='Média'?'var(--warning-fg)':'var(--danger-fg)'} />
          </div>
          {op.propostaIdeal !== '—' && (
            <div className="proposal">
              <div className="lbl">Proposta recomendada</div>
              <div className="amount">{op.propostaIdeal}</div>
              <div className="range">Mínimo saudável {op.propostaMin} · margem {op.margem}</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Btn variant="primary" onClick={onGenerate} iconLeft={<Icon name="file-signature" style={{width:17,height:17}} />} style={{ width: '100%' }}>Gerar proposta</Btn>
            <Btn variant="secondary" iconLeft={<Icon name="external-link" style={{width:16,height:16}} />} style={{ width: '100%' }}>Ver no PNCP</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Detail, KV });
