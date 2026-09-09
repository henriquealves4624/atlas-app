import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, TrendingUp, Activity, Check, Clock, Bookmark, Archive } from 'lucide-react'
import { C } from './atlas-tokens'
import type { InsightType, InsightStatus, Priority } from './atlas-data'

// ── Marca ───────────────────────────────────────────────────────────────────

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

// ── Entrada animada ─────────────────────────────────────────────────────────

export function Reveal({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="atlas-reveal" style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

// ── Número que conta ────────────────────────────────────────────────────────

export function CountUp({ value, prefix = '', suffix = '', decimals = 0, duration = 1100 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number; duration?: number
}) {
  const [display, setDisplay] = useState(0)
  const frame = useRef<number>()

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(value * eased)
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => { if (frame.current) cancelAnimationFrame(frame.current) }
  }, [value, duration])

  return <>{prefix}{display.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

// ── Sparkline ───────────────────────────────────────────────────────────────

export function Sparkline({ values, color = C.purpleLight, width = 120, height = 34, fill = true, strokeWidth = 2 }: {
  values: number[]; color?: string; width?: number; height?: number; fill?: boolean; strokeWidth?: number
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
  const gid = `spark-${color.replace(/[^a-z0-9]/gi, '')}-${width}-${height}`

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} className="atlas-spark-area" />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} className="atlas-spark-line" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={strokeWidth + 0.5} fill={color} className="atlas-spark-dot" />
    </svg>
  )
}

// ── Configuração visual dos insights ────────────────────────────────────────

export const TYPE_META: Record<InsightType, { label: string; color: string; soft: string; border: string; icon: React.ReactNode }> = {
  alerta: { label: 'Requer atenção', color: C.orange, soft: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.26)', icon: <AlertTriangle size={15} /> },
  oportunidade: { label: 'Oportunidade', color: C.green, soft: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.24)', icon: <TrendingUp size={15} /> },
  tendencia: { label: 'Tendência', color: C.blueLight, soft: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.24)', icon: <Activity size={15} /> },
}

export const STATUS_META: Record<InsightStatus, { label: string; color: string; soft: string; icon: React.ReactNode }> = {
  novo: { label: 'Novo', color: C.purpleNeon, soft: 'rgba(192,132,252,0.12)', icon: <Bookmark size={12} /> },
  priorizado: { label: 'Priorizado', color: C.purpleLight, soft: 'rgba(167,139,250,0.12)', icon: <Bookmark size={12} /> },
  andamento: { label: 'Em andamento', color: C.yellow, soft: 'rgba(251,191,36,0.12)', icon: <Clock size={12} /> },
  concluido: { label: 'Concluído', color: C.green, soft: 'rgba(52,211,153,0.12)', icon: <Check size={12} /> },
  descartado: { label: 'Descartado', color: C.textSubtle, soft: 'rgba(148,163,184,0.1)', icon: <Archive size={12} /> },
}

export const PRIORITY_META: Record<Priority, { label: string; color: string; soft: string }> = {
  alta: { label: 'Alta', color: C.red, soft: 'rgba(248,113,113,0.12)' },
  media: { label: 'Média', color: C.orange, soft: 'rgba(251,146,60,0.12)' },
  baixa: { label: 'Baixa', color: C.blueLight, soft: 'rgba(96,165,250,0.12)' },
}

// ── Peças de interface ──────────────────────────────────────────────────────

export function Pill({ children, color = C.textMuted, background = 'rgba(255,255,255,0.05)', icon }: {
  children: React.ReactNode; color?: string; background?: string; icon?: React.ReactNode
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background, color, borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 600, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
      {icon}{children}
    </span>
  )
}

export function Card({ children, style, padding = 20, hover = false, className = '' }: {
  children: React.ReactNode; style?: React.CSSProperties; padding?: number; hover?: boolean; className?: string
}) {
  return (
    <div className={`${hover ? 'card-hover ' : ''}${className}`}
      style={{ background: 'rgba(15,12,28,0.72)', border: `1px solid ${C.border}`, borderRadius: 16, padding, backdropFilter: 'blur(14px)', ...style }}>
      {children}
    </div>
  )
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
      <div>
        <h2 style={{ color: C.text, fontSize: 16, fontWeight: 650, letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ color: C.textSubtle, fontSize: 13, marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function GhostButton({ children, onClick, icon, style }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <button onClick={onClick} className="atlas-ghost"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.18s', ...style }}>
      {icon}{children}
    </button>
  )
}

export function PrimaryButton({ children, onClick, icon, disabled, style }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; disabled?: boolean; style?: React.CSSProperties
}) {
  return (
    <button onClick={onClick} disabled={disabled} className="atlas-btn-primary"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: 'none', color: 'white', fontSize: 13.5, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      {icon}{children}
    </button>
  )
}

// ── Saudação por horário ────────────────────────────────────────────────────

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
