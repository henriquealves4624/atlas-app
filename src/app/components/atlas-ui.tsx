import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check, Clock, Inbox, Archive, Layers, LayoutDashboard } from 'lucide-react'
import { C } from './atlas-tokens'
import markUrl from '../../assets/atlas-mark.png'
import fullUrl from '../../assets/atlas-logo-full.png'
import type { InsightType, InsightStatus, Priority } from './atlas-data'

// ── Marca ───────────────────────────────────────────────────────────────────

export function AtlasLogo({ size = 26, showName = true }: { size?: number; showName?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src={markUrl} alt="Atlas" width={size} height={size} style={{ display: 'block', flexShrink: 0 }} />
      {showName && (
        <span style={{ color: C.text, fontSize: size * 0.66, fontWeight: 300, letterSpacing: '0.14em', lineHeight: 1 }}>
          atlas
        </span>
      )}
    </div>
  )
}

export function AtlasLogoFull({ width = 150 }: { width?: number }) {
  return <img src={fullUrl} alt="Atlas" style={{ width, display: 'block' }} />
}

// ── Entrada animada ─────────────────────────────────────────────────────────

export function Reveal({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="atlas-reveal" style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

// ── Número que conta ────────────────────────────────────────────────────────

export function CountUp({ value, prefix = '', suffix = '', decimals = 0, duration = 1000 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number; duration?: number
}) {
  const [display, setDisplay] = useState(0)
  const frame = useRef<number>()

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setDisplay(value * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => { if (frame.current) cancelAnimationFrame(frame.current) }
  }, [value, duration])

  return <>{prefix}{display.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

// ── Sparkline ───────────────────────────────────────────────────────────────

export function Sparkline({ values, color = C.purpleLight, width = 120, height = 34, fill = true, strokeWidth = 2, responsive = false }: {
  values: number[]; color?: string; width?: number; height?: number; fill?: boolean; strokeWidth?: number; responsive?: boolean
}) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pad = strokeWidth
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - pad * 2) + pad
    const y = height - pad - ((v - min) / span) * (height - pad * 2)
    return [x, y] as const
  })
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`
  const gid = `sk-${color.replace(/[^a-z0-9]/gi, '')}-${width}-${height}`

  return (
    <svg width={responsive ? '100%' : width} height={height} viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={responsive ? 'none' : undefined} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} className="atlas-spark-area" />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} className="atlas-spark-line" />
    </svg>
  )
}

// ── Origem do insight ───────────────────────────────────────────────────────

export function PanelTag({ name }: { name: string }) {
  return (
    <span title={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, maxWidth: '100%', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: C.purpleLight, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 500, lineHeight: 1.5 }}>
      <LayoutDashboard size={10} style={{ flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
    </span>
  )
}

// ── Semântica dos insights ──────────────────────────────────────────────────

export const TYPE_META: Record<InsightType, { label: string; color: string; soft: string }> = {
  alerta: { label: 'Atenção', color: C.orange, soft: 'rgba(251,146,60,0.1)' },
  oportunidade: { label: 'Oportunidade', color: C.green, soft: 'rgba(52,211,153,0.1)' },
  tendencia: { label: 'Tendência', color: C.blueLight, soft: 'rgba(96,165,250,0.1)' },
}

export const STATUS_META: Record<InsightStatus, { label: string; short: string; color: string; soft: string; icon: React.ReactNode; hint: string }> = {
  gerado: { label: 'Insights gerados', short: 'Gerado', color: C.purpleNeon, soft: 'rgba(192,132,252,0.12)', icon: <Layers size={14} />, hint: 'Tudo o que a Atlas IA identificou nos seus painéis' },
  backlog: { label: 'Backlog', short: 'Backlog', color: C.purpleLight, soft: 'rgba(167,139,250,0.12)', icon: <Inbox size={14} />, hint: 'Insights que você decidiu acompanhar' },
  andamento: { label: 'Em andamento', short: 'Em andamento', color: C.yellow, soft: 'rgba(251,191,36,0.12)', icon: <Clock size={14} />, hint: 'Ações que o time já está executando' },
  concluido: { label: 'Concluídos', short: 'Concluído', color: C.green, soft: 'rgba(52,211,153,0.12)', icon: <Check size={14} />, hint: 'Ações finalizadas e registradas no contexto do Atlas' },
  descartado: { label: 'Descartados', short: 'Descartado', color: C.textSubtle, soft: 'rgba(148,163,184,0.1)', icon: <Archive size={14} />, hint: 'Insights que não fazem sentido para o seu contexto' },
}

export const PRIORITY_META: Record<Priority, { label: string; color: string; soft: string }> = {
  alta: { label: 'Alta', color: C.red, soft: 'rgba(248,113,113,0.12)' },
  media: { label: 'Média', color: C.orange, soft: 'rgba(251,146,60,0.12)' },
  baixa: { label: 'Baixa', color: C.blueLight, soft: 'rgba(96,165,250,0.12)' },
}

// ── Peças de interface ──────────────────────────────────────────────────────

export function Tag({ children, color = C.textSubtle }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ color, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{children}</span>
  )
}

export function Dot() {
  return <span style={{ color: C.textSubtle, opacity: 0.5, fontSize: 12 }}>·</span>
}

export function Pill({ children, color = C.textMuted, background = 'rgba(255,255,255,0.05)', icon }: {
  children: React.ReactNode; color?: string; background?: string; icon?: React.ReactNode
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background, color, borderRadius: 6, padding: '3px 9px', fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {icon}{children}
    </span>
  )
}

export function Card({ children, style, padding = 20, hover = false, className = '', onClick }: {
  children: React.ReactNode; style?: React.CSSProperties; padding?: number; hover?: boolean; className?: string; onClick?: () => void
}) {
  return (
    <div onClick={onClick} className={`${hover ? 'card-hover ' : ''}${className}`}
      style={{ background: 'rgba(15,12,28,0.66)', border: `1px solid ${C.border}`, borderRadius: 16, padding, backdropFilter: 'blur(14px)', ...style }}>
      {children}
    </div>
  )
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
      <div>
        <h2 style={{ color: C.text, fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ color: C.textSubtle, fontSize: 13, marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function PrimaryButton({ children, onClick, icon, disabled, style }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; disabled?: boolean; style?: React.CSSProperties
}) {
  return (
    <button onClick={onClick} disabled={disabled} className="atlas-btn-primary"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, border: 'none', color: 'white', fontSize: 13.5, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      {icon}{children}
    </button>
  )
}

export function GhostButton({ children, onClick, icon, style, tone }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; style?: React.CSSProperties; tone?: 'danger'
}) {
  return (
    <button onClick={onClick} className="atlas-ghost"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 16px', borderRadius: 10,
        background: tone === 'danger' ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${tone === 'danger' ? 'rgba(248,113,113,0.2)' : C.borderSubtle}`,
        color: tone === 'danger' ? C.red : C.textMuted,
        fontSize: 13.5, fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s', ...style,
      }}>
      {icon}{children}
    </button>
  )
}

export function LinkButton({ children, onClick, icon }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: C.purpleLight, fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0 }}>
      {children}{icon}
    </button>
  )
}

// Alternador segmentado — usado em filtros e modos de visualização.
export function Segmented<T extends string>({ options, value, onChange, size = 'md' }: {
  options: { value: T; label: string; icon?: React.ReactNode }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}) {
  return (
    <div style={{ display: 'inline-flex', gap: 3, background: 'rgba(255,255,255,0.035)', borderRadius: 10, padding: 3, border: `1px solid ${C.borderSubtle}` }}>
      {options.map(o => {
        const active = o.value === value
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: size === 'sm' ? '5px 11px' : '7px 14px', borderRadius: 8, border: 'none',
              background: active ? 'rgba(139,92,246,0.18)' : 'transparent',
              color: active ? C.purpleLight : C.textMuted,
              cursor: 'pointer', fontSize: 12.5, fontWeight: active ? 600 : 450, transition: 'all 0.18s',
            }}>
            {o.icon}{o.label}
          </button>
        )
      })}
    </div>
  )
}

// Seletor de contexto: visão geral ou um projeto específico.
export function ContextSelector({ value, onChange, projects }: {
  value: string | null
  onChange: (v: string | null) => void
  projects: { id: string; name: string }[]
}) {
  const [open, setOpen] = useState(false)
  const current = value ? projects.find(p => p.id === value)?.name ?? 'Visão geral' : 'Visão geral'

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.035)', border: `1px solid ${open ? C.borderMd : C.borderSubtle}`, color: C.text, fontSize: 13, cursor: 'pointer', transition: 'border-color 0.18s' }}>
        {current}
        <ChevronDown size={13} color={C.textSubtle} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 60 }} onClick={() => setOpen(false)} />
          <div className="atlas-slide-in" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 200, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6, boxShadow: '0 16px 44px rgba(0,0,0,0.6)', zIndex: 70 }}>
            <MenuOption label="Visão geral" active={value === null} onClick={() => { onChange(null); setOpen(false) }} />
            {projects.length > 0 && <div style={{ height: 1, background: C.borderSubtle, margin: '5px 0' }} />}
            {projects.map(p => (
              <MenuOption key={p.id} label={p.name} active={value === p.id} onClick={() => { onChange(p.id); setOpen(false) }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function MenuOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 11px', borderRadius: 8, border: 'none', background: hover ? 'rgba(255,255,255,0.05)' : 'transparent', color: active ? C.purpleLight : C.textMuted, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
      {label}{active && <Check size={13} />}
    </button>
  )
}

// ── Estado vazio ────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action, compact }: {
  icon: React.ReactNode; title: string; description: string; action?: React.ReactNode; compact?: boolean
}) {
  return (
    <div style={{ textAlign: 'center', padding: compact ? '28px 22px' : '44px 24px' }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(139,92,246,0.09)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: C.purpleLight }}>
        {icon}
      </div>
      <div style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 7 }}>{title}</div>
      <div style={{ color: C.textSubtle, fontSize: 13.5, lineHeight: 1.65, maxWidth: 400, margin: '0 auto' }}>{description}</div>
      {action && <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>{action}</div>}
    </div>
  )
}

// ── Modal ───────────────────────────────────────────────────────────────────

export function Modal({ children, onClose, width = 480, padding = 28 }: {
  children: React.ReactNode; onClose?: () => void; width?: number; padding?: number
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="atlas-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(6,4,13,0.82)', backdropFilter: 'blur(10px)' }} onClick={onClose} />
      <div className="atlas-modal atlas-scrollbar" style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: width, maxHeight: 'calc(100vh - 48px)', overflowY: 'auto',
        background: 'rgba(17,13,32,0.97)', border: '1px solid rgba(139,92,246,0.24)', borderRadius: 20, padding,
        boxShadow: '0 0 70px rgba(139,92,246,0.12), 0 28px 70px rgba(0,0,0,0.65)',
      }}>
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ title, description, icon, onClose }: {
  title: string; description?: string; icon?: React.ReactNode; onClose?: () => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 22 }}>
      {icon && (
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(139,92,246,0.12)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: C.text, fontSize: 17, fontWeight: 650, letterSpacing: '-0.015em' }}>{title}</div>
        {description && <div style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6, marginTop: 5 }}>{description}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          ✕
        </button>
      )}
    </div>
  )
}

// ── Campos ──────────────────────────────────────────────────────────────────

export function Field({ label, value, onChange, placeholder, type = 'text', autoFocus, onEnter }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoFocus?: boolean; onEnter?: () => void
}) {
  return (
    <div>
      <label style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} autoFocus={autoFocus} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && onEnter) onEnter() }}
        style={{ width: '100%', padding: '11px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
        onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }} />
    </div>
  )
}

export function TextArea({ label, value, onChange, placeholder, rows = 4, autoFocus }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; autoFocus?: boolean
}) {
  return (
    <div>
      <label style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 7 }}>{label}</label>
      <textarea value={value} rows={rows} placeholder={placeholder} autoFocus={autoFocus}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '11px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', transition: 'border-color 0.2s' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.borderMd }}
        onBlur={e => { e.currentTarget.style.borderColor = C.borderSubtle }} />
    </div>
  )
}

export function Select({ label, value, options, onChange }: {
  label?: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void
}) {
  return (
    <div>
      {label && <label style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 7 }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '11px 34px 11px 13px', borderRadius: 10, background: 'rgba(13,11,26,0.95)', border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: 13.5, outline: 'none', appearance: 'none', cursor: 'pointer' }}>
          {options.map(o => <option key={o.value} value={o.value} style={{ background: '#0d0b1a' }}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} color={C.textSubtle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

// ── Datas ───────────────────────────────────────────────────────────────────

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function todayLabel() {
  const d = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  return d.charAt(0).toUpperCase() + d.slice(1)
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h}h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'ontem' : `há ${d} dias`
}
