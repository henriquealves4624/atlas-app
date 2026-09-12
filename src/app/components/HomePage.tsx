import { useMemo, useState } from 'react'
import {
  Plug, Plus, ArrowRight, Sparkles, RefreshCw, Send, FolderOpen,
  LayoutDashboard, Lightbulb, BarChart3, ArrowUpRight, ArrowDownRight, Check,
} from 'lucide-react'
import { C } from './atlas-tokens'
import {
  Reveal, Card, SectionHeading, PrimaryButton, GhostButton, LinkButton, EmptyState,
  ContextSelector, Sparkline, Modal, ModalHeader,
  greeting, todayLabel, relativeTime,
} from './atlas-ui'
import InsightCard from './InsightCard'
import { TriageModal, ProjectModal } from './InsightTriage'
import { useAtlas, type Insight, type Project } from '../store'
import { TEMPLATES, USER } from './atlas-data'

const QUESTIONS = [
  'Por que meu faturamento caiu?',
  'Qual indicador merece atenção?',
  'Qual produto mais cresceu?',
]

export default function HomePage() {
  const {
    projects, panels, insights, sources, go, startFlow,
    lastAnalysis, analyzing, runAnalysis, analyzingPanelId, askAtlas,
  } = useAtlas()

  const [context, setContext] = useState<string | null>(null)
  const [triage, setTriage] = useState<Insight | null>(null)
  const [projectModal, setProjectModal] = useState(false)
  const [openProject, setOpenProject] = useState<Project | null>(null)

  const hasSources = sources.length > 0
  const hasPanels = panels.length > 0

  const contextPanels = useMemo(
    () => context ? panels.filter(p => p.projectId === context) : panels,
    [panels, context],
  )
  const contextInsights = useMemo(
    () => context ? insights.filter(i => i.projectId === context) : insights,
    [insights, context],
  )
  const pending = contextInsights.filter(i => i.status === 'gerado')

  const kpis = useMemo(() => {
    const seen = new Set<string>()
    const out: typeof TEMPLATES['comercial']['kpis'] = []
    contextPanels.forEach(p => TEMPLATES[p.templateId].kpis.forEach(k => {
      if (!seen.has(k.label)) { seen.add(k.label); out.push(k) }
    }))
    return out.slice(0, 4)
  }, [contextPanels])

  const recentProjects = [...projects].slice(-3).reverse()

  return (
    <div className="atlas-page" style={{ padding: '28px 32px 52px', maxWidth: 1180, margin: '0 auto' }}>
      {/* ── 1. Saudação ───────────────────────────────────────────────────── */}
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 22, marginBottom: 34, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', minWidth: 0 }}>
            <h1 style={{ color: C.text, fontSize: 28, fontWeight: 700, letterSpacing: '-0.032em', marginBottom: 8 }}>
              {greeting()}, {USER.name.split(' ')[0]}
            </h1>
            <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.6 }}>
              {todayLabel()}.{' '}
              {!hasSources
                ? 'O Atlas está aguardando você conectar seus dados para começar a gerar insights.'
                : pending.length > 0
                  ? <>O Atlas encontrou <strong style={{ color: C.purpleLight, fontWeight: 600 }}>{pending.length} {pending.length === 1 ? 'insight' : 'insights'}</strong> que {pending.length === 1 ? 'merece' : 'merecem'} sua atenção.</>
                  : hasPanels ? 'Nenhum insight pendente de avaliação por aqui.' : 'Escolha como quer visualizar os dados conectados.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ color: C.textSubtle, fontSize: 12.5 }}>
              {lastAnalysis ? `Última análise ${lastAnalysis}` : 'Nenhuma análise ainda'}
            </span>
            <GhostButton
              icon={<RefreshCw size={14} style={analyzing ? { animation: 'spin-slow 1s linear infinite' } : undefined} />}
              onClick={runAnalysis}
            >
              {analyzing ? 'Analisando...' : 'Analisar agora'}
            </GhostButton>
          </div>
        </div>
      </Reveal>

      {/* ── 2. Projetos recentes ──────────────────────────────────────────── */}
      <Reveal delay={60} style={{ marginBottom: 30 }}>
        <SectionHeading
          title="Projetos recentes"
          action={projects.length > 3 ? <LinkButton onClick={() => go('panels')} icon={<ArrowRight size={13} />}>Ver todos</LinkButton> : undefined}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))', gap: 12 }}>
          {recentProjects.map(project => (
            <ProjectCard key={project.id} project={project} onOpen={() => setOpenProject(project)} />
          ))}
          <button onClick={() => setProjectModal(true)} className="row-hover"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9, minHeight: recentProjects.length ? undefined : 128, padding: '22px 18px', borderRadius: 16, border: `1px dashed ${C.borderMd}`, background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight }}>
              <Plus size={16} />
            </div>
            <span style={{ color: C.textMuted, fontSize: 13.5, fontWeight: 500 }}>Criar projeto</span>
          </button>
        </div>
      </Reveal>

      {/* ── 3. Conectar dados ─────────────────────────────────────────────── */}
      {!hasPanels && (
        <Reveal delay={100} style={{ marginBottom: 30 }}>
          {!hasSources ? (
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, border: '1px solid rgba(139,92,246,0.22)', background: 'rgba(15,12,28,0.7)', padding: '32px 30px' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(139,92,246,0.05) 1px, transparent 1px)', backgroundSize: '26px 26px', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: -1, left: '10%', width: 220, height: 2, background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.7), transparent)' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 380px', minWidth: 0 }}>
                  <h2 style={{ color: C.text, fontSize: 21, fontWeight: 680, letterSpacing: '-0.022em', marginBottom: 9 }}>
                    Conecte sua primeira fonte de dados
                  </h2>
                  <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.68, maxWidth: 520 }}>
                    Conecte as ferramentas que sua empresa já utiliza e deixe o Atlas identificar o que merece sua atenção.
                  </p>
                </div>
                <PrimaryButton onClick={() => go('integrations')} icon={<Plug size={15} />} style={{ padding: '12px 22px', fontSize: 14 }}>
                  Conectar dados
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <Card style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }} padding={22}>
              <div className="check-pop" style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={17} color={C.green} />
              </div>
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <div style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Seus dados estão conectados</div>
                <div style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>
                  Escolha como visualizá-los para o Atlas começar a encontrar insights.
                </div>
              </div>
              <PrimaryButton onClick={() => startFlow('visualize', { sourceId: sources[0]?.id })} icon={<LayoutDashboard size={15} />}>
                Escolher visualização
              </PrimaryButton>
            </Card>
          )}
        </Reveal>
      )}

      {/* ── 4. Insights do Atlas ──────────────────────────────────────────── */}
      <Reveal delay={140} style={{ marginBottom: 30 }}>
        <SectionHeading
          title="Insights do Atlas"
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {projects.length > 0 && (
                <ContextSelector value={context} onChange={setContext} projects={projects} />
              )}
              {insights.length > 0 && (
                <LinkButton onClick={() => go('insights', { insightStatus: 'gerado' })} icon={<ArrowRight size={13} />}>
                  Central de Insights
                </LinkButton>
              )}
            </div>
          }
        />

        {analyzingPanelId ? (
          <AnalyzingCard />
        ) : !hasPanels ? (
          <Card padding={0}>
            <EmptyState
              icon={<Lightbulb size={19} />}
              title="O Atlas ainda não encontrou insights"
              description="Conecte seus dados para começar a identificar oportunidades, riscos e mudanças importantes no seu negócio."
              action={<PrimaryButton onClick={() => go('integrations')} icon={<Plug size={15} />}>Conectar dados</PrimaryButton>}
            />
          </Card>
        ) : pending.length === 0 ? (
          <Card padding={0}>
            <EmptyState
              compact
              icon={<Check size={19} />}
              title="Tudo avaliado por aqui"
              description="Você já tratou todos os insights desta rodada. O Atlas avisa assim que encontrar algo novo."
              action={<GhostButton onClick={() => go('insights', { insightStatus: 'backlog' })}>Ver Central de Insights</GhostButton>}
            />
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {pending.slice(0, 3).map((insight, i) => (
              <div key={insight.id} style={{ animationDelay: `${i * 70}ms` }}>
                <InsightCard insight={insight} onAdd={setTriage} showOrigin={!context} />
              </div>
            ))}
            {pending.length > 3 && (
              <LinkButton onClick={() => go('insights', { insightStatus: 'gerado' })} icon={<ArrowRight size={13} />}>
                Ver mais {pending.length - 3} {pending.length - 3 === 1 ? 'insight' : 'insights'}
              </LinkButton>
            )}
          </div>
        )}
      </Reveal>

      {/* ── 5. Perguntar ao Atlas ─────────────────────────────────────────── */}
      <Reveal delay={180} style={{ marginBottom: 30 }}>
        <AskCard onAsk={askAtlas} enabled={hasPanels} />
      </Reveal>

      {/* ── 6. Como o negócio está hoje ───────────────────────────────────── */}
      <Reveal delay={220}>
        <SectionHeading
          title="Como o negócio está hoje"
          action={projects.length > 0 ? <ContextSelector value={context} onChange={setContext} projects={projects} /> : undefined}
        />
        {kpis.length === 0 ? (
          <Card padding={0}>
            <EmptyState
              compact
              icon={<BarChart3 size={19} />}
              title="Seus indicadores aparecerão aqui"
              description="Conecte seus dados para acompanhar os principais indicadores do negócio em um só lugar."
            />
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(212px, 1fr))', gap: 12 }}>
            {kpis.map((k, i) => (
              <Card key={k.label} padding={18} hover>
                <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 10 }}>{k.label}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{k.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                      {k.up ? <ArrowUpRight size={13} color={C.green} /> : <ArrowDownRight size={13} color={C.red} />}
                      <span style={{ color: k.up ? C.green : C.red, fontSize: 12.5, fontWeight: 600 }}>{k.change}</span>
                      <span style={{ color: C.textSubtle, fontSize: 12 }}>no mês</span>
                    </div>
                  </div>
                  <Sparkline values={k.spark} color={k.up ? C.green : C.orange} width={70} height={34} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </Reveal>

      {triage && <TriageModal insight={triage} onClose={() => setTriage(null)} />}
      {projectModal && <ProjectModal onClose={() => setProjectModal(false)} />}
      {openProject && <ProjectPanelsModal project={openProject} onClose={() => setOpenProject(null)} />}
    </div>
  )
}

// ── Projeto ─────────────────────────────────────────────────────────────────

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { panelsOf } = useAtlas()
  const panels = panelsOf(project.id)
  const last = panels.length ? panels[panels.length - 1].createdAt : project.createdAt

  return (
    <button onClick={onOpen} className="card-hover"
      style={{ textAlign: 'left', background: 'rgba(15,12,28,0.66)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 19px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.11)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
          <FolderOpen size={15} />
        </div>
        <span style={{ color: C.text, fontSize: 14.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {project.name}
        </span>
      </div>
      <div style={{ color: C.textSubtle, fontSize: 12.5 }}>
        {panels.length} {panels.length === 1 ? 'painel' : 'painéis'} · atualizado {relativeTime(last)}
      </div>
    </button>
  )
}

function ProjectPanelsModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { panelsOf, go, insights } = useAtlas()
  const panels = panelsOf(project.id)

  return (
    <Modal onClose={onClose} width={460}>
      <ModalHeader icon={<FolderOpen size={18} />} title={project.name}
        description={project.description || `${panels.length} ${panels.length === 1 ? 'painel neste projeto' : 'painéis neste projeto'}`}
        onClose={onClose} />

      {panels.length === 0 ? (
        <EmptyState compact icon={<LayoutDashboard size={18} />} title="Nenhum painel ainda"
          description="Conecte uma fonte de dados para adicionar o primeiro painel a este projeto." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {panels.map(panel => {
            const count = insights.filter(i => i.panelId === panel.id && i.status === 'gerado').length
            return (
              <button key={panel.id} className="row-hover"
                onClick={() => { onClose(); go('panels', { projectId: project.id, panelId: panel.id }) }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: `1px solid ${C.borderSubtle}`, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.11)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
                  <LayoutDashboard size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{panel.name}</div>
                  <div style={{ color: C.textSubtle, fontSize: 12 }}>
                    {panel.originLabel}{count > 0 ? ` · ${count} ${count === 1 ? 'insight novo' : 'insights novos'}` : ''}
                  </div>
                </div>
                <ArrowRight size={14} color={C.textSubtle} />
              </button>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

// ── Atlas analisando ────────────────────────────────────────────────────────

function AnalyzingCard() {
  return (
    <Card style={{ position: 'relative', overflow: 'hidden' }} padding={24}>
      <div className="atlas-scan" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="atlas-pulse" style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={17} color="white" />
        </div>
        <div>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>A Atlas IA está lendo seus dados</div>
          <div style={{ color: C.textMuted, fontSize: 13.5 }}>Cruzando métricas e comparando com o histórico para encontrar o que mudou.</div>
        </div>
      </div>
    </Card>
  )
}

// ── Perguntar ao Atlas ──────────────────────────────────────────────────────

function AskCard({ onAsk, enabled }: { onAsk: (q: string) => void; enabled: boolean }) {
  const [value, setValue] = useState('')

  const send = () => {
    if (!value.trim()) return
    onAsk(value.trim())
    setValue('')
  }

  return (
    <Card padding={22}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 15 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={14} color="white" />
        </div>
        <div>
          <div style={{ color: C.text, fontSize: 14.5, fontWeight: 600 }}>Perguntar ao Atlas</div>
          <div style={{ color: C.textSubtle, fontSize: 12.5, marginTop: 2 }}>Pergunte sobre seus dados em linguagem natural.</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send() }}
          placeholder="O que você quer entender?"
          style={{ flex: 1, minWidth: 0, padding: '11px 14px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13.5, outline: 'none', caretColor: C.purpleLight, transition: 'border-color 0.2s' }}
          onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
          onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }}
        />
        <button onClick={send} className="atlas-btn-primary"
          style={{ width: 42, borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Send size={15} color="white" />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {QUESTIONS.map(q => (
          <button key={q} onClick={() => onAsk(q)}
            style={{ padding: '7px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, fontSize: 12.5, cursor: 'pointer', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted }}>
            {q}
          </button>
        ))}
      </div>

      {!enabled && (
        <div style={{ color: C.textSubtle, fontSize: 12.5, marginTop: 13 }}>
          As respostas ficam mais precisas depois que você conecta suas fontes de dados.
        </div>
      )}
    </Card>
  )
}
