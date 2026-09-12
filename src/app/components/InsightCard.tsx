import { useState } from 'react'
import { Plus, Trash2, Play, Check, RotateCcw, BarChart3, MessageSquare } from 'lucide-react'
import { C } from './atlas-tokens'
import { TYPE_META, PRIORITY_META, STATUS_META, relativeTime } from './atlas-ui'
import { useAtlas, type Insight } from '../store'

interface Props {
  insight: Insight
  onAdd?: (insight: Insight) => void
  onConclude?: (insight: Insight) => void
  showOrigin?: boolean
  showStatus?: boolean
  secondaryActions?: boolean
}

export default function InsightCard({
  insight, onAdd, onConclude, showOrigin = false, showStatus = false, secondaryActions = true,
}: Props) {
  const { setInsightStatus, go, askAtlas, toast, panels, projects } = useAtlas()
  const type = TYPE_META[insight.type]
  const prio = PRIORITY_META[insight.priority]
  const status = STATUS_META[insight.status]
  const panel = panels.find(p => p.id === insight.panelId)
  const project = projects.find(p => p.id === insight.projectId)

  const discard = () => {
    setInsightStatus(insight.id, 'descartado')
    toast('Insight descartado', insight.title, 'warn', {
      label: 'Desfazer',
      onClick: () => setInsightStatus(insight.id, 'gerado'),
    })
  }

  return (
    <div className="insight-in" style={{
      background: 'rgba(15,12,28,0.6)',
      border: `1px solid ${C.border}`,
      borderLeft: `2px solid ${type.color}`,
      borderRadius: 14,
      padding: '17px 19px',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* linha de contexto */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9, flexWrap: 'wrap' }}>
        <span style={{ color: type.color, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.04em' }}>{type.label}</span>
        <span style={{ color: C.textSubtle, opacity: 0.45 }}>·</span>
        <span style={{ color: C.textMuted, fontSize: 12.5 }}>{insight.impact}</span>
        {showStatus && (
          <>
            <span style={{ color: C.textSubtle, opacity: 0.45 }}>·</span>
            <span style={{ color: status.color, fontSize: 12.5 }}>{status.short}</span>
          </>
        )}
        <span style={{ marginLeft: 'auto', color: C.textSubtle, fontSize: 12 }}>{relativeTime(insight.createdAt)}</span>
      </div>

      <h3 style={{ color: C.text, fontSize: 15.5, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: 7 }}>
        {insight.title}
      </h3>
      <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.68, marginBottom: insight.recommendation ? 13 : 4 }}>
        {insight.summary}
      </p>

      {insight.recommendation && (
        <div style={{ background: 'rgba(139,92,246,0.07)', borderRadius: 11, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ color: C.purpleLight, fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>Recomendação do Atlas</div>
          <p style={{ color: C.text, fontSize: 13.5, lineHeight: 1.6 }}>{insight.recommendation}</p>
        </div>
      )}

      {insight.conclusion && (
        <div style={{ background: 'rgba(52,211,153,0.06)', borderRadius: 11, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ color: C.green, fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>Ação registrada</div>
          <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>{insight.conclusion}</p>
        </div>
      )}

      {/* ações */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {insight.status === 'gerado' && onAdd && (
          <>
            <Action primary icon={<Plus size={13} />} label="Adicionar aos Insights" onClick={() => onAdd(insight)} />
            <Action icon={<Trash2 size={13} />} label="Descartar" onClick={discard} tone="danger" />
          </>
        )}
        {insight.status === 'backlog' && (
          <>
            <Action primary icon={<Play size={13} />} label="Iniciar ação" onClick={() => { setInsightStatus(insight.id, 'andamento'); toast('Ação iniciada', insight.title) }} />
            <Action icon={<Trash2 size={13} />} label="Descartar" onClick={discard} tone="danger" />
          </>
        )}
        {insight.status === 'andamento' && onConclude && (
          <>
            <Action primary icon={<Check size={13} />} label="Concluir" onClick={() => onConclude(insight)} />
            <Action icon={<RotateCcw size={13} />} label="Voltar ao backlog" onClick={() => setInsightStatus(insight.id, 'backlog')} />
          </>
        )}
        {insight.status === 'concluido' && (
          <Action icon={<RotateCcw size={13} />} label="Reabrir" onClick={() => setInsightStatus(insight.id, 'andamento')} />
        )}
        {insight.status === 'descartado' && (
          <Action icon={<RotateCcw size={13} />} label="Restaurar" onClick={() => { setInsightStatus(insight.id, 'gerado'); toast('Insight restaurado', insight.title) }} />
        )}

        {secondaryActions && (
          <>
            <Action icon={<BarChart3 size={13} />} label="Ver no painel"
              onClick={() => go('panels', { projectId: insight.projectId, panelId: insight.panelId })} />
            <Action icon={<MessageSquare size={13} />} label="Perguntar ao Atlas"
              onClick={() => askAtlas(`Me explique melhor: ${insight.title}`)} />
          </>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: C.textSubtle, fontSize: 12 }}>
          {insight.status !== 'gerado' && <span style={{ color: prio.color }}>Prioridade {prio.label.toLowerCase()}</span>}
          {showOrigin && project && (
            <>
              {insight.status !== 'gerado' && <span style={{ opacity: 0.45 }}>·</span>}
              <span>{project.name}</span>
              {panel && <><span style={{ opacity: 0.45 }}>·</span><span>{panel.name}</span></>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Action({ icon, label, onClick, primary, tone }: {
  icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean; tone?: 'danger'
}) {
  const [hover, setHover] = useState(false)
  const color = primary ? 'white' : tone === 'danger' ? C.red : C.textMuted
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={primary ? 'atlas-btn-primary' : ''}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 9,
        border: primary ? 'none' : `1px solid ${hover ? (tone === 'danger' ? 'rgba(248,113,113,0.3)' : C.borderMd) : C.borderSubtle}`,
        background: primary ? undefined : hover ? (tone === 'danger' ? 'rgba(248,113,113,0.1)' : 'rgba(139,92,246,0.09)') : 'transparent',
        color, fontSize: 12.5, fontWeight: primary ? 600 : 500, cursor: 'pointer', transition: 'all 0.16s',
      }}>
      {icon}{label}
    </button>
  )
}
