/* Radar PNCP — configuration screens: Palavras-chave (editáveis), Alertas
 * (toggles) e Perfil da empresa. Estado controlado pelo App e persistido. */
import { useState, type KeyboardEvent } from 'react'
import type { ConfigKey } from '../lib/types'
import type { IconName } from '../components/Icon'
import { Icon } from '../components/Icon'
import { KV } from '../components/KV'
import { empresa } from '../lib/data'
import { normalize } from '../lib/text'
import { CORE_TERMS } from '../lib/keywords'

export interface AlertChannels {
  whatsapp: boolean
  email: boolean
  telegram: boolean
  painel: boolean
}

export const DEFAULT_ALERTS: AlertChannels = {
  whatsapp: true,
  email: true,
  telegram: false,
  painel: true,
}

const META: Record<ConfigKey, { t: string; d: string }> = {
  palavras: {
    t: 'Palavras-chave monitoradas',
    d: 'O radar consulta o PNCP diariamente buscando estes termos. Edite à vontade.',
  },
  alertas: { t: 'Alertas', d: 'Canais de notificação para novas oportunidades.' },
  empresa: { t: 'Perfil da empresa', d: 'Base de comparação estratégica do radar.' },
}

const CANAIS: { key: keyof AlertChannels; nome: string; icon: IconName }[] = [
  { key: 'whatsapp', nome: 'WhatsApp', icon: 'message-circle' },
  { key: 'email', nome: 'E-mail', icon: 'mail' },
  { key: 'telegram', nome: 'Telegram', icon: 'send' },
  { key: 'painel', nome: 'Painel', icon: 'layout-dashboard' },
]

const isStrong = (k: string) => CORE_TERMS.has(normalize(k).trim())

export interface ConfigScreenProps {
  which: ConfigKey
  keywords: string[]
  onKeywordsChange: (keywords: string[]) => void
  alerts: AlertChannels
  onAlertsChange: (alerts: AlertChannels) => void
}

export function ConfigScreen({ which, keywords, onKeywordsChange, alerts, onAlertsChange }: ConfigScreenProps) {
  const meta = META[which]
  const [draft, setDraft] = useState('')

  const addTerm = () => {
    const t = draft.trim()
    if (!t) return
    const exists = keywords.some((k) => normalize(k).trim() === normalize(t).trim())
    if (!exists) onKeywordsChange([...keywords, t])
    setDraft('')
  }
  const removeTerm = (k: string) => onKeywordsChange(keywords.filter((x) => x !== k))
  const onDraftKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTerm()
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">{meta.t}</div>
          <div className="page-sub">{meta.d}</div>
        </div>
      </div>

      {which === 'palavras' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {keywords.map((k) => {
            const strong = isStrong(k)
            return (
              <span
                key={k}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  color: strong ? 'var(--brand-soft-fg)' : 'var(--text-body)',
                  background: strong ? 'var(--brand-soft)' : 'var(--surface)',
                  border: strong ? '1px solid transparent' : '1px solid var(--border-strong)',
                  borderRadius: 99,
                  padding: '7px 10px 7px 13px',
                }}
              >
                <Icon name="hash" style={{ opacity: 0.6 }} size={13} />
                {k}
                <button
                  onClick={() => removeTerm(k)}
                  aria-label={`Remover ${k}`}
                  style={{
                    display: 'inline-flex',
                    border: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'currentColor',
                    opacity: 0.55,
                    padding: 2,
                    marginLeft: 2,
                  }}
                >
                  <Icon name="x" size={13} />
                </button>
              </span>
            )
          })}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              border: '1px dashed var(--border-strong)',
              borderRadius: 99,
              padding: '3px 4px 3px 12px',
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onDraftKey}
              placeholder="novo termo"
              style={{
                border: 0,
                outline: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                color: 'var(--text-strong)',
                width: 110,
              }}
            />
            <button
              onClick={addTerm}
              aria-label="Adicionar termo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--brand)',
                background: 'transparent',
                border: 0,
                borderRadius: 99,
                padding: '5px 9px',
                cursor: 'pointer',
              }}
            >
              <Icon name="plus" size={15} />
            </button>
          </span>
        </div>
      )}

      {which === 'alertas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
          {CANAIS.map(({ key, nome, icon }) => {
            const on = alerts[key]
            return (
              <button
                key={key}
                onClick={() => onAlertsChange({ ...alerts, [key]: !on })}
                aria-pressed={on}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Icon name={icon} size={18} />
                </span>
                <span style={{ flex: 1, fontWeight: 600, color: 'var(--text-strong)' }}>{nome}</span>
                <span
                  style={{
                    width: 40,
                    height: 23,
                    borderRadius: 99,
                    background: on ? 'var(--brand)' : 'var(--ink-200)',
                    padding: 2,
                    display: 'flex',
                    justifyContent: on ? 'flex-end' : 'flex-start',
                    transition: 'background var(--dur-base) var(--ease-out)',
                  }}
                >
                  <span style={{ width: 19, height: 19, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)' }} />
                </span>
              </button>
            )
          })}
        </div>
      )}

      {which === 'empresa' && (
        <div
          style={{
            maxWidth: 560,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 24,
          }}
        >
          <KV k="Razão social" v={empresa.nome} />
          <KV k="CNPJ" v={empresa.cnpj} />
          <div className="kv" style={{ borderBottom: 0 }}>
            <span className="k">Área</span>
            <span style={{ fontSize: 14, color: 'var(--text-body)', textAlign: 'right', maxWidth: 320 }}>
              {empresa.area}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
