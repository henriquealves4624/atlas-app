import { useState } from 'react'
import { Inbox, Bookmark, Clock, CheckCircle2, Archive, Filter, ChevronRight, Sparkles } from 'lucide-react'
import { C } from './atlas-tokens'
import { Reveal, Card, Pill, PRIORITY_META } from './atlas-ui'
import InsightCard from './InsightCard'
import { TriageModal } from './InsightTriage'
import { useAtlas } from '../store'
import { PANEL_LABEL, type Insight, type InsightStatus, type Priority } from './atlas-data'

const TABS: { id: InsightStatus; label: string; icon: React.ReactNode; hint: string; color: string }[] = [
  { id: 'novo', label: 'Aguardando avaliação', icon: <Inbox size={15} />, hint: 'Insights que o Atlas encontrou e ainda não foram tratados', color: C.purpleNeon },
  { id: 'priorizado', label: 'Priorizados', icon: <Bookmark size={15} />, hint: 'No plano de ação, prontos para começar', color: C.purpleLight },
  { id: 'andamento', label: 'Em andamento', icon: <Clock size={15} />, hint: 'Ações que a equipe já está executando', color: C.yellow },
  { id: 'concluido', label: 'Concluídos', icon: <CheckCircle2 size={15} />, hint: 'Ações finalizadas e seus resultados', color: C.green },
  { id: 'descartado', label: 'Descartados', icon: <Archive size={15} />, hint: 'Insights que não fazem sentido para o seu contexto', color: C.textSubtle },
]

export default function InsightsPage() {
  const { insights, insightStatusFilter, setInsightStatusFilter } = useAtlas()
  const [priority, setPriority] = useState<Priority | 'todas'>('todas')
  const [panel, setPanel] = useState<string>('todos')
  const [triage, setTriage] = useState<Insight | null>(null)

  const status = insightStatusFilter === 'todos' ? 'novo' : insightStatusFilter
  const count = (s: InsightStatus) => insights.filter(i => i.status === s).length

  const filtered = insights.filter(i =>
    i.status === status &&
    (priority === 'todas' || i.priority === priority) &&
    (panel === 'todos' || i.panelId === panel)
  )

  const activeTab = TABS.find(t => t.id === status)!
  const impactoTotal = insights.filter(i => i.status === 'priorizado' || i.status === 'andamento').length

  return (
    <div className="atlas-page" style={{ padding: '26px 30px 44px', maxWidth: 1340, margin: '0 auto' }}>
      <Reveal>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ color: C.text, fontSize: 24, fontWeight: 750, letterSpacing: '-0.025em', marginBottom: 7 }}>Central de Insights</h1>
          <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.6, maxWidth: 720 }}>
            Aqui cada descoberta da Atlas IA vira uma decisão: você avalia, prioriza e acompanha até virar ação.
            {impactoTotal > 0 && <> Hoje há <strong style={{ color: C.purpleLight, fontWeight: 600 }}>{impactoTotal} ações</strong> no seu plano.</>}
          </p>
        </div>
      </Reveal>

      {/* Fluxo do insight */}
      <Reveal delay={60}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))', gap: 10, marginBottom: 24 }}>
          {TABS.map((t, i) => {
            const active = t.id === status
            const n = count(t.id)
            return (
              <button key={t.id} onClick={() => setInsightStatusFilter(t.id)} className="journey-step"
                style={{
                  position: 'relative', textAlign: 'left', cursor: 'pointer',
                  background: active ? 'rgba(139,92,246,0.1)' : 'rgba(15,12,28,0.7)',
                  border: `1px solid ${active ? 'rgba(139,92,246,0.35)' : C.border}`,
                  borderRadius: 14, padding: '15px 16px',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: t.color }}>
                  {t.icon}
                  <span style={{ color: active ? C.text : C.textMuted, fontSize: 12.5, fontWeight: 600 }}>{t.label}</span>
                </div>
                <div style={{ color: n > 0 ? t.color : C.textSubtle, fontSize: 26, fontWeight: 750, letterSpacing: '-0.03em' }}>{n}</div>
                {i < TABS.length - 1 && (
                  <ChevronRight size={14} color={C.textSubtle} style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                )}
              </button>
            )
          })}
        </div>
      </Reveal>

      {/* Filtros */}
      <Reveal delay={100}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textSubtle, fontSize: 12.5 }}>
            <Filter size={13} /> Filtrar por
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3, border: `1px solid ${C.borderSubtle}` }}>
            {(['todas', 'alta', 'media', 'baixa'] as const).map(p => (
              <button key={p} onClick={() => setPriority(p)}
                style={{ padding: '6px 13px', borderRadius: 7, border: 'none', background: priority === p ? 'rgba(139,92,246,0.2)' : 'transparent', color: priority === p ? C.purpleLight : C.textMuted, cursor: 'pointer', fontSize: 12.5, fontWeight: priority === p ? 600 : 400, transition: 'all 0.18s' }}>
                {p === 'todas' ? 'Todas prioridades' : PRIORITY_META[p].label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3, border: `1px solid ${C.borderSubtle}` }}>
            {['todos', 'financeiro', 'comercial', 'clientes'].map(p => (
              <button key={p} onClick={() => setPanel(p)}
                style={{ padding: '6px 13px', borderRadius: 7, border: 'none', background: panel === p ? 'rgba(139,92,246,0.2)' : 'transparent', color: panel === p ? C.purpleLight : C.textMuted, cursor: 'pointer', fontSize: 12.5, fontWeight: panel === p ? 600 : 400, transition: 'all 0.18s' }}>
                {p === 'todos' ? 'Todos os painéis' : PANEL_LABEL[p as keyof typeof PANEL_LABEL]}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', color: C.textSubtle, fontSize: 12.5 }}>
            {filtered.length} {filtered.length === 1 ? 'insight' : 'insights'} · {activeTab.hint}
          </span>
        </div>
      </Reveal>

      {/* Lista */}
      <Reveal delay={140}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '44px 24px' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: C.purpleLight }}>
                {activeTab.icon}
              </div>
              <div style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nada em "{activeTab.label}"</div>
              <div style={{ color: C.textSubtle, fontSize: 13.5, maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                {status === 'novo'
                  ? 'Você avaliou todos os insights desta rodada. O Atlas continua monitorando suas fontes e avisa quando encontrar algo relevante.'
                  : 'Nenhum insight neste estágio com os filtros aplicados.'}
              </div>
            </Card>
          ) : filtered.map(ins => (
            <InsightCard key={ins.id} insight={ins} onTriage={setTriage} showStatus />
          ))}
        </div>
      </Reveal>

      {/* Rodapé explicativo */}
      <Reveal delay={200}>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(139,92,246,0.05)', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 18px' }}>
          <Sparkles size={16} color={C.purpleLight} style={{ flexShrink: 0 }} />
          <span style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>
            A Atlas IA revisa suas fontes continuamente. Insights descartados ensinam o sistema a priorizar melhor o que importa para o seu negócio.
          </span>
          <Pill color={C.purpleLight} background="rgba(139,92,246,0.12)">Monitoramento ativo</Pill>
        </div>
      </Reveal>

      {triage && <TriageModal insight={triage} onClose={() => setTriage(null)} />}
    </div>
  )
}
