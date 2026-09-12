import { useState } from 'react'
import { User, Bell, Users, CreditCard, Shield, Plug, Check, ChevronDown, Mail } from 'lucide-react'
import { C } from './atlas-tokens'
import { Reveal, Card, Pill, PrimaryButton } from './atlas-ui'
import { useAtlas } from '../store'
import { USER } from './atlas-data'

type Tab = 'conta' | 'notificacoes' | 'equipe' | 'plano' | 'seguranca'

const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'conta', label: 'Conta', icon: <User size={15} />, desc: 'Seus dados e os da empresa' },
  { id: 'notificacoes', label: 'Notificações', icon: <Bell size={15} />, desc: 'Quando e como o Atlas avisa você' },
  { id: 'equipe', label: 'Equipe', icon: <Users size={15} />, desc: 'Quem tem acesso à conta' },
  { id: 'plano', label: 'Plano e uso', icon: <CreditCard size={15} />, desc: 'Assinatura e limites' },
  { id: 'seguranca', label: 'Segurança', icon: <Shield size={15} />, desc: 'Acesso e proteção de dados' },
]

export default function SettingsPage() {
  const { go, sources, toast } = useAtlas()
  const [tab, setTab] = useState<Tab>('conta')

  return (
    <div className="atlas-page" style={{ padding: '26px 30px 44px', maxWidth: 1180, margin: '0 auto' }}>
      <Reveal>
        <h1 style={{ color: C.text, fontSize: 24, fontWeight: 750, letterSpacing: '-0.025em', marginBottom: 7 }}>Configurações</h1>
        <p style={{ color: C.textMuted, fontSize: 14.5, marginBottom: 24 }}>Gerencie sua conta, sua equipe e a forma como o Atlas trabalha para você.</p>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', gap: 22, alignItems: 'start' }}>
        <Reveal delay={60}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TABS.map(t => {
              const active = tab === t.id
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 11, padding: '12px 14px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.18s', background: active ? 'rgba(139,92,246,0.12)' : 'transparent', border: `1px solid ${active ? C.borderMd : 'transparent'}` }}>
                  <span style={{ color: active ? C.purpleNeon : C.textSubtle, marginTop: 1 }}>{t.icon}</span>
                  <div>
                    <div style={{ color: active ? C.text : C.textMuted, fontSize: 13.5, fontWeight: active ? 600 : 500 }}>{t.label}</div>
                    <div style={{ color: C.textSubtle, fontSize: 11.5, marginTop: 2 }}>{t.desc}</div>
                  </div>
                </button>
              )
            })}
            <button onClick={() => go('integrations')}
              style={{ textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 11, padding: '12px 14px', borderRadius: 12, cursor: 'pointer', background: 'transparent', border: '1px solid transparent', transition: 'all 0.18s' }}>
              <span style={{ color: C.textSubtle, marginTop: 1 }}><Plug size={15} /></span>
              <div>
                <div style={{ color: C.textMuted, fontSize: 13.5, fontWeight: 500 }}>Fontes de dados</div>
                <div style={{ color: C.textSubtle, fontSize: 11.5, marginTop: 2 }}>{sources.length} conectadas</div>
              </div>
            </button>
          </div>
        </Reveal>

        <Reveal delay={100} key={tab}>
          {tab === 'conta' && <ContaTab onSave={() => toast('Alterações salvas', 'Os dados da conta foram atualizados.')} />}
          {tab === 'notificacoes' && <NotificacoesTab />}
          {tab === 'equipe' && <EquipeTab onInvite={() => toast('Convite enviado', 'A pessoa recebe o acesso por e-mail.')} />}
          {tab === 'plano' && <PlanoTab />}
          {tab === 'seguranca' && <SegurancaTab />}
        </Reveal>
      </div>
    </div>
  )
}

// ── Peças ───────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '10px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
        onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }} />
    </div>
  )
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 7 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '10px 34px 10px 13px', borderRadius: 10, background: 'rgba(13,11,26,0.95)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13.5, outline: 'none', appearance: 'none', cursor: 'pointer' }}>
          {options.map(o => <option key={o} value={o} style={{ background: '#0d0b1a' }}>{o}</option>)}
        </select>
        <ChevronDown size={14} color={C.textSubtle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

function Toggle({ label, hint, value, onChange }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: `1px solid ${C.borderSubtle}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: C.text, fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>{label}</div>
        <div style={{ color: C.textSubtle, fontSize: 12.5, lineHeight: 1.5 }}>{hint}</div>
      </div>
      <button onClick={() => onChange(!value)}
        style={{ width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0, padding: 3, background: value ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.09)', transition: 'background 0.22s', display: 'flex', justifyContent: value ? 'flex-end' : 'flex-start' }}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', display: 'block', transition: 'all 0.22s', boxShadow: '0 1px 4px rgba(0,0,0,0.35)' }} />
      </button>
    </div>
  )
}

// ── Abas ────────────────────────────────────────────────────────────────────

function ContaTab({ onSave }: { onSave: () => void }) {
  const [name, setName] = useState(USER.name)
  const [email, setEmail] = useState(USER.email)
  const [company, setCompany] = useState(USER.company)
  const [segment, setSegment] = useState('Varejo')

  return (
    <Card padding={24}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${C.borderSubtle}` }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white' }}>{USER.initial}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 650 }}>{name}</div>
          <div style={{ color: C.textSubtle, fontSize: 13 }}>{email}</div>
        </div>
        <Pill color={C.purpleLight} background="rgba(139,92,246,0.12)">Administrador</Pill>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 22 }}>
        <Field label="Nome completo" value={name} onChange={setName} />
        <Field label="E-mail" value={email} onChange={setEmail} type="email" />
        <Field label="Empresa" value={company} onChange={setCompany} />
        <Select label="Segmento" value={segment} options={['Varejo', 'E-commerce', 'Serviços', 'Alimentação', 'Saúde', 'Educação', 'Indústria']} onChange={setSegment} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PrimaryButton onClick={onSave} icon={<Check size={15} />}>Salvar alterações</PrimaryButton>
      </div>
    </Card>
  )
}

function NotificacoesTab() {
  const [urgentes, setUrgentes] = useState(true)
  const [resumo, setResumo] = useState(true)
  const [sync, setSync] = useState(false)
  const [app, setApp] = useState(true)
  const [freq, setFreq] = useState('A cada 6 horas')

  return (
    <Card padding={24}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: C.text, fontSize: 15.5, fontWeight: 650, marginBottom: 5 }}>Quando o Atlas deve avisar você</div>
        <div style={{ color: C.textSubtle, fontSize: 13, lineHeight: 1.6 }}>O objetivo é chamar sua atenção só quando algo realmente muda no negócio.</div>
      </div>

      <Toggle label="Insights urgentes por e-mail" hint="Envia um e-mail assim que a IA identificar algo de prioridade alta." value={urgentes} onChange={setUrgentes} />
      <Toggle label="Resumo semanal" hint="Toda segunda-feira, um panorama do que mudou na semana." value={resumo} onChange={setResumo} />
      <Toggle label="Falhas de sincronização" hint="Avisa quando uma fonte de dados parar de responder." value={sync} onChange={setSync} />
      <Toggle label="Notificações no sistema" hint="Mostra novidades no sino da barra superior." value={app} onChange={setApp} />

      <div style={{ marginTop: 22, maxWidth: 300 }}>
        <Select label="Frequência da análise automática" value={freq} options={['Em tempo real', 'A cada 6 horas', 'Diária', 'Semanal']} onChange={setFreq} />
      </div>
    </Card>
  )
}

function EquipeTab({ onInvite }: { onInvite: () => void }) {
  const members = [
    { name: USER.name, email: USER.email, role: 'Administrador', initial: USER.initial, color: '#7c3aed' },
    { name: 'Marina Costa', email: 'marina@empresa.com', role: 'Editor', initial: 'M', color: '#3b82f6' },
    { name: 'Rafael Lima', email: 'rafael@empresa.com', role: 'Leitor', initial: 'R', color: '#34d399' },
  ]
  return (
    <Card padding={24}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <div style={{ color: C.text, fontSize: 15.5, fontWeight: 650, marginBottom: 5 }}>Pessoas com acesso</div>
          <div style={{ color: C.textSubtle, fontSize: 13 }}>3 de 10 assentos usados no plano Pro.</div>
        </div>
        <PrimaryButton onClick={onInvite} icon={<Mail size={14} />}>Convidar pessoa</PrimaryButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {members.map(m => (
          <div key={m.email} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{m.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.text, fontSize: 13.5, fontWeight: 500 }}>{m.name}</div>
              <div style={{ color: C.textSubtle, fontSize: 12.5 }}>{m.email}</div>
            </div>
            <Pill color={m.role === 'Administrador' ? C.purpleLight : C.textMuted} background={m.role === 'Administrador' ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)'}>{m.role}</Pill>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PlanoTab() {
  const { sources, panels } = useAtlas()
  const usage = [
    { label: 'Fontes de dados', used: sources.length, total: 10 },
    { label: 'Painéis publicados', used: panels.length, total: 20 },
    { label: 'Perguntas à Atlas IA', used: 0, total: 500 },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding={24} style={{ border: '1px solid rgba(139,92,246,0.25)', background: 'rgba(19,15,36,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <span style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>Plano Pro</span>
              <Pill color={C.green} background="rgba(52,211,153,0.12)">Ativo</Pill>
            </div>
            <div style={{ color: C.textSubtle, fontSize: 13 }}>Renova em 12 de outubro · R$ 249/mês</div>
          </div>
          <PrimaryButton>Gerenciar assinatura</PrimaryButton>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {usage.map(u => {
            const pct = Math.round((u.used / u.total) * 100)
            return (
              <div key={u.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ color: C.textMuted, fontSize: 13 }}>{u.label}</span>
                  <span style={{ color: C.textSubtle, fontSize: 12.5 }}>{u.used} de {u.total}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div className="bar-grow" style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? C.orange : 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 3 }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card padding={22}>
        <div style={{ color: C.text, fontSize: 14.5, fontWeight: 650, marginBottom: 14 }}>Últimas faturas</div>
        {[
          { date: '12 de setembro de 2026', value: 'R$ 249,00' },
          { date: '12 de agosto de 2026', value: 'R$ 249,00' },
          { date: '12 de julho de 2026', value: 'R$ 249,00' },
        ].map(f => (
          <div key={f.date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.borderSubtle}` }}>
            <span style={{ color: C.textMuted, fontSize: 13 }}>{f.date}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{f.value}</span>
              <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<Check size={10} />}>Pago</Pill>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

function SegurancaTab() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [alerts, setAlerts] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding={24}>
        <div style={{ color: C.text, fontSize: 15.5, fontWeight: 650, marginBottom: 16 }}>Acesso à conta</div>
        <Toggle label="Verificação em duas etapas" hint="Pede um código adicional a cada novo acesso." value={twoFactor} onChange={setTwoFactor} />
        <Toggle label="Alertas de acesso" hint="Avisa por e-mail quando a conta for acessada de um novo dispositivo." value={alerts} onChange={setAlerts} />
        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button className="atlas-btn-secondary" style={{ padding: '9px 16px', borderRadius: 10, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Alterar senha</button>
          <button className="atlas-btn-ghost" style={{ padding: '9px 16px', borderRadius: 10, color: C.textMuted, cursor: 'pointer', fontSize: 13 }}>Encerrar outras sessões</button>
        </div>
      </Card>

      <Card padding={24}>
        <div style={{ color: C.text, fontSize: 15.5, fontWeight: 650, marginBottom: 6 }}>Privacidade dos dados</div>
        <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.7, marginBottom: 16 }}>
          Os dados conectados ao Atlas são usados exclusivamente para gerar os painéis e insights da sua conta.
          A conexão com cada fonte é criptografada e pode ser revogada a qualquer momento na tela de Integrações.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<Check size={10} />}>Conformidade LGPD</Pill>
          <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<Check size={10} />}>Criptografia em trânsito e em repouso</Pill>
          <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<Check size={10} />}>Backup diário</Pill>
        </div>
      </Card>
    </div>
  )
}
