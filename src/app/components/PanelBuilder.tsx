import { useEffect, useState } from 'react'
import {
  ArrowLeft, X, BarChart2, TrendingUp, PieChart as PieChartIcon, Hash,
  CheckCircle2, Sparkles, FolderPlus, Check,
} from 'lucide-react'
import { C } from './atlas-tokens'
import {
  Reveal, Modal, ModalHeader, PrimaryButton, GhostButton, Field, Select,
} from './atlas-ui'
import { CustomChartRender } from './PanelCharts'
import { useAtlas, type CustomChart } from '../store'
import { SOURCE_CATALOG, inferTemplate } from './atlas-data'

type ChartType = 'bar' | 'line' | 'pie' | 'kpi'

const CHART_BUTTONS: { type: ChartType; label: string; icon: React.ReactNode }[] = [
  { type: 'bar', label: 'Gráfico de barras', icon: <BarChart2 size={16} /> },
  { type: 'line', label: 'Gráfico de linha', icon: <TrendingUp size={16} /> },
  { type: 'pie', label: 'Gráfico de pizza', icon: <PieChartIcon size={16} /> },
  { type: 'kpi', label: 'KPI / Card', icon: <Hash size={16} /> },
]

const FIELDS = ['Mês', 'Realizado', 'Orçado', 'Desvio', 'Vendedor', 'Categoria', 'Data', 'Receita', 'Produto', 'Quantidade', 'Cliente', 'Margem', 'Custo']

// Visualização sugerida pela Atlas IA quando o usuário não sabe por onde começar.
const AI_CHARTS: Omit<CustomChart, 'id'>[] = [
  { type: 'line', title: 'Evolução da receita', fieldX: 'Data', fieldY: 'Receita' },
  { type: 'bar', title: 'Receita por categoria', fieldX: 'Categoria', fieldY: 'Receita' },
  { type: 'kpi', title: 'Receita do mês', fieldX: 'Data', fieldY: 'Receita' },
]

export default function PanelBuilder() {
  const { go, sources, flow, closeFlow } = useAtlas()
  const [name, setName] = useState('')
  const [charts, setCharts] = useState<CustomChart[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const source = SOURCE_CATALOG.find(s => s.id === (flow?.sourceId ?? sources[0]?.id))

  const addChart = (type: ChartType) => {
    const chart: CustomChart = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      title: `${CHART_BUTTONS.find(b => b.type === type)!.label} ${charts.length + 1}`,
      fieldX: FIELDS[0],
      fieldY: FIELDS[1],
    }
    setCharts(prev => [...prev, chart])
    setActive(chart.id)
  }

  const update = (id: string, field: keyof CustomChart, value: string) => {
    setCharts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const generateWithAI = () => {
    setGenerating(true)
    setTimeout(() => {
      setCharts(AI_CHARTS.map((c, i) => ({ ...c, id: `ai-${Date.now()}-${i}` })))
      if (!name.trim()) setName('Visão de Receita')
      setGenerating(false)
      setActive(null)
    }, 2900)
  }

  return (
    <div className="atlas-page" style={{ minHeight: '100%' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(7,5,15,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.borderSubtle}`, padding: '13px 30px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => { closeFlow(); go('integrations') }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 13, padding: '6px 10px', borderRadius: 8 }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textMuted }}>
          <ArrowLeft size={15} /> Voltar
        </button>
        <span style={{ color: C.textSubtle, fontSize: 13 }}>Novo painel no Atlas</span>
        <div style={{ flex: 1 }} />
        <PrimaryButton onClick={() => setPublishing(true)} disabled={!name.trim() || charts.length === 0} icon={<CheckCircle2 size={15} />}>
          Publicar painel
        </PrimaryButton>
      </div>

      <div style={{ padding: '34px 30px 56px', maxWidth: 880, margin: '0 auto' }}>
        <Reveal>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Dê um nome ao painel..."
            style={{ width: '100%', background: 'none', border: 'none', borderBottom: `2px solid ${name ? C.borderMd : C.borderSubtle}`, outline: 'none', color: C.text, fontSize: 26, fontWeight: 700, letterSpacing: '-0.028em', padding: '0 0 12px', boxSizing: 'border-box', caretColor: C.purpleLight, transition: 'border-color 0.2s' }}
            onFocus={e => { e.currentTarget.style.borderColor = C.purpleLight }}
            onBlur={e => { e.currentTarget.style.borderColor = name ? C.borderMd : C.borderSubtle }} />
          {source && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 13, color: C.textSubtle, fontSize: 12.5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: source.color }} />
              {source.name} conectado
            </div>
          )}
        </Reveal>

        {/* Sugestão da IA */}
        <Reveal delay={60} style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', borderRadius: 15, border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.06)', padding: '17px 19px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={16} color="white" />
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Gerar visualização com Atlas IA</div>
              <div style={{ color: C.textMuted, fontSize: 13 }}>Não sabe por onde começar? Deixe o Atlas sugerir uma visualização.</div>
            </div>
            <GhostButton onClick={generateWithAI} icon={<Sparkles size={14} />}>Gerar visualização</GhostButton>
          </div>
        </Reveal>

        {/* Adicionar gráficos */}
        <Reveal delay={100} style={{ marginTop: 28 }}>
          <div style={{ color: C.textSubtle, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12 }}>
            Adicionar visualização
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {CHART_BUTTONS.map(btn => (
              <button key={btn.type} onClick={() => addChart(btn.type)} className="atlas-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                <span style={{ color: C.purpleLight }}>{btn.icon}</span>{btn.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div style={{ marginTop: 22 }}>
          {charts.length === 0 ? (
            <div style={{ border: `1.5px dashed ${C.borderMd}`, borderRadius: 16, padding: '50px 28px', textAlign: 'center' }}>
              <div style={{ color: C.textMuted, fontSize: 14.5, marginBottom: 6 }}>Nenhuma visualização adicionada</div>
              <div style={{ color: C.textSubtle, fontSize: 13 }}>Escolha um tipo acima ou peça uma sugestão à Atlas IA.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {charts.map(chart => (
                <ChartConfig key={chart.id} chart={chart}
                  active={active === chart.id}
                  onClick={() => setActive(active === chart.id ? null : chart.id)}
                  onUpdate={(f, v) => update(chart.id, f, v)}
                  onRemove={() => {
                    setCharts(prev => prev.filter(c => c.id !== chart.id))
                    if (active === chart.id) setActive(null)
                  }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {generating && <GeneratingModal />}
      {publishing && (
        <PublishModal
          name={name.trim()}
          charts={charts}
          sourceLabel={source?.name ?? 'Atlas'}
          onClose={() => setPublishing(false)}
        />
      )}
    </div>
  )
}

// ── Geração pela IA ─────────────────────────────────────────────────────────

function GeneratingModal() {
  const steps = ['Analisando seus dados...', 'Identificando métricas relevantes...', 'Montando visualização...']
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = steps.map((_, i) => window.setTimeout(() => setStep(i + 1), 900 * (i + 1)))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal width={420}>
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <div className="atlas-pulse" style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Sparkles size={21} color="white" />
        </div>
        <div style={{ color: C.text, fontSize: 16.5, fontWeight: 650, marginBottom: 20 }}>Atlas IA montando sua visualização</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, textAlign: 'left', maxWidth: 280, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i <= step ? 1 : 0.35, transition: 'opacity 0.3s' }}>
              {i < step
                ? <Check size={14} color={C.green} className="check-pop" />
                : <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${i === step ? C.purpleLight : C.borderSubtle}`, display: 'inline-block' }} />}
              <span style={{ color: i <= step ? C.textMuted : C.textSubtle, fontSize: 13.5 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

// ── Publicação: escolher o projeto ──────────────────────────────────────────

function PublishModal({ name, charts, sourceLabel, onClose }: {
  name: string; charts: CustomChart[]; sourceLabel: string; onClose: () => void
}) {
  const { projects, createProject, createPanel, go, toast, closeFlow } = useAtlas()
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '__new__')
  const [newProject, setNewProject] = useState('')

  const creating = projectId === '__new__'
  const ready = !creating || newProject.trim().length > 1

  const publish = () => {
    if (!ready) return
    const id = creating ? createProject(newProject.trim()).id : projectId
    const panel = createPanel({
      name,
      projectId: id,
      // A leitura da IA segue o que o painel mostra (ex.: orçado x realizado).
      templateId: inferTemplate([name, ...charts.flatMap(c => [c.title, c.fieldX, c.fieldY])]),
      origin: 'atlas',
      originLabel: sourceLabel,
      charts,
    })
    closeFlow()
    onClose()
    go('panels', { projectId: id, panelId: panel.id })
    toast('Painel publicado', `${name} está disponível no projeto.`)
  }

  return (
    <Modal onClose={onClose} width={440}>
      <ModalHeader icon={<FolderPlus size={18} />} title="Em qual projeto este painel ficará?"
        description="Projetos agrupam painéis e insights de um mesmo contexto do negócio." onClose={onClose} />

      <Select
        label="Projeto"
        value={projectId}
        onChange={setProjectId}
        options={[
          ...projects.map(p => ({ value: p.id, label: p.name })),
          { value: '__new__', label: '+ Criar novo projeto' },
        ]}
      />
      {creating && (
        <div style={{ marginTop: 14 }} className="flow-step">
          <Field label="Nome do novo projeto" value={newProject} onChange={setNewProject} placeholder="Ex.: Financeiro" autoFocus onEnter={publish} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 26 }}>
        <GhostButton onClick={onClose}>Cancelar</GhostButton>
        <PrimaryButton onClick={publish} disabled={!ready} icon={<CheckCircle2 size={15} />}>Publicar painel</PrimaryButton>
      </div>
    </Modal>
  )
}

// ── Configuração de um gráfico ──────────────────────────────────────────────

function ChartConfig({ chart, active, onClick, onUpdate, onRemove }: {
  chart: CustomChart
  active: boolean
  onClick: () => void
  onUpdate: (field: keyof CustomChart, value: string) => void
  onRemove: () => void
}) {
  const btn = CHART_BUTTONS.find(b => b.type === chart.type)!
  return (
    <div onClick={onClick}
      style={{ background: active ? 'rgba(15,12,28,0.9)' : 'rgba(15,12,28,0.55)', border: `1px solid ${active ? 'rgba(139,92,246,0.32)' : C.border}`, borderRadius: 15, overflow: 'hidden', transition: 'all 0.22s', cursor: active ? 'default' : 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px', borderBottom: active ? `1px solid ${C.borderSubtle}` : 'none' }}>
        <span style={{ color: C.purpleLight, display: 'flex' }}>{btn.icon}</span>
        <input value={chart.title} onChange={e => onUpdate('title', e.target.value)} onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, fontWeight: 600, cursor: 'text' }} />
        <button onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.red, flexShrink: 0 }}>
          <X size={13} />
        </button>
      </div>

      {active && (
        <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: 'minmax(0, 190px) minmax(0, 1fr)', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onClick={e => e.stopPropagation()}>
            {chart.type !== 'kpi' && (
              <Select label="Eixo X" value={chart.fieldX} options={FIELDS.map(f => ({ value: f, label: f }))} onChange={v => onUpdate('fieldX', v)} />
            )}
            <Select label={chart.type === 'kpi' ? 'Métrica' : 'Eixo Y'} value={chart.fieldY} options={FIELDS.map(f => ({ value: f, label: f }))} onChange={v => onUpdate('fieldY', v)} />
          </div>
          <div>
            <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Pré-visualização</div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 11, padding: '10px 8px' }}>
              <CustomChartRender type={chart.type} height={130} label={chart.fieldY} title={chart.title} fieldX={chart.fieldX} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
