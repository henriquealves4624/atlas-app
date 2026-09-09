import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, X, BarChart2, TrendingUp, PieChart as PieChartIcon,
  Hash, ChevronDown, CheckCircle2, Sparkles,
} from 'lucide-react'
import { C } from './atlas-tokens'
import { Reveal } from './atlas-ui'
import { CustomChartRender } from './PanelsPage'
import { useAtlas, type CustomChart } from '../store'

type Step = 'connect' | 'create'
type ChartType = 'bar' | 'line' | 'pie' | 'kpi'

const SOURCE_OPTIONS = [
  { id: 'sheets', name: 'Google Sheets', emoji: '📊', color: '#0F9D58', desc: 'Planilhas do Google Drive' },
  { id: 'excel', name: 'Excel / CSV', emoji: '📋', color: '#217346', desc: 'Arquivos .xlsx, .xls e .csv' },
  { id: 'powerbi', name: 'Power BI', emoji: '📈', color: '#F2C811', desc: 'Relatórios e datasets já existentes' },
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

export default function PanelBuilder() {
  const { go, addCustomPanel, setActivePanel, toast } = useAtlas()
  const [step, setStep] = useState<Step>('connect')
  const [sourceId, setSourceId] = useState<string | null>(null)
  const [panelName, setPanelName] = useState('')
  const [charts, setCharts] = useState<CustomChart[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  const fields = sourceId ? FIELDS[sourceId] : []
  const source = SOURCE_OPTIONS.find(s => s.id === sourceId)

  const addChart = (type: ChartType) => {
    const chart: CustomChart = {
      id: `${Date.now()}`,
      type,
      title: `${CHART_BUTTONS.find(b => b.type === type)!.label} ${charts.length + 1}`,
      fieldX: fields[0] || '',
      fieldY: fields[1] || '',
    }
    setCharts(prev => [...prev, chart])
    setActive(chart.id)
  }

  const updateChart = (id: string, field: keyof CustomChart, value: string) => {
    setCharts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const publish = () => {
    if (!panelName.trim() || !source) return
    setPublishing(true)
    const id = `custom-${Date.now()}`
    setTimeout(() => {
      addCustomPanel({ id, label: panelName.trim(), source: source.name, sourceColor: source.color, charts })
      setActivePanel(id)
      go('panels')
      toast('Painel publicado', `${panelName.trim()} já está disponível em Painéis.`)
    }, 1300)
  }

  return (
    <div className="atlas-page" style={{ minHeight: '100%', background: C.bg, position: 'relative' }}>
      {/* Passos */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(7,5,15,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.borderSubtle}`, padding: '13px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => step === 'create' ? setStep('connect') : go('panels')}
          style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 10px', borderRadius: 7 }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textMuted }}>
          <ArrowLeft size={15} /> Voltar
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StepDot n={1} label="Fonte de dados" active={step === 'connect'} done={step === 'create'} />
          <div style={{ width: 26, height: 1, background: C.borderSubtle }} />
          <StepDot n={2} label="Montar painel" active={step === 'create'} done={false} />
        </div>

        <div style={{ flex: 1 }} />

        {step === 'create' && (
          <button onClick={publish} disabled={publishing || !panelName.trim()} className="atlas-btn-primary"
            style={{ padding: '9px 22px', borderRadius: 10, color: 'white', border: 'none', cursor: panelName.trim() && !publishing ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, opacity: panelName.trim() && !publishing ? 1 : 0.5 }}>
            {publishing
              ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} /> Publicando...</>
              : <><CheckCircle2 size={16} /> Publicar painel</>}
          </button>
        )}
      </div>

      {step === 'connect' ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
          <Reveal style={{ width: '100%', maxWidth: 580 }}>
            <h2 style={{ color: C.text, fontSize: 25, fontWeight: 750, letterSpacing: '-0.025em', marginBottom: 9 }}>De onde vêm os dados?</h2>
            <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.65, marginBottom: 28 }}>
              Escolha a fonte que o Atlas vai ler para montar este painel. Você pode conectar outras fontes depois, sem refazer nada.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, marginBottom: 24 }}>
              {SOURCE_OPTIONS.map(src => {
                const selected = sourceId === src.id
                return (
                  <div key={src.id} className="selection-card" onClick={() => setSourceId(src.id)}
                    style={{ border: `1px solid ${selected ? C.purpleLight : C.border}`, borderRadius: 15, padding: '18px 20px', background: selected ? 'rgba(139,92,246,0.1)' : 'rgba(15,12,28,0.75)', backdropFilter: 'blur(12px)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 11 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${src.color}22`, border: `1px solid ${src.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>
                        {src.emoji}
                      </div>
                      {selected && (
                        <div style={{ marginLeft: 'auto', width: 21, height: 21, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle2 size={13} color="white" />
                        </div>
                      )}
                    </div>
                    <div style={{ color: selected ? C.purpleLight : C.text, fontSize: 15, fontWeight: 650, marginBottom: 4 }}>{src.name}</div>
                    <div style={{ color: C.textSubtle, fontSize: 12.5 }}>{src.desc}</div>
                  </div>
                )
              })}
            </div>

            <button onClick={() => sourceId && setStep('create')} disabled={!sourceId} className="atlas-btn-primary"
              style={{ width: '100%', padding: '13px 0', borderRadius: 11, color: 'white', border: 'none', cursor: sourceId ? 'pointer' : 'not-allowed', fontSize: 15, fontWeight: 600, opacity: sourceId ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Continuar <ArrowRight size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 22, background: 'rgba(139,92,246,0.06)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px 16px' }}>
              <Sparkles size={15} color={C.purpleLight} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>
                Assim que o painel for publicado, a Atlas IA passa a analisar esses dados e gerar insights automaticamente.
              </span>
            </div>
          </Reveal>
        </div>
      ) : (
        <div style={{ padding: '32px 28px 48px', maxWidth: 860, margin: '0 auto' }}>
          <Reveal>
            <input value={panelName} onChange={e => setPanelName(e.target.value)} placeholder="Dê um nome ao painel..."
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `2px solid ${panelName ? C.borderMd : C.borderSubtle}`, outline: 'none', color: C.text, fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em', padding: '0 0 12px', boxSizing: 'border-box', caretColor: C.purpleLight, transition: 'border-color 0.2s' }}
              onFocus={e => { e.currentTarget.style.borderColor = C.purpleLight }}
              onBlur={e => { e.currentTarget.style.borderColor = panelName ? C.borderMd : C.borderSubtle }} />
            {source && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, padding: '5px 11px' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: source.color }} />
                <span style={{ color: C.textMuted, fontSize: 12.5 }}>{source.name} conectado</span>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} />
              </div>
            )}
          </Reveal>

          <Reveal delay={60} style={{ marginTop: 28 }}>
            <div style={{ color: C.textSubtle, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Adicionar visualização</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CHART_BUTTONS.map(btn => (
                <button key={btn.type} onClick={() => addChart(btn.type)} className="atlas-btn-secondary"
                  style={{ padding: '9px 16px', borderRadius: 10, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: C.purpleLight }}>{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div style={{ marginTop: 22 }}>
            {charts.length === 0 ? (
              <div style={{ border: '2px dashed rgba(139,92,246,0.2)', borderRadius: 16, padding: '52px 28px', textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>📊</div>
                <div style={{ color: C.textMuted, fontSize: 15, marginBottom: 6 }}>Nenhuma visualização adicionada</div>
                <div style={{ color: C.textSubtle, fontSize: 13 }}>Use os botões acima para montar o painel do seu jeito.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {charts.map(chart => (
                  <ChartConfigCard key={chart.id} chart={chart} fields={fields}
                    active={active === chart.id}
                    onClick={() => setActive(active === chart.id ? null : chart.id)}
                    onUpdate={(f, v) => updateChart(chart.id, f, v)}
                    onRemove={() => {
                      setCharts(prev => prev.filter(c => c.id !== chart.id))
                      if (active === chart.id) setActive(null)
                    }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 21, height: 21, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? C.purple : done ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? C.purple : done ? 'rgba(52,211,153,0.4)' : C.borderSubtle}`,
        color: active ? 'white' : done ? C.green : C.textSubtle, fontSize: 11, fontWeight: 700,
      }}>
        {done ? <CheckCircle2 size={12} /> : n}
      </div>
      <span style={{ color: active ? C.text : C.textSubtle, fontSize: 13, fontWeight: active ? 600 : 400 }}>{label}</span>
    </div>
  )
}

function ChartConfigCard({ chart, fields, active, onClick, onUpdate, onRemove }: {
  chart: CustomChart
  fields: string[]
  active: boolean
  onClick: () => void
  onUpdate: (field: keyof CustomChart, value: string) => void
  onRemove: () => void
}) {
  const btn = CHART_BUTTONS.find(b => b.type === chart.type)!
  return (
    <div onClick={onClick}
      style={{ background: active ? 'rgba(15,12,28,0.9)' : 'rgba(15,12,28,0.6)', border: `1px solid ${active ? 'rgba(139,92,246,0.35)' : C.border}`, borderRadius: 15, overflow: 'hidden', transition: 'all 0.22s', cursor: active ? 'default' : 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px', borderBottom: active ? `1px solid ${C.borderSubtle}` : 'none' }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
          {btn.icon}
        </div>
        <input value={chart.title} onChange={e => onUpdate('title', e.target.value)} onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, fontWeight: 600, cursor: 'text' }} />
        <button onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.red, flexShrink: 0 }}>
          <X size={13} />
        </button>
      </div>

      {active && (
        <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chart.type !== 'kpi' && (
              <FieldSelector label="Eixo X" value={chart.fieldX} options={fields} onChange={v => onUpdate('fieldX', v)} />
            )}
            <FieldSelector label={chart.type === 'kpi' ? 'Métrica' : 'Eixo Y'} value={chart.fieldY} options={fields} onChange={v => onUpdate('fieldY', v)} />
            <div style={{ background: 'rgba(139,92,246,0.06)', border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: '9px 12px' }}>
              <div style={{ color: C.textSubtle, fontSize: 11, marginBottom: 4 }}>Tipo de visualização</div>
              <div style={{ color: C.purpleLight, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                {btn.icon} {btn.label}
              </div>
            </div>
          </div>
          <div>
            <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pré-visualização</div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 11, padding: '10px 8px' }}>
              <CustomChartRender type={chart.type} height={130} label={chart.fieldY} />
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
        <select value={value} onChange={e => onChange(e.target.value)} onClick={e => e.stopPropagation()}
          style={{ width: '100%', padding: '8px 28px 8px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13, outline: 'none', cursor: 'pointer', appearance: 'none' }}>
          {options.map(o => <option key={o} value={o} style={{ background: '#0d0b1a' }}>{o}</option>)}
        </select>
        <ChevronDown size={13} color={C.textSubtle} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}
