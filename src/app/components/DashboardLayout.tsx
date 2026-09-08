import { useState } from 'react'
import { LayoutDashboard, PanelTop, Lightbulb, Plug, Settings, MessageSquare, Plus, Search, Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { C } from './atlas-tokens'
import { AtlasLogo } from './LandingPage'
import DashboardHome, { type SavedInsight } from './DashboardHome'
import DashboardEmpty from './DashboardEmpty'
import InsightsPage from './InsightsPage'
import IntegrationsPage from './IntegrationsPage'
import AIAssistant from './AIAssistant'
import type { Page } from '../App'

export type Section = 'home' | 'panels' | 'insights' | 'integrations' | 'ai' | 'settings'

interface Props {
  navigate: (page: Page) => void
}

export default function DashboardLayout({ navigate }: Props) {
  const [section, setSection] = useState<Section>('home')
  const [searchVal, setSearchVal] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([])

  const handleSaveInsight = (insight: SavedInsight) => setSavedInsights(prev => [insight, ...prev])

  const navItems: { id: Section; icon: React.ReactNode; label: string; badge?: number }[] = [
    { id: 'home', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { id: 'panels', icon: <PanelTop size={17} />, label: 'Painéis', badge: 3 },
    { id: 'insights', icon: <Lightbulb size={17} />, label: 'Insights', badge: 5 + savedInsights.length },
    { id: 'integrations', icon: <Plug size={17} />, label: 'Integrações' },
    { id: 'settings', icon: <Settings size={17} />, label: 'Configurações' },
  ]

  const sectionTitles: Record<Section, string> = {
    home: 'Dashboard', panels: 'Painéis', insights: 'Insights',
    integrations: 'Integrações', ai: 'Assistente IA', settings: 'Configurações',
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: C.bg2, borderRight: `1px solid ${C.borderSubtle}`, display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 20 }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${C.borderSubtle}` }}>
          <AtlasLogo size="sm" />
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, borderRadius: 6, padding: '3px 8px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
            <span style={{ color: C.purpleLight, fontSize: 11, fontWeight: 500 }}>Pro</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`sidebar-item ${section === item.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: section === item.id ? C.purpleNeon : C.textMuted }}>
              {item.icon}
              <span style={{ fontSize: 14, flex: 1 }}>{item.label}</span>
              {item.badge && (
                <div style={{ background: 'rgba(139,92,246,0.2)', borderRadius: 5, padding: '1px 6px', color: C.purpleLight, fontSize: 11, fontWeight: 600 }}>{item.badge}</div>
              )}
            </button>
          ))}
        </nav>

        {/* AI Assistant CTA */}
        <div style={{ padding: '12px 8px', borderTop: `1px solid ${C.borderSubtle}` }}>
          <button onClick={() => setSection('ai')}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 11, border: `1px solid ${C.borderMd}`,
              background: section === 'ai' ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.07)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.background = section === 'ai' ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.07)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={14} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: C.purpleLight, fontSize: 13, fontWeight: 600 }}>Perguntar ao Atlas</div>
              <div style={{ color: C.textSubtle, fontSize: 11 }}>IA disponível</div>
            </div>
          </button>
        </div>

        {/* User */}
        <div style={{ padding: '12px', borderTop: `1px solid ${C.borderSubtle}`, position: 'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 9, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>J</span>
            </div>
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>João Silva</div>
              <div style={{ color: C.textSubtle, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>joao@empresa.com</div>
            </div>
            <ChevronDown size={13} color={C.textSubtle} />
          </button>
          {profileOpen && (
            <div style={{ position: 'absolute', bottom: '100%', left: 12, right: 12, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: '6px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 50 }}>
              <ProfileMenuItem icon={<User size={14} />} label="Perfil" />
              <ProfileMenuItem icon={<Settings size={14} />} label="Configurações" onClick={() => { setSection('settings'); setProfileOpen(false) }} />
              <div style={{ height: 1, background: C.borderSubtle, margin: '4px 0' }} />
              <ProfileMenuItem icon={<LogOut size={14} />} label="Sair" onClick={() => navigate('landing')} danger />
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 56, borderBottom: `1px solid ${C.borderSubtle}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, background: C.bg2, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <span style={{ color: C.textSubtle, fontSize: 12, fontWeight: 400 }}>Atlas /</span>
            {' '}
            <span style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{sectionTitles[section]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, borderRadius: 9, padding: '7px 12px', width: 220 }}>
            <Search size={14} color={C.textSubtle} />
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Buscar..." style={{ background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 13, flex: 1, caretColor: C.purpleLight }} />
          </div>
          <button style={{ position: 'relative', width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted }}>
            <Bell size={16} />
            <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: C.purpleNeon }} />
          </button>
          <button onClick={() => setSection('panels')} className="atlas-btn-primary"
            style={{ padding: '8px 16px', borderRadius: 9, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={15} /> Adicionar Painel
          </button>
        </header>

        {/* Content area */}
        <main style={{ flex: 1, overflow: 'auto', background: C.bg }} className="atlas-scrollbar">
          {section === 'home' && <DashboardEmpty navigateSection={(s) => setSection(s as Section)} />}
          {section === 'panels' && <DashboardHome onSaveInsight={handleSaveInsight} />}
          {section === 'insights' && <InsightsPage extraInsights={savedInsights} />}
          {section === 'integrations' && <IntegrationsPage />}
          {section === 'ai' && <AIAssistant />}
          {section === 'settings' && <SettingsPlaceholder />}
        </main>
      </div>
    </div>
  )
}

function ProfileMenuItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick?: () => void; danger?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 7, background: hover ? 'rgba(255,255,255,0.05)' : 'none', border: 'none', cursor: 'pointer', color: danger ? C.red : hover ? C.text : C.textMuted, fontSize: 13, transition: 'all 0.15s' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {icon}{label}
    </button>
  )
}

function SettingsPlaceholder() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: C.text, fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Configurações</h2>
      <p style={{ color: C.textMuted, fontSize: 14 }}>Gerencie sua conta, integrações, equipe e preferências do Atlas.</p>
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {['Conta', 'Segurança', 'Equipe', 'Integrações', 'Notificações', 'Plano e faturamento'].map(item => (
          <div key={item} className="card-glass card-hover" style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px', cursor: 'pointer' }}>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{item}</div>
            <div style={{ color: C.textSubtle, fontSize: 13 }}>Gerencie {item.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
