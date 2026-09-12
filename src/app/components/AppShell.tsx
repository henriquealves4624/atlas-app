import { useState } from 'react'
import {
  LayoutDashboard, PanelTop, Lightbulb, Plug, Settings, Sparkles, Plus,
  Bell, ChevronDown, LogOut, User, X, CheckCircle2, AlertTriangle, Info, ArrowRight,
} from 'lucide-react'
import { C } from './atlas-tokens'
import { AtlasLogo, PrimaryButton, TYPE_META } from './atlas-ui'
import HomePage from './HomePage'
import PanelsPage from './PanelsPage'
import PanelBuilder from './PanelBuilder'
import InsightsPage from './InsightsPage'
import IntegrationsPage from './IntegrationsPage'
import AIAssistant from './AIAssistant'
import SettingsPage from './SettingsPage'
import ConnectFlow from './ConnectFlow'
import { useAtlas, type Section } from '../store'
import { USER } from './atlas-data'

const TITLES: Record<Section, string> = {
  home: 'Início',
  panels: 'Painéis',
  insights: 'Central de Insights',
  integrations: 'Integrações',
  ai: 'Perguntar ao Atlas',
  settings: 'Configurações',
  builder: 'Novo painel',
}

export default function AppShell({ onLogout }: { onLogout: () => void }) {
  const { section, go, insights } = useAtlas()
  const [profileOpen, setProfileOpen] = useState(false)
  const pending = insights.filter(i => i.status === 'gerado').length

  const primary: { id: Section; icon: React.ReactNode; label: string; badge?: number; gradient?: boolean }[] = [
    { id: 'home', icon: <LayoutDashboard size={17} />, label: 'Início' },
    { id: 'panels', icon: <PanelTop size={17} />, label: 'Painéis' },
    { id: 'insights', icon: <Lightbulb size={17} />, label: 'Central de Insights', badge: pending },
    { id: 'ai', icon: <Sparkles size={17} />, label: 'Perguntar ao Atlas', gradient: true },
  ]
  const secondary: { id: Section; icon: React.ReactNode; label: string }[] = [
    { id: 'integrations', icon: <Plug size={17} />, label: 'Integrações' },
    { id: 'settings', icon: <Settings size={17} />, label: 'Configurações' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      {/* ── Menu lateral ────────────────────────────────────────────────── */}
      <aside style={{ width: 232, background: C.bg2, borderRight: `1px solid ${C.borderSubtle}`, display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 20 }}>
        <div style={{ padding: '22px 20px 18px' }}>
          <AtlasLogo size={26} />
        </div>

        <nav className="atlas-scrollbar" style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {primary.map(item => (
            <NavItem key={item.id} {...item} active={section === item.id || (item.id === 'panels' && section === 'builder')} onClick={() => go(item.id)} />
          ))}

          <div style={{ height: 1, background: C.borderSubtle, margin: '12px 10px' }} />

          {secondary.map(item => (
            <NavItem key={item.id} {...item} active={section === item.id} onClick={() => go(item.id)} />
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: `1px solid ${C.borderSubtle}`, position: 'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{USER.initial}</span>
            </div>
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{USER.name}</div>
              <div style={{ color: C.textSubtle, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{USER.email}</div>
            </div>
            <ChevronDown size={13} color={C.textSubtle} />
          </button>

          {profileOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
              <div className="atlas-slide-in" style={{ position: 'absolute', bottom: '100%', left: 12, right: 12, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 50 }}>
                <MenuItem icon={<User size={14} />} label="Meu perfil" onClick={() => { go('settings'); setProfileOpen(false) }} />
                <MenuItem icon={<Settings size={14} />} label="Configurações" onClick={() => { go('settings'); setProfileOpen(false) }} />
                <div style={{ height: 1, background: C.borderSubtle, margin: '4px 0' }} />
                <MenuItem icon={<LogOut size={14} />} label="Sair da conta" onClick={onLogout} danger />
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ── Conteúdo ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar />
        <main style={{ flex: 1, overflow: 'auto', background: C.bg }} className="atlas-scrollbar">
          {section === 'home' && <HomePage />}
          {section === 'panels' && <PanelsPage />}
          {section === 'builder' && <PanelBuilder />}
          {section === 'insights' && <InsightsPage />}
          {section === 'integrations' && <IntegrationsPage />}
          {section === 'ai' && <AIAssistant />}
          {section === 'settings' && <SettingsPage />}
        </main>
      </div>

      <ConnectFlow />
      <Toaster />
    </div>
  )
}

function NavItem({ icon, label, badge, gradient, active, onClick }: {
  icon: React.ReactNode; label: string; badge?: number; gradient?: boolean; active: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} className={`sidebar-item ${active ? 'active' : ''}`}
      style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: active ? C.purpleNeon : C.textMuted }}>
      {gradient ? (
        <span style={{ width: 21, height: 21, borderRadius: 7, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={12} color="white" />
        </span>
      ) : icon}
      <span style={{ fontSize: 13.5, flex: 1 }}>{label}</span>
      {badge ? (
        <span style={{ background: 'rgba(139,92,246,0.2)', borderRadius: 5, padding: '1px 6px', color: C.purpleLight, fontSize: 11, fontWeight: 700 }}>{badge}</span>
      ) : null}
    </button>
  )
}

function MenuItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick?: () => void; danger?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 8, background: hover ? 'rgba(255,255,255,0.05)' : 'none', border: 'none', cursor: 'pointer', color: danger ? C.red : hover ? C.text : C.textMuted, fontSize: 13, transition: 'all 0.15s' }}>
      {icon}{label}
    </button>
  )
}

// ── Barra superior ──────────────────────────────────────────────────────────

function TopBar() {
  const { section, go, insights, panels } = useAtlas()
  const [notifOpen, setNotifOpen] = useState(false)
  const generated = insights.filter(i => i.status === 'gerado')
  const showConnect = section !== 'integrations' && section !== 'builder'

  return (
    <header style={{ height: 58, borderBottom: `1px solid ${C.borderSubtle}`, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 14, background: C.bg2, flexShrink: 0, position: 'relative', zIndex: 30 }}>
      <span style={{ color: C.text, fontSize: 14.5, fontWeight: 500, flex: 1 }}>{TITLES[section]}</span>

      <div style={{ position: 'relative' }}>
        <button onClick={() => setNotifOpen(!notifOpen)}
          style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.035)', border: `1px solid ${notifOpen ? C.borderMd : C.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, transition: 'all 0.2s' }}>
          <Bell size={16} />
          {generated.length > 0 && <span className="atlas-glow" style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: C.purpleNeon }} />}
        </button>

        {notifOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
            <div className="atlas-slide-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 340, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, padding: 8, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 50 }}>
              <div style={{ padding: '8px 10px 12px', color: C.text, fontSize: 13.5, fontWeight: 600 }}>Novidades do Atlas</div>
              {generated.length === 0 ? (
                <div style={{ padding: '16px 12px 20px', color: C.textSubtle, fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
                  {panels.length === 0
                    ? 'Conecte seus dados para o Atlas começar a encontrar insights.'
                    : 'Nenhum insight aguardando avaliação.'}
                </div>
              ) : (
                <>
                  {generated.slice(0, 4).map(i => (
                    <button key={i.id} className="row-hover"
                      onClick={() => { go('insights', { insightStatus: 'gerado' }); setNotifOpen(false) }}
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderRadius: 10, padding: '10px 11px', cursor: 'pointer', display: 'flex', gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_META[i.type].color, marginTop: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.45, marginBottom: 3 }}>{i.title}</div>
                        <div style={{ color: C.textSubtle, fontSize: 11.5 }}>{i.impact}</div>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => { go('insights', { insightStatus: 'gerado' }); setNotifOpen(false) }}
                    style={{ width: '100%', marginTop: 6, padding: '9px 0', borderRadius: 9, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, color: C.purpleLight, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                    Abrir Central de Insights
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {showConnect && (
        <PrimaryButton onClick={() => go('integrations')} icon={<Plus size={15} />} style={{ padding: '9px 16px', fontSize: 13 }}>
          Conectar dados
        </PrimaryButton>
      )}
    </header>
  )
}

// ── Toasts ──────────────────────────────────────────────────────────────────

function Toaster() {
  const { toasts, dismissToast } = useAtlas()
  const icons = {
    success: <CheckCircle2 size={16} color={C.green} />,
    warn: <AlertTriangle size={16} color={C.orange} />,
    info: <Info size={16} color={C.blueLight} />,
  }
  return (
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 400, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
      {toasts.map(t => (
        <div key={t.id} className="atlas-toast"
          style={{ display: 'flex', alignItems: 'flex-start', gap: 11, background: 'rgba(17,13,32,0.97)', border: `1px solid ${C.border}`, borderRadius: 13, padding: '13px 15px', boxShadow: '0 12px 40px rgba(0,0,0,0.55)', minWidth: 300 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>{icons[t.kind]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: C.text, fontSize: 13.5, fontWeight: 600 }}>{t.text}</div>
            {t.detail && <div style={{ color: C.textSubtle, fontSize: 12.5, marginTop: 3, lineHeight: 1.5 }}>{t.detail}</div>}
          </div>
          {t.action && (
            <button onClick={() => { t.action!.onClick(); dismissToast(t.id) }}
              style={{ background: 'rgba(139,92,246,0.14)', border: `1px solid ${C.borderMd}`, borderRadius: 8, padding: '5px 11px', color: C.purpleLight, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              {t.action.label}
            </button>
          )}
          <button onClick={() => dismissToast(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSubtle, display: 'flex', flexShrink: 0, padding: 2 }}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
