import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Sparkles, Wand2 } from 'lucide-react'
import { C, CHART_COLORS } from './atlas-tokens'
import { Modal, ModalHeader } from './atlas-ui'
import {
  revenueData, marginData, expenseData, costPieData, weeklySales, conversionData,
  productSales, customerGrowth, retentionData, segmentsPie, channelLeads,
  campaignPerformance, conversionByChannel, type TemplateId,
} from './atlas-data'

const axis = { fill: C.textSubtle, fontSize: 11 }

const TooltipBox = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(13,10,24,0.97)', border: '1px solid rgba(139,92,246,0.28)', borderRadius: 9, padding: '9px 13px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
      {label && <p style={{ color: C.textSubtle, fontSize: 11, marginBottom: 5 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || C.text, fontSize: 13, fontWeight: 500 }}>
          {p.name ? `${p.name}: ` : ''}
          {typeof p.value === 'number' && p.value > 999 ? `R$ ${(p.value / 1000).toFixed(1)}K` : p.value}
        </p>
      ))}
    </div>
  )
}

// ── Cartão de gráfico ───────────────────────────────────────────────────────

export function ChartCard({ title, subtitle, children, reading }: {
  title: string; subtitle?: string; children: React.ReactNode; reading?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="chart-card" style={{ background: 'rgba(15,12,28,0.6)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, transition: 'border-color 0.25s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.22)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ color: C.textSubtle, fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
          </div>
          {reading && (
            <button className="translate-btn" onClick={() => setOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, color: C.purpleLight, cursor: 'pointer', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
              <Sparkles size={11} /> Traduzir
            </button>
          )}
        </div>
        {children}
      </div>

      {open && reading && (
        <Modal onClose={() => setOpen(false)} width={460}>
          <ModalHeader icon={<Wand2 size={17} />} title={title} description="Leitura do Atlas sobre este gráfico" onClose={() => setOpen(false)} />
          <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.75 }}>{reading}</p>
        </Modal>
      )}
    </>
  )
}

// ── Gráficos por tipo de painel ─────────────────────────────────────────────

export function TemplateCharts({ templateId }: { templateId: TemplateId }) {
  if (templateId === 'financeiro') return <FinanceCharts />
  if (templateId === 'comercial') return <SalesCharts />
  if (templateId === 'clientes') return <CustomerCharts />
  return <MarketingCharts />
}

const grid2 = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 14 } as const
const gridWide = { display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 14 } as const

function FinanceCharts() {
  return (
    <div style={gridWide}>
      <ChartCard title="Receita mensal" subtitle="Atual vs ano anterior"
        reading="A receita cresceu de forma consistente, com pico em novembro (R$ 85K) e crescimento acumulado de 17% sobre o ano anterior. Março foi o único mês abaixo do esperado, provavelmente por sazonalidade.">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={axis} />
            <YAxis tick={axis} tickFormatter={v => `R$${v / 1000}K`} />
            <Tooltip content={<TooltipBox />} />
            <Line type="monotone" dataKey="atual" name="Atual" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="ant" name="Anterior" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Distribuição de custos"
        reading="Os custos fixos representam 40% da estrutura, acima dos 35% praticados por empresas do mesmo porte. Reduzir três pontos liberaria cerca de R$ 2.400 por mês.">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={costPieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value">
              {costPieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Pie>
            <Tooltip content={<TooltipBox />} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Despesas por categoria"
        reading="Pessoal responde por 48% do total, uma proporção saudável. Marketing, em R$ 8K, está abaixo do ideal para o nível de receita atual.">
        <ResponsiveContainer width="100%" height={165}>
          <BarChart data={expenseData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={axis} tickFormatter={v => `R$${v / 1000}K`} />
            <YAxis type="category" dataKey="cat" tick={axis} width={58} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="v" name="Valor" fill="#a78bfa" radius={[0, 5, 5, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Margem por período"
        reading="A margem oscilou entre 37% e 47% no ano. Setembro foi o melhor mês e março concentrou a maior compressão, por custos sazonais.">
        <ResponsiveContainer width="100%" height={165}>
          <LineChart data={marginData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={axis} />
            <YAxis tick={axis} tickFormatter={v => `${v}%`} />
            <Tooltip content={<TooltipBox />} />
            <Line type="monotone" dataKey="v" name="Margem" stroke="#34d399" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function SalesCharts() {
  return (
    <div style={grid2}>
      <ChartCard title="Vendas por dia da semana"
        reading="Sexta e sábado concentram 46% das vendas da semana, enquanto domingo fica 65% abaixo da média — o comportamento de compra está muito concentrado no fim de semana.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklySales} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="d" tick={axis} />
            <YAxis tick={axis} tickFormatter={v => `R$${v / 1000}K`} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="v" name="Vendas" radius={[5, 5, 0, 0]}>
              {weeklySales.map((_, i) => <Cell key={i} fill={i >= 4 ? '#c084fc' : '#a78bfa'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Funil de conversão"
        reading="A conversão de lead para proposta (31%) está acima da média do setor. A perda está na etapa final: 35% contra um benchmark de 42%.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={conversionData} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={axis} />
            <YAxis type="category" dataKey="etapa" tick={axis} width={72} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="v" name="Total" radius={[0, 5, 5, 0]}>
              {conversionData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Mix de produtos"
        reading="O Produto A domina com 38% das vendas. A concentração nos dois principais produtos (65%) cria risco caso haja problema de fornecimento ou queda de demanda.">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={productSales} cx="50%" cy="50%" outerRadius={78} paddingAngle={4} dataKey="value">
              {productSales.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Pie>
            <Tooltip content={<TooltipBox />} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Metas do mês"
        reading="Três das quatro metas estão no caminho certo. A meta de novos clientes está em risco: 72% atingido a dez dias do fechamento.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 10 }}>
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
                <div className="bar-grow" style={{ height: '100%', width: `${g.pct}%`, background: g.color, borderRadius: 3 }} />
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
    <div style={gridWide}>
      <ChartCard title="Aquisição e churn"
        reading="A aquisição cresceu de forma consistente, mas o churn subiu em fevereiro e maio — nos dois casos houve alteração de preço no mesmo período.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={customerGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={axis} />
            <YAxis tick={axis} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="novos" name="Novos" fill="#a78bfa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="churn" name="Churn" fill="#f87171" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Segmentos da base"
        reading="20% da base está em risco de cancelamento. Cada cliente nessa faixa representa cerca de R$ 380 de valor potencial perdido.">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={segmentsPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
              {segmentsPie.map((_, i) => <Cell key={i} fill={[C.purpleLight, C.blueLight, C.orange][i]} />)}
            </Pie>
            <Tooltip content={<TooltipBox />} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Retenção por coorte"
        reading="As coortes de março e abril retêm melhor no primeiro mês, sinal de que as mudanças no onboarding funcionaram. A retenção em seis meses ainda está abaixo do benchmark de 60%.">
        <ResponsiveContainer width="100%" height={165}>
          <BarChart data={retentionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="coorte" tick={axis} />
            <YAxis tick={axis} tickFormatter={v => `${v}%`} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="m1" name="M1" fill="#a78bfa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="m3" name="M3" fill="#60a5fa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="m6" name="M6" fill="#34d399" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="NPS por canal de entrada"
        reading="Clientes que chegam por indicação têm NPS 28 pontos acima da média e também o menor custo de aquisição da base.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, paddingTop: 10 }}>
          {[
            { canal: 'Indicação', nps: 92, color: '#34d399' },
            { canal: 'Orgânico', nps: 78, color: '#a78bfa' },
            { canal: 'Mídia paga', nps: 61, color: '#60a5fa' },
            { canal: 'Evento', nps: 55, color: '#fb923c' },
          ].map(n => (
            <div key={n.canal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ color: C.textMuted, fontSize: 13 }}>{n.canal}</span>
                <span style={{ color: n.color, fontSize: 13, fontWeight: 600 }}>{n.nps}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div className="bar-grow" style={{ height: '100%', width: `${n.nps}%`, background: n.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

function MarketingCharts() {
  return (
    <div style={grid2}>
      <ChartCard title="Leads por canal"
        reading="O canal orgânico lidera em volume com o segundo menor custo por lead. A mídia paga gera volume relevante, mas ao custo mais alto da operação.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={channelLeads} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="canal" tick={axis} />
            <YAxis tick={axis} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="leads" name="Leads" radius={[5, 5, 0, 0]}>
              {channelLeads.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Investimento e retorno" subtitle="Em milhares de reais"
        reading="Setembro teve o melhor retorno do ano: R$ 16K investidos geraram R$ 58K. O aumento de investimento em outubro não trouxe retorno proporcional.">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={campaignPerformance} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={axis} />
            <YAxis tick={axis} tickFormatter={v => `R$${v}K`} />
            <Tooltip content={<TooltipBox />} />
            <Line type="monotone" dataKey="retorno" name="Retorno" stroke="#34d399" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="invest" name="Investimento" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Custo por lead por canal"
        reading="A indicação custa R$ 28 por lead, quase seis vezes menos que a mídia paga. Ainda assim, é o canal com menor volume da operação.">
        <ResponsiveContainer width="100%" height={175}>
          <BarChart data={channelLeads} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={axis} tickFormatter={v => `R$${v}`} />
            <YAxis type="category" dataKey="canal" tick={axis} width={78} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="cpl" name="Custo por lead" fill="#fb923c" radius={[0, 5, 5, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Taxa de conversão por canal"
        reading="Indicação e orgânico convertem muito acima da mídia paga. Migrar parte do orçamento para esses canais tende a reduzir o custo de aquisição.">
        <ResponsiveContainer width="100%" height={175}>
          <BarChart data={conversionByChannel} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="canal" tick={axis} />
            <YAxis tick={axis} tickFormatter={v => `${v}%`} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="taxa" name="Conversão" fill="#60a5fa" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

// ── Gráficos criados no Atlas ───────────────────────────────────────────────

const barMock = [{ n: 'Jan', v: 42 }, { n: 'Fev', v: 61 }, { n: 'Mar', v: 47 }, { n: 'Abr', v: 78 }, { n: 'Mai', v: 55 }, { n: 'Jun', v: 71 }]
const lineMock = [{ n: 'Jan', v: 35 }, { n: 'Fev', v: 52 }, { n: 'Mar', v: 44 }, { n: 'Abr', v: 68 }, { n: 'Mai', v: 61 }, { n: 'Jun', v: 74 }]
const pieMock = [{ name: 'Categoria A', value: 40 }, { name: 'Categoria B', value: 33 }, { name: 'Categoria C', value: 27 }]

export function CustomChartRender({ type, height = 200, label }: { type: string; height?: number; label?: string }) {
  if (type === 'kpi') {
    return (
      <div style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ color: C.text, fontSize: 38, fontWeight: 750, letterSpacing: '-0.035em' }}>R$ 82K</div>
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
          <Tooltip content={<TooltipBox />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
        </PieChart>
      </ResponsiveContainer>
    )
  }
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={lineMock} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="n" tick={axis} />
          <YAxis tick={axis} />
          <Tooltip content={<TooltipBox />} />
          <Line type="monotone" dataKey="v" name={label || 'Valor'} stroke="#a78bfa" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={barMock} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="n" tick={axis} />
        <YAxis tick={axis} />
        <Tooltip content={<TooltipBox />} />
        <Bar dataKey="v" name={label || 'Valor'} fill="#a78bfa" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
