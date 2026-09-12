import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import {
  INSIGHT_POOL, TEMPLATES,
  type InsightStatus, type InsightType, type Priority, type TemplateId,
} from './components/atlas-data'

// ── Navegação ───────────────────────────────────────────────────────────────

export type Section = 'home' | 'panels' | 'insights' | 'integrations' | 'ai' | 'settings' | 'builder'

// ── Entidades ───────────────────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface CustomChart {
  id: string
  type: 'bar' | 'line' | 'pie' | 'kpi'
  title: string
  fieldX: string
  fieldY: string
}

export interface Panel {
  id: string
  projectId: string
  name: string
  templateId: TemplateId
  origin: 'importado' | 'atlas'
  originLabel: string
  charts?: CustomChart[]
  createdAt: string
}

export interface Insight {
  id: string
  panelId: string
  projectId: string
  title: string
  summary: string
  recommendation: string | null
  impact: string
  priority: Priority
  type: InsightType
  category: string
  metric: string
  status: InsightStatus
  createdAt: string
  conclusion?: string
  concludedAt?: string
}

export interface ConnectedSource {
  id: string
  lastSync: string
  records: string
}

export interface ContextEntry {
  id: string
  projectId: string
  panelId: string
  insightTitle: string
  text: string
  at: string
}

// ── Fluxo de conexão ────────────────────────────────────────────────────────

export type FlowStep =
  | 'source-connect'    // autenticação/upload da fonte escolhida
  | 'visualize'         // como você quer visualizar os dados
  | 'tool-pick'         // escolher ferramenta de visualização
  | 'tool-connect'      // autenticação da ferramenta
  | 'dashboards'        // escolher painel existente na ferramenta
  | 'save'              // nome do painel + projeto
  | 'importing'         // importação + análise

export interface FlowState {
  step: FlowStep
  sourceId?: string
  toolId?: string
  dashboardId?: string
}

export interface Toast {
  id: number
  text: string
  detail?: string
  kind: 'success' | 'info' | 'warn'
  action?: { label: string; onClick: () => void }
}

interface NavOptions {
  insightStatus?: InsightStatus
  projectId?: string
  panelId?: string
  question?: string
}

interface AtlasStore {
  // navegação
  section: Section
  go: (section: Section, options?: NavOptions) => void
  insightStatusFilter: InsightStatus
  setInsightStatusFilter: (s: InsightStatus) => void
  activeProject: string | null
  setActiveProject: (id: string | null) => void
  activePanel: string | null
  setActivePanel: (id: string | null) => void
  pendingQuestion: string | null
  clearPendingQuestion: () => void
  askAtlas: (question: string) => void

  // dados do usuário
  projects: Project[]
  panels: Panel[]
  insights: Insight[]
  sources: ConnectedSource[]
  contextEntries: ContextEntry[]

  createProject: (name: string, description?: string) => Project
  connectSource: (id: string, records?: string) => void
  disconnectSource: (id: string) => void
  isConnected: (id: string) => boolean
  createPanel: (input: {
    name: string
    projectId: string
    templateId: TemplateId
    origin: 'importado' | 'atlas'
    originLabel: string
    charts?: CustomChart[]
  }) => Panel

  panelsOf: (projectId: string) => Panel[]
  insightsOf: (projectId: string | null) => Insight[]

  // insights
  addToBacklog: (id: string, priority: Priority, category: string) => void
  setInsightStatus: (id: string, status: InsightStatus) => void
  concludeInsight: (id: string, conclusion: string) => void

  // análise da Atlas IA
  analyzingPanelId: string | null
  lastAnalysis: string | null
  runAnalysis: () => void
  analyzing: boolean

  // fluxo de conexão
  flow: FlowState | null
  startFlow: (step: FlowStep, payload?: Omit<FlowState, 'step'>) => void
  updateFlow: (patch: Partial<FlowState>) => void
  closeFlow: () => void

  // toasts
  toasts: Toast[]
  toast: (text: string, detail?: string, kind?: Toast['kind'], action?: Toast['action']) => void
  dismissToast: (id: number) => void
}

const Ctx = createContext<AtlasStore | null>(null)

export function useAtlas() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAtlas precisa estar dentro de <AtlasProvider>')
  return ctx
}

let seq = 0
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`

export function AtlasProvider({ children }: { children: React.ReactNode }) {
  const [section, setSection] = useState<Section>('home')
  const [insightStatusFilter, setInsightStatusFilter] = useState<InsightStatus>('backlog')
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  const [projects, setProjects] = useState<Project[]>([])
  const [panels, setPanels] = useState<Panel[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [sources, setSources] = useState<ConnectedSource[]>([])
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([])

  const [analyzingPanelId, setAnalyzingPanelId] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null)
  const [flow, setFlow] = useState<FlowState | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<number[]>([])

  // ── toasts ────────────────────────────────────────────────────────────────
  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((text: string, detail?: string, kind: Toast['kind'] = 'success', action?: Toast['action']) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, text, detail, kind, action }])
    const t = window.setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4800)
    timers.current.push(t)
  }, [])

  // ── navegação ─────────────────────────────────────────────────────────────
  const go = useCallback((next: Section, options?: NavOptions) => {
    if (options?.insightStatus) setInsightStatusFilter(options.insightStatus)
    if (options?.projectId !== undefined) setActiveProject(options.projectId)
    if (options?.panelId !== undefined) setActivePanel(options.panelId)
    if (options?.question) setPendingQuestion(options.question)
    setSection(next)
  }, [])

  const askAtlas = useCallback((question: string) => {
    setPendingQuestion(question)
    setSection('ai')
  }, [])

  // ── projetos, fontes e painéis ────────────────────────────────────────────
  const createProject = useCallback((name: string, description = '') => {
    const project: Project = { id: uid('prj'), name: name.trim(), description: description.trim(), createdAt: new Date().toISOString() }
    setProjects(prev => [...prev, project])
    return project
  }, [])

  const connectSource = useCallback((id: string, records = 'Sincronizando...') => {
    setSources(prev => prev.some(s => s.id === id) ? prev : [...prev, { id, lastSync: 'agora', records }])
  }, [])

  const disconnectSource = useCallback((id: string) => {
    setSources(prev => prev.filter(s => s.id !== id))
  }, [])

  const isConnected = useCallback((id: string) => sources.some(s => s.id === id), [sources])

  // Cada painel publicado passa por uma leitura da Atlas IA, que devolve os
  // insights daquele contexto.
  const createPanel = useCallback((input: {
    name: string
    projectId: string
    templateId: TemplateId
    origin: 'importado' | 'atlas'
    originLabel: string
    charts?: CustomChart[]
  }) => {
    const panel: Panel = {
      id: uid('pnl'),
      projectId: input.projectId,
      name: input.name.trim(),
      templateId: input.templateId,
      origin: input.origin,
      originLabel: input.originLabel,
      charts: input.charts,
      createdAt: new Date().toISOString(),
    }
    setPanels(prev => [...prev, panel])
    setAnalyzingPanelId(panel.id)

    const t = window.setTimeout(() => {
      const seeds = INSIGHT_POOL[panel.templateId]
      const generated: Insight[] = seeds.map(seed => ({
        ...seed,
        id: uid('ins'),
        panelId: panel.id,
        projectId: panel.projectId,
        status: 'gerado' as InsightStatus,
        createdAt: new Date().toISOString(),
      }))
      setInsights(prev => [...generated, ...prev])
      setAnalyzingPanelId(null)
      setLastAnalysis('agora mesmo')
      toast(
        `${generated.length} insights encontrados`,
        `A Atlas IA analisou ${panel.name} e identificou pontos que merecem sua atenção.`,
      )
    }, 2600)
    timers.current.push(t)

    return panel
  }, [toast])

  const panelsOf = useCallback((projectId: string) => panels.filter(p => p.projectId === projectId), [panels])

  const insightsOf = useCallback(
    (projectId: string | null) => projectId ? insights.filter(i => i.projectId === projectId) : insights,
    [insights],
  )

  // ── ciclo de vida do insight ──────────────────────────────────────────────
  const addToBacklog = useCallback((id: string, priority: Priority, category: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'backlog', priority, category } : i))
  }, [])

  const setInsightStatus = useCallback((id: string, status: InsightStatus) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }, [])

  // A descrição do que foi feito vira contexto do projeto: é assim que o
  // Atlas "aprende" com as decisões tomadas.
  const concludeInsight = useCallback((id: string, conclusion: string) => {
    const at = new Date().toISOString()
    const insight = insights.find(i => i.id === id)
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'concluido', conclusion, concludedAt: at } : i))
    if (insight) {
      setContextEntries(prev => [
        { id: uid('ctx'), projectId: insight.projectId, panelId: insight.panelId, insightTitle: insight.title, text: conclusion, at },
        ...prev,
      ])
    }
  }, [insights])

  // ── análise manual ────────────────────────────────────────────────────────
  const runAnalysis = useCallback(() => {
    setAnalyzing(true)
    const t = window.setTimeout(() => {
      setAnalyzing(false)
      setLastAnalysis('agora mesmo')
      if (panels.length === 0) {
        toast('Nada para analisar ainda', 'Conecte uma fonte de dados para o Atlas começar a leitura.', 'info')
      } else {
        toast('Análise concluída', 'Nenhum insight novo desde a última leitura das suas fontes.', 'info')
      }
    }, 2400)
    timers.current.push(t)
  }, [panels.length, toast])

  // ── fluxo de conexão ──────────────────────────────────────────────────────
  const startFlow = useCallback((step: FlowStep, payload?: Omit<FlowState, 'step'>) => {
    setFlow({ step, ...payload })
  }, [])

  const updateFlow = useCallback((patch: Partial<FlowState>) => {
    setFlow(prev => prev ? { ...prev, ...patch } : prev)
  }, [])

  const closeFlow = useCallback(() => setFlow(null), [])

  const value = useMemo<AtlasStore>(() => ({
    section, go, insightStatusFilter, setInsightStatusFilter,
    activeProject, setActiveProject, activePanel, setActivePanel,
    pendingQuestion, clearPendingQuestion: () => setPendingQuestion(null), askAtlas,
    projects, panels, insights, sources, contextEntries,
    createProject, connectSource, disconnectSource, isConnected, createPanel,
    panelsOf, insightsOf,
    addToBacklog, setInsightStatus, concludeInsight,
    analyzingPanelId, lastAnalysis, runAnalysis, analyzing,
    flow, startFlow, updateFlow, closeFlow,
    toasts, toast, dismissToast,
  }), [
    section, go, insightStatusFilter, activeProject, activePanel, pendingQuestion, askAtlas,
    projects, panels, insights, sources, contextEntries,
    createProject, connectSource, disconnectSource, isConnected, createPanel,
    panelsOf, insightsOf, addToBacklog, setInsightStatus, concludeInsight,
    analyzingPanelId, lastAnalysis, runAnalysis, analyzing,
    flow, startFlow, updateFlow, closeFlow, toasts, toast, dismissToast,
  ])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
