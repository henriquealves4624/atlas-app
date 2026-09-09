import { useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard, PanelTop, Lightbulb, Plug, Settings, Sparkles, Plus, Search,
  Bell, ChevronDown, LogOut, User, X, CheckCircle2, AlertTriangle, Info, ArrowRight,
} from 'lucide-react'
import { C } from './atlas-tokens'
import { AtlasLogo, Pill, TYPE_META } from './atlas-ui'
import HomePage from './HomePage'
import PanelsPage from './PanelsPage'
import PanelBuilder from './PanelBuilder'
import InsightsPage from './InsightsPage'
import IntegrationsPage from './IntegrationsPage'
import AIAssistant from './AIAssistant'
import SettingsPage from './SettingsPage'
import { useAtlas, type Section } from '../store'
import { PANELS, PANEL_LABEL } from './atlas-data'

const SECTION_TITLE: Record<Section, string> = {
  home: 'Início',
  panels: 'Painéis',
  insights: 'Central de Insights',
  integrations: 'Integrações',
  ai: 'Perguntar ao Atlas',
  settings: 'Configurações',
  builder: 'Novo painel',
}

interface Props {
  onLogout: () => void
}

export default function AppShell({ onLogout }: Props) {
  const { section, go, insights, sources } = useAtlas()
  const [profileOpen, setProfileOpen] = useState(false)
  const novos = insights.filter(i => i.status === 'novo')
  const emAndamento = insights.filter(i => i.status === 'priorizado' || i.status === 'andamento')

  const groups: { label?: string; items: { id: Section; icon: React.ReactNode; label: string; badge?: number; gradient?: boolean }[] }[] = [
    { items: [{ id: 'home', icon: <LayoutDashboard size={17} />, label: 'Início' }] },
    {
      label: 'Seus dados',
      items: [
        { id: 'panels', icon: <PanelTop size={17} />, label: 'Painéis' },
        { id: 'integrations', icon: <Plug size={17} />, label: 'Integrações', badge: sources.filter(s => s.connected).length },
      ],
    },
    {
      label: 'Inteligência',
      items: [
        { id: 'insights', icon: <Lightbulb size={17} />, label: 'Central de Insights', badge: novos.length },
        { id: 'ai', icon: <Sparkles size={17} />, label: 'Perguntar ao Atlas', gradient: true },
      ],
    },
    { items: [{ id: 'settings', icon: <Settings size={17} />, label: 'Configurações' }] },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{ width: 236, background: C.bg2, borderRight: `1px solid ${C.borderSubtle}`, display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 20 }}>
        <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${C.borderSubtle}` }}>
          <AtlasLogo size="sm" />
          <div style={{ marginTop: 9, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, borderRadius: 6, padding: '3px 8px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
            <span style={{ color: C.purpleLight, fontSize: 11, fontWeight: 500 }}>Plano Pro</span>
          </div>
        </div>

        <nav className="atlas-scrollbar" style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {groups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 8 }}>
              {group.label && (
                <div style={{ color: C.textSubtle, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.11em', padding: '10px 12px 6px' }}>
                  {group.label}
                </div>
              )}
              {group.items.map(item => {
                const active = section === item.id || (item.id === 'panels' && section === 'builder')
                return (
                  <button key={item.id} onClick={() => go(item.id)}
                    className={`sidebar-item ${active ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: active ? C.purpleNeon : C.textMuted }}>
                    {item.gradient ? (
                      <span style={{ width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Sparkles size={12} color="white" />
                      </span>
                    ) : item.icon}
                    <span style={{ fontSize: 13.5, flex: 1 }}>{item.label}</span>
                    {item.badge ? (
                      <span style={{ background: 'rgba(139,92,246,0.2)', borderRadius: 5, padding: '1px 6px', color: C.purpleLight, fontSize: 11, fontWeight: 700 }}>{item.badge}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Resumo do plano de ação */}
        <div style={{ padding: '0 10px 12px' }}>
          <button onClick={() => go('insights', { insightStatus: 'andamento' })}
            style={{ width: '100%', textAlign: 'left', background: 'rgba(139,92,246,0.07)', border: `1px solid ${C.borderMd}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.13)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.07)' }}>
            <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Plano de ação</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ color: C.purpleLight, fontSize: 20, fontWeight: 750 }}>{emAndamento.length}</span>
              <span style={{ color: C.textMuted, fontSize: 12 }}>ações abertas</span>
            </div>
          </button>
        </div>

        <div style={{ padding: 12, borderTop: `1px solid ${C.borderSubtle}`, position: 'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
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
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
              <div style={{ position: 'absolute', bottom: '100%', left: 12, right: 12, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 50 }}>
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
        <TopBar onLogout={onLogout} />
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

      <Toaster />
    </div>
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

function TopBar({ onLogout }: { onLogout: () => void }) {
  const { section, go, insights } = useAtlas()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const novos = insights.filter(i => i.status === 'novo')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        boxRef.current?.querySelector('input')?.focus()
      }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const q = query.trim().toLowerCase()
  const results = q.length > 1 ? [
    ...insights.filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .slice(0, 4).map(i => ({ id: i.id, label: i.title, hint: `Insight · ${PANEL_LABEL[i.panelId]}`, go: () => go('insights', { insightStatus: i.status }) })),
    ...PANELS.filter(p => p.label.toLowerCase().includes(q))
      .map(p => ({ id: p.id, label: p.label, hint: 'Painel', go: () => go('panels', { panelId: p.id }) })),
  ] : []

  return (
    <header style={{ height: 58, borderBottom: `1px solid ${C.borderSubtle}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, background: C.bg2, flexShrink: 0, position: 'relative', zIndex: 30 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ color: C.textSubtle, fontSize: 12 }}>Atlas /</span>{' '}
        <span style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{SECTION_TITLE[section]}</span>
      </div>

      {/* Busca */}
      <div ref={boxRef} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${searchOpen ? C.borderMd : C.borderSubtle}`, borderRadius: 10, padding: '7px 12px', width: 250, transition: 'border-color 0.2s' }}>
          <Search size={14} color={C.textSubtle} />
          <input value={query} onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Buscar insights e painéis..."
            style={{ background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 13, flex: 1, minWidth: 0, caretColor: C.purpleLight }} />
          <kbd style={{ color: C.textSubtle, fontSize: 10, border: `1px solid ${C.borderSubtle}`, borderRadius: 4, padding: '1px 5px', fontFamily: 'inherit' }}>Ctrl K</kbd>
        </div>

        {searchOpen && q.length > 1 && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setSearchOpen(false)} />
            <div className="atlas-slide-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 340, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 13, padding: 7, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 50 }}>
              {results.length === 0 ? (
                <div style={{ padding: '16px 12px', color: C.textSubtle, fontSize: 13, textAlign: 'center' }}>Nada encontrado para "{query}"</div>
              ) : results.map(r => (
                <button key={r.id + r.hint} onClick={() => { r.go(); setSearchOpen(false); setQuery('') }} className="row-hover"
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderRadius: 9, padding: '9px 11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: C.text, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</div>
                    <div style={{ color: C.textSubtle, fontSize: 11.5 }}>{r.hint}</div>
                  </div>
                  <ArrowRight size={13} color={C.textSubtle} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Notificações */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setNotifOpen(!notifOpen)}
          style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${notifOpen ? C.borderMd : C.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, transition: 'all 0.2s' }}>
          <Bell size={16} />
          {novos.length > 0 && <div className="atlas-glow" style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: C.purpleNeon }} />}
        </button>

        {notifOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
            <div className="atlas-slide-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 348, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, padding: 8, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 50 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px 12px' }}>
                <span style={{ color: C.text, fontSize: 13.5, fontWeight: 650 }}>Novidades do Atlas</span>
                <Pill color={C.purpleLight} background="rgba(139,92,246,0.14)">{novos.length} novos</Pill>
              </div>
              {novos.slice(0, 4).map(i => {
                const meta = TYPE_META[i.type]
                return (
                  <button key={i.id} onClick={() => { go('insights', { insightStatus: 'novo' }); setNotifOpen(false) }} className="row-hover"
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderRadius: 10, padding: '10px 11px', cursor: 'pointer', display: 'flex', gap: 10 }}>
                    <span style={{ color: meta.color, flexShrink: 0, marginTop: 1 }}>{meta.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: C.text, fontSize: 13, lineHeight: 1.4, marginBottom: 3 }}>{i.title}</div>
                      <div style={{ color: C.textSubtle, fontSize: 11.5 }}>{PANEL_LABEL[i.panelId]} · {i.time}</div>
                    </div>
                  </button>
                )
              })}
              {novos.length === 0 && (
                <div style={{ padding: '18px 12px', color: C.textSubtle, fontSize: 13, textAlign: 'center' }}>Nenhum insight aguardando avaliação.</div>
              )}
              <button onClick={() => { go('insights', { insightStatus: 'novo' }); setNotifOpen(false) }}
                style={{ width: '100%', marginTop: 6, padding: '9px 0', borderRadius: 9, background: 'rgba(139,92,246,0.1)', border: `1px solid ${C.borderMd}`, color: C.purpleLight, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Abrir Central de Insights
              </button>
            </div>
          </>
        )}
      </div>

      <button onClick={() => go('builder')} className="atlas-btn-primary"
        style={{ padding: '9px 16px', borderRadius: 10, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <Plus size={15} /> Novo painel
      </button>
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
        <div key={t.id} className="atlas-toast card-glass"
          style={{ display: 'flex', alignItems: 'flex-start', gap: 11, border: `1px solid ${C.border}`, borderRadius: 13, padding: '13px 15px', boxShadow: '0 12px 40px rgba(0,0,0,0.55)', minWidth: 300 }}>
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
