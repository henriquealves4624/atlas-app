// ── Atlas · Catálogos e modelos ─────────────────────────────────────────────
// O sistema começa vazio. Tudo aqui é catálogo (o que pode ser conectado,
// importado e analisado), não estado inicial do usuário.

export type Priority = 'alta' | 'media' | 'baixa'
export type InsightType = 'alerta' | 'oportunidade' | 'tendencia'
export type InsightStatus = 'gerado' | 'backlog' | 'andamento' | 'concluido' | 'descartado'
export type TemplateId = 'comercial' | 'financeiro' | 'clientes' | 'marketing'
export type ConnectMethod = 'upload' | 'google' | 'login' | 'powerbi' | 'token'

// ── Fontes de dados e ferramentas de visualização ───────────────────────────

export interface SourceCatalogItem {
  id: string
  name: string
  category: string
  desc: string
  color: string
  method: ConnectMethod
  visualization?: boolean
}

export const SOURCE_CATALOG: SourceCatalogItem[] = [
  { id: 'excel', name: 'Excel / CSV', category: 'Planilhas', color: '#217346', method: 'upload', desc: 'Envie arquivos .xlsx, .xls ou .csv e mantenha a atualização manual ou automática.' },
  { id: 'sheets', name: 'Google Sheets', category: 'Planilhas', color: '#0F9D58', method: 'google', desc: 'Conecte planilhas do Google Drive com sincronização automática.' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', color: '#FF7A59', method: 'login', desc: 'Traga leads, negócios e atividades do seu funil comercial.' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'CRM', color: '#1A73E8', method: 'token', desc: 'Acompanhe o pipeline de vendas em tempo real.' },
  { id: 'bling', name: 'Bling ERP', category: 'ERP', color: '#0070f3', method: 'login', desc: 'Sincronize vendas, estoque, NF-e e financeiro.' },
  { id: 'tiny', name: 'Tiny ERP', category: 'ERP', color: '#6B48FF', method: 'token', desc: 'Integre pedidos, produtos e faturamento do Tiny.' },
  { id: 'notion', name: 'Notion', category: 'Produtividade', color: '#94a3b8', method: 'token', desc: 'Centralize bases operacionais mantidas pelo time.' },

  { id: 'powerbi', name: 'Power BI', category: 'Analytics', color: '#F2C811', method: 'powerbi', visualization: true, desc: 'Importe os painéis que sua empresa já usa no Power BI.' },
  { id: 'looker', name: 'Looker Studio', category: 'Analytics', color: '#4285F4', method: 'google', visualization: true, desc: 'Traga relatórios do Looker Studio para dentro do Atlas.' },
  { id: 'tableau', name: 'Tableau', category: 'Analytics', color: '#E8762D', method: 'login', visualization: true, desc: 'Conecte workbooks publicados no Tableau Server ou Cloud.' },
]

export const SOURCE_CATEGORIES = ['Todas', 'Planilhas', 'CRM', 'ERP', 'Analytics', 'Produtividade']

// Painéis que a empresa já mantém na ferramenta de visualização.
export interface ExternalDashboard {
  id: string
  name: string
  detail: string
  templateId: TemplateId
}

export const EXTERNAL_DASHBOARDS: Record<string, ExternalDashboard[]> = {
  powerbi: [
    { id: 'pbi-1', name: 'Performance Comercial', detail: '8 visuais · atualizado há 2 dias', templateId: 'comercial' },
    { id: 'pbi-2', name: 'Resultado Financeiro', detail: '6 visuais · atualizado ontem', templateId: 'financeiro' },
    { id: 'pbi-3', name: 'Base de Clientes', detail: '5 visuais · atualizado há 3 dias', templateId: 'clientes' },
    { id: 'pbi-4', name: 'Marketing e Aquisição', detail: '7 visuais · atualizado hoje', templateId: 'marketing' },
  ],
  looker: [
    { id: 'lkr-1', name: 'Vendas 2026', detail: '5 páginas · atualizado hoje', templateId: 'comercial' },
    { id: 'lkr-2', name: 'Aquisição por Canal', detail: '4 páginas · atualizado ontem', templateId: 'marketing' },
  ],
  tableau: [
    { id: 'tbl-1', name: 'Resultado Consolidado', detail: '9 visuais · atualizado há 4 dias', templateId: 'financeiro' },
    { id: 'tbl-2', name: 'Retenção de Clientes', detail: '6 visuais · atualizado ontem', templateId: 'clientes' },
  ],
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
  { name: 'Custo fixo', value: 40 }, { name: 'Custo variável', value: 35 },
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
  { name: 'Recorrentes', value: 48 }, { name: 'Novos', value: 32 }, { name: 'Em risco', value: 20 },
]

export const channelLeads = [
  { canal: 'Orgânico', leads: 1420, cpl: 62 },
  { canal: 'Mídia paga', leads: 980, cpl: 165 },
  { canal: 'Indicação', leads: 460, cpl: 28 },
  { canal: 'Social', leads: 720, cpl: 118 },
]

export const campaignPerformance = [
  { m: 'Jun', invest: 11, retorno: 38 }, { m: 'Jul', invest: 13, retorno: 44 },
  { m: 'Ago', invest: 12, retorno: 41 }, { m: 'Set', invest: 16, retorno: 58 },
  { m: 'Out', invest: 18, retorno: 55 }, { m: 'Nov', invest: 17, retorno: 62 },
]

export const conversionByChannel = [
  { canal: 'Orgânico', taxa: 3.9 }, { canal: 'Indicação', taxa: 5.2 },
  { canal: 'Social', taxa: 2.1 }, { canal: 'Mídia paga', taxa: 2.4 },
]

// ── Templates de painel ─────────────────────────────────────────────────────

export interface Kpi {
  label: string
  value: string
  change: string
  up: boolean
  spark: number[]
}

export interface PanelTemplate {
  id: TemplateId
  label: string
  summary: string
  kpis: Kpi[]
}

export const TEMPLATES: Record<TemplateId, PanelTemplate> = {
  comercial: {
    id: 'comercial',
    label: 'Comercial',
    summary: 'Vendas, funil de conversão e aquisição',
    kpis: [
      { label: 'Vendas do mês', value: '342', change: '+12,4%', up: true, spark: [210, 245, 232, 268, 254, 289, 305, 298, 322, 310, 348, 342] },
      { label: 'Novos clientes', value: '87', change: '+5,2%', up: true, spark: [58, 62, 61, 68, 71, 69, 75, 78, 74, 82, 84, 87] },
      { label: 'Taxa de conversão', value: '18%', change: '-2,0pp', up: false, spark: [22, 23, 21, 22, 20, 21, 19, 20, 19, 18, 19, 18] },
      { label: 'Custo de aquisição', value: 'R$ 143', change: '+15,1%', up: false, spark: [112, 108, 115, 110, 118, 121, 117, 124, 128, 132, 139, 143] },
    ],
  },
  financeiro: {
    id: 'financeiro',
    label: 'Financeiro',
    summary: 'Receita, margem e estrutura de custos',
    kpis: [
      { label: 'Receita do mês', value: 'R$ 82K', change: '+8,2%', up: true, spark: [45, 52, 48, 61, 58, 67, 72, 69, 78, 71, 85, 82] },
      { label: 'Margem bruta', value: '42%', change: '+2,1pp', up: true, spark: [38, 41, 37, 43, 42, 44, 46, 43, 47, 42, 45, 43] },
      { label: 'Ticket médio', value: 'R$ 187', change: '+3,5%', up: true, spark: [162, 166, 171, 168, 175, 172, 178, 181, 175, 183, 185, 187] },
      { label: 'Custo fixo', value: '40%', change: '+1,4pp', up: false, spark: [35, 36, 36, 37, 37, 38, 38, 39, 39, 40, 40, 40] },
    ],
  },
  clientes: {
    id: 'clientes',
    label: 'Clientes',
    summary: 'Base ativa, retenção e satisfação',
    kpis: [
      { label: 'Clientes ativos', value: '1.247', change: '+3,1%', up: true, spark: [980, 1010, 1042, 1078, 1105, 1140, 1168, 1190, 1205, 1222, 1238, 1247] },
      { label: 'Churn', value: '4,2%', change: '-1,0pp', up: true, spark: [6.1, 5.8, 6, 5.5, 5.4, 5.2, 4.9, 5.1, 4.8, 4.6, 4.4, 4.2] },
      { label: 'NPS', value: '72', change: '+5 pts', up: true, spark: [58, 60, 59, 63, 62, 65, 66, 64, 68, 69, 70, 72] },
      { label: 'Retenção 90d', value: '78%', change: '-2,3pp', up: false, spark: [84, 83, 85, 82, 83, 81, 82, 80, 81, 79, 80, 78] },
    ],
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    summary: 'Investimento, canais e geração de demanda',
    kpis: [
      { label: 'Investimento', value: 'R$ 17K', change: '+6,3%', up: true, spark: [11, 13, 12, 16, 18, 17, 16, 18, 17, 19, 18, 17] },
      { label: 'Leads gerados', value: '3.580', change: '+9,1%', up: true, spark: [2400, 2610, 2580, 2890, 3040, 3120, 3240, 3180, 3310, 3420, 3510, 3580] },
      { label: 'Custo por lead', value: 'R$ 94', change: '+11,2%', up: false, spark: [72, 74, 71, 78, 80, 82, 79, 84, 88, 90, 92, 94] },
      { label: 'Retorno sobre mídia', value: '3,4x', change: '-0,3x', up: false, spark: [4.1, 4, 3.9, 4.2, 3.8, 3.9, 3.7, 3.8, 3.6, 3.5, 3.5, 3.4] },
    ],
  },
}

// ── Insights que a Atlas IA encontra em cada tipo de painel ─────────────────

export interface InsightSeed {
  title: string
  summary: string
  recommendation: string | null
  impact: string
  priority: Priority
  type: InsightType
  category: string
  metric: string
}

export const INSIGHT_POOL: Record<TemplateId, InsightSeed[]> = {
  comercial: [
    {
      title: 'CAC subiu 15% nos últimos 15 dias',
      summary: 'A mídia paga responde por quase toda a variação, com CPC 22% acima da média dos últimos seis meses.',
      recommendation: 'Pause os grupos de anúncio com CPC acima de R$ 3,50 e redistribua o orçamento para os conjuntos com melhor custo por lead.',
      impact: 'R$ 1,9K por mês em excesso', priority: 'alta', type: 'alerta', category: 'Aquisição', metric: 'CAC',
    },
    {
      title: 'Propostas travam na etapa final do funil',
      summary: 'A conversão de proposta para fechamento está em 35%, contra 42% do setor. Há 28 propostas paradas há mais de sete dias.',
      recommendation: 'Ative um follow-up de três toques para propostas sem contato há mais de cinco dias.',
      impact: 'R$ 12,4K parados em negociação', priority: 'alta', type: 'alerta', category: 'Conversão', metric: 'Taxa de conversão',
    },
    {
      title: 'Indicação é o canal de menor custo e maior retorno',
      summary: 'Clientes indicados custam R$ 28 e têm valor 28% acima da média, mas representam só 18% do volume.',
      recommendation: 'Estruture um programa de indicação com incentivo para quem indica e para quem é indicado.',
      impact: 'R$ 9,8K por mês de potencial', priority: 'media', type: 'oportunidade', category: 'Aquisição', metric: 'CAC por canal',
    },
    {
      title: 'Fim de semana concentra 46% das vendas',
      summary: 'Sexta e sábado puxam o volume, enquanto domingo fica 65% abaixo da média da semana.',
      recommendation: 'Crie ofertas para os dias de baixa e reduza a pressão operacional do fim de semana.',
      impact: 'R$ 4,1K por mês redistribuíveis', priority: 'baixa', type: 'tendencia', category: 'Vendas', metric: 'Vendas por dia',
    },
  ],
  financeiro: [
    {
      title: 'Faturamento caiu 8% nas últimas 3 semanas',
      summary: 'Os produtos B e C concentram a queda e respondem pela maior parte do impacto. O restante do portfólio se manteve estável.',
      recommendation: 'Teste uma promoção de três dias nesses produtos e acompanhe a resposta antes de mexer no preço de tabela.',
      impact: 'R$ 6,4K por mês em risco', priority: 'alta', type: 'alerta', category: 'Receita', metric: 'Faturamento',
    },
    {
      title: 'Custos fixos acima do praticado no setor',
      summary: 'Os custos fixos representam 40% da estrutura, contra 35% em empresas do mesmo porte.',
      recommendation: 'Revise os contratos recorrentes com vencimento neste trimestre.',
      impact: 'R$ 2,4K por mês liberáveis', priority: 'media', type: 'oportunidade', category: 'Custos', metric: 'Estrutura de custos',
    },
    {
      title: 'Reajuste de preço não afetou o volume',
      summary: 'O ticket médio subiu de R$ 175 para R$ 187 após o reajuste, sem queda relevante nas vendas.',
      recommendation: null,
      impact: 'R$ 3,1K por mês adicionais', priority: 'baixa', type: 'tendencia', category: 'Preço', metric: 'Ticket médio',
    },
    {
      title: 'Margem de setembro foi a melhor do ano',
      summary: 'A margem chegou a 47% no período, puxada pelo mix de produtos de maior valor agregado.',
      recommendation: 'Repita o mix de setembro nas campanhas do próximo trimestre.',
      impact: 'R$ 5,2K por mês de potencial', priority: 'media', type: 'oportunidade', category: 'Receita', metric: 'Margem bruta',
    },
  ],
  clientes: [
    {
      title: 'Clientes antigos estão recomprando menos',
      summary: 'A frequência de recompra caiu 18% no mês, concentrada em quem tem mais de seis meses de casa — a faixa de maior valor.',
      recommendation: 'Lance uma campanha de reativação para clientes recorrentes sem compra há mais de 30 dias.',
      impact: 'R$ 4,7K por mês em risco', priority: 'alta', type: 'alerta', category: 'Retenção', metric: 'Frequência de recompra',
    },
    {
      title: 'Churn no menor patamar dos últimos 6 meses',
      summary: 'O churn chegou a 4,2%, acompanhando as iniciativas de atendimento iniciadas em agosto.',
      recommendation: 'Documente o que foi feito no atendimento e estenda para toda a base.',
      impact: 'R$ 5,6K por mês preservados', priority: 'media', type: 'oportunidade', category: 'Retenção', metric: 'Churn',
    },
    {
      title: '20% da base está em risco de cancelamento',
      summary: 'Esse grupo reduziu a frequência de uso e representa perda potencial relevante de receita recorrente.',
      recommendation: 'Priorize contato proativo com esse segmento antes do próximo ciclo de cobrança.',
      impact: 'R$ 7,6K por mês em risco', priority: 'alta', type: 'alerta', category: 'Retenção', metric: 'Segmentos',
    },
  ],
  marketing: [
    {
      title: 'Custo por lead subiu 11% no mês',
      summary: 'A alta se concentra na mídia paga; os demais canais mantiveram o custo estável.',
      recommendation: 'Revise as palavras-chave de menor qualidade e realoque parte do orçamento para o canal orgânico.',
      impact: 'R$ 2,8K por mês em excesso', priority: 'alta', type: 'alerta', category: 'Campanha', metric: 'Custo por lead',
    },
    {
      title: 'Canal orgânico converte 2x melhor que a mídia paga',
      summary: 'O orgânico gera menos volume, mas converte 3,9% contra 2,4% da mídia paga, com custo bem menor.',
      recommendation: 'Direcione parte do orçamento de mídia para conteúdo e otimização das páginas de entrada.',
      impact: 'R$ 6,9K por mês de potencial', priority: 'media', type: 'oportunidade', category: 'Campanha', metric: 'Conversão por canal',
    },
    {
      title: 'Campanha de setembro teve o melhor retorno do ano',
      summary: 'O retorno sobre mídia chegou a 3,6x no período, acima da média de 3,4x.',
      recommendation: 'Replique a estrutura da campanha de setembro no próximo ciclo.',
      impact: 'R$ 4,4K por mês de potencial', priority: 'baixa', type: 'tendencia', category: 'Campanha', metric: 'Retorno sobre mídia',
    },
  ],
}

export const CATEGORIES = ['Receita', 'Custos', 'Preço', 'Vendas', 'Conversão', 'Aquisição', 'Retenção', 'Campanha', 'Produto', 'Operacional']

// ── Perfil do usuário ───────────────────────────────────────────────────────

export const USER = {
  name: 'Henrique Mello',
  email: 'henrique@empresa.com',
  initial: 'H',
  company: 'Mello Comércio Ltda',
}
