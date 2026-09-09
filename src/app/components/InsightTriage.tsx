import { useState } from 'react'
import { X, ChevronDown, Target, Wand2 } from 'lucide-react'
import { C } from './atlas-tokens'
import { PRIORITY_META, TYPE_META, Pill } from './atlas-ui'
import { useAtlas } from '../store'
import type { Insight, Priority } from './atlas-data'

// Modal de triagem: o usuário avalia o insight, define prioridade e categoria
// e o envia para a Central de Insights como item do plano de ação.

export function TriageModal({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const { prioritize, categories, addCategory, toast } = useAtlas()
  const [priority, setPriority] = useState<Priority>(insight.priority)
  const [category, setCategory] = useState(insight.category)
  const [newCatMode, setNewCatMode] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const meta = TYPE_META[insight.type]

  const confirm = () => {
    const finalCat = newCatMode ? newCatName.trim() : category
    if (!finalCat) return
    if (newCatMode) addCategory(finalCat)
    prioritize(insight.id, priority, finalCat)
    onClose()
    toast('Insight adicionado ao plano de ação', `${insight.title} · prioridade ${PRIORITY_META[priority].label.toLowerCase()}`)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,5,15,0.86)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div className="card-glass atlas-slide-in" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, border: '1px solid rgba(139,92,246,0.28)', borderRadius: 18, padding: 28, boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 24px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 140, height: 2, background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.7), transparent)', borderRadius: 4 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Target size={17} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.text, fontSize: 15.5, fontWeight: 700 }}>Adicionar ao plano de ação</div>
            <div style={{ color: C.textSubtle, fontSize: 12.5 }}>O insight vai para a Central para ser acompanhado.</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, flexShrink: 0 }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ background: 'rgba(139,92,246,0.06)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Pill color={meta.color} background={meta.soft} icon={meta.icon}>{meta.label}</Pill>
            <Pill color={C.textMuted}>{insight.impact}</Pill>
          </div>
          <div style={{ color: C.text, fontSize: 14, fontWeight: 600, lineHeight: 1.5, marginBottom: 6 }}>{insight.title}</div>
          {insight.suggestion && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10 }}>
              <Wand2 size={13} color={C.purpleNeon} style={{ flexShrink: 0, marginTop: 3 }} />
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{insight.suggestion}</p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 9 }}>Prioridade</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(Object.keys(PRIORITY_META) as Priority[]).map(p => {
              const pm = PRIORITY_META[p]
              const active = priority === p
              return (
                <button key={p} onClick={() => setPriority(p)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: `1px solid ${active ? pm.color + '80' : C.borderSubtle}`, background: active ? pm.soft : 'rgba(255,255,255,0.02)', cursor: 'pointer', color: active ? pm.color : C.textMuted, fontSize: 13, fontWeight: active ? 600 : 400, transition: 'all 0.18s' }}>
                  {pm.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ color: C.textSubtle, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 9 }}>Categoria</div>
          {!newCatMode ? (
            <div style={{ position: 'relative' }}>
              <select value={category}
                onChange={e => { if (e.target.value === '__new__') setNewCatMode(true); else setCategory(e.target.value) }}
                style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: 'rgba(13,11,26,0.95)', color: C.text, fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                {categories.map(c => <option key={c} value={c} style={{ background: '#0d0b1a' }}>{c}</option>)}
                <option value="__new__" style={{ background: '#0d0b1a', color: C.purpleLight }}>+ Criar nova categoria</option>
              </select>
              <ChevronDown size={14} color={C.textSubtle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nome da nova categoria..."
                style={{ flex: 1, padding: '10px 12px', borderRadius: 9, border: `1px solid ${C.borderMd}`, background: 'rgba(255,255,255,0.04)', color: C.text, fontSize: 13, outline: 'none' }} />
              <button onClick={() => { setNewCatMode(false); setNewCatName('') }}
                style={{ padding: '10px 14px', borderRadius: 9, border: `1px solid ${C.borderSubtle}`, background: 'none', color: C.textMuted, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="atlas-btn-ghost" style={{ padding: '10px 20px', borderRadius: 9, color: C.textMuted, cursor: 'pointer', fontSize: 14 }}>
            Cancelar
          </button>
          <button onClick={confirm} disabled={newCatMode && !newCatName.trim()} className="atlas-btn-primary"
            style={{ padding: '10px 22px', borderRadius: 9, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: newCatMode && !newCatName.trim() ? 'not-allowed' : 'pointer', opacity: newCatMode && !newCatName.trim() ? 0.45 : 1 }}>
            Adicionar ao plano
          </button>
        </div>
      </div>
    </div>
  )
}

// Descarte com possibilidade de desfazer — nada é perdido sem intenção.
export function useDiscard() {
  const { setStatus, toast } = useAtlas()
  return (insight: Insight) => {
    const previous = insight.status
    setStatus(insight.id, 'descartado')
    toast('Insight descartado', insight.title, 'warn', {
      label: 'Desfazer',
      onClick: () => setStatus(insight.id, previous),
    })
  }
}
