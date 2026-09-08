import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts'
import {
  Plug, Sparkles, PanelTop, ArrowLeft, Plus, X,
  BarChart2, TrendingUp, PieChart as PieChartIcon, Hash,
  ArrowRight, ChevronDown, CheckCircle2
} from 'lucide-react'
import { C, CHART_COLORS } from './atlas-tokens'

// ─── Types ────────────────────────────────────────────────────────────────

type Step = 'empty' | 'connect' | 'create'
type ChartType = 'bar' | 'line' | 'pie' | 'kpi'

interface ChartConfig {
  id: string
  type: ChartType
  title: string
  fieldX: string
  fieldY: string
}

// ─── Constants ────────────────────────────────────────────────────────────

const DATA_SOURCES = [
  { id: 'sheets', name: 'Google Sheets', emoji: '📊', color: '#0F9D58', desc: 'Planilhas do Google Drive' },
  { id: 'excel', name: 'Excel / CSV', emoji: '📋', color: '#217346', desc: 'Arquivos .xlsx, .xls, .csv' },
  { id: 'powerbi', name: 'Power BI', emoji: '📈', color: '#F2C811', desc: 'Relatórios e datasets do Power BI' },
  { id: 'erp', name: 'ERP / CRM', emoji: '🔗', color: '#6B48FF', desc: 'Tiny, Bling, HubSpot, Pipedrive' },
]

const FIELDS: Record<string, string[]> = {
  sheets: ['Data', 'Receita', 'Produto', 'Categoria', 'Quantidade', 'Cliente', 'Margem'],
  excel: ['Data', 'Receita', 'Produto', 'Categoria', 'Quantidade', 'Custo'],
  powerbi: ['Período', 'Faturamento', 'Departamento', 'Meta', 'Resultado', 'Variação'],
  erp: ['Data', 'Valor', 'Status', 'Produto', 'Cliente', 'Canal', 'Margem'],
}

const CHART_BUTTONS: { type: ChartType; label: string; icon: React.ReactNode }[] = [
  { type: 'bar', label: 'Gráfico de barras', icon: <BarChart2 size={17} /> },
  { type: 'line', label: 'Gráfico de linha', icon: <TrendingUp size={17} /> },
  { type: 'pie', label: 'Gráfico de pizza', icon: <PieChartIcon size={17} /> },
  { type: 'kpi', label: 'KPI / Card', icon: <Hash size={17} /> },
]

// preview mock data
const barMock = [{ n: 'Jan', v: 42 }, { n: 'Fev', v: 61 }, { n: 'Mar', v: 47 }, { n: 'Abr', v: 78 }, { n: 'Mai', v: 55 }]
const lineMock = [{ n: 'Jan', v: 35 }, { n: 'Fev', v: 52 }, { n: 'Mar', v: 44 }, { n: 'Abr', v: 68 }, { n: 'Mai', v: 61 }, { n: 'Jun', v: 74 }]
const pieMock = [{ name: 'Cat A', value: 40 }, { name: 'Cat B', value: 33 }, { name: 'Cat C', value: 27 }]
const axisStyle = { fill: C.textSubtle, fontSize: 10 }

// ─── Chart Preview ────────────────────────────────────────────────────────

function ChartPreview({ type, fieldX, fieldY }: { type: ChartType; fieldX: string; fieldY: string }) {
  if (type === 'kpi') {
    return (
      <div style={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <div style={{ color: C.text, fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em' }}>R$ 82K</div>
        <div style={{ color: C.green, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendingUp size={13} /> +8,2% vs mês anterior
        </div>
        <div style={{ color: C.textSubtle, fontSize: 11 }}>{fieldY || 'Métrica'}</div>
      </div>
    )
  }
  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie data={pieMock} cx="50%" cy="50%" outerRadius={42} dataKey="value" paddingAngle={3}>
            {pieMock.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: 'rgba(13,10,24,0.95)', border: `1px solid rgba(139,92,246,0.3)`, borderRadius: 8, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    )
  }
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={lineMock} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <XAxis dataKey="n" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={{ background: 'rgba(13,10,24,0.95)', border: `1px solid rgba(139,92,246,0.3)`, borderRadius: 8, fontSize: 12 }} />
          <Line type="monotone" dataKey="v" name={fieldY || 'Valor'} stroke="#a78bfa" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={barMock} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <XAxis dataKey="n" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={{ background: 'rgba(13,10,24,0.95)', border: `1px solid rgba(139,92,246,0.3)`, borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="v" name={fieldY || 'Valor'} fill="#a78bfa" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Chart Config Card ────────────────────────────────────────────────────

function ChartConfigCard({ chart, fields, onUpdate, onRemove, active, onClick }: {
  chart: ChartConfig
  fields: string[]
  onUpdate: (field: 'fieldX' | 'fieldY' | 'title', val: string) => void
  onRemove: () => void
  active: boolean
  onClick: () => void
}) {
  const btnInfo = CHART_BUTTONS.find(b => b.type === chart.type)!
  return (
    <div onClick={onClick}
      style={{ background: active ? 'rgba(15,12,28,0.9)' : 'rgba(15,12,28,0.6)', border: `1px solid ${active ? 'rgba(139,92,246,0.35)' : C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'all 0.22s', cursor: active ? 'default' : 'pointer', boxShadow: active ? '0 0 24px rgba(139,92,246,0.1)' : 'none' }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: active ? `1px solid ${C.borderSubtle}` : 'none' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
          {btnInfo.icon}
        </div>
        <input value={chart.title} onChange={e => onUpdate('title', e.target.value)}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, fontWeight: 600, cursor: 'text' }} />
        <button onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.red, flexShrink: 0, transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.18)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}>
          <X size={13} />
        </button>
      </div>

      {/* Expanded content */}
      {active && (
        <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
          {/* Field selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chart.type !== 'kpi' && (
              <FieldSelector label="Eixo X" value={chart.fieldX} options={fields} onChange={v => onUpdate('fieldX', v)} />
            )}
            <FieldSelector label={chart.type === 'kpi' ? 'Métrica' : 'Eixo Y'} value={chart.fieldY} options={fields} onChange={v => onUpdate('fieldY', v)} />
            <div style={{ background: 'rgba(139,92,246,0.06)', border: `1px solid ${C.borderMd}`, borderRadius: 9, padding: '9px 12px' }}>
              <div style={{ color: C.textSubtle, fontSize: 11, marginBottom: 4 }}>Tipo de gráfico</div>
              <div style={{ color: C.purpleLight, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                {btnInfo.icon} {btnInfo.label}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pré-visualização</div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 10, padding: '10px 8px' }}>
              <ChartPreview type={chart.type} fieldX={chart.fieldX} fieldY={chart.fieldY} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldSelector({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ color: C.textSubtle, fontSize: 11, marginBottom: 5 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '8px 28px 8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13, outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
          {options.map(o => <option key={o} value={o} style={{ background: '#0d0b1a' }}>{o}</option>)}
        </select>
        <ChevronDown size={13} color={C.textSubtle} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────

interface Props {
  navigateSection: (section: string) => void
}

export default function DashboardEmpty({ navigateSection }: Props) {
  const [step, setStep] = useState<Step>('empty')
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [panelName, setPanelName] = useState('')
  const [charts, setCharts] = useState<ChartConfig[]>([])
  const [activeChart, setActiveChart] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  const fields = selectedSource ? FIELDS[selectedSource] : []
  const source = DATA_SOURCES.find(s => s.id === selectedSource)

  const addChart = (type: ChartType) => {
    const chart: ChartConfig = {
      id: Date.now().toString(),
      type,
      title: `${CHART_BUTTONS.find(b => b.type === type)?.label || 'Gráfico'} ${charts.length + 1}`,
      fieldX: fields[0] || '',
      fieldY: fields[1] || '',
    }
    setCharts(prev => [...prev, chart])
    setActiveChart(chart.id)
  }

  const updateChart = (id: string, field: 'fieldX' | 'fieldY' | 'title', value: string) => {
    setCharts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const handlePublish = () => {
    setPublishing(true)
    setTimeout(() => navigateSection('panels'), 1400)
  }

  // ── STEP: CREATE ──────────────────────────────────────────────────────
  if (step === 'create') {
    return (
      <div style={{ minHeight: '100%', background: C.bg, position: 'relative' }}>
        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(7,5,15,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.borderSubtle}`, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => setStep('connect')} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 10px', borderRadius: 7, transition: 'color 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text }}
            onMouseLeave={e => { e.currentTarget.style.color = C.textMuted }}>
            <ArrowLeft size={15} /> Voltar
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ color: C.textSubtle, fontSize: 12 }}>Novo painel</span>
          </div>
          <button onClick={handlePublish} disabled={publishing || !panelName.trim()}
            className="atlas-btn-primary"
            style={{ padding: '9px 22px', borderRadius: 10, color: 'white', border: 'none', cursor: panelName.trim() && !publishing ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, opacity: panelName.trim() && !publishing ? 1 : 0.5, boxShadow: '0 0 20px rgba(139,92,246,0.35)' }}>
            {publishing ? (
              <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} /> Publicando...</>
            ) : (
              <><CheckCircle2 size={16} /> Publicar Painel</>
            )}
          </button>
        </div>

        <div style={{ padding: '32px 28px', maxWidth: 820, margin: '0 auto' }}>
          {/* Panel name */}
          <div style={{ marginBottom: 28 }}>
            <input value={panelName} onChange={e => setPanelName(e.target.value)}
              placeholder="Nome do painel..."
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `2px solid ${panelName ? C.borderMd : C.borderSubtle}`, outline: 'none', color: C.text, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', padding: '0 0 12px', transition: 'border-color 0.2s', boxSizing: 'border-box', caretColor: C.purpleLight }}
              onFocus={e => { e.currentTarget.style.borderColor = C.purpleLight }}
              onBlur={e => { e.currentTarget.style.borderColor = panelName ? C.borderMd : C.borderSubtle }} />
            {/* Source chip */}
            {source && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, borderRadius: 7, padding: '4px 10px' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: source.color }} />
                <span style={{ color: C.textMuted, fontSize: 12 }}>{source.name} conectado</span>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} />
              </div>
            )}
          </div>

          {/* Add chart buttons */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ color: C.textSubtle, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Adicionar gráfico</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {CHART_BUTTONS.map(btn => (
                <button key={btn.type} onClick={() => addChart(btn.type)} className="atlas-btn-secondary"
                  style={{ padding: '9px 16px', borderRadius: 9, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: C.purpleLight }}>{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Charts list */}
          {charts.length === 0 ? (
            <div style={{ border: `2px dashed rgba(139,92,246,0.2)`, borderRadius: 14, padding: '48px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
              <div style={{ color: C.textMuted, fontSize: 15, marginBottom: 6 }}>Nenhum gráfico adicionado ainda</div>
              <div style={{ color: C.textSubtle, fontSize: 13 }}>Use os botões acima para adicionar gráficos ao seu painel.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {charts.map(chart => (
                <ChartConfigCard key={chart.id} chart={chart} fields={fields}
                  active={activeChart === chart.id}
                  onClick={() => setActiveChart(activeChart === chart.id ? null : chart.id)}
                  onUpdate={(field, val) => updateChart(chart.id, field, val)}
                  onRemove={() => {
                    setCharts(prev => prev.filter(c => c.id !== chart.id))
                    if (activeChart === chart.id) setActiveChart(null)
                  }} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── STEP: CONNECT ─────────────────────────────────────────────────────
  if (step === 'connect') {
    return (
      <div style={{ minHeight: '100%', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* BG orbs */}
        <div className="atlas-glow" style={{ position: 'absolute', top: '15%', right: '10%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(139,92,246,0.06)', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div className="atlas-glow" style={{ position: 'absolute', bottom: '10%', left: '8%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(59,130,246,0.05)', filter: 'blur(80px)', pointerEvents: 'none', animationDelay: '2s' }} />

        <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}>
          <button onClick={() => setStep('empty')} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 28, padding: 0, transition: 'color 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text }}
            onMouseLeave={e => { e.currentTarget.style.color = C.textMuted }}>
            <ArrowLeft size={15} /> Voltar
          </button>

          <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Selecione uma fonte de dados</h2>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Escolha de onde seus dados virão. Você pode conectar mais fontes depois.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
            {DATA_SOURCES.map(src => (
              <div key={src.id} className="selection-card"
                onClick={() => setSelectedSource(src.id)}
                style={{ border: `1px solid ${selectedSource === src.id ? C.purpleLight : C.border}`, borderRadius: 14, padding: '18px 20px', background: selectedSource === src.id ? 'rgba(139,92,246,0.1)' : 'rgba(15,12,28,0.75)', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.22s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${src.color}22`, border: `1px solid ${src.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {src.emoji}
                  </div>
                  {selectedSource === src.id && (
                    <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={13} color="white" />
                    </div>
                  )}
                </div>
                <div style={{ color: selectedSource === src.id ? C.purpleLight : C.text, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{src.name}</div>
                <div style={{ color: C.textSubtle, fontSize: 12 }}>{src.desc}</div>
              </div>
            ))}
          </div>

          <button onClick={() => selectedSource && setStep('create')} disabled={!selectedSource}
            className="atlas-btn-primary"
            style={{ width: '100%', padding: '13px 0', borderRadius: 11, color: 'white', border: 'none', cursor: selectedSource ? 'pointer' : 'not-allowed', fontSize: 15, fontWeight: 500, opacity: selectedSource ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Continuar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  // ── STEP: EMPTY ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100%', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* BG orbs */}
      <div className="atlas-glow" style={{ position: 'absolute', top: '10%', left: '10%', width: 440, height: 440, borderRadius: '50%', background: 'rgba(139,92,246,0.06)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div className="atlas-glow" style={{ position: 'absolute', bottom: '15%', right: '8%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(59,130,246,0.05)', filter: 'blur(90px)', pointerEvents: 'none', animationDelay: '2s' }} />

      <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}>
        {/* Welcome header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          {/* Atlas logo glow */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.2)' }}>
              <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>A</span>
            </div>
          </div>

          <h1 style={{ color: C.text, fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 10 }}>
            Bem-vindo ao <span className="gradient-text">Atlas</span>
          </h1>
          <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.65 }}>
            Conecte seus dados e transforme informações em decisões práticas.
          </p>
        </div>

        {/* Main card */}
        <div style={{ background: 'rgba(15,12,28,0.85)', border: `1px solid rgba(139,92,246,0.22)`, borderRadius: 20, padding: '36px 32px', backdropFilter: 'blur(20px)', boxShadow: '0 0 50px rgba(139,92,246,0.1), 0 24px 60px rgba(0,0,0,0.5)', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          {/* Top glow line */}
          <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 200, height: 2, background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.7), transparent)', borderRadius: 4 }} />
          {/* BG grid decoration */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(139,92,246,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', opacity: 0.5 }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(139,92,246,0.12)', border: `1px solid rgba(139,92,246,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PanelTop size={26} color={C.purpleNeon} />
              </div>
            </div>
            <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Crie seu primeiro painel</h2>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
              Para criar painéis e gráficos, primeiro conecte uma fonte de dados. O processo leva menos de 2 minutos.
            </p>
            <button onClick={() => setStep('connect')} className="atlas-btn-primary"
              style={{ padding: '13px 32px', borderRadius: 11, color: 'white', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 9, boxShadow: '0 0 28px rgba(139,92,246,0.45)' }}>
              <Plug size={17} /> Conectar fonte de dados
            </button>
          </div>
        </div>

        {/* 3 info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            {
              icon: <Plug size={20} color={C.blueLight} />,
              bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)',
              title: 'Conectar Dados',
              desc: 'Integre Google Sheets, Excel, ERP, CRM e muito mais.',
            },
            {
              icon: <PanelTop size={20} color={C.purpleNeon} />,
              bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.2)',
              title: 'Criar Painéis',
              desc: 'Monte dashboards com gráficos, KPIs e métricas.',
            },
            {
              icon: <Sparkles size={20} color={C.yellow} />,
              bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.18)',
              title: 'Gerar Insights com IA',
              desc: 'A IA analisa seus dados e entrega recomendações claras.',
            },
          ].map(card => (
            <div key={card.title} className="card-hover"
              style={{ background: 'rgba(15,12,28,0.7)', border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 16px', backdropFilter: 'blur(12px)', textAlign: 'center', cursor: 'default' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: card.bg, border: `1px solid ${card.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                {card.icon}
              </div>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{card.title}</div>
              <div style={{ color: C.textSubtle, fontSize: 12, lineHeight: 1.55 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
