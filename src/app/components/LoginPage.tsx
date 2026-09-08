import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { C } from './atlas-tokens'
import { AtlasLogo } from './LandingPage'
import type { Page } from '../App'

interface Props {
  navigate: (page: Page) => void
}

export default function LoginPage({ navigate }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('onboarding')
    }, 1200)
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '24px',
    }}>
      {/* BG orbs */}
      <div className="atlas-glow" style={{ position: 'absolute', top: '10%', left: '15%', width: 480, height: 480, borderRadius: '50%', background: 'rgba(139,92,246,0.07)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div className="atlas-glow" style={{ position: 'absolute', bottom: '10%', right: '10%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(90px)', pointerEvents: 'none', animationDelay: '2s' }} />

      {/* Back to landing */}
      <button onClick={() => navigate('landing')} className="atlas-btn-ghost"
        style={{ position: 'absolute', top: 24, left: 24, padding: '8px 16px', borderRadius: 8, color: C.textMuted, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Voltar
      </button>

      {/* Card */}
      <div className="card-glass atlas-fade-up" style={{
        width: '100%', maxWidth: 420,
        border: `1px solid rgba(139,92,246,0.22)`,
        borderRadius: 20,
        padding: '40px 36px',
        boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 0 120px rgba(139,92,246,0.05), 0 24px 64px rgba(0,0,0,0.6)',
        position: 'relative',
      }}>
        {/* Glow ring at top */}
        <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 180, height: 2, background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)', borderRadius: 4 }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <AtlasLogo size="lg" />
          <p style={{ color: C.textMuted, fontSize: 14, marginTop: 10, lineHeight: 1.5 }}>
            {mode === 'login' ? 'Bem-vindo de volta! Entre na sua conta.' : 'Crie sua conta e comece a usar.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3, marginBottom: 28, border: `1px solid ${C.borderSubtle}` }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14,
              background: mode === m ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: mode === m ? C.purpleLight : C.textMuted,
              transition: 'all 0.2s',
              fontWeight: mode === m ? 500 : 400,
            }}>
              {m === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        {/* Google login */}
        <button className="atlas-btn-ghost" style={{ width: '100%', padding: '11px 0', borderRadius: 10, color: C.text, cursor: 'pointer', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <GoogleIcon />
          Continuar com Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.borderSubtle }} />
          <span style={{ color: C.textSubtle, fontSize: 12 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: C.borderSubtle }} />
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <Field label="Nome completo" type="text" value={name} onChange={setName} placeholder="João Silva" />
          )}
          <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="joao@empresa.com" />
          <div>
            <label style={{ color: C.textMuted, fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 7 }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
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

        {/* Submit */}
        <button onClick={handleSubmit} className="atlas-btn-primary"
          style={{ width: '100%', padding: '13px 0', borderRadius: 10, color: 'white', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500, marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? (
            <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
          ) : (
            <>
              {mode === 'login' ? 'Entrar na conta' : 'Criar minha conta'}
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {mode === 'register' && (
          <p style={{ color: C.textSubtle, fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            Ao criar conta você concorda com nossos{' '}
            <span style={{ color: C.purpleLight, cursor: 'pointer' }}>Termos de Uso</span>
            {' '}e{' '}
            <span style={{ color: C.purpleLight, cursor: 'pointer' }}>Política de Privacidade</span>.
          </p>
        )}

        {/* Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
          {['SSL Seguro', 'LGPD', '14 dias grátis'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} />
              <span style={{ color: C.textSubtle, fontSize: 11 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label style={{ color: C.textMuted, fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
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
