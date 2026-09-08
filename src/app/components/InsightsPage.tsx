import { useState } from 'react'
import { TrendingUp, AlertCircle, Sparkles, Wand2, Filter, ChevronDown, BookmarkCheck } from 'lucide-react'
import { C } from './atlas-tokens'
import type { SavedInsight } from './DashboardHome'

const ALL_INSIGHTS = [
  {
    id: 1, panel: 'Financeiro', priority: 'alta', type: 'alert',
    title: 'Faturamento caiu 8% nas últimas semanas',
    body: 'Seu faturamento apresentou queda acumulada de 8% nas últimas 3 semanas comparado ao mesmo período do mês anterior. O maior impacto está nos produtos B e C, que tiveram redução de 15% e 12% respectivamente.',
    suggestion: 'Considere revisar campanhas dos produtos B e C. Uma promoção relâmpago de 3 dias pode reativar a demanda rapidamente.',
    time: 'Agora', color: C.orange, icon: 'alert',
  },
  {
    id: 2, panel: 'Comercial', priority: 'alta', type: 'alert',
    title: 'CAC aumentou 15% nos últimos 15 dias',
    body: 'O Custo de Aquisição de Clientes subiu de R$124 para R$143 nos últimos 15 dias. O canal de anúncios pagos é o principal responsável pelo aumento, com CPC 22% acima da média histórica.',
    suggestion: 'Pause os grupos de anúncio com CPC acima de R$3,50 e redistribua o budget para os conjuntos com melhor desempenho.',
    time: '15 min', color: C.orange, icon: 'alert',
  },
  {
    id: 3, panel: 'Financeiro', priority: 'media', type: 'positive',
    title: 'Produto A com crescimento acima da média',
    body: 'O Produto A apresentou crescimento de 24% neste mês — 3x acima da média histórica de 8%. A análise sugere que o reposicionamento de preço e a campanha de setembro foram os principais drivers.',
    suggestion: 'Amplie o estoque do Produto A e replique a campanha de setembro nos próximos 30 dias.',
    time: '1h', color: C.green, icon: 'positive',
  },
  {
    id: 4, panel: 'Clientes', priority: 'alta', type: 'alert',
    title: 'Clientes estão recomprando menos este mês',
    body: 'A frequência de recompra caiu 18% este mês. O segmento mais afetado é o de clientes com mais de 6 meses de relacionamento — justamente os mais valiosos em termos de LTV.',
    suggestion: 'Lance uma campanha de reativação com oferta exclusiva para clientes recorrentes inativos há mais de 30 dias.',
    time: '2h', color: C.orange, icon: 'alert',
  },
  {
    id: 5, panel: 'Financeiro', priority: 'baixa', type: 'neutral',
    title: 'Ticket médio aumentou após reajuste de preço',
    body: 'O ticket médio subiu de R$175 para R$187 (+6,8%) após o reajuste de outubro, sem impacto negativo significativo no volume de vendas. A elasticidade de preço está dentro do esperado.',
    suggestion: null,
    time: '3h', color: C.blueLight, icon: 'neutral',
  },
  {
    id: 6, panel: 'Clientes', priority: 'media', type: 'positive',
    title: 'Churn caiu para menor índice em 6 meses',
    body: 'O churn chegou a 4,2% — o menor índice dos últimos 6 meses. As iniciativas de Customer Success implementadas em agosto têm correlação positiva com essa melhora.',
    suggestion: 'Documente as práticas de CS e escale para toda a base de clientes, não apenas para os de maior valor.',
    time: '5h', color: C.green, icon: 'positive',
  },
  {
    id: 7, panel: 'Comercial', priority: 'media', type: 'neutral',
    title: 'Taxa de conversão de propostas abaixo do benchmark',
    body: 'A conversão de Proposta para Fechamento está em 35%, abaixo do benchmark do setor de 42%. Há 28 propostas abertas há mais de 7 dias sem contato registrado.',
    suggestion: 'Ative uma sequência de follow-up automático de 3 toques para propostas abertas sem contato há mais de 5 dias.',
    time: '8h', color: C.blueLight, icon: 'neutral',
  },
  {
    id: 8, panel: 'Financeiro', priority: 'baixa', type: 'positive',
    title: 'Margem bruta estável e saudável',
    body: 'A margem bruta de 42% se manteve estável nos últimos 3 meses, indicando boa gestão de custos operacionais. O benchmark do setor é 38%, portanto a empresa está 4pp acima.',
    suggestion: null,
    time: '12h', color: C.green, icon: 'positive',
  },
]

const iconMap = {
  alert: (color: string) => <AlertCircle size={18} color={color} />,
  positive: (color: string) => <TrendingUp size={18} color={color} />,
  neutral: (color: string) => <Sparkles size={18} color={color} />,
}

const priorityStyle = {
  alta: { bg: 'rgba(248,113,113,0.12)', color: '#f87171', text: 'Alta' },
  media: { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', text: 'Média' },
  baixa: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa', text: 'Baixa' },
}

interface InsightsPageProps {
  extraInsights?: SavedInsight[]
}

export default function InsightsPage({ extraInsights = [] }: InsightsPageProps) {
  const [filter, setFilter] = useState<'todos' | 'alta' | 'media' | 'baixa'>('todos')
  const [panelFilter, setPanelFilter] = useState<string>('todos')
  const [expanded, setExpanded] = useState<number | null>(null)

  const allInsights = [
    ...extraInsights.map(ins => ({ ...ins, isSaved: true as const, category: ins.category })),
    ...ALL_INSIGHTS.map(ins => ({ ...ins, isSaved: false as const, category: undefined as string | undefined, createdAt: '' })),
  ]

  const filtered = allInsights.filter(ins => {
    const matchPriority = filter === 'todos' || ins.priority === filter
    const matchPanel = panelFilter === 'todos' || ins.panel === panelFilter
    return matchPriority && matchPanel
  })

  const alta = allInsights.filter(i => i.priority === 'alta').length

  return (
    <div style={{ padding: '28px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>Insights</h1>
          <div style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 6, padding: '3px 10px', color: C.red, fontSize: 12, fontWeight: 600 }}>
            {alta} urgentes
          </div>
        </div>
        <p style={{ color: C.textMuted, fontSize: 14 }}>A IA monitorou todos os seus dados e identificou {allInsights.length} insights relevantes para o seu negócio.</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Insights Hoje', val: `${allInsights.length}`, sub: extraInsights.length > 0 ? `${extraInsights.length} adicionado${extraInsights.length > 1 ? 's' : ''} por você` : '3 novos desde ontem', color: C.purpleLight },
          { label: 'Urgentes', val: `${alta}`, sub: 'Requerem ação', color: C.red },
          { label: 'Oportunidades', val: `${allInsights.filter(i => i.type === 'positive').length}`, sub: 'Potencial de crescimento', color: C.green },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(15,12,28,0.7)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ color: C.textSubtle, fontSize: 12, marginBottom: 8 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{s.val}</div>
            <div style={{ color: C.textSubtle, fontSize: 12 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3, border: `1px solid ${C.borderSubtle}` }}>
          {(['todos', 'alta', 'media', 'baixa'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: filter === f ? 'rgba(139,92,246,0.2)' : 'transparent', color: filter === f ? C.purpleLight : C.textMuted, cursor: 'pointer', fontSize: 13, fontWeight: filter === f ? 500 : 400, transition: 'all 0.18s' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3, border: `1px solid ${C.borderSubtle}` }}>
          {(['todos', 'Financeiro', 'Comercial', 'Clientes'] as const).map(p => (
            <button key={p} onClick={() => setPanelFilter(p)} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: panelFilter === p ? 'rgba(139,92,246,0.2)' : 'transparent', color: panelFilter === p ? C.purpleLight : C.textMuted, cursor: 'pointer', fontSize: 13, fontWeight: panelFilter === p ? 500 : 400, transition: 'all 0.18s' }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, fontSize: 13, cursor: 'pointer' }}>
          <Filter size={13} /> Filtros
        </div>
      </div>

      {/* Insights list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.textSubtle, fontSize: 14 }}>
            Nenhum insight encontrado com os filtros selecionados.
          </div>
        )}
        {filtered.map((ins) => {
          const pStyle = priorityStyle[ins.priority as keyof typeof priorityStyle]
          const isExpanded = expanded === ins.id
          return (
            <div key={ins.id} className="insight-card" onClick={() => setExpanded(isExpanded ? null : ins.id)}
              style={{ background: ins.isSaved ? 'rgba(52,211,153,0.03)' : 'rgba(15,12,28,0.7)', border: `1px solid ${ins.isSaved ? 'rgba(52,211,153,0.16)' : C.border}`, borderRadius: 14, padding: '18px 20px', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.22s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${ins.color}18`, border: `1px solid ${ins.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {iconMap[ins.icon as keyof typeof iconMap](ins.color)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{ins.title}</span>
                    <span style={{ background: pStyle.bg, color: pStyle.color, borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{pStyle.text}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: C.textSubtle, borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>{ins.panel}</span>
                    {ins.isSaved && ins.category && (
                      <span style={{ background: 'rgba(139,92,246,0.12)', color: C.purpleLight, borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 500 }}>{ins.category}</span>
                    )}
                    {ins.isSaved && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(52,211,153,0.1)', color: C.green, borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 500 }}>
                        <BookmarkCheck size={10} /> Salvo
                      </span>
                    )}
                  </div>
                  <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, overflow: isExpanded ? 'visible' : 'hidden', display: isExpanded ? 'block' : '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {ins.body}
                  </p>
                  {isExpanded && ins.suggestion && (
                    <div style={{ marginTop: 12, background: 'rgba(139,92,246,0.08)', border: `1px solid ${C.borderMd}`, borderRadius: 9, padding: '10px 14px', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                      <Wand2 size={14} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ color: C.purpleNeon, fontSize: 11, fontWeight: 600, marginBottom: 3 }}>Sugestão do Atlas</div>
                        <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{ins.suggestion}</p>
                      </div>
                    </div>
                  )}
                  {isExpanded && ins.isSaved && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ color: C.textSubtle, fontSize: 12 }}>Origem: Painel {ins.panel}</span>
                      {ins.category && <span style={{ color: C.textSubtle, fontSize: 12 }}>Categoria: {ins.category}</span>}
                      {ins.createdAt && <span style={{ color: C.textSubtle, fontSize: 12 }}>Criado: {new Date(ins.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ color: C.textSubtle, fontSize: 12 }}>{ins.time}</span>
                  <ChevronDown size={16} color={C.textSubtle} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
