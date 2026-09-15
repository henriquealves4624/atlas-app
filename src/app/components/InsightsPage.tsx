import { useMemo, useState } from 'react'
import {
  Columns3, List, Download, Plus, Lightbulb, ChevronDown, ChevronRight, Plug, X,
} from 'lucide-react'
import { C } from './atlas-tokens'
import {
  Reveal, Card, Segmented, ContextSelector, EmptyState, PrimaryButton, GhostButton, Modal,
  STATUS_META, PRIORITY_META, TYPE_META, PanelTag, shortDate,
} from './atlas-ui'
import InsightCard from './InsightCard'
import { TriageModal, ConclusionModal } from './InsightTriage'
import { useAtlas, type Insight } from '../store'
import type { InsightStatus } from './atlas-data'

type View = 'kanban' | 'lista'

const FLOW: InsightStatus[] = ['backlog', 'andamento', 'concluido', 'descartado']
const ALL: InsightStatus[] = ['gerado', ...FLOW]

export default function InsightsPage() {
  const { insights, projects, panels, go, insightStatusFilter, setInsightStatusFilter } = useAtlas()
  const [view, setView] = useState<View>('kanban')
  const [context, setContext] = useState<string | null>(null)
  const [detail, setDetail] = useState<string | null>(null)
  const [triage, setTriage] = useState<Insight | null>(null)
  const [conclude, setConclude] = useState<Insight | null>(null)

  const scoped = useMemo(
    () => context ? insights.filter(i => i.projectId === context) : insights,
    [insights, context],
  )
  const countOf = (status: InsightStatus) => scoped.filter(i => i.status === status).length

  if (insights.length === 0) {
    return (
      <div className="atlas-page" style={{ padding: '28px 32px', maxWidth: 1180, margin: '0 auto' }}>
        <Reveal>
          <Header />
          <Card padding={0}>
            <EmptyState
              icon={<Lightbulb size={19} />}
              title="Nenhum insight ainda"
              description="Assim que você conectar seus dados, a Atlas IA começa a identificar oportunidades, riscos e mudanças importantes."
              action={<PrimaryButton onClick={() => go('integrations')} icon={<Plug size={15} />}>Conectar dados</PrimaryButton>}
            />
          </Card>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="atlas-page" style={{ padding: '28px 32px 52px', maxWidth: 1280, margin: '0 auto' }}>
      <Reveal>
        <Header />
      </Reveal>

      <Reveal delay={60}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
          <Segmented
            value={view}
            onChange={(v: View) => setView(v)}
            options={[
              { value: 'kanban', label: 'Kanban', icon: <Columns3 size={13} /> },
              { value: 'lista', label: 'Lista', icon: <List size={13} /> },
            ]}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {view === 'lista' && <ExportButton insights={scoped} projects={projects} panels={panels} />}
            {projects.length > 0 && <ContextSelector value={context} onChange={setContext} projects={projects} />}
          </div>
        </div>
      </Reveal>

      {view === 'lista' && (
        <Reveal delay={100}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 20, borderBottom: `1px solid ${C.borderSubtle}`, paddingBottom: 2 }}>
            {ALL.map(status => {
              const meta = STATUS_META[status]
              const active = insightStatusFilter === status
              return (
                <button key={status} onClick={() => setInsightStatusFilter(status)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 450, color: active ? C.text : C.textSubtle, borderBottom: `2px solid ${active ? C.purpleLight : 'transparent'}`, marginBottom: -2, transition: 'all 0.18s' }}>
                  {meta.label}
                  <span style={{ color: active ? C.purpleLight : C.textSubtle, fontSize: 12, fontWeight: 600 }}>{countOf(status)}</span>
                </button>
              )
            })}
          </div>
          <p style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 18 }}>{STATUS_META[insightStatusFilter].hint}</p>
        </Reveal>
      )}

      <Reveal delay={140}>
        {view === 'kanban' ? (
          <KanbanView insights={scoped} onOpen={setDetail} onTriage={setTriage} onConclude={setConclude} />
        ) : (
          <ListView insights={scoped.filter(i => i.status === insightStatusFilter)} onOpen={setDetail} />
        )}
      </Reveal>

      {detail && (
        <InsightDetailModal
          insightId={detail}
          onClose={() => setDetail(null)}
          onTriage={i => { setDetail(null); setTriage(i) }}
          onConclude={i => { setDetail(null); setConclude(i) }}
        />
      )}
      {triage && <TriageModal insight={triage} onClose={() => setTriage(null)} />}
      {conclude && <ConclusionModal insight={conclude} onClose={() => setConclude(null)} />}
    </div>
  )
}

function Header() {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.028em', marginBottom: 8 }}>Central de Insights</h1>
      <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.6, maxWidth: 680 }}>
        Tudo o que a Atlas IA encontrou nos seus painéis, do que ainda precisa ser avaliado ao que já virou ação.
      </p>
    </div>
  )
}

// ── Detalhe do insight (aberto a partir do Kanban ou da Lista) ─────────────

function InsightDetailModal({ insightId, onClose, onTriage, onConclude }: {
  insightId: string; onClose: () => void; onTriage: (i: Insight) => void; onConclude: (i: Insight) => void
}) {
  const { insights } = useAtlas()
  const insight = insights.find(i => i.id === insightId)
  if (!insight) return null
  const status = STATUS_META[insight.status]

  return (
    <Modal onClose={onClose} width={620} padding={26}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: status.soft, color: status.color, borderRadius: 7, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
          {status.icon}{status.short}
        </span>
        <button onClick={onClose} aria-label="Fechar"
          style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={14} />
        </button>
      </div>
      <InsightCard bare insight={insight} showOrigin onAdd={onTriage} onConclude={onConclude} />
    </Modal>
  )
}

// ── Kanban ──────────────────────────────────────────────────────────────────

function KanbanView({ insights, onOpen, onTriage, onConclude }: {
  insights: Insight[]; onOpen: (id: string) => void; onTriage: (i: Insight) => void; onConclude: (i: Insight) => void
}) {
  const { setInsightStatus, toast } = useAtlas()
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<InsightStatus | null>(null)
  const [inboxOpen, setInboxOpen] = useState(true)

  const generated = insights.filter(i => i.status === 'gerado')

  const drop = (status: InsightStatus) => {
    setOver(null)
    const id = dragging
    setDragging(null)
    if (!id) return
    const insight = insights.find(i => i.id === id)
    if (!insight || insight.status === status) return

    if (status === 'concluido') { onConclude(insight); return }
    setInsightStatus(id, status)
    toast(`Movido para ${STATUS_META[status].label.toLowerCase()}`, insight.title, 'info')
  }

  return (
    <div>
      {/* Caixa de entrada: insights ainda não avaliados */}
      {generated.length > 0 && (
        <div style={{ marginBottom: 18, border: `1px solid ${C.border}`, borderRadius: 15, background: 'rgba(15,12,28,0.5)', overflow: 'hidden' }}>
          <button onClick={() => setInboxOpen(!inboxOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            {inboxOpen ? <ChevronDown size={15} color={C.textSubtle} /> : <ChevronRight size={15} color={C.textSubtle} />}
            <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>Insights gerados</span>
            <span style={{ background: 'rgba(192,132,252,0.14)', color: C.purpleNeon, borderRadius: 6, padding: '2px 8px', fontSize: 11.5, fontWeight: 700 }}>{generated.length}</span>
            <span style={{ color: C.textSubtle, fontSize: 12.5, marginLeft: 4 }}>aguardando sua avaliação</span>
          </button>
          {inboxOpen && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(258px, 1fr))', gap: 10, padding: '0 18px 18px' }}>
              {generated.map(insight => (
                <div key={insight.id} role="button" tabIndex={0} className="insight-tile"
                  onClick={() => onOpen(insight.id)}
                  onKeyDown={e => { if (e.key === 'Enter') onOpen(insight.id) }}
                  style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${C.borderSubtle}`, borderLeft: `2px solid ${TYPE_META[insight.type].color}`, borderRadius: 11, padding: '13px 15px' }}>
                  <OriginTag insight={insight} />
                  <div style={{ color: C.text, fontSize: 13.5, fontWeight: 600, lineHeight: 1.45, marginBottom: 6 }}>{insight.title}</div>
                  <div style={{ color: C.textSubtle, fontSize: 12, marginBottom: 11 }}>{insight.impact}</div>
                  <button onClick={e => { e.stopPropagation(); onTriage(insight) }} className="atlas-btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: 'none', color: 'white', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={12} /> Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fluxo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(232px, 1fr))', gap: 13, alignItems: 'start' }}>
        {FLOW.map(status => {
          const meta = STATUS_META[status]
          const items = insights.filter(i => i.status === status)
          return (
            <div key={status}
              className={`kanban-col${over === status ? ' drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setOver(status) }}
              onDragLeave={() => setOver(o => o === status ? null : o)}
              onDrop={() => drop(status)}
              style={{ background: 'rgba(15,12,28,0.42)', border: `1px solid ${C.borderSubtle}`, borderRadius: 15, padding: 13, minHeight: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13, padding: '2px 4px' }}>
                <span style={{ color: meta.color }}>{meta.icon}</span>
                <span style={{ color: C.text, fontSize: 13, fontWeight: 600, flex: 1 }}>{meta.label}</span>
                <span style={{ color: C.textSubtle, fontSize: 12, fontWeight: 600 }}>{items.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {items.map(insight => (
                  <KanbanCard key={insight.id} insight={insight}
                    dragging={dragging === insight.id}
                    onOpen={() => onOpen(insight.id)}
                    onDragStart={() => setDragging(insight.id)}
                    onDragEnd={() => { setDragging(null); setOver(null) }}
                  />
                ))}
                {items.length === 0 && (
                  <div style={{ padding: '18px 10px', textAlign: 'center', color: C.textSubtle, fontSize: 12.5, lineHeight: 1.5, border: `1px dashed ${C.borderSubtle}`, borderRadius: 11 }}>
                    Arraste um insight para cá
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ color: C.textSubtle, fontSize: 12.5, marginTop: 16 }}>
        Arraste os cards entre as colunas para mudar o estágio ou clique em um insight para ver detalhes e ações. Ao mover para concluídos, o Atlas pergunta o que foi feito.
      </p>
    </div>
  )
}

function KanbanCard({ insight, dragging, onOpen, onDragStart, onDragEnd }: {
  insight: Insight; dragging: boolean; onOpen: () => void; onDragStart: () => void; onDragEnd: () => void
}) {
  const { panels } = useAtlas()
  const panel = panels.find(p => p.id === insight.panelId)
  const prio = PRIORITY_META[insight.priority]

  return (
    <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
      role="button" tabIndex={0} onClick={onOpen}
      onKeyDown={e => { if (e.key === 'Enter') onOpen() }}
      className={`kanban-card${dragging ? ' dragging' : ''}`}
      style={{ background: 'rgba(20,16,38,0.9)', border: `1px solid ${C.border}`, borderRadius: 11, padding: '13px 14px' }}>
      {panel && <div style={{ marginBottom: 8 }}><PanelTag name={panel.name} /></div>}
      <div style={{ color: C.text, fontSize: 13, fontWeight: 600, lineHeight: 1.45, marginBottom: 9 }}>{insight.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        <span style={{ color: prio.color, fontSize: 11.5, fontWeight: 600 }}>{prio.label}</span>
        <span style={{ color: C.textSubtle, opacity: 0.45 }}>·</span>
        <span style={{ color: C.textSubtle, fontSize: 11.5 }}>{insight.category}</span>
      </div>
    </div>
  )
}

function OriginTag({ insight }: { insight: Insight }) {
  const { panels } = useAtlas()
  const panel = panels.find(p => p.id === insight.panelId)
  if (!panel) return null
  return <div style={{ marginBottom: 8 }}><PanelTag name={panel.name} /></div>
}

// ── Lista / relatório ───────────────────────────────────────────────────────

const COLS = ['Insight', 'Projeto', 'Painel', 'Categoria', 'Prioridade', 'Status', 'Data', 'Impacto']

function ListView({ insights, onOpen }: { insights: Insight[]; onOpen: (id: string) => void }) {
  const { projects, panels } = useAtlas()

  if (insights.length === 0) {
    return (
      <Card padding={0}>
        <EmptyState compact icon={<List size={18} />} title="Nada para listar"
          description="Nenhum insight neste estágio no contexto selecionado." />
      </Card>
    )
  }

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 15, overflow: 'hidden', background: 'rgba(15,12,28,0.5)' }}>
      <div style={{ overflowX: 'auto' }} className="atlas-scrollbar">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 940 }}>
          <thead>
            <tr>
              {COLS.map(col => (
                <th key={col} style={{ textAlign: 'left', padding: '13px 16px', color: C.textSubtle, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: `1px solid ${C.borderSubtle}`, whiteSpace: 'nowrap' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {insights.map(insight => {
              const project = projects.find(p => p.id === insight.projectId)
              const panel = panels.find(p => p.id === insight.panelId)
              const prio = PRIORITY_META[insight.priority]
              const status = STATUS_META[insight.status]
              return (
                <tr key={insight.id} className="table-row" onClick={() => onOpen(insight.id)}
                  style={{ borderBottom: `1px solid ${C.borderSubtle}`, cursor: 'pointer' }}>
                  <td style={{ padding: '14px 16px', color: C.text, fontSize: 13.5, fontWeight: 500, maxWidth: 320 }}>{insight.title}</td>
                  <td style={cell}>{project?.name ?? '—'}</td>
                  <td style={cell}>{panel?.name ?? '—'}</td>
                  <td style={cell}>{insight.category}</td>
                  <td style={{ ...cell, color: prio.color }}>{prio.label}</td>
                  <td style={{ ...cell, color: status.color }}>{status.short}</td>
                  <td style={cell}>{shortDate(insight.createdAt)}</td>
                  <td style={{ ...cell, whiteSpace: 'nowrap' }}>{insight.impact}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const cell: React.CSSProperties = { padding: '14px 16px', color: C.textMuted, fontSize: 13 }

function ExportButton({ insights, projects, panels }: {
  insights: Insight[]
  projects: { id: string; name: string }[]
  panels: { id: string; name: string }[]
}) {
  const { toast } = useAtlas()

  const exportCsv = () => {
    const rows = insights.map(i => [
      i.title,
      projects.find(p => p.id === i.projectId)?.name ?? '',
      panels.find(p => p.id === i.panelId)?.name ?? '',
      i.category,
      PRIORITY_META[i.priority].label,
      STATUS_META[i.status].short,
      new Date(i.createdAt).toLocaleDateString('pt-BR'),
      i.impact,
    ])
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
    const csv = [COLS, ...rows].map(r => r.map(c => escape(String(c))).join(';')).join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `atlas-insights-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast('Relatório exportado', `${insights.length} ${insights.length === 1 ? 'insight' : 'insights'} em CSV.`)
  }

  return <GhostButton icon={<Download size={14} />} onClick={exportCsv}>Exportar CSV</GhostButton>
}
