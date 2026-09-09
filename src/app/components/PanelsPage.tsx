import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Sparkles, X, Wand2, ArrowUpRight, ArrowDownRight, Plus, MoreHorizontal,
  RefreshCw, Trash2, Check,
} from 'lucide-react'
import { C, CHART_COLORS } from './atlas-tokens'
import { Reveal, Sparkline, Pill, TYPE_META } from './atlas-ui'
import { TriageModal, useDiscard } from './InsightTriage'
import { useAtlas } from '../store'
import {
  PANELS, revenueData, marginData, expenseData, costPieData, weeklySales,
  conversionData, productSales, customerGrowth, retentionData, segmentsPie,
  type Insight,
} from './atlas-data'

const axisStyle = { fill: C.textSubtle, fontSize: 11 }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(13,10,24,0.97)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 9, padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      {label && <p style={{ color: C.textSubtle, fontSize: 11, marginBottom: 6 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || C.text, fontSize: 13, fontWeight: 500 }}>
          {p.name ? `${p.name}: ` : ''}
          {typeof p.value === 'number' && p.value > 999 ? `R$ ${(p.value / 1000).toFixed(1)}K` : p.value}
        </p>
      ))}
    </div>
  )
}

// ── Modal de tradução do gráfico ────────────────────────────────────────────

function TranslationModal({ title, reading, suggestion, onClose }: {
  title: string; reading: string; suggestion: string | null; onClose: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,5,15,0.82)', backdropFilter: 'blur(8px)' }} />
      <div className="card-glass atlas-slide-in" onClick={e => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 480, border: '1px solid rgba(139,92,246,0.28)', borderRadius: 18, padding: '30px 28px', boxShadow: '0 0 60px rgba(139,92,246,0.18), 0 32px 80px rgba(0,0,0,0.6)', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 160, height: 2, background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.7), transparent)', borderRadius: 4 }} />
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, width: 28, height: 28, cursor: 'pointer', color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={14} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={17} color="white" />
          </div>
          <div>
            <div style={{ color: C.purpleNeon, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Leitura do Atlas</div>
            <div style={{ color: C.text, fontSize: 14.5, fontWeight: 600 }}>{title}</div>
          </div>
        </div>
        <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.75, marginBottom: suggestion ? 18 : 0 }}>{reading}</p>
        {suggestion && (
          <div style={{ background: 'rgba(139,92,246,0.08)', border: `1px solid ${C.borderMd}`, borderRadius: 11, padding: '13px 16px', display: 'flex', gap: 10 }}>
            <Wand2 size={15} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ color: C.purpleNeon, fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>O que fazer com isso</div>
              <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.65 }}>{suggestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children, reading, suggestion }: {
  title: string; subtitle?: string; children: React.ReactNode; reading?: string; suggestion?: string | null
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="chart-card" style={{ background: 'rgba(15,12,28,0.7)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)', transition: 'border-color 0.25s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.25)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 10 }}>
          <div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 650 }}>{title}</div>
            {subtitle && <div style={{ color: C.textSubtle, fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {reading && (
              <button className="translate-btn" onClick={() => setOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, color: C.purpleLight, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                <Sparkles size={12} /> Traduzir com IA
              </button>
            )}
            <button style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textSubtle }}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
        {children}
      </div>
      {open && reading && <TranslationModal title={title} reading={reading} suggestion={suggestion ?? null} onClose={() => setOpen(false)} />}
    </>
  )
}

// ── Página ──────────────────────────────────────────────────────────────────

export default function PanelsPage() {
  const { activePanel, setActivePanel, go, customPanels, insights } = useAtlas()
  const [triage, setTriage] = useState<Insight | null>(null)

  const custom = customPanels.find(p => p.id === activePanel)
  const panel = PANELS.find(p => p.id === activePanel) ?? PANELS[0]
  const current = custom ?? panel

  return (
    <div className="atlas-page" style={{ padding: '24px 30px 40px', maxWidth: 1340, margin: '0 auto' }}>
      {/* Abas */}
      <Reveal>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22, alignItems: 'center', flexWrap: 'wrap' }}>
          {[...PANELS, ...customPanels].map(p => {
            const active = p.id === current.id
            return (
              <button key={p.id} onClick={() => setActivePanel(p.id)}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: `1px solid ${active ? C.borderMd : C.borderSubtle}`,
                  background: active ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
                  color: active ? C.purpleLight : C.textMuted, cursor: 'pointer', fontSize: 13,
                  fontWeight: active ? 600 : 400, transition: 'all 0.2s',
                }}>
                {p.label}
              </button>
            )
          })}
          <button onClick={() => go('builder')} className="atlas-ghost"
            style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: 10, border: `1px solid ${C.borderSubtle}`, background: 'rgba(255,255,255,0.02)', color: C.textMuted, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Novo painel
          </button>
        </div>
      </Reveal>

      {/* Cabeçalho do painel */}
      <Reveal delay={40}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 5 }}>{current.label}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
              <span style={{ color: C.textSubtle, fontSize: 12.5 }}>
                {custom ? `${custom.source} · publicado agora` : `${panel.source} · sincronizado ${panel.sync}`}
              </span>
            </div>
          </div>
          <button className="atlas-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, cursor: 'pointer', fontSize: 13 }}>
            <RefreshCw size={13} /> Atualizar dados
          </button>
        </div>
      </Reveal>

      {custom ? (
        <CustomPanelView charts={custom.charts} />
      ) : (
        <>
          {/* KPIs */}
          <Reveal delay={80}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))', gap: 14, marginBottom: 20 }}>
              {panel.kpis.map(k => (
                <div key={k.label} className="card-hover" style={{ background: 'rgba(15,12,28,0.75)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '17px 19px', backdropFilter: 'blur(12px)' }}>
                  <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 9 }}>{k.label}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ color: C.text, fontSize: 24, fontWeight: 750, letterSpacing: '-0.025em' }}>{k.value}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7 }}>
                        {k.up ? <ArrowUpRight size={13} color={C.green} /> : <ArrowDownRight size={13} color={C.red} />}
                        <span style={{ color: k.up ? C.green : C.red, fontSize: 12.5, fontWeight: 600 }}>{k.change}</span>
                        <span style={{ color: C.textSubtle, fontSize: 11.5 }}>vs mês ant.</span>
                      </div>
                    </div>
                    <Sparkline values={k.spark} color={k.up ? C.green : C.orange} width={66} height={34} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            {panel.id === 'financeiro' && <FinancialCharts />}
            {panel.id === 'comercial' && <CommercialCharts />}
            {panel.id === 'clientes' && <CustomerCharts />}
          </Reveal>
        </>
      )}

      {/* Overview Atlas */}
      <Reveal delay={160}>
        <OverviewAtlas panelId={current.id} onTriage={setTriage} insights={insights} />
      </Reveal>

      {triage && <TriageModal insight={triage} onClose={() => setTriage(null)} />}
    </div>
  )
}

// ── Painel criado pelo usuário ──────────────────────────────────────────────

const barMock = [{ n: 'Jan', v: 42 }, { n: 'Fev', v: 61 }, { n: 'Mar', v: 47 }, { n: 'Abr', v: 78 }, { n: 'Mai', v: 55 }, { n: 'Jun', v: 71 }]
const lineMock = [{ n: 'Jan', v: 35 }, { n: 'Fev', v: 52 }, { n: 'Mar', v: 44 }, { n: 'Abr', v: 68 }, { n: 'Mai', v: 61 }, { n: 'Jun', v: 74 }]
const pieMock = [{ name: 'Categoria A', value: 40 }, { name: 'Categoria B', value: 33 }, { name: 'Categoria C', value: 27 }]

export function CustomChartRender({ type, height = 200, label }: { type: string; height?: number; label?: string }) {
  if (type === 'kpi') {
    return (
      <div style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ color: C.text, fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>R$ 82K</div>
        <div style={{ color: C.green, fontSize: 13, fontWeight: 600 }}>+8,2% vs mês anterior</div>
        {label && <div style={{ color: C.textSubtle, fontSize: 12 }}>{label}</div>}
      </div>
    )
  }
  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={pieMock} cx="50%" cy="50%" innerRadius={height * 0.2} outerRadius={height * 0.34} dataKey="value" paddingAngle={4}>
            {pieMock.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
        </PieChart>
      </ResponsiveContainer>
    )
  }
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={lineMock} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="n" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="v" name={label || 'Valor'} stroke="#a78bfa" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={barMock} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="n" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="v" name={label || 'Valor'} fill="#a78bfa" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomPanelView({ charts }: { charts: { id: string; type: string; title: string; fieldY: string }[] }) {
  if (charts.length === 0) {
    return (
      <div style={{ border: '2px dashed rgba(139,92,246,0.2)', borderRadius: 16, padding: '48px 28px', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ color: C.textMuted, fontSize: 15 }}>Este painel ainda não tem gráficos.</div>
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
      {charts.map(ch => (
        <ChartCard key={ch.id} title={ch.title} subtitle={ch.fieldY}>
          <CustomChartRender type={ch.type} label={ch.fieldY} />
        </ChartCard>
      ))}
    </div>
  )
}

// ── Gráficos por painel ─────────────────────────────────────────────────────

function FinancialCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
      <ChartCard title="Receita Mensal" subtitle="Atual vs ano anterior"
        reading="A receita cresceu de forma consistente, com pico em novembro (R$ 85K). Comparando com o ano anterior, o crescimento acumulado é de 17%. Março foi o único mês abaixo da expectativa, possivelmente por sazonalidade."
        suggestion="Prepare ações antecipadas para reforçar março do próximo ano e replique o que foi feito em setembro e novembro.">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={axisStyle} />
            <YAxis tick={axisStyle} tickFormatter={v => `R$${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="atual" name="Atual" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="ant" name="Anterior" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Distribuição de Custos"
        reading="Custos fixos representam 40% da estrutura, acima do benchmark de 35% para empresas do mesmo porte. Reduzir 3pp liberaria cerca de R$ 2.400 por mês para reinvestimento."
        suggestion="Revise contratos de serviços fixos que possam ser renegociados neste trimestre.">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={costPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
              {costPieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Despesas por Categoria"
        reading="Pessoal (R$ 28K) representa 48% do total, uma proporção saudável. Marketing, em R$ 8K, está abaixo do ideal para o nível de receita atual — empresas semelhantes investem de 12% a 15% da receita."
        suggestion="Considere aumentar o orçamento de marketing em R$ 2K mensais. O retorno histórico desta operação é de R$ 4,20 por real investido.">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={expenseData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={axisStyle} tickFormatter={v => `R$${v / 1000}K`} />
            <YAxis type="category" dataKey="cat" tick={axisStyle} width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="v" name="Valor" fill="#a78bfa" radius={[0, 5, 5, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Margem por Período"
        reading="A margem bruta oscilou entre 37% e 47% ao longo do ano. Setembro foi o melhor mês e março apresentou compressão, provavelmente por custos sazonais."
        suggestion={null}>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={marginData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={axisStyle} />
            <YAxis tick={axisStyle} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="v" name="Margem" stroke="#34d399" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function CommercialCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
      <ChartCard title="Vendas por Dia da Semana"
        reading="Sexta e sábado concentram 46% das vendas da semana. Domingo fica 65% abaixo da média — o comportamento de compra está fortemente concentrado no fim de semana."
        suggestion="Crie promoções para terça e domingo para distribuir melhor o volume e reduzir a pressão operacional no fim de semana.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklySales} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="d" tick={axisStyle} />
            <YAxis tick={axisStyle} tickFormatter={v => `R$${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="v" name="Vendas" fill="#a78bfa" radius={[5, 5, 0, 0]}>
              {weeklySales.map((_, i) => <Cell key={i} fill={i >= 4 ? '#c084fc' : '#a78bfa'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Funil de Conversão"
        reading="A conversão de lead para proposta está em 31%, acima da média do setor (25%). Já a conversão de proposta para fechamento está em 35%, abaixo do benchmark de 42% — a perda está na etapa final."
        suggestion="Analise as propostas abertas há mais de 7 dias e ative um follow-up automatizado. A queda na fase final costuma indicar objeções de preço ou prazo não resolvidas.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={conversionData} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={axisStyle} />
            <YAxis type="category" dataKey="etapa" tick={axisStyle} width={70} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="v" name="Total" fill="#60a5fa" radius={[0, 5, 5, 0]}>
              {conversionData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Mix de Produtos"
        reading="O Produto A domina com 38% das vendas. A concentração nos dois principais produtos (65%) cria risco de receita caso haja problema de fornecimento ou queda de demanda."
        suggestion="Revise a estratégia de portfólio: os produtos C e D têm potencial não explorado e podem reduzir a dependência do Produto A.">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={productSales} cx="50%" cy="50%" outerRadius={80} paddingAngle={4} dataKey="value">
              {productSales.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Metas do Mês"
        reading="Das 4 metas comerciais, 3 estão no caminho certo. A meta de novos clientes está em risco: 72% atingido a 10 dias do fechamento."
        suggestion="Concentre o esforço da equipe em novos clientes nesta reta final e reative leads que ficaram sem resposta no mês.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          {[
            { label: 'Receita', pct: 87, color: '#a78bfa' },
            { label: 'Novos clientes', pct: 72, color: '#f87171' },
            { label: 'Vendas', pct: 94, color: '#34d399' },
            { label: 'Conversão', pct: 82, color: '#60a5fa' },
          ].map(g => (
            <div key={g.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: C.textMuted, fontSize: 13 }}>{g.label}</span>
                <span style={{ color: g.pct >= 85 ? C.green : C.orange, fontSize: 13, fontWeight: 600 }}>{g.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div className="bar-grow" style={{ height: '100%', width: `${g.pct}%`, background: g.color, borderRadius: 3, boxShadow: `0 0 8px ${g.color}50` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

function CustomerCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
      <ChartCard title="Aquisição e Churn Mensal"
        reading="A aquisição de novos clientes cresceu de forma consistente, mas o churn subiu em fevereiro e maio. Nos dois casos houve alteração de preço no mesmo período — uma causa provável e correlacionada."
        suggestion="Faça entrevistas de saída com os próximos 30 cancelamentos. Oferecer pausa em vez de cancelamento pode reduzir o churn involuntário em até 20%.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={customerGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="novos" name="Novos" fill="#a78bfa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="churn" name="Churn" fill="#f87171" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Segmentos de Clientes"
        reading="20% da base está em risco de churn. Cada cliente nessa faixa representa cerca de R$ 380 de LTV potencial perdido, o que dá margem para investir em reativação com retorno positivo."
        suggestion="Lance uma campanha de reativação focada nesses 20%, com oferta especial ou contato proativo do time de atendimento.">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={segmentsPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
              {segmentsPie.map((_, i) => <Cell key={i} fill={[C.purpleLight, C.blueLight, C.orange][i]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Retenção por Coorte"
        reading="As coortes de março e abril têm melhor retenção no primeiro mês, o que sugere que as melhorias no onboarding funcionaram. A retenção em M6 ainda está abaixo dos 60% do benchmark."
        suggestion="Identifique o comportamento dos clientes que chegam ao sexto mês e crie ações de engajamento para os primeiros 90 dias.">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={retentionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="coorte" tick={axisStyle} />
            <YAxis tick={axisStyle} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="m1" name="M1" fill="#a78bfa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="m3" name="M3" fill="#60a5fa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="m6" name="M6" fill="#34d399" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="NPS por Canal"
        reading="Clientes que chegam por indicação têm NPS 28 pontos acima da média geral. Esse canal também tem o menor custo de aquisição e o maior LTV da base."
        suggestion="Peça indicações de forma estruturada aos promotores: hoje 34% deles nunca foram convidados a indicar.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
          {[
            { canal: 'Indicação', nps: 92, color: '#34d399' },
            { canal: 'Orgânico', nps: 78, color: '#a78bfa' },
            { canal: 'Pago', nps: 61, color: '#60a5fa' },
            { canal: 'Evento', nps: 55, color: '#fb923c' },
          ].map(n => (
            <div key={n.canal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ color: C.textMuted, fontSize: 13 }}>{n.canal}</span>
                <span style={{ color: n.color, fontSize: 13, fontWeight: 600 }}>{n.nps}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div className="bar-grow" style={{ height: '100%', width: `${n.nps}%`, background: n.color, borderRadius: 3, boxShadow: `0 0 6px ${n.color}40` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

// ── Overview Atlas: leitura automática do painel ────────────────────────────

function OverviewAtlas({ panelId, insights, onTriage }: {
  panelId: string; insights: Insight[]; onTriage: (i: Insight) => void
}) {
  const { go } = useAtlas()
  const discard = useDiscard()
  const novos = insights.filter(i => i.panelId === panelId && i.status === 'novo')
  const tratados = insights.filter(i => i.panelId === panelId && (i.status === 'priorizado' || i.status === 'andamento' || i.status === 'concluido'))

  return (
    <div style={{ marginTop: 10, background: 'rgba(15,12,28,0.6)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: 18, padding: 24, backdropFilter: 'blur(12px)', boxShadow: '0 0 40px rgba(139,92,246,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="atlas-pulse" style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <div style={{ color: C.purpleNeon, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Leitura do Atlas</div>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 650 }}>O que este painel está dizendo</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {tratados.length > 0 && <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<Check size={11} />}>{tratados.length} no plano de ação</Pill>}
          <button onClick={() => go('insights', { insightStatus: 'novo' })} style={{ background: 'none', border: 'none', color: C.purpleLight, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            Central de Insights
          </button>
        </div>
      </div>

      {novos.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: '26px 0' }}>
          {tratados.length === 0 ? (
            <>
              <div className="atlas-glow" style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight }}>
                <Sparkles size={16} />
              </div>
              <div style={{ color: C.textMuted, fontSize: 14, textAlign: 'center' }}>
                A Atlas IA está lendo os dados deste painel.
                <br />
                <span style={{ color: C.textSubtle, fontSize: 13 }}>Os primeiros insights aparecem aqui assim que houver um padrão relevante.</span>
              </div>
            </>
          ) : (
            <>
              <Check size={20} color={C.green} />
              <div style={{ color: C.textMuted, fontSize: 14 }}>Todos os insights deste painel já foram avaliados.</div>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {novos.map(ins => {
            const meta = TYPE_META[ins.type]
            return (
              <div key={ins.id} className="insight-card" style={{ position: 'relative', background: meta.soft, border: `1px solid ${meta.border}`, borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ position: 'absolute', top: 13, right: 13, display: 'flex', gap: 5 }}>
                  <button title="Adicionar ao plano de ação" onClick={() => onTriage(ins)}
                    style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.28)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.22)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)' }}>
                    <Plus size={12} />
                  </button>
                  <button title="Descartar" onClick={() => discard(ins)}
                    style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.red, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.22)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, paddingRight: 64 }}>
                  <span style={{ color: meta.color }}>{meta.icon}</span>
                  <span style={{ color: meta.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{meta.label}</span>
                  <Pill color={C.textMuted}>{ins.impact}</Pill>
                </div>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.45 }}>{ins.title}</div>
                <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.65, marginBottom: ins.suggestion ? 12 : 0 }}>{ins.body}</p>
                {ins.suggestion && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, borderRadius: 9, padding: '9px 12px' }}>
                    <Wand2 size={13} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.55 }}>{ins.suggestion}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
