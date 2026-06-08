/* Radar PNCP — configuration screens: Palavras-chave (editáveis), Alertas
 * (toggles) e Perfil da empresa (editável, salva no Supabase). */
import { useState, useEffect, type KeyboardEvent } from 'react'
import type { ConfigKey } from '../lib/types'
import type { IconName } from '../components/Icon'
import type { EmpresaPerfil } from '../hooks/useEmpresaPerfil'
import type { PerfilRow } from '../lib/perfil-db'
import type { UseMutationResult } from '@tanstack/react-query'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'
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
  onAddKeyword: (termo: string) => void
  onRemoveKeyword: (termo: string) => void
  alerts: AlertChannels
  onAlertsChange: (alerts: AlertChannels) => void
  perfil?: EmpresaPerfil
  perfilUpdate?: UseMutationResult<void, Error, Partial<PerfilRow>>
  onToast?: (d: { title: string; message?: string; tone?: 'success' | 'warning' | 'info' }) => void
}

export function ConfigScreen({ which, keywords, onAddKeyword, onRemoveKeyword, alerts, onAlertsChange, perfil, perfilUpdate, onToast }: ConfigScreenProps) {
  const meta = META[which]
  const [draft, setDraft] = useState('')

  // empresa form state
  const [empRazao, setEmpRazao] = useState('')
  const [empCnpj, setEmpCnpj] = useState('')
  const [empArea, setEmpArea] = useState('')
  const [empPortfolio, setEmpPortfolio] = useState('')
  const [empDirty, setEmpDirty] = useState(false)

  // sync form when perfil loads / changes
  useEffect(() => {
    if (perfil) {
      setEmpRazao(perfil.razaoSocial)
      setEmpCnpj(perfil.cnpj)
      setEmpArea(perfil.area)
      setEmpPortfolio(perfil.portfolioTexto)
      setEmpDirty(false)
    }
  }, [perfil])

  const handleEmpresaChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value)
    setEmpDirty(true)
  }

  const handleEmpresaSave = () => {
    if (!perfilUpdate) return
    perfilUpdate.mutate(
      { razao_social: empRazao.trim(), cnpj: empCnpj.trim(), area: empArea.trim(), portfolio_texto: empPortfolio.trim() },
      {
        onSuccess: () => {
          setEmpDirty(false)
          onToast?.({ title: 'Perfil salvo', message: 'As alterações foram gravadas com sucesso.', tone: 'success' })
        },
        onError: () => {
          onToast?.({ title: 'Erro ao salvar', message: 'Não foi possível atualizar o perfil. Tente novamente.', tone: 'warning' })
        },
      },
    )
  }

  const addTerm = () => {
    const t = draft.trim()
    if (!t) return
    const exists = keywords.some((k) => normalize(k).trim() === normalize(t).trim())
    if (!exists) onAddKeyword(t)
    setDraft('')
  }
  const removeTerm = (k: string) => onRemoveKeyword(k)
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
              aria-label="Nova palavra-chave"
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
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Razão social</span>
            <input
              value={empRazao}
              onChange={handleEmpresaChange(setEmpRazao)}
              style={{
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                background: 'var(--bg)',
                color: 'var(--text-strong)',
                outline: 'none',
              }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>CNPJ</span>
            <input
              value={empCnpj}
              onChange={handleEmpresaChange(setEmpCnpj)}
              style={{
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                background: 'var(--bg)',
                color: 'var(--text-strong)',
                outline: 'none',
              }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Área de atuação</span>
            <input
              value={empArea}
              onChange={handleEmpresaChange(setEmpArea)}
              style={{
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                background: 'var(--bg)',
                color: 'var(--text-strong)',
                outline: 'none',
              }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Portfólio / Descrição detalhada</span>
            <span style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.4 }}>
              Esse texto alimenta a precisão do radar — quanto mais detalhado, melhor o cruzamento semântico com os editais do PNCP.
            </span>
            <textarea
              value={empPortfolio}
              onChange={handleEmpresaChange(setEmpPortfolio)}
              rows={5}
              style={{
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                background: 'var(--bg)',
                color: 'var(--text-strong)',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5,
              }}
            />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEmpresaSave}
              disabled={!empDirty || perfilUpdate?.isPending}
              iconLeft={<Icon name="check" size={15} />}
            >
              {perfilUpdate?.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
