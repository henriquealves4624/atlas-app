// ── Atlas · Modelo de dados compartilhado ────────────────────────────────────
// Fonte única de verdade do sistema: os mesmos insights nascem nos painéis,
// aparecem no Início e são gerenciados na Central de Insights.

export type InsightType = 'alerta' | 'oportunidade' | 'tendencia'
export type Priority = 'alta' | 'media' | 'baixa'
export type InsightStatus = 'novo' | 'priorizado' | 'andamento' | 'concluido' | 'descartado'
export type PanelId = 'financeiro' | 'comercial' | 'clientes'

export interface Insight {
  id: string
  title: string
  body: string
  suggestion: string | null
  type: InsightType
  priority: Priority
  panelId: PanelId
  category: string
  metric: string
  impact: string
  confidence: number
  time: string
  status: InsightStatus
  createdAt: string
}

export interface Kpi {
  label: string
  value: string
  change: string
  up: boolean
  spark: number[]
}

// ── Séries dos painéis ──────────────────────────────────────────────────────

export const revenueData = [
  { m: 'Jan', atual: 45000, ant: 38000 }, { m: 'Fev', atual: 52000, ant: 42000 },
  { m: 'Mar', atual: 48000, ant: 44000 }, { m: 'Abr', atual: 61000, ant: 51000 },
  { m: 'Mai', atual: 58000, ant: 53000 }, { m: 'Jun', atual: 67000, ant: 55000 },
  { m: 'Jul', atual: 72000, ant: 58000 }, { m: 'Ago', atual: 69000, ant: 60000 },
  { m: 'Set', atual: 78000, ant: 62000 }, { m: 'Out', atual: 71000, ant: 65000 },
  { m: 'Nov', atual: 85000, ant: 70000 }, { m: 'Dez', atual: 82000, ant: 72000 },
]

export const marginData = [
  { m: 'Jan', v: 38 }, { m: 'Fev', v: 41 }, { m: 'Mar', v: 37 }, { m: 'Abr', v: 43 },
  { m: 'Mai', v: 42 }, { m: 'Jun', v: 44 }, { m: 'Jul', v: 46 }, { m: 'Ago', v: 43 },
  { m: 'Set', v: 47 }, { m: 'Out', v: 42 }, { m: 'Nov', v: 45 }, { m: 'Dez', v: 43 },
]

export const expenseData = [
  { cat: 'Pessoal', v: 28000 }, { cat: 'Operação', v: 14000 },
  { cat: 'Mktg', v: 8000 }, { cat: 'Infra', v: 5000 }, { cat: 'Outros', v: 3000 },
]

export const costPieData = [
  { name: 'Custo Fixo', value: 40 }, { name: 'Custo Variável', value: 35 },
  { name: 'Investimento', value: 25 },
]

export const weeklySales = [
  { d: 'Seg', v: 12000 }, { d: 'Ter', v: 9400 }, { d: 'Qua', v: 15800 },
  { d: 'Qui', v: 11200 }, { d: 'Sex', v: 18600 }, { d: 'Sáb', v: 22400 }, { d: 'Dom', v: 7800 },
]

export const conversionData = [
  { etapa: 'Visitantes', v: 12400 }, { etapa: 'Leads', v: 3800 },
  { etapa: 'Propostas', v: 1200 }, { etapa: 'Fechados', v: 420 },
]

export const productSales = [
  { name: 'Produto A', value: 38 }, { name: 'Produto B', value: 27 },
  { name: 'Produto C', value: 18 }, { name: 'Outros', value: 17 },
]

export const customerGrowth = [
  { m: 'Jan', novos: 82, churn: 18 }, { m: 'Fev', novos: 95, churn: 22 },
  { m: 'Mar', novos: 78, churn: 15 }, { m: 'Abr', novos: 112, churn: 19 },
  { m: 'Mai', novos: 105, churn: 25 }, { m: 'Jun', novos: 128, churn: 21 },
  { m: 'Jul', novos: 144, churn: 18 }, { m: 'Ago', novos: 138, churn: 24 },
]

export const retentionData = [
  { coorte: 'Jan', m1: 82, m3: 65, m6: 51 }, { coorte: 'Fev', m1: 79, m3: 62, m6: 48 },
  { coorte: 'Mar', m1: 85, m3: 70, m6: 55 }, { coorte: 'Abr', m1: 88, m3: 72, m6: 58 },
]

export const segmentsPie = [
  { name: 'Recorrentes', value: 48 }, { name: 'Novos', value: 32 }, { name: 'Em Risco', value: 20 },
]

// ── Painéis ─────────────────────────────────────────────────────────────────

export interface Panel {
  id: PanelId
  label: string
  source: string
  sync: string
  headline: string
  kpis: Kpi[]
  spark: number[]
}

export const PANELS: Panel[] = [
  {
    id: 'financeiro',
    label: 'Painel Financeiro',
    source: 'Google Sheets',
    sync: '2 min atrás',
    headline: 'Receita, margem e estrutura de custos',
    spark: [45, 52, 48, 61, 58, 67, 72, 69, 78, 71, 85, 82],
    kpis: [
      { label: 'Receita Total', value: 'R$ 82K', change: '+8,2%', up: true, spark: [45, 52, 48, 61, 58, 67, 72, 69, 78, 71, 85, 82] },
      { label: 'Margem Bruta', value: '42%', change: '+2,1pp', up: true, spark: [38, 41, 37, 43, 42, 44, 46, 43, 47, 42, 45, 43] },
      { label: 'Ticket Médio', value: 'R$ 187', change: '+3,5%', up: true, spark: [162, 166, 171, 168, 175, 172, 178, 181, 175, 183, 185, 187] },
      { label: 'LTV', value: 'R$ 1,2K', change: '-1,8%', up: false, spark: [1180, 1215, 1240, 1260, 1290, 1275, 1310, 1288, 1265, 1240, 1225, 1204] },
    ],
  },
  {
    id: 'comercial',
    label: 'Painel Comercial',
    source: 'HubSpot CRM',
    sync: '5 min atrás',
    headline: 'Vendas, funil de conversão e aquisição',
    spark: [210, 245, 232, 268, 254, 289, 305, 298, 322, 310, 348, 342],
    kpis: [
      { label: 'Vendas do Mês', value: '342', change: '+12,4%', up: true, spark: [210, 245, 232, 268, 254, 289, 305, 298, 322, 310, 348, 342] },
      { label: 'Novos Clientes', value: '87', change: '+5,2%', up: true, spark: [58, 62, 61, 68, 71, 69, 75, 78, 74, 82, 84, 87] },
      { label: 'Taxa Conversão', value: '18%', change: '-2,0pp', up: false, spark: [22, 23, 21, 22, 20, 21, 19, 20, 19, 18, 19, 18] },
      { label: 'CAC', value: 'R$ 143', change: '+15,1%', up: false, spark: [112, 108, 115, 110, 118, 121, 117, 124, 128, 132, 139, 143] },
    ],
  },
  {
    id: 'clientes',
    label: 'Painel de Clientes',
    source: 'CRM + ERP',
    sync: '8 min atrás',
    headline: 'Base ativa, retenção e satisfação',
    spark: [980, 1010, 1042, 1078, 1105, 1140, 1168, 1190, 1205, 1222, 1238, 1247],
    kpis: [
      { label: 'Total Clientes', value: '1.247', change: '+3,1%', up: true, spark: [980, 1010, 1042, 1078, 1105, 1140, 1168, 1190, 1205, 1222, 1238, 1247] },
      { label: 'Churn Rate', value: '4,2%', change: '-1,0pp', up: true, spark: [6.1, 5.8, 6.0, 5.5, 5.4, 5.2, 4.9, 5.1, 4.8, 4.6, 4.4, 4.2] },
      { label: 'NPS Score', value: '72', change: '+5 pts', up: true, spark: [58, 60, 59, 63, 62, 65, 66, 64, 68, 69, 70, 72] },
      { label: 'Retenção 90d', value: '78%', change: '-2,3pp', up: false, spark: [84, 83, 85, 82, 83, 81, 82, 80, 81, 79, 80, 78] },
    ],
  },
]

export const PANEL_LABEL: Record<PanelId, string> = {
  financeiro: 'Financeiro',
  comercial: 'Comercial',
  clientes: 'Clientes',
}

// ── KPIs consolidados (visão geral do negócio) ──────────────────────────────

export interface OverviewKpi {
  label: string
  value: number
  prefix?: string
  suffix?: string
  change: string
  up: boolean
  spark: number[]
  hint: string
  panelId: PanelId
}

export const OVERVIEW_KPIS: OverviewKpi[] = [
  { label: 'Receita do mês', value: 82, prefix: 'R$ ', suffix: 'K', change: '+8,2%', up: true, spark: [45, 52, 48, 61, 58, 67, 72, 69, 78, 71, 85, 82], hint: 'Meta do mês: R$ 95K', panelId: 'financeiro' },
  { label: 'Margem bruta', value: 42, suffix: '%', change: '+2,1pp', up: true, spark: [38, 41, 37, 43, 42, 44, 46, 43, 47, 42, 45, 43], hint: 'Média do setor: 38%', panelId: 'financeiro' },
  { label: 'Clientes ativos', value: 1247, change: '+3,1%', up: true, spark: [980, 1010, 1042, 1078, 1105, 1140, 1168, 1190, 1205, 1222, 1238, 1247], hint: '87 novos neste mês', panelId: 'clientes' },
  { label: 'Custo de aquisição', value: 143, prefix: 'R$ ', change: '+15,1%', up: false, spark: [112, 108, 115, 110, 118, 121, 117, 124, 128, 132, 139, 143], hint: 'Acima do ideal de R$ 124', panelId: 'comercial' },
]

// ── Insights gerados pela Atlas IA ──────────────────────────────────────────

const NOW = Date.now()
const ago = (hours: number) => new Date(NOW - hours * 3600000).toISOString()

export const SEED_INSIGHTS: Insight[] = [
  {
    id: 'ins-1',
    title: 'Faturamento caiu 8% nas últimas 3 semanas',
    body: 'A queda acumulada de 8% se concentra nos produtos B e C, com redução de 15% e 12% respectivamente. O restante do portfólio manteve o comportamento esperado, o que indica um problema pontual de demanda e não uma retração geral do negócio.',
    suggestion: 'Rode uma promoção de 3 dias para os produtos B e C e acompanhe a resposta de demanda antes de revisar o preço de tabela.',
    type: 'alerta', priority: 'alta', panelId: 'financeiro', category: 'Receita',
    metric: 'Faturamento', impact: 'R$ 6,4K/mês em risco', confidence: 92,
    time: 'Agora', status: 'novo', createdAt: ago(0.2),
  },
  {
    id: 'ins-2',
    title: 'CAC subiu 15% e passou do limite saudável',
    body: 'O custo de aquisição saiu de R$ 124 para R$ 143 em 15 dias. O canal de mídia paga responde por quase toda a variação, com CPC 22% acima da média dos últimos 6 meses.',
    suggestion: 'Pause os grupos de anúncio com CPC acima de R$ 3,50 e redistribua o orçamento para os conjuntos com melhor custo por lead qualificado.',
    type: 'alerta', priority: 'alta', panelId: 'comercial', category: 'Aquisição',
    metric: 'CAC', impact: 'R$ 1,9K/mês em excesso', confidence: 88,
    time: '15 min', status: 'novo', createdAt: ago(0.25),
  },
  {
    id: 'ins-3',
    title: 'Produto A cresce 3x acima da média histórica',
    body: 'O Produto A avançou 24% no mês contra uma média histórica de 8%. O reposicionamento de preço e a campanha de setembro aparecem como os principais fatores correlacionados ao crescimento.',
    suggestion: 'Amplie o estoque do Produto A e replique a estrutura da campanha de setembro nos próximos 30 dias.',
    type: 'oportunidade', priority: 'media', panelId: 'financeiro', category: 'Produto',
    metric: 'Receita por produto', impact: 'R$ 8,2K/mês de potencial', confidence: 84,
    time: '1h', status: 'novo', createdAt: ago(1),
  },
  {
    id: 'ins-4',
    title: 'Clientes antigos estão recomprando menos',
    body: 'A frequência de recompra caiu 18% no mês. O segmento com mais de 6 meses de relacionamento — o de maior LTV da base — concentra a maior parte da queda.',
    suggestion: 'Lance uma campanha de reativação exclusiva para clientes recorrentes sem compra há mais de 30 dias.',
    type: 'alerta', priority: 'alta', panelId: 'clientes', category: 'Retenção',
    metric: 'Frequência de recompra', impact: 'R$ 4,7K/mês em risco', confidence: 79,
    time: '2h', status: 'novo', createdAt: ago(2),
  },
  {
    id: 'ins-5',
    title: 'Reajuste de preço não afetou o volume de vendas',
    body: 'O ticket médio subiu de R$ 175 para R$ 187 (+6,8%) após o reajuste de outubro, sem queda relevante no volume. A elasticidade observada está dentro do esperado para a base atual.',
    suggestion: null,
    type: 'tendencia', priority: 'baixa', panelId: 'financeiro', category: 'Preço',
    metric: 'Ticket médio', impact: 'R$ 3,1K/mês adicionais', confidence: 95,
    time: '3h', status: 'novo', createdAt: ago(3),
  },
  {
    id: 'ins-6',
    title: 'Churn no menor patamar dos últimos 6 meses',
    body: 'O churn chegou a 4,2%, melhor resultado desde março. As iniciativas de Customer Success iniciadas em agosto têm correlação direta com a melhora observada.',
    suggestion: 'Documente as práticas de CS aplicadas e estenda o atendimento para toda a base, não apenas para os clientes de maior valor.',
    type: 'oportunidade', priority: 'media', panelId: 'clientes', category: 'Retenção',
    metric: 'Churn', impact: 'R$ 5,6K/mês preservados', confidence: 90,
    time: '5h', status: 'priorizado', createdAt: ago(5),
  },
  {
    id: 'ins-7',
    title: 'Propostas travam na etapa final do funil',
    body: 'A conversão de proposta para fechamento está em 35%, contra 42% do benchmark do setor. Há 28 propostas abertas há mais de 7 dias sem nenhum contato registrado.',
    suggestion: 'Ative uma sequência de follow-up de 3 toques para propostas sem contato há mais de 5 dias.',
    type: 'alerta', priority: 'alta', panelId: 'comercial', category: 'Funil',
    metric: 'Taxa de conversão', impact: 'R$ 12,4K/mês em propostas paradas', confidence: 86,
    time: '8h', status: 'andamento', createdAt: ago(8),
  },
  {
    id: 'ins-8',
    title: 'Indicação é o canal de menor custo e maior retorno',
    body: 'Clientes vindos de indicação têm CAC de R$ 28 e LTV 28% acima da média, mas o canal responde por apenas 18% do volume total de novos clientes.',
    suggestion: 'Estruture um programa de indicação com incentivo para quem indica e para quem é indicado.',
    type: 'oportunidade', priority: 'media', panelId: 'comercial', category: 'Aquisição',
    metric: 'CAC por canal', impact: 'R$ 9,8K/mês de potencial', confidence: 81,
    time: '12h', status: 'andamento', createdAt: ago(12),
  },
  {
    id: 'ins-9',
    title: 'Custos fixos acima do praticado no setor',
    body: 'Os custos fixos representam 40% da estrutura, contra 35% do benchmark de empresas do mesmo porte. Uma redução de 3pp liberaria caixa relevante para reinvestimento.',
    suggestion: 'Revise os contratos de serviços recorrentes com vencimento neste trimestre.',
    type: 'tendencia', priority: 'baixa', panelId: 'financeiro', category: 'Custos',
    metric: 'Estrutura de custos', impact: 'R$ 2,4K/mês liberáveis', confidence: 76,
    time: '1 dia', status: 'priorizado', createdAt: ago(26),
  },
  {
    id: 'ins-10',
    title: 'Onboarding revisado melhorou a retenção das novas coortes',
    body: 'As coortes de março e abril apresentam retenção em M1 de 85% e 88%, acima de todas as anteriores. As mudanças no onboarding aplicadas em março são o fator mais provável.',
    suggestion: 'Mantenha o novo fluxo como padrão e monitore a retenção em M6 das mesmas coortes.',
    type: 'oportunidade', priority: 'baixa', panelId: 'clientes', category: 'Retenção',
    metric: 'Retenção por coorte', impact: 'R$ 3,3K/mês preservados', confidence: 83,
    time: '2 dias', status: 'concluido', createdAt: ago(50),
  },
]

export const DEFAULT_CATEGORIES = ['Receita', 'Custos', 'Preço', 'Produto', 'Aquisição', 'Funil', 'Retenção', 'Operacional']

// ── Fontes de dados ─────────────────────────────────────────────────────────

export interface DataSource {
  id: string
  name: string
  desc: string
  category: string
  color: string
  connected: boolean
  lastSync?: string
  records?: string
}

export const SEED_SOURCES: DataSource[] = [
  { id: 'powerbi', name: 'Power BI', desc: 'Importe dashboards e relatórios do Power BI diretamente para o Atlas.', category: 'Analytics', color: '#F2C811', connected: true, lastSync: '2 min atrás', records: '14 relatórios' },
  { id: 'sheets', name: 'Google Sheets', desc: 'Conecte planilhas do Google Sheets para sincronização automática de dados.', category: 'Planilhas', color: '#0F9D58', connected: true, lastSync: '5 min atrás', records: '3 planilhas' },
  { id: 'hubspot', name: 'HubSpot', desc: 'Sincronize leads, negócios e atividades do seu CRM HubSpot.', category: 'CRM', color: '#FF7A59', connected: true, lastSync: '8 min atrás', records: '1.247 contatos' },
  { id: 'excel', name: 'Excel', desc: 'Importe arquivos .xlsx e .xls com atualização manual ou automática.', category: 'Planilhas', color: '#217346', connected: false },
  { id: 'pipedrive', name: 'Pipedrive', desc: 'Integre seu pipeline de vendas e acompanhe negócios em tempo real.', category: 'CRM', color: '#1A73E8', connected: false },
  { id: 'notion', name: 'Notion', desc: 'Conecte bancos de dados do Notion para centralizar informações operacionais.', category: 'Produtividade', color: '#e2e8f0', connected: false },
  { id: 'tiny', name: 'Tiny ERP', desc: 'Integre o Tiny para trazer dados de vendas, estoque e financeiro.', category: 'ERP', color: '#6B48FF', connected: false },
  { id: 'looker', name: 'Looker Studio', desc: 'Importe relatórios do Looker Studio automaticamente.', category: 'Analytics', color: '#4285F4', connected: false },
  { id: 'bling', name: 'Bling ERP', desc: 'Conecte o Bling para sincronizar vendas, NF-e e financeiro.', category: 'ERP', color: '#0070f3', connected: false },
]
