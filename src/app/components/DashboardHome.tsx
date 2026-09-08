import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Sparkles, X, Wand2, AlertCircle, ArrowUpRight, ArrowDownRight, Plus, MoreHorizontal, RefreshCw, Trash2, ChevronDown } from 'lucide-react'
import { C, CHART_COLORS } from './atlas-tokens'

// ── Shared Types ─────────────────────────────────────────────────────────────

export interface SavedInsight {
  id: number
  title: string
  body: string
  suggestion: string | null
  priority: 'alta' | 'media' | 'baixa'
  category: string
  panel: string
  type: 'alert' | 'positive' | 'neutral'
  color: string
  icon: 'alert' | 'positive' | 'neutral'
  time: string
  createdAt: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const revenueData = [
  { m: 'Jan', atual: 45000, ant: 38000 }, { m: 'Fev', atual: 52000, ant: 42000 },
  { m: 'Mar', atual: 48000, ant: 44000 }, { m: 'Abr', atual: 61000, ant: 51000 },
  { m: 'Mai', atual: 58000, ant: 53000 }, { m: 'Jun', atual: 67000, ant: 55000 },
  { m: 'Jul', atual: 72000, ant: 58000 }, { m: 'Ago', atual: 69000, ant: 60000 },
  { m: 'Set', atual: 78000, ant: 62000 }, { m: 'Out', atual: 71000, ant: 65000 },
  { m: 'Nov', atual: 85000, ant: 70000 }, { m: 'Dez', atual: 82000, ant: 72000 },
]

const expenseData = [
  { cat: 'Pessoal', v: 28000 }, { cat: 'Operação', v: 14000 },
  { cat: 'Mktg', v: 8000 }, { cat: 'Infra', v: 5000 }, { cat: 'Outros', v: 3000 },
]

const costPieData = [
  { name: 'Custo Fixo', value: 40 }, { name: 'Custo Variável', value: 35 },
  { name: 'Investimento', value: 25 },
]

const weeklySales = [
  { d: 'Seg', v: 12000 }, { d: 'Ter', v: 9400 }, { d: 'Qua', v: 15800 },
  { d: 'Qui', v: 11200 }, { d: 'Sex', v: 18600 }, { d: 'Sáb', v: 22400 }, { d: 'Dom', v: 7800 },
]

const conversionData = [
  { etapa: 'Visitantes', v: 12400 }, { etapa: 'Leads', v: 3800 },
  { etapa: 'Propostas', v: 1200 }, { etapa: 'Fechados', v: 420 },
]

const productSales = [
  { name: 'Produto A', value: 38 }, { name: 'Produto B', value: 27 },
  { name: 'Produto C', value: 18 }, { name: 'Outros', value: 17 },
]

const customerGrowth = [
  { m: 'Jan', novos: 82, churn: 18 }, { m: 'Fev', novos: 95, churn: 22 },
  { m: 'Mar', novos: 78, churn: 15 }, { m: 'Abr', novos: 112, churn: 19 },
  { m: 'Mai', novos: 105, churn: 25 }, { m: 'Jun', novos: 128, churn: 21 },
  { m: 'Jul', novos: 144, churn: 18 }, { m: 'Ago', novos: 138, churn: 24 },
]

const retentionData = [
  { coorte: 'Jan', m1: 82, m3: 65, m6: 51 }, { coorte: 'Fev', m1: 79, m3: 62, m6: 48 },
  { coorte: 'Mar', m1: 85, m3: 70, m6: 55 }, { coorte: 'Abr', m1: 88, m3: 72, m6: 58 },
]

const segmentsPie = [
  { name: 'Recorrentes', value: 48 }, { name: 'Novos', value: 32 }, { name: 'Em Risco', value: 20 },
]

// ── Panel Config ────────────────────────────────────────────────────────────

const PANELS = [
  {
    id: 'financeiro', label: 'Painel Financeiro', source: 'Google Sheets · Sync 2 min atrás',
    kpis: [
      { label: 'Receita Total', value: 'R$ 82K', change: '+8,2%', up: true },
      { label: 'Margem Bruta', value: '42%', change: '+2,1pp', up: true },
      { label: 'Ticket Médio', value: 'R$ 187', change: '+3,5%', up: true },
      { label: 'LTV', value: 'R$ 1,2K', change: '-1,8%', up: false },
    ],
    insights: [
      { type: 'alert', text: 'Seu faturamento caiu 8% nas últimas 3 semanas comparado ao período anterior.', action: 'Revisar campanhas de retenção', color: C.orange },
      { type: 'positive', text: 'O Produto A apresentou crescimento de 24% acima da média histórica este mês.', action: 'Ampliar estoque e promoções do Produto A', color: C.green },
      { type: 'neutral', text: 'Seu ticket médio aumentou R$12 após o reajuste de preços em outubro.', action: null, color: C.blueLight },
      { type: 'alert', text: 'CAC aumentou 15% nos últimos 15 dias. Custo de aquisição acima do benchmark.', action: 'Otimizar funil de conversão', color: C.orange },
    ],
  },
  {
    id: 'comercial', label: 'Painel Comercial', source: 'HubSpot CRM · Sync 5 min atrás',
    kpis: [
      { label: 'Vendas do Mês', value: '342', change: '+12,4%', up: true },
      { label: 'Novos Clientes', value: '87', change: '+5,2%', up: true },
      { label: 'Taxa Conversão', value: '18%', change: '-2,0pp', up: false },
      { label: 'CAC', value: 'R$ 143', change: '+15,1%', up: false },
    ],
    insights: [
      { type: 'alert', text: 'Taxa de conversão caiu 2pp. Leads na etapa "Proposta" estagnados por +7 dias.', action: 'Ativar sequência de follow-up automático', color: C.orange },
      { type: 'positive', text: 'Novos clientes cresceram 5% MoM. Canal orgânico é o de maior performance.', action: null, color: C.green },
      { type: 'neutral', text: 'Produto B está com 3x mais propostas abertas que a média. Alta demanda identificada.', action: 'Priorizar vendas do Produto B', color: C.blueLight },
    ],
  },
  {
    id: 'clientes', label: 'Painel de Clientes', source: 'CRM + ERP · Sync 8 min atrás',
    kpis: [
      { label: 'Total Clientes', value: '1.247', change: '+3,1%', up: true },
      { label: 'Churn Rate', value: '4,2%', change: '-1,0pp', up: true },
      { label: 'NPS Score', value: '72', change: '+5 pts', up: true },
      { label: 'Retenção 90d', value: '78%', change: '-2,3pp', up: false },
    ],
    insights: [
      { type: 'positive', text: 'Churn caiu para 4,2% — melhor resultado em 6 meses. Iniciativas de CS estão funcionando.', action: null, color: C.green },
      { type: 'alert', text: 'Clientes estão recomprando menos este mês. Frequência de compra caiu 18%.', action: 'Lançar campanha de reativação', color: C.orange },
      { type: 'neutral', text: 'NPS atingiu 72 pontos. 34% dos promotores não foram convidados a indicar amigos.', action: 'Ativar programa de indicação', color: C.blueLight },
    ],
  },
]

// ── Components ──────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(13,10,24,0.97)', border: `1px solid rgba(139,92,246,0.3)`, borderRadius: 9, padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
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

const axisStyle = { fill: C.textSubtle, fontSize: 11 }

interface InsightModalProps {
  title: string
  insight: string
  suggestion: string | null
  onClose: () => void
}

function InsightModal({ title, insight, suggestion, onClose }: InsightModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,5,15,0.8)', backdropFilter: 'blur(8px)' }} />
      <div className="card-glass atlas-slide-in"
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 480, border: `1px solid rgba(139,92,246,0.28)`, borderRadius: 18, padding: '32px 28px', boxShadow: '0 0 60px rgba(139,92,246,0.2), 0 32px 80px rgba(0,0,0,0.6)', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 160, height: 2, background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.7), transparent)', borderRadius: 4 }} />
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, width: 28, height: 28, cursor: 'pointer', color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={14} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <div style={{ color: C.purpleNeon, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Insight do Atlas</div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{title}</div>
          </div>
        </div>
        <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.72, marginBottom: suggestion ? 20 : 0 }}>{insight}</p>
        {suggestion && (
          <div style={{ background: 'rgba(139,92,246,0.08)', border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10 }}>
            <Wand2 size={15} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ color: C.purpleNeon, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Sugestão do Atlas</div>
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{suggestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  insight?: string
  suggestion?: string | null
}

function ChartCard({ title, subtitle, children, insight, suggestion }: ChartCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <div className="chart-card" style={{ background: 'rgba(15,12,28,0.7)', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px', backdropFilter: 'blur(12px)', transition: 'border-color 0.25s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.25)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ color: C.textSubtle, fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {insight && (
              <button className="translate-btn" onClick={() => setModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, color: C.purpleLight, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                <Sparkles size={12} />
                Traduzir Insight
              </button>
            )}
            <button style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textSubtle }}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
        {children}
      </div>
      {modalOpen && insight && (
        <InsightModal title={title} insight={insight} suggestion={suggestion ?? null} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

interface DashboardHomeProps {
  onSaveInsight: (insight: SavedInsight) => void
}

export default function DashboardHome({ onSaveInsight }: DashboardHomeProps) {
  const [activePanel, setActivePanel] = useState(0)
  const panel = PANELS[activePanel]

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Panel tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
        {PANELS.map((p, i) => (
          <button key={p.id} onClick={() => setActivePanel(i)} style={{
            padding: '8px 16px', borderRadius: 9, border: `1px solid ${i === activePanel ? C.borderMd : C.borderSubtle}`,
            background: i === activePanel ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
            color: i === activePanel ? C.purpleLight : C.textMuted,
            cursor: 'pointer', fontSize: 13, fontWeight: i === activePanel ? 500 : 400,
            transition: 'all 0.2s',
          }}>
            {p.label}
          </button>
        ))}
        <button style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 9, border: `1px solid ${C.borderSubtle}`, background: 'none', color: C.textSubtle, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderMd; (e.currentTarget as HTMLButtonElement).style.color = C.text }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderSubtle; (e.currentTarget as HTMLButtonElement).style.color = C.textSubtle }}>
          <Plus size={14} /> Novo Painel
        </button>
      </div>

      {/* Panel header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{panel.label}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
            <span style={{ color: C.textSubtle, fontSize: 12 }}>{panel.source}</span>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'none', border: `1px solid ${C.borderSubtle}`, color: C.textSubtle, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderMd; (e.currentTarget as HTMLButtonElement).style.color = C.text }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderSubtle; (e.currentTarget as HTMLButtonElement).style.color = C.textSubtle }}>
          <RefreshCw size={13} /> Atualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {panel.kpis.map(k => (
          <div key={k.label} className="card-hover" style={{ background: 'rgba(15,12,28,0.75)', border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ color: C.textSubtle, fontSize: 12, marginBottom: 10 }}>{k.label}</div>
            <div style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {k.up ? <ArrowUpRight size={14} color={C.green} /> : <ArrowDownRight size={14} color={C.red} />}
              <span style={{ color: k.up ? C.green : C.red, fontSize: 13, fontWeight: 500 }}>{k.change}</span>
              <span style={{ color: C.textSubtle, fontSize: 12 }}>vs mês ant.</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {activePanel === 0 && <FinancialCharts />}
      {activePanel === 1 && <CommercialCharts />}
      {activePanel === 2 && <CustomerCharts />}

      {/* Overview Atlas */}
      <OverviewAtlas insights={panel.insights} panelId={panel.id} onSaveInsight={onSaveInsight} />
    </div>
  )
}

// ── Financial Charts ──────────────────────────────────────────────────────

function FinancialCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
      <ChartCard title="Receita Mensal" subtitle="Atual vs Ano Anterior"
        insight="A receita cresceu de forma consistente, com pico em novembro (R$85K). Comparando com o ano anterior, o crescimento acumulado é de 17%. Março foi o único mês abaixo da expectativa, possivelmente influenciado por sazonalidade."
        suggestion="Considere preparar estratégias antecipadas para reforçar março do próximo ano. Replique as ações de novembro e setembro que performaram acima da média.">
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
        insight="Custos fixos representam 40% da estrutura de custos, acima do benchmark de 35% para empresas similares. A redução de 3pp nos custos fixos liberaria cerca de R$2.400/mês para reinvestimento."
        suggestion="Analise contratos de serviços fixos que possam ser renegociados ou otimizados neste trimestre.">
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
        insight="Despesas com pessoal (R$28K) representam 48% do total — proporção saudável. Marketing em R$8K está abaixo do ideal para o nível de receita atual. Empresas com receita similar investem em média 12-15% da receita em marketing."
        suggestion="Considere aumentar o budget de marketing em R$2K mensais. O retorno histórico desta empresa é de R$4,2 por real investido em mídia.">
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
        insight="A margem bruta oscilou entre 38% e 46% ao longo do ano. O melhor período foi setembro, enquanto março apresentou compressão de margem provavelmente por custos sazonais."
        suggestion={null}>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={[
            { m: 'Jan', v: 38 }, { m: 'Fev', v: 41 }, { m: 'Mar', v: 37 }, { m: 'Abr', v: 43 },
            { m: 'Mai', v: 42 }, { m: 'Jun', v: 44 }, { m: 'Jul', v: 46 }, { m: 'Ago', v: 43 },
            { m: 'Set', v: 47 }, { m: 'Out', v: 42 }, { m: 'Nov', v: 45 }, { m: 'Dez', v: 43 },
          ]} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
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

// ── Commercial Charts ─────────────────────────────────────────────────────

function CommercialCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      <ChartCard title="Vendas por Dia da Semana"
        insight="Sexta e Sábado concentram 46% das vendas semanais. Domingo tem performance 65% abaixo da média. O comportamento de compra está fortemente concentrado no final de semana."
        suggestion="Crie promoções específicas para dias de baixa como Terça e Domingo para distribuir melhor o volume de vendas e reduzir pressão operacional no final de semana.">
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
        insight="A conversão de Lead para Proposta está em 31% — acima da média do setor (25%). Porém a conversão de Proposta para Fechamento está em 35%, abaixo do benchmark de 42%. Há oportunidade de melhoria na etapa final."
        suggestion="Analise as propostas abertas há mais de 7 dias e ative um follow-up automatizado. A queda na fase final indica objeções de preço ou prazo não resolvidas.">
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
        insight="Produto A domina com 38% das vendas. A concentração nos dois principais produtos (65%) cria risco de receita caso haja problema de fornecimento ou demanda."
        suggestion="Considere revisar a estratégia de portfólio. Produtos C e D têm potencial não explorado — uma campanha focada pode reduzir a dependência excessiva no Produto A.">
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
        insight="Das 4 metas comerciais, 3 estão no caminho certo. A meta de novos clientes está em risco — 72% atingido a 10 dias do fechamento.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          {[
            { label: 'Receita', pct: 87, target: 'R$95K', color: '#a78bfa' },
            { label: 'Novos clientes', pct: 72, target: '120', color: '#f87171' },
            { label: 'Vendas', pct: 94, target: '360', color: '#34d399' },
            { label: 'Conversão', pct: 82, target: '22%', color: '#60a5fa' },
          ].map(g => (
            <div key={g.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: C.textMuted, fontSize: 13 }}>{g.label}</span>
                <span style={{ color: g.pct >= 85 ? C.green : C.orange, fontSize: 13, fontWeight: 600 }}>{g.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${g.pct}%`, background: g.color, borderRadius: 3, transition: 'width 0.8s ease', boxShadow: `0 0 8px ${g.color}50` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

// ── Customer Charts ───────────────────────────────────────────────────────

function CustomerCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
      <ChartCard title="Aquisição e Churn Mensal"
        insight="A aquisição de novos clientes cresceu consistentemente, mas o churn aumentou em Fevereiro e Maio. Nesses meses, o churn coincidiu com alterações de preço — possível causa correlacionada."
        suggestion="Implemente entrevistas de saída para os próximos 30 churns e mapeie os principais motivos. Criar um programa de pausar ao invés de cancelar pode reduzir o churn involuntário em até 20%.">
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
        insight="20% dos clientes estão em risco de churn. Um cliente 'em risco' vale em média R$380 de LTV potencial perdido. O investimento em reativação pode ter ROI positivo de 3x."
        suggestion="Lance uma campanha de reativação focada nos 20% em risco com oferta especial ou contato proativo do CS.">
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
        insight="As coortes mais recentes (Mar e Abr) apresentam melhor retenção em M1, sugerindo que as melhorias no onboarding estão funcionando. A retenção em M6 ainda está abaixo de 60%, que é o benchmark do setor."
        suggestion="Aprofunde a análise das melhorias de onboarding de março. Identifique os comportamentos dos clientes que chegam a M6 e crie triggers de engajamento para os primeiros 90 dias.">
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
        insight="Clientes que chegam via indicação têm NPS 28 pontos acima da média geral. Esse canal também tem o menor CAC e maior LTV."
        suggestion={null}>
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
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${n.nps}%`, background: n.color, borderRadius: 3, boxShadow: `0 0 6px ${n.color}40` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

// ── Overview Atlas ────────────────────────────────────────────────────────

const typeConfig = {
  alert: { icon: <AlertCircle size={16} />, bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.25)', label: 'Atenção' },
  positive: { icon: <TrendingUp size={16} />, bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', label: 'Crescimento' },
  neutral: { icon: <Sparkles size={16} />, bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', label: 'Insight' },
}

const DEFAULT_CATEGORIES = ['Financeiro', 'Comercial', 'Clientes', 'Operacional', 'Estratégico']

interface OverviewAtlasProps {
  insights: typeof PANELS[0]['insights']
  panelId: string
  onSaveInsight: (insight: SavedInsight) => void
}

function OverviewAtlas({ insights, panelId, onSaveInsight }: OverviewAtlasProps) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [addModal, setAddModal] = useState<{ index: number; text: string; action: string | null } | null>(null)
  const [discardModal, setDiscardModal] = useState<number | null>(null)
  const [priority, setPriority] = useState<'alta' | 'media' | 'baixa'>('alta')
  const [category, setCategory] = useState('Financeiro')
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [newCatMode, setNewCatMode] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  const panelShort = panelId.charAt(0).toUpperCase() + panelId.slice(1)

  const openAddModal = (i: number) => {
    const ins = insights[i]
    setPriority('alta')
    setCategory(DEFAULT_CATEGORIES.includes(panelShort) ? panelShort : 'Financeiro')
    setNewCatMode(false)
    setNewCatName('')
    setAddModal({ index: i, text: ins.text, action: ins.action })
  }

  const handleSave = () => {
    if (!addModal) return
    const ins = insights[addModal.index]
    const finalCat = newCatMode ? newCatName.trim() : category
    if (newCatMode && finalCat && !customCategories.includes(finalCat)) {
      setCustomCategories(prev => [...prev, finalCat])
    }
    onSaveInsight({
      id: Date.now(),
      title: addModal.text.length > 60 ? addModal.text.slice(0, 60) + '…' : addModal.text,
      body: addModal.text,
      suggestion: addModal.action,
      priority,
      category: finalCat,
      panel: panelShort,
      type: ins.type as 'alert' | 'positive' | 'neutral',
      color: ins.color,
      icon: ins.type as 'alert' | 'positive' | 'neutral',
      time: 'Agora',
      createdAt: new Date().toISOString(),
    })
    setAddModal(null)
  }

  const handleDiscard = () => {
    if (discardModal === null) return
    setDismissed(prev => new Set([...prev, discardModal]))
    setDiscardModal(null)
  }

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories]

  return (
    <>
      <div style={{ marginTop: 8, background: 'rgba(15,12,28,0.6)', border: `1px solid rgba(139,92,246,0.18)`, borderRadius: 16, padding: '24px', backdropFilter: 'blur(12px)', boxShadow: '0 0 40px rgba(139,92,246,0.06)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <div style={{ color: C.purpleNeon, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Overview Atlas</div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>Análise automática deste painel</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, borderRadius: 6, padding: '4px 10px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} className="atlas-glow" />
            <span style={{ color: C.purpleLight, fontSize: 11, fontWeight: 500 }}>IA Ativa</span>
          </div>
        </div>

        {/* Insight cards */}
        {insights.every((_, i) => dismissed.has(i)) ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: C.textSubtle, fontSize: 14 }}>
            Todos os insights foram processados para este painel.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {insights.map((ins, i) => {
              if (dismissed.has(i)) return null
              const cfg = typeConfig[ins.type as keyof typeof typeConfig]
              return (
                <div key={i} className="insight-card" style={{ position: 'relative', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: '16px 18px' }}>
                  {/* Action buttons */}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 5, zIndex: 1 }}>
                    <button
                      title="Adicionar aos Insights"
                      onClick={e => { e.stopPropagation(); openAddModal(i) }}
                      style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.28)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.22)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.55)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.28)' }}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      title="Descartar Insight"
                      onClick={e => { e.stopPropagation(); setDiscardModal(i) }}
                      style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.red, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.22)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.5)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.25)' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingRight: 64 }}>
                    <span style={{ color: ins.color }}>{cfg.icon}</span>
                    <span style={{ color: ins.color, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cfg.label}</span>
                  </div>
                  <p style={{ color: C.text, fontSize: 14, lineHeight: 1.65, marginBottom: ins.action ? 12 : 0 }}>{ins.text}</p>
                  {ins.action && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, borderRadius: 8, padding: '8px 12px' }}>
                      <Wand2 size={13} color={C.purpleNeon} style={{ flexShrink: 0 }} />
                      <span style={{ color: C.textMuted, fontSize: 13 }}>{ins.action}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Add to Insights Modal ─────────────────────────────────────────── */}
      {addModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,5,15,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setAddModal(null)} />
          <div className="card-glass atlas-slide-in" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, border: `1px solid rgba(139,92,246,0.28)`, borderRadius: 18, padding: '28px', boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 120, height: 2, background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.7), transparent)', borderRadius: 4 }} />

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #34d399, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={18} color="white" />
              </div>
              <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Adicionar Insight à Central</div>
              <button onClick={() => setAddModal(null)} style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
                <X size={14} />
              </button>
            </div>

            {/* Insight preview */}
            <div style={{ background: 'rgba(139,92,246,0.06)', border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.65 }}>{addModal.text}</p>
            </div>

            {/* Prioridade */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Prioridade</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {([
                  ['alta', 'Alta', C.red, 'rgba(248,113,113'],
                  ['media', 'Média', C.orange, 'rgba(251,146,60'],
                  ['baixa', 'Baixa', C.blueLight, 'rgba(96,165,250'],
                ] as const).map(([val, label, color, rgb]) => (
                  <button key={val} onClick={() => setPriority(val)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${priority === val ? `${rgb},0.5)` : C.borderSubtle}`, background: priority === val ? `${rgb},0.12)` : 'rgba(255,255,255,0.02)', cursor: 'pointer', color: priority === val ? color : C.textMuted, fontSize: 13, fontWeight: priority === val ? 600 : 400, transition: 'all 0.18s' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Categoria</div>
              {!newCatMode ? (
                <div style={{ position: 'relative' }}>
                  <select
                    value={category}
                    onChange={e => {
                      if (e.target.value === '__new__') setNewCatMode(true)
                      else setCategory(e.target.value)
                    }}
                    style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: 'rgba(13,11,26,0.95)', color: C.text, fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                    {allCategories.map(c => (
                      <option key={c} value={c} style={{ background: '#0d0b1a' }}>{c}</option>
                    ))}
                    <option value="__new__" style={{ background: '#0d0b1a', color: C.purpleLight }}>+ Criar nova categoria</option>
                  </select>
                  <ChevronDown size={14} color={C.textSubtle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    autoFocus
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Nome da nova categoria..."
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 9, border: `1px solid ${C.borderMd}`, background: 'rgba(255,255,255,0.04)', color: C.text, fontSize: 13, outline: 'none' }}
                  />
                  <button onClick={() => { setNewCatMode(false); setNewCatName('') }}
                    style={{ padding: '10px 14px', borderRadius: 9, border: `1px solid ${C.borderSubtle}`, background: 'none', color: C.textMuted, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setAddModal(null)} className="atlas-btn-ghost"
                style={{ padding: '10px 20px', borderRadius: 9, color: C.textMuted, cursor: 'pointer', fontSize: 14 }}>
                Cancelar
              </button>
              <button onClick={handleSave}
                disabled={newCatMode && !newCatName.trim()}
                className="atlas-btn-primary"
                style={{ padding: '10px 22px', borderRadius: 9, color: 'white', border: 'none', fontSize: 14, fontWeight: 500, cursor: (newCatMode && !newCatName.trim()) ? 'not-allowed' : 'pointer', opacity: (newCatMode && !newCatName.trim()) ? 0.45 : 1 }}>
                Salvar Insight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Discard Confirmation Modal ────────────────────────────────────── */}
      {discardModal !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,5,15,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setDiscardModal(null)} />
          <div className="card-glass atlas-slide-in" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380, border: `1px solid rgba(248,113,113,0.2)`, borderRadius: 16, padding: '28px', boxShadow: '0 0 40px rgba(248,113,113,0.1), 0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Trash2 size={21} color={C.red} />
              </div>
              <div style={{ color: C.text, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Descartar este insight?</div>
              <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.65 }}>O insight será removido do Overview Atlas. Esta ação não pode ser desfeita.</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDiscardModal(null)} className="atlas-btn-ghost"
                style={{ flex: 1, padding: '10px', borderRadius: 9, color: C.textMuted, cursor: 'pointer', fontSize: 14 }}>
                Cancelar
              </button>
              <button onClick={handleDiscard}
                style={{ flex: 1, padding: '10px', borderRadius: 9, background: 'rgba(248,113,113,0.14)', border: '1px solid rgba(248,113,113,0.3)', color: C.red, cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.26)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.14)' }}>
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
