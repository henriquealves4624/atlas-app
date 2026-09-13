import { useEffect, useMemo, useState } from 'react'
import {
  Plus, Plug, LayoutDashboard, Sparkles, ArrowUpRight, ArrowDownRight, Check, RefreshCw, ChevronDown,
} from 'lucide-react'
import { C } from './atlas-tokens'
import {
  Reveal, Card, SectionHeading, PrimaryButton, GhostButton, LinkButton, EmptyState,
  Sparkline, relativeTime,
} from './atlas-ui'
import InsightCard from './InsightCard'
import { TriageModal } from './InsightTriage'
import { TemplateCharts, ChartCard, CustomChartRender } from './PanelCharts'
import { useAtlas, type Insight } from '../store'
import { TEMPLATES } from './atlas-data'

export default function PanelsPage() {
  const {
    projects, panels, insights, go,
    activeProject, setActiveProject, activePanel, setActivePanel, analyzingPanelId,
  } = useAtlas()
  const [triage, setTriage] = useState<Insight | null>(null)
  const [showAllKpis, setShowAllKpis] = useState(false)

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

  useEffect(() => { setShowAllKpis(false) }, [panel?.id])

  if (projects.length === 0) {
    return (
      <div className="atlas-page" style={{ padding: '28px 32px', maxWidth: 1180, margin: '0 auto' }}>
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
      </div>
    )
  }

  const panelInsights = panel ? insights.filter(i => i.panelId === panel.id) : []
  const pending = panelInsights.filter(i => i.status === 'gerado')
  const tracked = panelInsights.filter(i => i.status === 'backlog' || i.status === 'andamento' || i.status === 'concluido')
  const template = panel ? TEMPLATES[panel.templateId] : null

  return (
    <div className="atlas-page" style={{ padding: '28px 32px 52px', maxWidth: 1180, margin: '0 auto' }}>
      {/* ── Projetos ──────────────────────────────────────────────────────── */}
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ color: C.textSubtle, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 4 }}>
            Projetos
          </span>
          {projects.map(p => {
            const active = project?.id === p.id
            return (
              <button key={p.id} onClick={() => { setActiveProject(p.id); setActivePanel(null) }}
                style={{ padding: '8px 15px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 450, transition: 'all 0.18s', border: `1px solid ${active ? C.borderMd : C.borderSubtle}`, background: active ? 'rgba(139,92,246,0.11)' : 'transparent', color: active ? C.purpleLight : C.textMuted }}>
                {p.name}
              </button>
            )
          })}
        </div>
      </Reveal>

      {/* ── Painéis do projeto ────────────────────────────────────────────── */}
      <Reveal delay={40}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 26, paddingBottom: 20, borderBottom: `1px solid ${C.borderSubtle}` }}>
          {projectPanels.map(p => {
            const active = panel?.id === p.id
            const count = insights.filter(i => i.panelId === p.id && i.status === 'gerado').length
            return (
              <button key={p.id} onClick={() => setActivePanel(p.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 15px', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: active ? 600 : 450, transition: 'all 0.18s', border: `1px solid ${active ? 'rgba(139,92,246,0.35)' : C.borderSubtle}`, background: active ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)', color: active ? C.text : C.textMuted }}>
                <LayoutDashboard size={14} color={active ? C.purpleLight : C.textSubtle} />
                {p.name}
                {count > 0 && (
                  <span style={{ background: 'rgba(192,132,252,0.16)', color: C.purpleNeon, borderRadius: 5, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>{count}</span>
                )}
              </button>
            )
          })}
          <GhostButton icon={<Plus size={14} />} onClick={() => go('integrations')} style={{ padding: '9px 15px' }}>
            Novo painel
          </GhostButton>
        </div>
      </Reveal>

      {!panel ? (
        <Reveal delay={80}>
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
          <Reveal delay={80}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 26, flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ color: C.text, fontSize: 23, fontWeight: 700, letterSpacing: '-0.028em', marginBottom: 6 }}>{panel.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: C.textSubtle, fontSize: 12.5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
                  {panel.origin === 'importado' ? `Importado do ${panel.originLabel}` : `Criado no Atlas · ${panel.originLabel}`}
                  <span style={{ opacity: 0.45 }}>·</span>
                  atualizado {relativeTime(panel.createdAt)}
                </div>
              </div>
              <GhostButton icon={<RefreshCw size={13} />}>Atualizar dados</GhostButton>
            </div>
          </Reveal>

          {/* 1 · Insights do Atlas */}
          <Reveal delay={120} style={{ marginBottom: 30 }}>
            <SectionHeading
              title="Insights do Atlas"
              subtitle="O que a leitura deste painel revelou"
              action={tracked.length > 0
                ? <LinkButton onClick={() => go('insights', { insightStatus: 'backlog' })}>
                    {tracked.length} em acompanhamento
                  </LinkButton>
                : undefined}
            />

            {analyzingPanelId === panel.id ? (
              <Card style={{ position: 'relative', overflow: 'hidden' }} padding={22}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {pending.map(insight => (
                  <InsightCard key={insight.id} insight={insight} onAdd={setTriage} secondaryActions={false} />
                ))}
              </div>
            )}
          </Reveal>

          {/* 2 · Indicadores */}
          {template && (
            <Reveal delay={160} style={{ marginBottom: 30 }}>
              <SectionHeading title="Indicadores principais" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(212px, 1fr))', gap: 12 }}>
                {(showAllKpis ? template.kpis : template.kpis.slice(0, 4)).map((k, i) => (
                  <Card key={k.label} padding={18} hover className={i >= 4 ? 'insight-in' : ''}>
                    <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 10 }}>{k.label}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                      <div>
                        <div style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{k.value}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                          {k.up ? <ArrowUpRight size={13} color={C.green} /> : <ArrowDownRight size={13} color={C.red} />}
                          <span style={{ color: k.up ? C.green : C.red, fontSize: 12.5, fontWeight: 600 }}>{k.change}</span>
                        </div>
                      </div>
                      <Sparkline values={k.spark} color={k.up ? C.green : C.orange} width={66} height={32} />
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
          <Reveal delay={200}>
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

      {triage && <TriageModal insight={triage} onClose={() => setTriage(null)} />}
    </div>
  )
}
