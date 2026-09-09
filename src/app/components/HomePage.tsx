import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Sparkles, RefreshCw, ArrowRight, Plug, PanelTop, Lightbulb, Target,
  ArrowUpRight, ArrowDownRight, Plus, Trash2, MessageSquare, CheckCircle2, Send,
} from 'lucide-react'
import { C } from './atlas-tokens'
import {
  Reveal, CountUp, Sparkline, Card, SectionHeading, Pill, PrimaryButton,
  TYPE_META, greeting, todayLabel,
} from './atlas-ui'
import InsightCard from './InsightCard'
import { TriageModal, useDiscard } from './InsightTriage'
import { useAtlas } from '../store'
import { OVERVIEW_KPIS, PANELS, PANEL_LABEL, revenueData, type Insight } from './atlas-data'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const QUICK_QUESTIONS = [
  'Por que meu faturamento caiu?',
  'Onde estou perdendo clientes?',
  'Como reduzir meu CAC?',
]

export default function HomePage() {
  const { insights, sources, go, askAtlas, lastAnalysis, analyzing, runAnalysis, customPanels } = useAtlas()
  const [triage, setTriage] = useState<Insight | null>(null)
  const discard = useDiscard()

  const novos = insights.filter(i => i.status === 'novo')
  const emPlano = insights.filter(i => i.status === 'priorizado' || i.status === 'andamento')
  const concluidos = insights.filter(i => i.status === 'concluido')
  const connected = sources.filter(s => s.connected)
  const totalPanels = PANELS.length + customPanels.length

  // O insight mais crítico ainda não tratado abre o dia.
  const hero = [...novos].sort((a, b) => {
    const w = { alta: 0, media: 1, baixa: 2 } as const
    if (w[a.priority] !== w[b.priority]) return w[a.priority] - w[b.priority]
    return b.confidence - a.confidence
  })[0]

  const recentes = novos.filter(i => i.id !== hero?.id).slice(0, 4)

  return (
    <div className="atlas-page" style={{ padding: '26px 30px 44px', maxWidth: 1340, margin: '0 auto' }}>
      {/* ── Saudação ──────────────────────────────────────────────────────── */}
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <h1 style={{ color: C.text, fontSize: 27, fontWeight: 750, letterSpacing: '-0.03em', marginBottom: 7 }}>
              {greeting()}, João
            </h1>
            <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.6 }}>
              {todayLabel()} · O Atlas leu {connected.length} fontes de dados e encontrou{' '}
              <strong style={{ color: C.purpleLight, fontWeight: 600 }}>
                {novos.length} {novos.length === 1 ? 'ponto' : 'pontos'}
              </strong> que {novos.length === 1 ? 'merece' : 'merecem'} sua atenção.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 9, padding: '8px 13px' }}>
              <div className="atlas-glow" style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
              <span style={{ color: C.textMuted, fontSize: 12.5 }}>Última análise {lastAnalysis}</span>
            </div>
            <PrimaryButton onClick={runAnalysis} disabled={analyzing}
              icon={<RefreshCw size={14} style={analyzing ? { animation: 'spin-slow 1s linear infinite' } : undefined} />}>
              {analyzing ? 'Analisando...' : 'Analisar agora'}
            </PrimaryButton>
          </div>
        </div>
      </Reveal>

      {analyzing && <AnalysisBar />}

      {/* ── Jornada ───────────────────────────────────────────────────────── */}
      <Reveal delay={60}>
        <JourneySteps
          connected={connected.length}
          panels={totalPanels}
          insights={novos.length}
          actions={emPlano.length}
          done={concluidos.length}
        />
      </Reveal>

      {/* ── Prioridade do dia ─────────────────────────────────────────────── */}
      <Reveal delay={120}>
        {hero
          ? <HeroInsight insight={hero} onTriage={() => setTriage(hero)} onDiscard={() => discard(hero)} onAsk={() => askAtlas(`Me explique melhor: ${hero.title}`)} />
          : <AllClear onGo={() => go('insights', { insightStatus: 'andamento' })} pending={emPlano.length} />}
      </Reveal>

      {/* ── Indicadores consolidados ──────────────────────────────────────── */}
      <Reveal delay={180} style={{ marginTop: 26 }}>
        <SectionHeading
          title="Como o negócio está hoje"
          subtitle="Indicadores consolidados das suas fontes conectadas"
          action={<button onClick={() => go('panels')} style={linkBtn}>Ver painéis <ArrowRight size={13} /></button>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))', gap: 14 }}>
          {OVERVIEW_KPIS.map((k, i) => (
            <div key={k.label} className="card-hover" onClick={() => go('panels', { panelId: k.panelId })}
              style={{ background: 'rgba(15,12,28,0.72)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '17px 19px', backdropFilter: 'blur(14px)', cursor: 'pointer' }}>
              <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 9 }}>{k.label}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ color: C.text, fontSize: 25, fontWeight: 750, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    <CountUp value={k.value} prefix={k.prefix} suffix={k.suffix} duration={900 + i * 90} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7 }}>
                    {k.up ? <ArrowUpRight size={13} color={C.green} /> : <ArrowDownRight size={13} color={C.red} />}
                    <span style={{ color: k.up ? C.green : C.red, fontSize: 12.5, fontWeight: 600 }}>{k.change}</span>
                    <span style={{ color: C.textSubtle, fontSize: 12 }}>no mês</span>
                  </div>
                </div>
                <Sparkline values={k.spark} color={k.up ? C.green : C.orange} width={78} height={38} />
              </div>
              <div style={{ color: C.textSubtle, fontSize: 11.5, marginTop: 11, paddingTop: 10, borderTop: `1px solid ${C.borderSubtle}` }}>{k.hint}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Insights + laterais ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.75fr) minmax(280px, 1fr)', gap: 20, marginTop: 30, alignItems: 'start' }}>
        <Reveal delay={240}>
          <SectionHeading
            title="O que o Atlas encontrou"
            subtitle="Cada item pode virar uma ação ou ser descartado"
            action={<button onClick={() => go('insights', { insightStatus: 'novo' })} style={linkBtn}>Central de Insights <ArrowRight size={13} /></button>}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentes.length > 0 ? recentes.map(ins => (
              <InsightCard key={ins.id} insight={ins} onTriage={setTriage} />
            )) : (
              <Card style={{ textAlign: 'center', padding: '32px 20px' }}>
                <CheckCircle2 size={22} color={C.green} style={{ marginBottom: 10 }} />
                <div style={{ color: C.text, fontSize: 14.5, fontWeight: 600, marginBottom: 5 }}>Nenhum insight aguardando avaliação</div>
                <div style={{ color: C.textSubtle, fontSize: 13 }}>Você já tratou tudo o que o Atlas encontrou hoje.</div>
              </Card>
            )}
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Reveal delay={300}>
            <AskCard onAsk={askAtlas} />
          </Reveal>
          <Reveal delay={340}>
            <SourcesCard onManage={() => go('integrations')} />
          </Reveal>
        </div>
      </div>

      {/* ── Painéis ───────────────────────────────────────────────────────── */}
      <Reveal delay={380} style={{ marginTop: 30 }}>
        <SectionHeading
          title="Seus painéis"
          subtitle="A leitura visual por trás de cada insight"
          action={<button onClick={() => go('builder')} style={linkBtn}>Criar painel <Plus size={13} /></button>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(268px, 1fr))', gap: 14 }}>
          {[
            ...PANELS.map(p => ({ id: p.id, label: p.label, headline: p.headline, spark: p.spark, source: p.source, sync: p.sync })),
            ...customPanels.map(p => ({
              id: p.id, label: p.label,
              headline: `${p.charts.length} ${p.charts.length === 1 ? 'visualização criada' : 'visualizações criadas'} no Atlas`,
              spark: [14, 18, 16, 23, 21, 28, 26, 32], source: p.source, sync: 'agora',
            })),
          ].map(p => {
            const panelInsights = insights.filter(i => i.panelId === p.id && i.status === 'novo').length
            return (
              <div key={p.id} className="card-hover" onClick={() => go('panels', { panelId: p.id })}
                style={{ background: 'rgba(15,12,28,0.72)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', backdropFilter: 'blur(14px)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ color: C.text, fontSize: 14.5, fontWeight: 650 }}>{p.label}</div>
                  {panelInsights > 0 && <Pill color={C.purpleNeon} background="rgba(192,132,252,0.12)">{panelInsights} novos</Pill>}
                </div>
                <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 14 }}>{p.headline}</div>
                <Sparkline values={p.spark} color={C.purpleLight} width={240} height={44} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.borderSubtle}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
                  <span style={{ color: C.textSubtle, fontSize: 11.5 }}>{p.source} · sincronizado {p.sync}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>

      {triage && <TriageModal insight={triage} onClose={() => setTriage(null)} />}
    </div>
  )
}

const linkBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none',
  color: C.purpleLight, fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0,
}

// ── Barra de análise ────────────────────────────────────────────────────────

const STEPS = [
  'Lendo Power BI, Google Sheets e HubSpot...',
  'Cruzando métricas entre as fontes...',
  'Comparando com o histórico dos últimos 12 meses...',
  'Gerando insights e recomendações...',
]

function AnalysisBar() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 700)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="atlas-scan" style={{ position: 'relative', overflow: 'hidden', background: 'rgba(139,92,246,0.07)', border: `1px solid ${C.borderMd}`, borderRadius: 12, padding: '13px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
      <Sparkles size={16} color={C.purpleNeon} />
      <span style={{ color: C.purpleLight, fontSize: 13.5, fontWeight: 500 }}>{STEPS[step]}</span>
    </div>
  )
}

// ── Jornada do produto ──────────────────────────────────────────────────────

function JourneySteps({ connected, panels, insights, actions, done }: {
  connected: number; panels: number; insights: number; actions: number; done: number
}) {
  const { go } = useAtlas()
  const steps = [
    { icon: <Plug size={16} />, label: 'Conectar dados', value: `${connected} ${connected === 1 ? 'fonte ativa' : 'fontes ativas'}`, onClick: () => go('integrations') },
    { icon: <PanelTop size={16} />, label: 'Visualizar', value: `${panels} ${panels === 1 ? 'painel publicado' : 'painéis publicados'}`, onClick: () => go('panels') },
    { icon: <Lightbulb size={16} />, label: 'Entender', value: `${insights} ${insights === 1 ? 'insight novo' : 'insights novos'}`, onClick: () => go('insights', { insightStatus: 'novo' }) },
    { icon: <Target size={16} />, label: 'Agir', value: `${actions} no plano · ${done} ${done === 1 ? 'concluída' : 'concluídas'}`, onClick: () => go('insights', { insightStatus: 'andamento' }) },
  ]

  return (
    <div style={{ background: 'rgba(15,12,28,0.6)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', backdropFilter: 'blur(14px)', marginBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 15 }}>
        <span style={{ color: C.textSubtle, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.11em' }}>Como o Atlas trabalha</span>
        <div className="journey-track" style={{ flex: 1, height: 1, borderRadius: 1 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))', gap: 12 }}>
        {steps.map((s, i) => (
          <button key={s.label} onClick={s.onClick} className="journey-step"
            style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 13, padding: '14px 16px', cursor: 'pointer', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight }}>
                {s.icon}
              </div>
              <span style={{ color: C.textSubtle, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
            </div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: C.textSubtle, fontSize: 12.5 }}>{s.value}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Prioridade do dia ───────────────────────────────────────────────────────

function HeroInsight({ insight, onTriage, onDiscard, onAsk }: {
  insight: Insight; onTriage: () => void; onDiscard: () => void; onAsk: () => void
}) {
  const { go } = useAtlas()
  const meta = TYPE_META[insight.type]
  const panel = PANELS.find(p => p.id === insight.panelId)!
  const series = insight.panelId === 'financeiro'
    ? revenueData.map(d => ({ m: d.m, v: d.atual / 1000 }))
    : panel.spark.map((v, i) => ({ m: MONTHS[i], v }))

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'rgba(15,12,28,0.85)', border: '1px solid rgba(139,92,246,0.25)',
      borderRadius: 20, backdropFilter: 'blur(18px)',
      boxShadow: '0 0 50px rgba(139,92,246,0.09), 0 20px 50px rgba(0,0,0,0.45)',
    }}>
      <div style={{ position: 'absolute', top: -1, left: '8%', width: 220, height: 2, background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.75), transparent)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(139,92,246,0.05) 1px, transparent 1px)', backgroundSize: '26px 26px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 28, padding: '24px 26px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={15} color="white" />
            </div>
            <span style={{ color: C.purpleNeon, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Prioridade do dia</span>
            <Pill color={meta.color} background={meta.soft} icon={meta.icon}>{meta.label}</Pill>
          </div>

          <h2 style={{ color: C.text, fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 10 }}>
            {insight.title}
          </h2>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.72, marginBottom: 16 }}>{insight.body}</p>

          {insight.suggestion && (
            <div style={{ background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, borderRadius: 12, padding: '13px 16px', marginBottom: 18 }}>
              <div style={{ color: C.purpleNeon, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 5 }}>Recomendação do Atlas</div>
              <p style={{ color: C.text, fontSize: 14, lineHeight: 1.65 }}>{insight.suggestion}</p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            <PrimaryButton onClick={onTriage} icon={<Plus size={15} />}>Adicionar ao plano</PrimaryButton>
            <button onClick={onAsk} className="atlas-ghost" style={secondaryBtn}>
              <MessageSquare size={14} /> Perguntar ao Atlas
            </button>
            <button onClick={() => go('panels', { panelId: insight.panelId })} className="atlas-ghost" style={secondaryBtn}>
              Ver no painel
            </button>
            <button onClick={onDiscard} className="atlas-ghost"
              style={{ ...secondaryBtn, color: C.red, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.06)' }}>
              <Trash2 size={14} /> Descartar
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MiniStat label="Impacto estimado" value={insight.impact} color={meta.color} />
            <MiniStat label="Confiança da análise" value={`${insight.confidence}%`} color={C.purpleLight} />
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 13, padding: '14px 14px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 600 }}>{insight.metric}</span>
              <Pill>{PANEL_LABEL[insight.panelId]}</Pill>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={meta.color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fill: C.textSubtle, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
                <Tooltip
                  contentStyle={{ background: 'rgba(13,10,24,0.97)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 9, fontSize: 12 }}
                  labelStyle={{ color: C.textSubtle }} />
                <Area type="monotone" dataKey="v" name={insight.metric} stroke={meta.color} strokeWidth={2.4} fill="url(#heroFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

const secondaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 15px', borderRadius: 10,
  background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted,
  fontSize: 13.5, fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s',
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ color: C.textSubtle, fontSize: 11.5, marginBottom: 6 }}>{label}</div>
      <div style={{ color, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 }}>{value}</div>
    </div>
  )
}

function AllClear({ onGo, pending }: { onGo: () => void; pending: number }) {
  return (
    <div style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 20, padding: '30px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <CheckCircle2 size={24} color={C.green} />
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{ color: C.text, fontSize: 19, fontWeight: 700, marginBottom: 6 }}>Tudo avaliado por aqui</h2>
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>
          Você tratou todos os insights desta rodada. {pending > 0 ? `Há ${pending} ${pending === 1 ? 'ação' : 'ações'} em andamento no seu plano.` : 'O Atlas avisa assim que encontrar algo novo.'}
        </p>
      </div>
      <PrimaryButton onClick={onGo} icon={<Target size={15} />}>Ver plano de ação</PrimaryButton>
    </div>
  )
}

// ── Perguntar ao Atlas ──────────────────────────────────────────────────────

function AskCard({ onAsk }: { onAsk: (q: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <Card style={{ border: '1px solid rgba(139,92,246,0.22)', background: 'rgba(19,15,36,0.75)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(139,92,246,0.35)' }}>
          <Sparkles size={15} color="white" />
        </div>
        <div>
          <div style={{ color: C.text, fontSize: 14, fontWeight: 650 }}>Perguntar ao Atlas</div>
          <div style={{ color: C.textSubtle, fontSize: 12 }}>Pergunte em português, sem fórmulas</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={value} onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && value.trim()) { onAsk(value.trim()); setValue('') } }}
          placeholder="O que você quer entender?"
          style={{ flex: 1, minWidth: 0, padding: '10px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13, outline: 'none', caretColor: C.purpleLight }}
          onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
          onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }} />
        <button onClick={() => { if (value.trim()) { onAsk(value.trim()); setValue('') } }} className="atlas-btn-primary"
          style={{ width: 38, borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Send size={15} color="white" />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {QUICK_QUESTIONS.map(q => (
          <button key={q} onClick={() => onAsk(q)} className="row-hover"
            style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 9, padding: '9px 12px', color: C.textMuted, fontSize: 12.5, cursor: 'pointer' }}>
            {q}
          </button>
        ))}
      </div>
    </Card>
  )
}

// ── Fontes conectadas ───────────────────────────────────────────────────────

function SourcesCard({ onManage }: { onManage: () => void }) {
  const { sources } = useAtlas()
  const connected = sources.filter(s => s.connected)
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ color: C.text, fontSize: 14, fontWeight: 650 }}>Fontes conectadas</div>
        <Pill color={C.green} background="rgba(52,211,153,0.1)">{connected.length} ativas</Pill>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {connected.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${s.color}22`, border: `1px solid ${s.color}44`, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
              <div style={{ color: C.textSubtle, fontSize: 11.5 }}>{s.records}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} />
              <span style={{ color: C.textSubtle, fontSize: 11 }}>{s.lastSync}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onManage} className="atlas-ghost"
        style={{ width: '100%', marginTop: 14, padding: '9px 0', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Plug size={13} /> Gerenciar integrações
      </button>
    </Card>
  )
}
