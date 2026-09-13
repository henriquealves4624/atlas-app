import { useEffect, useState } from 'react'
import { Eye, EyeOff, ArrowRight, Plug, Lightbulb, Target, Wand2 } from 'lucide-react'
import { C } from './atlas-tokens'
import { AtlasLogoFull, Sparkline, Field } from './atlas-ui'
import { USER } from './atlas-data'

const STEPS = [
  { icon: <Plug size={14} />, title: 'Conecte o que você já usa', desc: 'Planilhas, Power BI, ERP e CRM em um só lugar.' },
  { icon: <Lightbulb size={14} />, title: 'Entenda sem ser analista', desc: 'A Atlas IA lê seus números e explica em português.' },
  { icon: <Target size={14} />, title: 'Aja no que importa', desc: 'Cada insight vira uma ação acompanhada até o fim.' },
]

const LOADING = ['Verificando seu acesso...', 'Preparando seu espaço de trabalho...']

export default function LoginPage({ onEnter }: { onEnter: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!loading) return
    const tick = window.setInterval(() => setStep(s => Math.min(s + 1, LOADING.length - 1)), 560)
    const done = window.setTimeout(onEnter, 1500)
    return () => { clearInterval(tick); clearTimeout(done) }
  }, [loading, onEnter])

  const submit = () => { setStep(0); setLoading(true) }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
      padding: 'clamp(24px, 5vh, 56px) clamp(20px, 4vw, 56px)',
    }}>
      <div className="atlas-glow" style={{ position: 'absolute', top: '-12%', left: '8%', width: 520, height: 520, borderRadius: '50%', background: 'rgba(139,92,246,0.09)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div className="atlas-glow" style={{ position: 'absolute', bottom: '-14%', right: '8%', width: 440, height: 440, borderRadius: '50%', background: 'rgba(59,130,246,0.07)', filter: 'blur(110px)', pointerEvents: 'none', animationDelay: '2s' }} />

      <div className="login-grid">
        {/* ── Apresentação: topo alinhado ao topo do card, base à base ───── */}
        <section className="atlas-login-side login-side">
          <div className="atlas-reveal">
            <AtlasLogoFull width={72} />

            <h1 style={{
              color: C.text, fontWeight: 750, letterSpacing: '-0.038em', lineHeight: 1.13,
              fontSize: 'clamp(28px, calc(1.1vw + 1.7vh + 5px), 38px)',
              margin: 'clamp(18px, 2.8vh, 30px) 0 clamp(10px, 1.6vh, 16px)',
            }}>
              Pare de apenas olhar dados.<br />
              <span className="gradient-text">Comece a decidir.</span>
            </h1>

            <p style={{ color: C.textMuted, fontSize: 'clamp(13.5px, calc(0.9vh + 5.5px), 15px)', lineHeight: 1.68, maxWidth: 470, marginBottom: 'clamp(16px, 2.8vh, 28px)' }}>
              O Atlas conecta as ferramentas que sua empresa já usa, encontra o que mudou nos seus números
              e transforma isso em ações claras.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.5vh, 14px)' }}>
              {STEPS.map((s, i) => (
                <div key={s.title} className="atlas-reveal" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', animationDelay: `${140 + i * 90}ms` }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ color: C.text, fontSize: 'clamp(13px, calc(0.5vh + 8.5px), 14px)', fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
                    <div style={{ color: C.textSubtle, fontSize: 'clamp(12px, calc(0.5vh + 8px), 13px)', lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <InsightPreview />
        </section>

        {/* ── Autenticação ────────────────────────────────────────────────── */}
        <section style={{ minWidth: 0 }}>
          <div className="atlas-fade-up" style={{
            height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            background: 'rgba(17,13,32,0.8)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139,92,246,0.2)', borderRadius: 22,
            padding: 'clamp(26px, 4vh, 36px) clamp(24px, 2.4vw, 32px)',
            boxShadow: '0 0 60px rgba(139,92,246,0.1), 0 24px 64px rgba(0,0,0,0.55)', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 170, height: 2, background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.55), transparent)', borderRadius: 4 }} />

            <div style={{ marginBottom: 'clamp(16px, 2.6vh, 24px)' }}>
              <h2 style={{ color: C.text, fontSize: 21, fontWeight: 700, letterSpacing: '-0.022em', marginBottom: 6 }}>
                {mode === 'login' ? 'Entrar na sua conta' : 'Criar sua conta'}
              </h2>
              <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.55 }}>
                {mode === 'login' ? 'Continue de onde parou.' : 'Comece conectando sua primeira fonte de dados.'}
              </p>
            </div>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.035)', borderRadius: 11, padding: 3, marginBottom: 'clamp(14px, 2.4vh, 22px)', border: `1px solid ${C.borderSubtle}` }}>
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13.5, background: mode === m ? 'rgba(139,92,246,0.18)' : 'transparent', color: mode === m ? C.purpleLight : C.textMuted, fontWeight: mode === m ? 600 : 450, transition: 'all 0.2s' }}>
                  {m === 'login' ? 'Entrar' : 'Criar conta'}
                </button>
              ))}
            </div>

            <button onClick={submit} className="atlas-btn-ghost"
              style={{ width: '100%', padding: '11px 0', borderRadius: 11, color: C.text, cursor: 'pointer', fontSize: 13.5, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 'clamp(12px, 2vh, 18px)' }}>
              <GoogleIcon /> Continuar com Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(12px, 2vh, 18px)' }}>
              <div style={{ flex: 1, height: 1, background: C.borderSubtle }} />
              <span style={{ color: C.textSubtle, fontSize: 12 }}>ou</span>
              <div style={{ flex: 1, height: 1, background: C.borderSubtle }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.7vh, 14px)' }}>
              {mode === 'register' && <Field label="Nome completo" value={name} onChange={setName} placeholder={USER.name} />}
              <Field label="E-mail" value={email} onChange={setEmail} type="email" placeholder={USER.email} />
              <div>
                <label style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 7 }}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') submit() }} placeholder="••••••••"
                    style={{ width: '100%', padding: '11px 40px 11px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
                    onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }} />
                  <button onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textSubtle, display: 'flex' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {mode === 'login' && (
              <button style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: C.purpleLight, fontSize: 13, cursor: 'pointer', marginTop: 11, padding: 0 }}>
                Esqueci minha senha
              </button>
            )}

            <button onClick={submit} disabled={loading} className="atlas-btn-primary"
              style={{ width: '100%', padding: '13px 0', borderRadius: 11, color: 'white', border: 'none', cursor: loading ? 'default' : 'pointer', fontSize: 14.5, fontWeight: 600, marginTop: 'clamp(14px, 2.4vh, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
              {loading ? (
                <>
                  <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} />
                  {LOADING[step]}
                </>
              ) : (
                <>{mode === 'login' ? 'Entrar no Atlas' : 'Criar minha conta'} <ArrowRight size={16} /></>
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 'clamp(14px, 2.4vh, 22px)', color: C.textSubtle, fontSize: 11.5 }}>
              <span>Conexão segura</span>
              <span>LGPD</span>
              <span>14 dias grátis</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// O gráfico vem primeiro, como contexto; o insight e a recomendação levam o peso visual.
function InsightPreview() {
  return (
    <div className="atlas-reveal" style={{
      animationDelay: '420ms', maxWidth: 470,
      background: 'rgba(17,13,32,0.72)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: 16,
      padding: 'clamp(14px, 2vh, 18px) 18px', backdropFilter: 'blur(16px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: C.textSubtle, fontSize: 11.5 }}>Faturamento · últimas 8 semanas</span>
        <span style={{ color: C.orange, fontSize: 11.5, fontWeight: 600 }}>-8%</span>
      </div>
      <div style={{ opacity: 0.75 }}>
        <Sparkline values={[78, 82, 85, 83, 80, 76, 72, 69]} color={C.orange} width={430} height={30} strokeWidth={1.5} responsive />
      </div>

      <div style={{ height: 1, background: C.borderSubtle, margin: 'clamp(10px, 1.5vh, 13px) 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange }} />
        <span style={{ color: C.orange, fontSize: 11.5, fontWeight: 600 }}>Atenção</span>
        <span style={{ color: C.textSubtle, opacity: 0.45 }}>·</span>
        <span style={{ color: C.textMuted, fontSize: 12 }}>R$ 6,4K por mês em risco</span>
      </div>

      <div style={{ color: C.text, fontSize: 'clamp(13.5px, calc(0.6vh + 8.5px), 14.5px)', fontWeight: 600, lineHeight: 1.42, marginBottom: 'clamp(8px, 1.3vh, 11px)' }}>
        Faturamento caiu 8% nas últimas 3 semanas
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(139,92,246,0.09)', borderRadius: 11, padding: '10px 12px' }}>
        <Wand2 size={13} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 2 }} />
        <span style={{ color: C.text, fontSize: 'clamp(12px, calc(0.5vh + 8px), 13px)', lineHeight: 1.55 }}>
          Os produtos B e C concentram a queda. Teste uma promoção de três dias e acompanhe a resposta.
        </span>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
