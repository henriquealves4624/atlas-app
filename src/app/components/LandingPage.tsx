import { useState, useEffect } from 'react'
import { ArrowRight, Zap, Brain, BarChart3, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { C, GRADIENT_BG } from './atlas-tokens'
import type { Page } from '../App'

const heroData = [
  { v: 45 }, { v: 52 }, { v: 48 }, { v: 61 }, { v: 58 }, { v: 72 }, { v: 79 },
]

interface Props {
  navigate: (page: Page) => void
}

export default function LandingPage({ navigate }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', overflowX: 'hidden' }} className="atlas-scrollbar">
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(7,5,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.borderSubtle}` : 'none',
        transition: 'all 0.3s ease',
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <AtlasLogo size="md" />
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Produto', 'Integrações', 'Preços', 'Docs'].map(item => (
            <NavLink key={item}>{item}</NavLink>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('login')} className="atlas-btn-secondary"
            style={{ padding: '8px 18px', borderRadius: 8, color: C.text, cursor: 'pointer', fontSize: 14 }}>
            Entrar
          </button>
          <button onClick={() => navigate('login')} className="atlas-btn-primary"
            style={{ padding: '8px 18px', borderRadius: 8, color: 'white', cursor: 'pointer', border: 'none', fontSize: 14 }}>
            Começar grátis
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '120px 48px 80px',
        background: GRADIENT_BG,
      }}>
        <div className="atlas-glow" style={{ position: 'absolute', top: '15%', left: '3%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(139,92,246,0.07)', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div className="atlas-glow" style={{ position: 'absolute', top: '45%', right: '8%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(80px)', pointerEvents: 'none', animationDelay: '1.8s' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div className="atlas-fade-up">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(139,92,246,0.09)', border: `1px solid ${C.borderMd}`,
              borderRadius: 20, padding: '5px 14px', marginBottom: 28,
            }}>
              <Sparkles size={12} color={C.purpleLight} />
              <span style={{ color: C.purpleLight, fontSize: 12, fontWeight: 500 }}>Inteligência de Dados para PMEs</span>
            </div>

            <h1 style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.08, color: C.text, marginBottom: 22, letterSpacing: '-0.03em' }}>
              Pare de olhar dados.{' '}
              <span className="gradient-text">Comece a entender decisões.</span>
            </h1>

            <p style={{ color: C.textMuted, fontSize: 18, lineHeight: 1.72, marginBottom: 38, maxWidth: 490 }}>
              O Atlas centraliza seus dados e traduz informações complexas em insights claros para pequenas empresas tomarem melhores decisões.
            </p>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('login')} className="atlas-btn-primary"
                style={{ padding: '14px 28px', borderRadius: 10, color: 'white', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                Testar Demo
                <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('login')} className="atlas-btn-secondary"
                style={{ padding: '14px 28px', borderRadius: 10, color: C.text, cursor: 'pointer', fontSize: 15, fontWeight: 500 }}>
                Conectar Dados
              </button>
            </div>

            <div style={{ marginTop: 52, display: 'flex', gap: 36, alignItems: 'center' }}>
              {[
                { num: '2.400+', label: 'empresas ativas' },
                { num: '98%', label: 'satisfação' },
                { num: '3x', label: 'mais insights' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>{s.num}</div>
                  <div style={{ color: C.textSubtle, fontSize: 13, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="atlas-float" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -24, background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.22) 0%, transparent 68%)', filter: 'blur(24px)', pointerEvents: 'none' }} />
            <HeroDashboardMock navigate={navigate} />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: `linear-gradient(to bottom, transparent, ${C.bg})`, pointerEvents: 'none' }} />
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            title={<>Inteligência que <span className="gradient-text">trabalha por você</span></>}
            sub="Mais do que dashboards. Uma plataforma que entende seus dados e traduz em decisões."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: <BarChart3 size={22} color={C.purpleLight} />, bg: 'rgba(124,58,237,0.09)', border: 'rgba(124,58,237,0.18)', title: 'Centralização de Dados', desc: 'Conecte todas suas fontes em um único lugar. Excel, ERP, CRM, Google Sheets — tudo integrado automaticamente e em tempo real.' },
              { icon: <Brain size={22} color={C.blueLight} />, bg: 'rgba(59,130,246,0.09)', border: 'rgba(59,130,246,0.18)', title: 'Tradução Inteligente', desc: 'Transformamos gráficos complexos em linguagem clara. Sem tecnicismos, apenas insights que fazem sentido para o seu negócio.' },
              { icon: <Zap size={22} color={C.green} />, bg: 'rgba(52,211,153,0.09)', border: 'rgba(52,211,153,0.18)', title: 'Insights Automáticos', desc: 'A IA monitora seus dados 24/7 e gera alertas quando algo importante acontece, antes que você precise procurar.' },
            ].map(f => (
              <div key={f.title} className="card-glass card-hover" style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, boxShadow: C.glowCard }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: f.bg, border: `1px solid ${f.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ color: C.text, fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.72 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 48px', background: 'rgba(139,92,246,0.025)', borderTop: `1px solid ${C.borderSubtle}`, borderBottom: `1px solid ${C.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader title="Como funciona" sub="Em 3 passos simples, comece a tomar decisões baseadas em dados" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {[
              { step: '01', emoji: '🔗', title: 'Conecte seus dados', desc: 'Integre suas fontes de dados com um clique. Sem configuração técnica, sem complicação.' },
              { step: '02', emoji: '📊', title: 'Organize seus painéis', desc: 'Crie ambientes personalizados por área: Financeiro, Comercial, Marketing e muito mais.' },
              { step: '03', emoji: '⚡', title: 'Receba insights', desc: 'A IA analisa seus dados e entrega interpretações claras e acionáveis em tempo real.' },
            ].map((s, i) => (
              <div key={s.step} style={{ position: 'relative', textAlign: 'center' }}>
                {i < 2 && (
                  <div style={{ position: 'absolute', top: 32, left: 'calc(50% + 56px)', right: '-50%', height: 1, background: 'linear-gradient(to right, rgba(139,92,246,0.3), rgba(139,92,246,0.04))' }} />
                )}
                <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(59,130,246,0.08))', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: C.glowSm }}>
                  {s.emoji}
                </div>
                <div style={{ color: C.purpleLight, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Passo {s.step}</div>
                <h3 style={{ color: C.text, fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader title={<>Integrações <span className="gradient-text">nativas</span></>} sub="Conecte com as ferramentas que você já usa. Sem código, sem configurações complexas." />
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
            {INTEGRATIONS.map(intg => (
              <div key={intg.name} className="card-glass card-hover" style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '11px 20px', color: C.textMuted, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 9 }}>
                <IntgDot color={intg.color} />
                {intg.name}
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 64, textAlign: 'center' }}>
            <p style={{ color: C.textSubtle, fontSize: 13, marginBottom: 20 }}>Empresas que já transformaram seus dados em decisões</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
              {['Loja Moderna', 'Academia Fit', 'Restaurante Do João', 'E-Shop Brasil', 'Tech Services'].map(name => (
                <span key={name} style={{ color: C.textSubtle, fontSize: 14, fontWeight: 500, opacity: 0.65 }}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.13) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: C.text, fontSize: 42, fontWeight: 700, lineHeight: 1.12, marginBottom: 18, letterSpacing: '-0.025em' }}>Pronto para entender seus dados?</h2>
          <p style={{ color: C.textMuted, fontSize: 16, marginBottom: 36, lineHeight: 1.65 }}>Junte-se a mais de 2.400 empresas que usam o Atlas para tomar decisões mais inteligentes e crescer com clareza.</p>
          <button onClick={() => navigate('login')} className="atlas-btn-primary"
            style={{ padding: '16px 40px', borderRadius: 12, color: 'white', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 500, boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
            Começar gratuitamente
          </button>
          <p style={{ color: C.textSubtle, fontSize: 13, marginTop: 14 }}>Sem cartão de crédito · 14 dias grátis · Cancele quando quiser</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.borderSubtle}`, padding: '48px', background: C.bg2 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <AtlasLogo size="sm" />
            <p style={{ color: C.textSubtle, fontSize: 13, lineHeight: 1.72, marginTop: 14, maxWidth: 240 }}>
              Inteligência de dados para pequenas empresas crescerem com clareza e decisões baseadas em realidade.
            </p>
          </div>
          {[
            { title: 'Produto', items: ['Funcionalidades', 'Integrações', 'Preços', 'Changelog'] },
            { title: 'Empresa', items: ['Sobre', 'Blog', 'Carreiras', 'Contato'] },
            { title: 'Suporte', items: ['Documentação', 'Status', 'Comunidade', 'API'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.title}</div>
              {col.items.map(item => (
                <button key={item} style={{ display: 'block', background: 'none', border: 'none', color: C.textSubtle, fontSize: 13, cursor: 'pointer', padding: '5px 0', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.textMuted }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.textSubtle }}>
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 24, borderTop: `1px solid ${C.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: C.textSubtle, fontSize: 13 }}>© 2025 Atlas. Todos os direitos reservados.</span>
          <span style={{ color: C.textSubtle, fontSize: 13 }}>Feito com IA para PMEs brasileiras 🇧🇷</span>
        </div>
      </footer>
    </div>
  )
}

function HeroDashboardMock({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div
      onClick={() => navigate('login')}
      style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid rgba(139,92,246,0.25)`, boxShadow: '0 0 70px rgba(139,92,246,0.18), 0 0 140px rgba(139,92,246,0.07), 0 32px 80px rgba(0,0,0,0.65)', background: C.bg2, cursor: 'pointer' }}>
      {/* Window chrome */}
      <div style={{ display: 'flex', gap: 6, padding: '11px 16px', borderBottom: `1px solid ${C.borderSubtle}`, background: 'rgba(255,255,255,0.02)', alignItems: 'center' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: C.textSubtle, fontSize: 11 }}>atlas.app · Painel Financeiro</span>
        </div>
      </div>
      <div style={{ display: 'flex', height: 390 }}>
        {/* Mini sidebar */}
        <div style={{ width: 52, background: 'rgba(0,0,0,0.25)', borderRight: `1px solid ${C.borderSubtle}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 14, gap: 14 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>A</span>
          </div>
          {[0,1,2,3,4].map(i => <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: i === 0 ? 'rgba(139,92,246,0.28)' : 'rgba(255,255,255,0.04)' }} />)}
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: 18, overflow: 'hidden' }}>
          <div style={{ color: C.textSubtle, fontSize: 10, marginBottom: 14 }}>Dashboard · Painel Financeiro</div>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { l: 'Receita', v: 'R$82K', c: C.green },
              { l: 'Margem', v: '42%', c: C.green },
              { l: 'Ticket', v: 'R$187', c: C.green },
              { l: 'CAC', v: 'R$143', c: C.red },
            ].map(k => (
              <div key={k.l} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: 7, padding: '8px 9px', border: `1px solid ${C.borderSubtle}` }}>
                <div style={{ color: C.textSubtle, fontSize: 9, marginBottom: 3 }}>{k.l}</div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{k.v}</div>
                <div style={{ color: k.c, fontSize: 9 }}>{k.c === C.green ? '↑ 8.2%' : '↓ 3.1%'}</div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 8, padding: '8px 10px', border: `1px solid ${C.borderSubtle}`, marginBottom: 10, height: 120 }}>
            <div style={{ color: C.textSubtle, fontSize: 9, marginBottom: 6 }}>Receita mensal</div>
            <ResponsiveContainer width="100%" height={88}>
              <LineChart data={heroData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <Line type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Insight */}
          <div style={{ background: 'rgba(139,92,246,0.08)', borderRadius: 7, padding: '9px 11px', border: `1px solid rgba(139,92,246,0.22)`, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.purpleNeon, marginTop: 3, flexShrink: 0 }} />
            <div style={{ color: C.purpleNeon, fontSize: 9.5, lineHeight: 1.55 }}>
              <strong>Overview Atlas:</strong> Faturamento cresceu 8% no período. Ticket médio aumentou após reajuste de preço.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AtlasLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? { box: 36, font: 18, text: 22 } : size === 'md' ? { box: 28, font: 14, text: 18 } : { box: 24, font: 12, text: 16 }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: s.box, height: s.box, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: 'white', fontSize: s.font, fontWeight: 800 }}>A</span>
      </div>
      <span style={{ color: C.text, fontSize: s.text, fontWeight: 700, letterSpacing: '-0.01em' }}>Atlas</span>
    </div>
  )
}

function NavLink({ children }: { children: React.ReactNode }) {
  const [hover, setHover] = useState(false)
  return (
    <button style={{ background: 'none', border: 'none', color: hover ? C.text : C.textMuted, cursor: 'pointer', fontSize: 14, transition: 'color 0.2s' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </button>
  )
}

function SectionHeader({ title, sub }: { title: React.ReactNode; sub: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <h2 style={{ color: C.text, fontSize: 42, fontWeight: 700, lineHeight: 1.12, marginBottom: 16, letterSpacing: '-0.025em' }}>{title}</h2>
      <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>{sub}</p>
    </div>
  )
}

function IntgDot({ color }: { color: string }) {
  return <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
}

const INTEGRATIONS = [
  { name: 'Power BI', color: '#F2C811' },
  { name: 'Google Sheets', color: '#0F9D58' },
  { name: 'HubSpot', color: '#FF7A59' },
  { name: 'Pipedrive', color: '#1A73E8' },
  { name: 'Notion', color: '#e2e8f0' },
  { name: 'Excel', color: '#217346' },
  { name: 'Looker Studio', color: '#4285F4' },
  { name: 'Tiny ERP', color: '#6B48FF' },
]
