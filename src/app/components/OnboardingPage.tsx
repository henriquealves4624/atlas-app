import { useState } from 'react'
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { C } from './atlas-tokens'
import { AtlasLogo } from './LandingPage'
import type { Page } from '../App'

interface Props {
  navigate: (page: Page) => void
}

const COMPANY_TYPES = [
  { id: 'varejo', icon: '🛍️', label: 'Varejo', desc: 'Loja física ou online' },
  { id: 'academia', icon: '💪', label: 'Academia', desc: 'Fitness & bem-estar' },
  { id: 'restaurante', icon: '🍽️', label: 'Restaurante', desc: 'Alimentação & delivery' },
  { id: 'ecommerce', icon: '🛒', label: 'E-commerce', desc: 'Vendas digitais' },
  { id: 'servicos', icon: '⚙️', label: 'Serviços', desc: 'Prestação de serviços' },
  { id: 'saude', icon: '🏥', label: 'Saúde', desc: 'Clínicas & bem-estar' },
]

const DATA_SOURCES = [
  { id: 'excel', icon: '📊', label: 'Excel', desc: 'Planilhas .xlsx' },
  { id: 'sheets', icon: '🔢', label: 'Google Sheets', desc: 'Planilhas online' },
  { id: 'erp', icon: '🏭', label: 'ERP', desc: 'Tiny, Bling, TOTVS' },
  { id: 'crm', icon: '👥', label: 'CRM', desc: 'HubSpot, Pipedrive' },
  { id: 'powerbi', icon: '📈', label: 'Power BI', desc: 'Relatórios existentes' },
  { id: 'looker', icon: '🔍', label: 'Looker Studio', desc: 'Dashboards Google' },
]

const ENVIRONMENTS = [
  { id: 'financeiro', icon: '💰', label: 'Financeiro', desc: 'Receita, custos, fluxo de caixa' },
  { id: 'comercial', icon: '📦', label: 'Comercial', desc: 'Vendas, metas, conversão' },
  { id: 'marketing', icon: '📣', label: 'Marketing', desc: 'Campanhas, leads, CAC' },
  { id: 'operacao', icon: '⚙️', label: 'Operação', desc: 'Processos, entregas, estoque' },
  { id: 'clientes', icon: '👤', label: 'Clientes', desc: 'Retenção, NPS, churn' },
  { id: 'rh', icon: '🧑‍💼', label: 'Recursos Humanos', desc: 'Equipe, produtividade' },
]

export default function OnboardingPage({ navigate }: Props) {
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState<string | null>(null)
  const [sources, setSources] = useState<string[]>([])
  const [envs, setEnvs] = useState<string[]>([])

  const toggleSource = (id: string) => setSources(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleEnv = (id: string) => setEnvs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const canNext = step === 1 ? !!company : step === 2 ? sources.length > 0 : envs.length > 0

  const handleFinish = () => {
    navigate('dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div className="atlas-glow" style={{ position: 'absolute', top: '5%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(139,92,246,0.06)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div className="atlas-glow" style={{ position: 'absolute', bottom: '10%', left: '5%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(59,130,246,0.05)', filter: 'blur(90px)', pointerEvents: 'none', animationDelay: '2s' }} />

      {/* Header */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <AtlasLogo size="md" />
        <p style={{ color: C.textMuted, fontSize: 14, marginTop: 8 }}>Configuração inicial</p>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 560, marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          {[
            { n: 1, label: 'Seu negócio' },
            { n: 2, label: 'Fontes de dados' },
            { n: 3, label: 'Seus painéis' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600,
                background: step > s.n ? C.purple : step === s.n ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.06)',
                color: step >= s.n ? 'white' : C.textSubtle,
                border: step >= s.n ? 'none' : `1px solid ${C.borderSubtle}`,
                boxShadow: step === s.n ? C.glowSm : 'none',
              }}>
                {step > s.n ? <CheckCircle2 size={14} /> : s.n}
              </div>
              <span style={{ color: step >= s.n ? C.text : C.textSubtle, fontSize: 13, fontWeight: step === s.n ? 500 : 400 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${((step - 1) / 2) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 2, transition: 'width 0.4s ease', boxShadow: '0 0 8px rgba(139,92,246,0.6)' }} />
        </div>
      </div>

      {/* Step card */}
      <div className="card-glass" style={{ width: '100%', maxWidth: 560, border: `1px solid ${C.border}`, borderRadius: 20, padding: '36px 32px', boxShadow: '0 0 50px rgba(139,92,246,0.1), 0 24px 60px rgba(0,0,0,0.5)' }}>
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Qual é o seu tipo de negócio?</h2>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>Vamos personalizar o Atlas para o seu segmento e criar a melhor experiência para você.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {COMPANY_TYPES.map(c => (
                <div key={c.id} className={`selection-card ${company === c.id ? 'selected' : ''}`}
                  onClick={() => setCompany(c.id)}
                  style={{ border: `1px solid ${company === c.id ? C.purpleLight : C.border}`, borderRadius: 12, padding: '16px 14px', textAlign: 'center', background: company === c.id ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ color: company === c.id ? C.purpleLight : C.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ color: C.textSubtle, fontSize: 12 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Onde estão seus dados?</h2>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>Selecione as fontes que você usa. Você pode conectar mais fontes depois, quando quiser.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {DATA_SOURCES.map(s => (
                <div key={s.id} className={`selection-card ${sources.includes(s.id) ? 'selected' : ''}`}
                  onClick={() => toggleSource(s.id)}
                  style={{ border: `1px solid ${sources.includes(s.id) ? C.purpleLight : C.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: sources.includes(s.id) ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ color: sources.includes(s.id) ? C.purpleLight : C.text, fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ color: C.textSubtle, fontSize: 12 }}>{s.desc}</div>
                  </div>
                  {sources.includes(s.id) && (
                    <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={12} color="white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Crie seus ambientes</h2>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>Selecione as áreas que você quer acompanhar. Cada ambiente terá seus próprios painéis e insights.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {ENVIRONMENTS.map(e => (
                <div key={e.id} className={`selection-card ${envs.includes(e.id) ? 'selected' : ''}`}
                  onClick={() => toggleEnv(e.id)}
                  style={{ border: `1px solid ${envs.includes(e.id) ? C.purpleLight : C.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: envs.includes(e.id) ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: 22 }}>{e.icon}</span>
                  <div>
                    <div style={{ color: envs.includes(e.id) ? C.purpleLight : C.text, fontSize: 14, fontWeight: 600 }}>{e.label}</div>
                    <div style={{ color: C.textSubtle, fontSize: 12 }}>{e.desc}</div>
                  </div>
                  {envs.includes(e.id) && (
                    <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={12} color="white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI note */}
            <div style={{ marginTop: 20, background: 'rgba(139,92,246,0.07)', border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={16} color={C.purpleNeon} />
              <span style={{ color: C.textMuted, fontSize: 13 }}>
                O Atlas criará painéis e insights automáticos para cada ambiente selecionado.
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('login')} className="atlas-btn-ghost"
            style={{ padding: '10px 20px', borderRadius: 9, color: C.textMuted, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={15} />
            {step === 1 ? 'Voltar' : 'Anterior'}
          </button>
          <button
            onClick={() => step < 3 ? setStep(s => s + 1) : handleFinish()}
            className="atlas-btn-primary"
            disabled={!canNext}
            style={{ padding: '11px 28px', borderRadius: 9, color: 'white', border: 'none', cursor: canNext ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 500, opacity: canNext ? 1 : 0.45, display: 'flex', alignItems: 'center', gap: 8 }}>
            {step === 3 ? 'Abrir o Atlas' : 'Continuar'}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <p style={{ color: C.textSubtle, fontSize: 12, marginTop: 20 }}>Passo {step} de 3 · Você pode alterar isso depois nas configurações</p>
    </div>
  )
}
