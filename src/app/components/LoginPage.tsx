import { useEffect, useState } from 'react'
import { Eye, EyeOff, ArrowRight, Plug, Lightbulb, Target, TrendingDown, Wand2 } from 'lucide-react'
import { C } from './atlas-tokens'
import { AtlasLogo, Sparkline } from './atlas-ui'

interface Props {
  onEnter: () => void
}

const STEPS = [
  { icon: <Plug size={15} />, title: 'Conecte o que você já usa', desc: 'Planilhas, Power BI, ERP e CRM em um só lugar.' },
  { icon: <Lightbulb size={15} />, title: 'Entenda sem ser analista', desc: 'A Atlas IA lê seus números e explica em português.' },
  { icon: <Target size={15} />, title: 'Aja no que importa', desc: 'Cada insight vira uma ação acompanhada até o fim.' },
]

const LOADING_STEPS = ['Verificando seu acesso...', 'Carregando suas fontes de dados...', 'Preparando seus insights...']

export default function LoginPage({ onEnter }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setLoadingStep(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 520)
    const done = setTimeout(onEnter, 1650)
    return () => { clearInterval(t); clearTimeout(done) }
  }, [loading, onEnter])

  const submit = () => { setLoadingStep(0); setLoading(true) }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="atlas-glow" style={{ position: 'absolute', top: '-10%', left: '5%', width: 560, height: 560, borderRadius: '50%', background: 'rgba(139,92,246,0.09)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div className="atlas-glow" style={{ position: 'absolute', bottom: '-15%', right: '5%', width: 460, height: 460, borderRadius: '50%', background: 'rgba(59,130,246,0.07)', filter: 'blur(110px)', pointerEvents: 'none', animationDelay: '2s' }} />

      {/* ── Apresentação ──────────────────────────────────────────────────── */}
      <div className="atlas-login-side" style={{ flex: '1 1 52%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 5vw', position: 'relative', zIndex: 1 }}>
        <div className="atlas-reveal" style={{ maxWidth: 520 }}>
          <AtlasLogo size="lg" />

          <h1 style={{ color: C.text, fontSize: 40, fontWeight: 780, letterSpacing: '-0.035em', lineHeight: 1.12, margin: '30px 0 18px' }}>
            Pare de olhar dados.<br />
            <span className="gradient-text">Comece a decidir.</span>
          </h1>

          <p style={{ color: C.textMuted, fontSize: 16, lineHeight: 1.7, marginBottom: 34, maxWidth: 460 }}>
            O Atlas conecta as ferramentas que sua empresa já usa, encontra o que mudou nos seus números
            e transforma isso em ações claras — sem você precisar entender de BI.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
            {STEPS.map((s, i) => (
              <div key={s.title} className="atlas-reveal" style={{ display: 'flex', gap: 13, alignItems: 'flex-start', animationDelay: `${120 + i * 90}ms` }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ color: C.text, fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ color: C.textSubtle, fontSize: 13.5, lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <InsightPreview />
        </div>
      </div>

      {/* ── Autenticação ──────────────────────────────────────────────────── */}
      <div style={{ flex: '0 1 520px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 4vw', position: 'relative', zIndex: 1 }}>
        <div className="card-glass atlas-fade-up" style={{
          width: '100%', maxWidth: 400, border: '1px solid rgba(139,92,246,0.22)', borderRadius: 22, padding: '36px 32px',
          boxShadow: '0 0 60px rgba(139,92,246,0.14), 0 24px 64px rgba(0,0,0,0.6)', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 180, height: 2, background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)', borderRadius: 4 }} />

          <div style={{ marginBottom: 24 }}>
            <h2 style={{ color: C.text, fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
              {mode === 'login' ? 'Entrar na sua conta' : 'Criar sua conta'}
            </h2>
            <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.55 }}>
              {mode === 'login' ? 'Seus painéis e insights estão esperando por você.' : 'Comece conectando sua primeira fonte de dados.'}
            </p>
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 11, padding: 3, marginBottom: 22, border: `1px solid ${C.borderSubtle}` }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13.5, background: mode === m ? 'rgba(139,92,246,0.2)' : 'transparent', color: mode === m ? C.purpleLight : C.textMuted, fontWeight: mode === m ? 600 : 400, transition: 'all 0.2s' }}>
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <button onClick={submit} className="atlas-btn-ghost"
            style={{ width: '100%', padding: '11px 0', borderRadius: 11, color: C.text, cursor: 'pointer', fontSize: 13.5, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
            <GoogleIcon /> Continuar com Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: C.borderSubtle }} />
            <span style={{ color: C.textSubtle, fontSize: 12 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: C.borderSubtle }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && <Field label="Nome completo" type="text" value={name} onChange={setName} placeholder="João Silva" />}
            <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="joao@empresa.com" />
            <div>
              <label style={{ color: C.textMuted, fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 7 }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submit() }}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }} />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textSubtle, display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {mode === 'login' && (
            <button style={{ background: 'none', border: 'none', color: C.purpleLight, fontSize: 13, cursor: 'pointer', marginTop: 10, padding: 0 }}>
              Esqueci minha senha
            </button>
          )}

          <button onClick={submit} disabled={loading} className="atlas-btn-primary"
            style={{ width: '100%', padding: '13px 0', borderRadius: 11, color: 'white', border: 'none', cursor: loading ? 'default' : 'pointer', fontSize: 14.5, fontWeight: 600, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
                {LOADING_STEPS[loadingStep]}
              </>
            ) : (
              <>{mode === 'login' ? 'Entrar no Atlas' : 'Criar minha conta'} <ArrowRight size={16} /></>
            )}
          </button>

          {mode === 'register' && (
            <p style={{ color: C.textSubtle, fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
              Ao criar conta você concorda com os{' '}
              <span style={{ color: C.purpleLight, cursor: 'pointer' }}>Termos de Uso</span> e a{' '}
              <span style={{ color: C.purpleLight, cursor: 'pointer' }}>Política de Privacidade</span>.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 22 }}>
            {['Conexão segura', 'LGPD', '14 dias grátis'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} />
                <span style={{ color: C.textSubtle, fontSize: 11 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Prévia do produto: um insight real do sistema, como o usuário verá lá dentro.
function InsightPreview() {
  return (
    <div className="atlas-reveal atlas-float" style={{
      animationDelay: '400ms', maxWidth: 430,
      background: 'rgba(15,12,28,0.8)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: 16,
      padding: '16px 18px', backdropFilter: 'blur(16px)', boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.orange }}>
          <TrendingDown size={13} />
        </div>
        <span style={{ color: C.orange, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Requer atenção</span>
        <span style={{ marginLeft: 'auto', color: C.textSubtle, fontSize: 11 }}>há 2 minutos</span>
      </div>
      <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 10, lineHeight: 1.45 }}>
        Faturamento caiu 8% nas últimas 3 semanas
      </div>
      <div style={{ marginBottom: 12 }}>
        <Sparkline values={[78, 82, 85, 83, 80, 76, 72, 69]} color={C.orange} width={390} height={40} />
      </div>
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: 'rgba(139,92,246,0.09)', border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: '10px 12px' }}>
        <Wand2 size={13} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 2 }} />
        <span style={{ color: C.textMuted, fontSize: 12.5, lineHeight: 1.5 }}>
          A queda se concentra nos produtos B e C. Rode uma promoção de 3 dias e acompanhe a resposta.
        </span>
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div>
      <label style={{ color: C.textMuted, fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
        onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }} />
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
