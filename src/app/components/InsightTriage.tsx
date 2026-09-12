import { useState } from 'react'
import { Target, Check, Sparkles } from 'lucide-react'
import { C } from './atlas-tokens'
import { Modal, ModalHeader, PrimaryButton, GhostButton, TextArea, Select, Field, PRIORITY_META } from './atlas-ui'
import { useAtlas, type Insight } from '../store'
import { CATEGORIES, type Priority } from './atlas-data'

// ── Adicionar aos Insights (backlog) ────────────────────────────────────────

export function TriageModal({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const { addToBacklog, toast, projects } = useAtlas()
  const [priority, setPriority] = useState<Priority>(insight.priority)
  const [category, setCategory] = useState(insight.category)
  const project = projects.find(p => p.id === insight.projectId)

  const confirm = () => {
    addToBacklog(insight.id, priority, category)
    onClose()
    toast('Insight adicionado ao backlog', 'Acompanhe a execução na Central de Insights.')
  }

  return (
    <Modal onClose={onClose} width={470}>
      <ModalHeader
        icon={<Target size={18} />}
        title="Adicionar aos Insights"
        description="Defina prioridade e categoria. O insight vai para o backlog da Central."
        onClose={onClose}
      />

      <div style={{ background: 'rgba(139,92,246,0.06)', borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
        <div style={{ color: C.text, fontSize: 14, fontWeight: 600, lineHeight: 1.45, marginBottom: 6 }}>{insight.title}</div>
        <div style={{ color: C.textSubtle, fontSize: 12.5 }}>
          {insight.impact}{project ? ` · ${project.name}` : ''}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ color: C.textMuted, fontSize: 12.5, fontWeight: 500, marginBottom: 9 }}>Prioridade</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(Object.keys(PRIORITY_META) as Priority[]).map(p => {
            const meta = PRIORITY_META[p]
            const active = priority === p
            return (
              <button key={p} onClick={() => setPriority(p)}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 450, transition: 'all 0.18s', border: `1px solid ${active ? meta.color + '70' : C.borderSubtle}`, background: active ? meta.soft : 'rgba(255,255,255,0.02)', color: active ? meta.color : C.textMuted }}>
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      <Select
        label="Categoria"
        value={category}
        onChange={setCategory}
        options={CATEGORIES.map(c => ({ value: c, label: c }))}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 26 }}>
        <GhostButton onClick={onClose}>Cancelar</GhostButton>
        <PrimaryButton onClick={confirm} icon={<Check size={15} />}>Adicionar</PrimaryButton>
      </div>
    </Modal>
  )
}

// ── Conclusão: o que foi feito volta como contexto para o Atlas ─────────────

export function ConclusionModal({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const { concludeInsight, toast, panels } = useAtlas()
  const [text, setText] = useState('')
  const panel = panels.find(p => p.id === insight.panelId)

  const confirm = () => {
    if (text.trim().length < 4) return
    concludeInsight(insight.id, text.trim())
    onClose()
    toast('Insight concluído', `A decisão foi registrada no contexto${panel ? ` de ${panel.name}` : ''}.`)
  }

  return (
    <Modal onClose={onClose} width={500}>
      <ModalHeader
        icon={<Check size={18} />}
        title="Como essa ação foi concluída?"
        description="Conte brevemente o que foi feito. Essa informação ajuda o Atlas a entender o contexto das decisões e melhorar as próximas análises."
        onClose={onClose}
      />

      <div style={{ background: 'rgba(139,92,246,0.06)', borderRadius: 12, padding: '13px 15px', marginBottom: 20 }}>
        <div style={{ color: C.text, fontSize: 14, fontWeight: 600, lineHeight: 1.45 }}>{insight.title}</div>
      </div>

      <TextArea
        label="Ação realizada"
        value={text}
        onChange={setText}
        rows={4}
        autoFocus
        placeholder="Ex.: Redistribuí o orçamento dos anúncios com CPC acima de R$ 3,50 para os grupos com melhor custo por lead."
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 16, color: C.textSubtle, fontSize: 12.5, lineHeight: 1.6 }}>
        <Sparkles size={13} color={C.purpleLight} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>Essa decisão passa a fazer parte do contexto {panel ? `de ${panel.name}` : 'do projeto'} nas próximas leituras do Atlas.</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
        <GhostButton onClick={onClose}>Cancelar</GhostButton>
        <PrimaryButton onClick={confirm} disabled={text.trim().length < 4} icon={<Check size={15} />}>Concluir insight</PrimaryButton>
      </div>
    </Modal>
  )
}

// ── Criar projeto ───────────────────────────────────────────────────────────

export function ProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated?: (id: string) => void }) {
  const { createProject, toast } = useAtlas()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const confirm = () => {
    if (name.trim().length < 2) return
    const project = createProject(name, description)
    onClose()
    onCreated?.(project.id)
    toast('Projeto criado', `${project.name} está pronto para receber painéis.`)
  }

  return (
    <Modal onClose={onClose} width={440}>
      <ModalHeader
        icon={<Target size={18} />}
        title="Criar novo projeto"
        description="Projetos agrupam os painéis e os insights de um mesmo contexto do negócio."
        onClose={onClose}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Nome do projeto" value={name} onChange={setName} placeholder="Ex.: Comercial" autoFocus onEnter={confirm} />
        <TextArea label="Descrição (opcional)" value={description} onChange={setDescription} rows={3}
          placeholder="O que este projeto acompanha?" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
        <GhostButton onClick={onClose}>Cancelar</GhostButton>
        <PrimaryButton onClick={confirm} disabled={name.trim().length < 2}>Criar projeto</PrimaryButton>
      </div>
    </Modal>
  )
}

