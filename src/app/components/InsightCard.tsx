import { useState } from 'react'
import { ChevronDown, Wand2, Plus, Trash2, Play, Check, RotateCcw, MessageSquare, BarChart3 } from 'lucide-react'
import { C } from './atlas-tokens'
import { TYPE_META, STATUS_META, PRIORITY_META, Pill } from './atlas-ui'
import { useAtlas } from '../store'
import { useDiscard } from './InsightTriage'
import { PANEL_LABEL, type Insight } from './atlas-data'

interface Props {
  insight: Insight
  onTriage: (insight: Insight) => void
  showStatus?: boolean
  defaultExpanded?: boolean
}

export default function InsightCard({ insight, onTriage, showStatus = false, defaultExpanded = false }: Props) {
  const { setStatus, go, askAtlas, toast } = useAtlas()
  const discard = useDiscard()
  const [open, setOpen] = useState(defaultExpanded)
  const meta = TYPE_META[insight.type]
  const status = STATUS_META[insight.status]
  const prio = PRIORITY_META[insight.priority]

  const actions: { label: string; icon: React.ReactNode; onClick: () => void; tone?: 'primary' | 'danger' }[] = []
  if (insight.status === 'novo') {
    actions.push({ label: 'Adicionar ao plano', icon: <Plus size={13} />, onClick: () => onTriage(insight), tone: 'primary' })
    actions.push({ label: 'Descartar', icon: <Trash2 size={13} />, onClick: () => discard(insight), tone: 'danger' })
  } else if (insight.status === 'priorizado') {
    actions.push({ label: 'Iniciar ação', icon: <Play size={13} />, onClick: () => { setStatus(insight.id, 'andamento'); toast('Ação iniciada', insight.title) }, tone: 'primary' })
    actions.push({ label: 'Descartar', icon: <Trash2 size={13} />, onClick: () => discard(insight), tone: 'danger' })
  } else if (insight.status === 'andamento') {
    actions.push({ label: 'Concluir', icon: <Check size={13} />, onClick: () => { setStatus(insight.id, 'concluido'); toast('Ação concluída', insight.title) }, tone: 'primary' })
    actions.push({ label: 'Voltar para priorizado', icon: <RotateCcw size={13} />, onClick: () => setStatus(insight.id, 'priorizado') })
  } else if (insight.status === 'concluido') {
    actions.push({ label: 'Reabrir', icon: <RotateCcw size={13} />, onClick: () => setStatus(insight.id, 'andamento') })
  } else {
    actions.push({ label: 'Restaurar', icon: <RotateCcw size={13} />, onClick: () => { setStatus(insight.id, 'novo'); toast('Insight restaurado', insight.title) } })
  }

  return (
    <div className="row-hover"
      style={{ background: 'rgba(15,12,28,0.66)', border: `1px solid ${open ? 'rgba(139,92,246,0.28)' : C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', gap: 14, padding: '15px 18px', cursor: 'pointer', alignItems: 'flex-start' }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: meta.soft, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0, marginTop: 1 }}>
          {meta.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ color: C.text, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{insight.title}</span>
            {showStatus && <Pill color={status.color} background={status.soft} icon={status.icon}>{status.label}</Pill>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <Pill color={meta.color} background={meta.soft}>{insight.impact}</Pill>
            <Pill color={prio.color} background={prio.soft}>Prioridade {prio.label.toLowerCase()}</Pill>
            <Pill>{PANEL_LABEL[insight.panelId]}</Pill>
            <Pill>{insight.category}</Pill>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ color: C.textSubtle, fontSize: 12 }}>{insight.time}</span>
          <ChevronDown size={16} color={C.textSubtle} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s' }} />
        </div>
      </div>

      {open && (
        <div style={{ padding: '0 18px 16px 66px' }}>
          <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>{insight.body}</p>

          {insight.suggestion && (
            <div style={{ background: 'rgba(139,92,246,0.08)', border: `1px solid ${C.borderMd}`, borderRadius: 11, padding: '12px 15px', display: 'flex', gap: 10, marginBottom: 14 }}>
              <Wand2 size={14} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ color: C.purpleNeon, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>O que fazer</div>
                <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.65 }}>{insight.suggestion}</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {actions.map(a => (
              <button key={a.label} onClick={e => { e.stopPropagation(); a.onClick() }}
                className={a.tone === 'primary' ? 'atlas-btn-primary' : 'atlas-ghost'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  border: a.tone === 'primary' ? 'none' : `1px solid ${a.tone === 'danger' ? 'rgba(248,113,113,0.22)' : C.borderSubtle}`,
                  background: a.tone === 'primary' ? undefined : a.tone === 'danger' ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.03)',
                  color: a.tone === 'primary' ? 'white' : a.tone === 'danger' ? C.red : C.textMuted,
                }}>
                {a.icon}{a.label}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: C.borderSubtle, margin: '0 2px' }} />
            <button onClick={e => { e.stopPropagation(); go('panels', { panelId: insight.panelId }) }} className="atlas-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, fontSize: 13, cursor: 'pointer' }}>
              <BarChart3 size={13} /> Ver no painel
            </button>
            <button onClick={e => { e.stopPropagation(); askAtlas(`Me explique melhor: ${insight.title}`) }} className="atlas-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, fontSize: 13, cursor: 'pointer' }}>
              <MessageSquare size={13} /> Perguntar ao Atlas
            </button>
            <span style={{ marginLeft: 'auto', color: C.textSubtle, fontSize: 12 }}>
              Confiança da análise: <strong style={{ color: C.textMuted, fontWeight: 600 }}>{insight.confidence}%</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
