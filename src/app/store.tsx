import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  SEED_INSIGHTS, SEED_SOURCES, DEFAULT_CATEGORIES,
  type Insight, type InsightStatus, type Priority, type DataSource,
} from './components/atlas-data'

// ── Navegação ───────────────────────────────────────────────────────────────

export type Section = 'home' | 'panels' | 'insights' | 'integrations' | 'ai' | 'settings' | 'builder'

export interface CustomChart {
  id: string
  type: 'bar' | 'line' | 'pie' | 'kpi'
  title: string
  fieldX: string
  fieldY: string
}

export interface CustomPanel {
  id: string
  label: string
  source: string
  sourceColor: string
  charts: CustomChart[]
}

export interface Toast {
  id: number
  text: string
  detail?: string
  kind: 'success' | 'info' | 'warn'
  action?: { label: string; onClick: () => void }
}

interface NavOptions {
  insightStatus?: InsightStatus | 'todos'
  panelId?: string
  question?: string
}

interface AtlasStore {
  // navegação
  section: Section
  go: (section: Section, options?: NavOptions) => void
  insightStatusFilter: InsightStatus | 'todos'
  setInsightStatusFilter: (s: InsightStatus | 'todos') => void
  activePanel: string
  setActivePanel: (id: string) => void
  pendingQuestion: string | null
  clearPendingQuestion: () => void
  askAtlas: (question: string) => void

  // insights
  insights: Insight[]
  byStatus: (status: InsightStatus) => Insight[]
  prioritize: (id: string, priority: Priority, category: string) => void
  setStatus: (id: string, status: InsightStatus) => void
  categories: string[]
  addCategory: (name: string) => void

  // fontes
  sources: DataSource[]
  connectSource: (id: string) => void
  disconnectSource: (id: string) => void

  // painéis criados no Atlas
  customPanels: CustomPanel[]
  addCustomPanel: (panel: CustomPanel) => void

  // análise da IA
  lastAnalysis: string
  analyzing: boolean
  runAnalysis: () => void

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

export function AtlasProvider({ children }: { children: React.ReactNode }) {
  const [section, setSection] = useState<Section>('home')
  const [insightStatusFilter, setInsightStatusFilter] = useState<InsightStatus | 'todos'>('novo')
  const [activePanel, setActivePanel] = useState<string>('financeiro')
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  const [insights, setInsights] = useState<Insight[]>(SEED_INSIGHTS)
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [sources, setSources] = useState<DataSource[]>(SEED_SOURCES)
  const [customPanels, setCustomPanels] = useState<CustomPanel[]>([])

  const [lastAnalysis, setLastAnalysis] = useState('há 2 minutos')
  const [analyzing, setAnalyzing] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((text: string, detail?: string, kind: Toast['kind'] = 'success', action?: Toast['action']) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, text, detail, kind, action }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4600)
  }, [])

  const go = useCallback((next: Section, options?: NavOptions) => {
    if (options?.insightStatus) setInsightStatusFilter(options.insightStatus)
    if (options?.panelId) setActivePanel(options.panelId)
    if (options?.question) setPendingQuestion(options.question)
    setSection(next)
  }, [])

  const askAtlas = useCallback((question: string) => {
    setPendingQuestion(question)
    setSection('ai')
  }, [])

  const byStatus = useCallback((status: InsightStatus) => insights.filter(i => i.status === status), [insights])

  const prioritize = useCallback((id: string, priority: Priority, category: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'priorizado', priority, category } : i))
  }, [])

  const setStatus = useCallback((id: string, status: InsightStatus) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }, [])

  const addCategory = useCallback((name: string) => {
    setCategories(prev => prev.includes(name) ? prev : [...prev, name])
  }, [])

  const connectSource = useCallback((id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, connected: true, lastSync: 'Agora', records: 'Primeira sincronização' } : s))
  }, [])

  const disconnectSource = useCallback((id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, connected: false, lastSync: undefined, records: undefined } : s))
  }, [])

  const addCustomPanel = useCallback((panel: CustomPanel) => {
    setCustomPanels(prev => [...prev, panel])
  }, [])

  const runAnalysis = useCallback(() => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setLastAnalysis('agora mesmo')
      toast('Análise concluída', 'Nenhum insight novo desde a última leitura das fontes.', 'info')
    }, 2600)
  }, [toast])

  const value = useMemo<AtlasStore>(() => ({
    section, go, insightStatusFilter, setInsightStatusFilter, activePanel, setActivePanel,
    pendingQuestion, clearPendingQuestion: () => setPendingQuestion(null), askAtlas,
    insights, byStatus, prioritize, setStatus, categories, addCategory,
    sources, connectSource, disconnectSource,
    customPanels, addCustomPanel,
    lastAnalysis, analyzing, runAnalysis,
    toasts, toast, dismissToast,
  }), [
    section, go, insightStatusFilter, activePanel, pendingQuestion, askAtlas,
    insights, byStatus, prioritize, setStatus, categories, addCategory,
    sources, connectSource, disconnectSource, customPanels, addCustomPanel,
    lastAnalysis, analyzing, runAnalysis, toasts, toast, dismissToast,
  ])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
