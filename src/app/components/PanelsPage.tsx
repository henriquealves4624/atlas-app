import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus, Plug, LayoutDashboard, Sparkles, ArrowUpRight, ArrowDownRight, Check, RefreshCw, ChevronDown,
  ChevronRight, Folder, FolderOpen, FolderPlus, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { C } from './atlas-tokens'
import {
  Reveal, Card, SectionHeading, PrimaryButton, GhostButton, LinkButton, EmptyState,
  Sparkline, relativeTime,
} from './atlas-ui'
import { CompactInsightCard } from './InsightCard'
import { TriageModal, ProjectModal } from './InsightTriage'
import { TemplateCharts, ChartCard, CustomChartRender } from './PanelCharts'
import { useAtlas, type Insight, type Panel, type Project } from '../store'
import { TEMPLATES } from './atlas-data'

// Insights exibidos antes do "Ver mais insights" (duas linhas do grid).
const VISIBLE_INSIGHTS = 4

export default function PanelsPage() {
  const {
    projects, panels, insights, go,
    activeProject, setActiveProject, activePanel, setActivePanel, analyzingPanelId,
  } = useAtlas()
  const [triage, setTriage] = useState<Insight | null>(null)
  const [creatingProject, setCreatingProject] = useState(false)
  const [explorerOpen, setExplorerOpen] = useState(true)
  const [showAllKpis, setShowAllKpis] = useState(false)
  const [showAllInsights, setShowAllInsights] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const project = useMemo(
    () => projects.find(p => p.id === activeProject) ?? projects[0] ?? null,
    [projects, activeProject],
  )
  const projectPanels = useMemo(
    () => project ? panels.filter(p => p.projectId === project.id) : [],
    [panels, project],
  )
  const panel = useMemo(
    () => projectPanels.find(p => p.id === activePanel) ?? projectPanels[0] ?? null,
    [projectPanels, activePanel],
  )

  // Mantém a seleção coerente quando o usuário troca de projeto.
  useEffect(() => {
    if (project && activeProject !== project.id) setActiveProject(project.id)
    if (panel && activePanel !== panel.id) setActivePanel(panel.id)
    if (!panel && activePanel) setActivePanel(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id, panel?.id])

  // Cada painel abre do topo, com as listas recolhidas.
  useEffect(() => {
    setShowAllKpis(false)
    setShowAllInsights(false)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [panel?.id])

  const selectPanel = (target: Panel) => {
    setActiveProject(target.projectId)
    setActivePanel(target.id)
  }

  const panelInsights = panel ? insights.filter(i => i.panelId === panel.id) : []
  const pending = panelInsights.filter(i => i.status === 'gerado')
  const tracked = panelInsights.filter(i => i.status === 'backlog' || i.status === 'andamento' || i.status === 'concluido')
  const visibleInsights = showAllInsights ? pending : pending.slice(0, VISIBLE_INSIGHTS)
  const template = panel ? TEMPLATES[panel.templateId] : null

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {explorerOpen ? (
        <PanelsExplorer
          project={project}
          panel={panel}
          onSelect={selectPanel}
          onCollapse={() => setExplorerOpen(false)}
          onNewProject={() => setCreatingProject(true)}
        />
      ) : (
        <aside aria-label="Projetos e painéis" style={{ ...explorerFrame, width: 56, alignItems: 'center', padding: '16px 0' }}>
          <IconButton title="Mostrar projetos e painéis" onClick={() => setExplorerOpen(true)}>
            <PanelLeftOpen size={15} />
          </IconButton>
        </aside>
      )}

      <div ref={scrollRef} className="atlas-scrollbar" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        <div key={panel?.id ?? project?.id ?? 'vazio'} className="atlas-page" style={{ padding: '28px 32px 52px', maxWidth: 1180, margin: '0 auto' }}>
          {projects.length === 0 ? (
            <Reveal>
              <h1 style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.028em', marginBottom: 26 }}>Painéis</h1>
              <Card padding={0}>
                <EmptyState
                  icon={<LayoutDashboard size={19} />}
                  title="Nenhum painel por aqui ainda"
                  description="Conecte uma fonte de dados para importar um painel que sua empresa já usa ou criar um novo no Atlas."
                  action={<PrimaryButton onClick={() => go('integrations')} icon={<Plug size={15} />}>Conectar dados</PrimaryButton>}
                />
              </Card>
            </Reveal>
          ) : !panel ? (
            <Reveal>
              <Card padding={0}>
                <EmptyState
                  icon={<LayoutDashboard size={19} />}
                  title={`${project?.name} ainda não tem painéis`}
                  description="Conecte uma fonte de dados e importe um painel existente ou monte um novo direto no Atlas."
                  action={<PrimaryButton onClick={() => go('integrations')} icon={<Plug size={15} />}>Conectar dados</PrimaryButton>}
                />
              </Card>
            </Reveal>
          ) : (
            <>
              {/* cabeçalho do painel */}
              <Reveal>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <h1 style={{ color: C.text, fontSize: 23, fontWeight: 700, letterSpacing: '-0.028em', marginBottom: 6 }}>{panel.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: C.textSubtle, fontSize: 12.5, flexWrap: 'wrap' }}>
                      <Folder size={12} />
                      <span>{project?.name}</span>
                      <span style={{ opacity: 0.45 }}>·</span>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
                      <span>{panel.origin === 'importado' ? `Importado do ${panel.originLabel}` : `Criado no Atlas · ${panel.originLabel}`}</span>
                      <span style={{ opacity: 0.45 }}>·</span>
                      <span>atualizado {relativeTime(panel.createdAt)}</span>
                    </div>
                  </div>
                  <GhostButton icon={<RefreshCw size={13} />}>Atualizar dados</GhostButton>
                </div>
              </Reveal>

              {/* 1 · Insights do Atlas */}
              <Reveal delay={60} style={{ marginBottom: 28 }}>
                <SectionHeading
                  title="Insights do Atlas"
                  subtitle={pending.length > 0
                    ? `${pending.length} ${pending.length === 1 ? 'insight aguardando' : 'insights aguardando'} sua avaliação`
                    : undefined}
                  action={tracked.length > 0
                    ? <LinkButton onClick={() => go('insights', { insightStatus: 'backlog' })}>
                        {tracked.length} em acompanhamento
                      </LinkButton>
                    : undefined}
                />

                {analyzingPanelId === panel.id ? (
                  <Card style={{ position: 'relative', overflow: 'hidden' }} padding={20}>
                    <div className="atlas-scan" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                      <div className="atlas-pulse" style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Sparkles size={16} color="white" />
                      </div>
                      <div>
                        <div style={{ color: C.text, fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>Analisando este painel</div>
                        <div style={{ color: C.textMuted, fontSize: 13 }}>Cruzando os indicadores com o histórico para encontrar o que mudou.</div>
                      </div>
                    </div>
                  </Card>
                ) : pending.length === 0 ? (
                  <Card padding={0}>
                    <EmptyState
                      compact
                      icon={<Check size={18} />}
                      title="Nenhum insight pendente neste painel"
                      description={tracked.length > 0
                        ? 'Todos os insights deste painel já foram avaliados. Acompanhe a execução na Central de Insights.'
                        : 'A Atlas IA continua monitorando os dados e avisa quando encontrar algo relevante.'}
                    />
                  </Card>
                ) : (
                  <>
                    <div className="panel-insights-grid">
                      {visibleInsights.map(insight => (
                        <CompactInsightCard key={insight.id} insight={insight} onAdd={setTriage} />
                      ))}
                    </div>
                    {pending.length > VISIBLE_INSIGHTS && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                        <GhostButton onClick={() => setShowAllInsights(v => !v)}
                          icon={<ChevronDown size={14} style={{ transform: showAllInsights ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}>
                          {showAllInsights ? 'Ver menos insights' : `Ver mais insights (${pending.length - VISIBLE_INSIGHTS})`}
                        </GhostButton>
                      </div>
                    )}
                  </>
                )}
              </Reveal>

              {/* 2 · Indicadores */}
              {template && (
                <Reveal delay={100} style={{ marginBottom: 28 }}>
                  <SectionHeading title="Indicadores principais" />
                  <div className="panel-kpi-grid">
                    {(showAllKpis ? template.kpis : template.kpis.slice(0, 4)).map((k, i) => (
                      <Card key={k.label} padding={18} hover className={i >= 4 ? 'insight-in' : ''}>
                        <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 10 }}>{k.label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{k.value}</div>
                          <Sparkline values={k.spark} color={k.up ? C.green : C.orange} width={58} height={30} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                          {k.up ? <ArrowUpRight size={13} color={C.green} /> : <ArrowDownRight size={13} color={C.red} />}
                          <span style={{ color: k.up ? C.green : C.red, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{k.change}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                  {template.kpis.length > 4 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                      <GhostButton onClick={() => setShowAllKpis(v => !v)}
                        icon={<ChevronDown size={14} style={{ transform: showAllKpis ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}>
                        {showAllKpis ? 'Ver menos' : 'Ver mais'}
                      </GhostButton>
                    </div>
                  )}
                </Reveal>
              )}

              {/* 3 · Visualizações */}
              <Reveal delay={140}>
                <SectionHeading
                  title="Visualizações"
                  subtitle={panel.origin === 'importado' ? `Espelhadas do ${panel.originLabel}` : 'Criadas no Atlas'}
                />
                {panel.charts && panel.charts.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
                    {panel.charts.map(chart => (
                      <ChartCard key={chart.id} title={chart.title} subtitle={chart.fieldY}>
                        <CustomChartRender type={chart.type} label={chart.fieldY} title={chart.title} fieldX={chart.fieldX} />
                      </ChartCard>
                    ))}
                  </div>
                ) : (
                  <TemplateCharts templateId={panel.templateId} />
                )}
              </Reveal>
            </>
          )}
        </div>
      </div>

      {triage && <TriageModal insight={triage} onClose={() => setTriage(null)} />}
      {creatingProject && (
        <ProjectModal
          onClose={() => setCreatingProject(false)}
          onCreated={id => { setActiveProject(id); setActivePanel(null) }}
        />
      )}
    </div>
  )
}

// ── Menu de projetos e painéis ──────────────────────────────────────────────

function PanelsExplorer({ project, panel, onSelect, onCollapse, onNewProject }: {
  project: Project | null
  panel: Panel | null
  onSelect: (panel: Panel) => void
  onCollapse: () => void
  onNewProject: () => void
}) {
  const { projects, panels, insights, go } = useAtlas()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => project ? { [project.id]: true } : {})

  // A pasta do projeto em uso abre sozinha.
  useEffect(() => {
    if (project) setExpanded(prev => prev[project.id] ? prev : { ...prev, [project.id]: true })
  }, [project?.id])

  const pendingOf = (panelId: string) => insights.filter(i => i.panelId === panelId && i.status === 'gerado').length
  const recent = [...panels].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)

  return (
    <aside aria-label="Projetos e painéis" style={{ ...explorerFrame, width: 256 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 12px 10px' }}>
        <GhostButton icon={<Plus size={14} />} onClick={() => go('integrations')}
          style={{ flex: 1, justifyContent: 'flex-start', padding: '8px 12px', fontSize: 13 }}>
          Novo painel
        </GhostButton>
        <IconButton title="Recolher menu" onClick={onCollapse}>
          <PanelLeftClose size={15} />
        </IconButton>
      </div>

      <div className="atlas-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 20px' }}>
        <GroupLabel action={
          <IconButton title="Novo projeto" onClick={onNewProject} small>
            <FolderPlus size={14} />
          </IconButton>
        }>
          Meus projetos
        </GroupLabel>

        {projects.length === 0 ? (
          <p style={{ color: C.textSubtle, fontSize: 12.5, lineHeight: 1.55, padding: '2px 8px 0' }}>
            Crie um projeto para organizar seus painéis por área do negócio.
          </p>
        ) : projects.map(p => {
          const open = !!expanded[p.id]
          const current = project?.id === p.id
          const list = panels.filter(x => x.projectId === p.id)
          return (
            <div key={p.id} style={{ marginBottom: 2 }}>
              <button className="explorer-item" aria-expanded={open}
                onClick={() => setExpanded(prev => ({ ...prev, [p.id]: !open }))}
                style={{ ...rowStyle, color: current ? C.text : C.textMuted }}>
                <ChevronRight size={13} color={C.textSubtle}
                  style={{ flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }} />
                {open
                  ? <FolderOpen size={15} color={C.purpleLight} style={{ flexShrink: 0 }} />
                  : <Folder size={15} color={current ? C.purpleLight : C.textSubtle} style={{ flexShrink: 0 }} />}
                <span style={{ ...ellipsis, flex: 1, fontWeight: current ? 550 : 450 }}>{p.name}</span>
                <span style={{ color: C.textSubtle, fontSize: 11.5, flexShrink: 0 }}>{list.length}</span>
              </button>

              {open && (
                <div className="explorer-branch" style={{ margin: '1px 0 6px 14px', paddingLeft: 8, borderLeft: `1px solid ${C.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {list.length === 0 ? (
                    <button className="explorer-item" onClick={() => go('integrations')}
                      style={{ ...rowStyle, color: C.textSubtle, fontSize: 12.5 }}>
                      <Plus size={13} style={{ flexShrink: 0 }} />
                      Adicionar painel
                    </button>
                  ) : list.map(x => {
                    const active = panel?.id === x.id
                    const count = pendingOf(x.id)
                    return (
                      <button key={x.id} className={`explorer-item${active ? ' active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => onSelect(x)}
                        style={{ ...rowStyle, color: active ? C.text : C.textMuted }}>
                        <LayoutDashboard size={14} color={active ? C.purpleLight : C.textSubtle} style={{ flexShrink: 0 }} />
                        <span style={{ ...ellipsis, flex: 1, fontWeight: active ? 550 : 450 }}>{x.name}</span>
                        {count > 0 && <span style={badge}>{count}</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {recent.length > 0 && (
          <>
            <GroupLabel style={{ marginTop: 18 }}>Painéis recentes</GroupLabel>
            {recent.map(x => {
              const active = panel?.id === x.id
              const owner = projects.find(p => p.id === x.projectId)
              return (
                <button key={x.id} className={`explorer-item${active ? ' active' : ''}`} onClick={() => onSelect(x)}
                  style={{ ...rowStyle, alignItems: 'flex-start', padding: '8px 9px', marginBottom: 1, color: active ? C.text : C.textMuted }}>
                  <LayoutDashboard size={14} color={active ? C.purpleLight : C.textSubtle} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ ...ellipsis, display: 'block', fontWeight: active ? 550 : 450 }}>{x.name}</span>
                    <span style={{ ...ellipsis, display: 'block', color: C.textSubtle, fontSize: 11.5, marginTop: 2 }}>
                      {owner ? `${owner.name} · ` : ''}{relativeTime(x.createdAt)}
                    </span>
                  </span>
                </button>
              )
            })}
          </>
        )}
      </div>
    </aside>
  )
}

function GroupLabel({ children, action, style }: {
  children: React.ReactNode; action?: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 4px 6px 8px', minHeight: 34, ...style }}>
      <span style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{children}</span>
      {action}
    </div>
  )
}

function IconButton({ children, title, onClick, small }: {
  children: React.ReactNode; title: string; onClick: () => void; small?: boolean
}) {
  const size = small ? 26 : 34
  return (
    <button onClick={onClick} title={title} aria-label={title} className="explorer-icon"
      style={{ width: size, height: size, borderRadius: small ? 7 : 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', color: C.textSubtle, border: `1px solid ${small ? 'transparent' : C.borderSubtle}` }}>
      {children}
    </button>
  )
}

const explorerFrame: React.CSSProperties = {
  flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%',
  background: 'rgba(13,11,26,0.6)', borderRight: `1px solid ${C.borderSubtle}`,
}

const rowStyle: React.CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8,
  border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13,
}

const ellipsis: React.CSSProperties = { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

const badge: React.CSSProperties = {
  background: 'rgba(192,132,252,0.16)', color: C.purpleNeon, borderRadius: 5, padding: '1px 6px',
  fontSize: 11, fontWeight: 700, flexShrink: 0,
}
