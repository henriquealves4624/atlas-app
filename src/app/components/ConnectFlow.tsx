import { useEffect, useRef, useState } from 'react'
import {
  Check, ArrowRight, ArrowLeft, Upload, FileSpreadsheet, KeyRound, Lock,
  LayoutDashboard, Sparkles, PanelsTopLeft, FolderPlus, Loader2,
} from 'lucide-react'
import { C } from './atlas-tokens'
import { Modal, ModalHeader, PrimaryButton, GhostButton, Field, Select, Pill } from './atlas-ui'
import { useAtlas } from '../store'
import {
  SOURCE_CATALOG, EXTERNAL_DASHBOARDS, TEMPLATES, USER,
  type SourceCatalogItem, type ExternalDashboard,
} from './atlas-data'

const sourceById = (id?: string) => SOURCE_CATALOG.find(s => s.id === id)

export default function ConnectFlow() {
  const { flow } = useAtlas()
  if (!flow) return null
  return <FlowContent key={flow.step + (flow.sourceId ?? '') + (flow.toolId ?? '')} />
}

function FlowContent() {
  const { flow, closeFlow } = useAtlas()
  if (!flow) return null

  const width = flow.step === 'visualize' ? 620 : flow.step === 'dashboards' ? 560 : 500

  return (
    <Modal onClose={flow.step === 'importing' ? undefined : closeFlow} width={width}>
      <div className="flow-step">
        {flow.step === 'source-connect' && <SourceConnect />}
        {flow.step === 'visualize' && <VisualizeChoice />}
        {flow.step === 'tool-pick' && <ToolPick />}
        {flow.step === 'tool-connect' && <ToolConnect />}
        {flow.step === 'dashboards' && <DashboardPick />}
        {flow.step === 'save' && <SavePanel />}
        {flow.step === 'importing' && <ImportProgress />}
      </div>
    </Modal>
  )
}

// ── Passos animados de progresso ────────────────────────────────────────────

function ProgressSteps({ steps, onDone, interval = 780 }: { steps: string[]; onDone: () => void; interval?: number }) {
  const [current, setCurrent] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const timers: number[] = []
    steps.forEach((_, i) => {
      timers.push(window.setTimeout(() => setCurrent(i + 1), interval * (i + 1)))
    })
    timers.push(window.setTimeout(() => {
      if (!done.current) { done.current = true; onDone() }
    }, interval * steps.length + 620))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: '4px 0' }}>
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'doing' : 'todo'
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 11, opacity: state === 'todo' ? 0.4 : 1, transition: 'opacity 0.3s' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: state === 'done' ? 'rgba(52,211,153,0.14)' : 'rgba(139,92,246,0.12)', border: `1px solid ${state === 'done' ? 'rgba(52,211,153,0.4)' : C.borderMd}` }}>
              {state === 'done'
                ? <Check size={11} color={C.green} className="check-pop" />
                : state === 'doing'
                  ? <Loader2 size={11} color={C.purpleLight} style={{ animation: 'spin-slow 0.8s linear infinite' }} />
                  : <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.textSubtle }} />}
            </div>
            <span style={{ color: state === 'done' ? C.textMuted : state === 'doing' ? C.text : C.textSubtle, fontSize: 13.5 }}>{s}</span>
          </div>
        )
      })}
    </div>
  )
}

function SourceAvatar({ source, size = 38 }: { source: SourceCatalogItem; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.29, background: `${source.color}22`, border: `1px solid ${source.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: source.color, fontSize: size * 0.4, fontWeight: 700 }}>
      {source.name.charAt(0)}
    </div>
  )
}

// ── 1. Conectar a fonte de dados ────────────────────────────────────────────

function SourceConnect() {
  const { flow, updateFlow, connectSource, closeFlow, toast } = useAtlas()
  const source = sourceById(flow?.sourceId)!
  const [phase, setPhase] = useState<'form' | 'running'>('form')

  const finish = () => {
    connectSource(source.id, recordsFor(source.id))
    toast(`${source.name} conectado`, 'A Atlas IA já pode ler esses dados.')
    if (source.visualization) {
      updateFlow({ step: 'dashboards', toolId: source.id })
    } else {
      updateFlow({ step: 'visualize' })
    }
  }

  if (phase === 'running') {
    return (
      <>
        <ModalHeader icon={<SourceAvatar source={source} size={38} />} title={`Conectando ao ${source.name}`}
          description="Estabelecendo a conexão e preparando a primeira leitura dos dados." />
        <ProgressSteps steps={progressFor(source)} onDone={finish} />
      </>
    )
  }

  return (
    <>
      <ModalHeader icon={<SourceAvatar source={source} size={38} />} title={`Conectar ${source.name}`}
        description={descriptionFor(source)} onClose={closeFlow} />
      {source.method === 'upload' && <UploadForm onSubmit={() => setPhase('running')} />}
      {source.method === 'google' && <GoogleForm source={source} onSubmit={() => setPhase('running')} />}
      {source.method === 'powerbi' && <MicrosoftForm onSubmit={() => setPhase('running')} />}
      {source.method === 'login' && <LoginForm source={source} onSubmit={() => setPhase('running')} />}
      {source.method === 'token' && <TokenForm source={source} onSubmit={() => setPhase('running')} />}
    </>
  )
}

function descriptionFor(source: SourceCatalogItem) {
  switch (source.method) {
    case 'upload': return 'Envie o arquivo que deseja analisar. O Atlas identifica as colunas automaticamente.'
    case 'google': return 'Autorize o acesso à sua conta Google para ler os arquivos selecionados.'
    case 'powerbi': return 'Entre com a conta Microsoft que administra seus painéis.'
    case 'login': return 'Use as credenciais da sua conta para autorizar a leitura dos dados.'
    default: return 'Informe a chave de integração gerada no painel da ferramenta.'
  }
}

function progressFor(source: SourceCatalogItem): string[] {
  switch (source.method) {
    case 'upload': return ['Enviando arquivo...', 'Identificando colunas...', 'Importando registros...']
    case 'google': return ['Autorizando conta Google...', 'Localizando arquivos...', 'Sincronizando dados...']
    case 'powerbi': return ['Autenticando conta Microsoft...', 'Listando workspaces...', 'Conexão concluída.']
    case 'login': return ['Autenticando...', 'Sincronizando dados...', 'Conexão concluída.']
    default: return ['Validando chave de integração...', 'Sincronizando dados...', 'Conexão concluída.']
  }
}

function recordsFor(id: string) {
  const map: Record<string, string> = {
    excel: '1 arquivo · 4.812 linhas',
    sheets: '3 planilhas',
    hubspot: '1.247 contatos',
    pipedrive: '612 negócios',
    bling: '8.940 pedidos',
    tiny: '5.210 pedidos',
    notion: '4 bases',
    powerbi: '4 painéis disponíveis',
    looker: '2 relatórios',
    tableau: '2 workbooks',
  }
  return map[id] ?? 'Sincronizado'
}

function UploadForm({ onSubmit }: { onSubmit: () => void }) {
  const [file, setFile] = useState<string | null>(null)
  return (
    <>
      <div onClick={() => setFile('orcado-x-realizado-2026.xlsx')}
        style={{ border: `1.5px dashed ${file ? 'rgba(52,211,153,0.4)' : 'rgba(139,92,246,0.28)'}`, borderRadius: 14, padding: '30px 22px', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(52,211,153,0.04)' : 'rgba(139,92,246,0.04)', transition: 'all 0.25s' }}>
        {file ? (
          <>
            <FileSpreadsheet size={24} color={C.green} style={{ marginBottom: 10 }} className="check-pop" />
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{file}</div>
            <div style={{ color: C.textSubtle, fontSize: 12.5 }}>842 KB · pronto para importar</div>
          </>
        ) : (
          <>
            <Upload size={22} color={C.purpleLight} style={{ marginBottom: 10 }} />
            <div style={{ color: C.text, fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Selecionar arquivo</div>
            <div style={{ color: C.textSubtle, fontSize: 12.5 }}>.xlsx, .xls ou .csv até 50 MB</div>
          </>
        )}
      </div>
      <FlowActions onNext={onSubmit} nextLabel="Importar arquivo" disabled={!file} />
    </>
  )
}

function GoogleForm({ source, onSubmit }: { source: SourceCatalogItem; onSubmit: () => void }) {
  return (
    <>
      <div style={{ border: `1px solid ${C.borderSubtle}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>
            {USER.initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: C.text, fontSize: 13.5, fontWeight: 500 }}>{USER.name}</div>
            <div style={{ color: C.textSubtle, fontSize: 12.5 }}>{USER.email}</div>
          </div>
          <Pill color={C.green} background="rgba(52,211,153,0.1)">Conta ativa</Pill>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ color: C.textMuted, fontSize: 12.5, marginBottom: 10 }}>O {source.name} poderá:</div>
          {['Ver e ler os arquivos que você selecionar', 'Acompanhar atualizações desses arquivos'].map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
              <Check size={13} color={C.green} />
              <span style={{ color: C.textMuted, fontSize: 13 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
      <FlowActions onNext={onSubmit} nextLabel="Permitir acesso" />
    </>
  )
}

function MicrosoftForm({ onSubmit }: { onSubmit: () => void }) {
  const [email, setEmail] = useState(USER.email)
  const [password, setPassword] = useState('')
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Conta Microsoft" value={email} onChange={setEmail} placeholder="voce@empresa.com" />
        <Field label="Senha" value={password} onChange={setPassword} type="password" placeholder="••••••••" onEnter={onSubmit} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: C.textSubtle, fontSize: 12.5 }}>
        <Lock size={12} /> O Atlas recebe apenas permissão de leitura dos seus painéis.
      </div>
      <FlowActions onNext={onSubmit} nextLabel="Entrar" />
    </>
  )
}

function LoginForm({ source, onSubmit }: { source: SourceCatalogItem; onSubmit: () => void }) {
  const [email, setEmail] = useState(USER.email)
  const [password, setPassword] = useState('')
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label={`E-mail da conta ${source.name}`} value={email} onChange={setEmail} placeholder="voce@empresa.com" />
        <Field label="Senha" value={password} onChange={setPassword} type="password" placeholder="••••••••" onEnter={onSubmit} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: C.textSubtle, fontSize: 12.5 }}>
        <Lock size={12} /> Conexão criptografada. Você pode revogar o acesso quando quiser.
      </div>
      <FlowActions onNext={onSubmit} nextLabel="Conectar" />
    </>
  )
}

function TokenForm({ source, onSubmit }: { source: SourceCatalogItem; onSubmit: () => void }) {
  const [token, setToken] = useState('')
  return (
    <>
      <Field label={`Chave de integração do ${source.name}`} value={token} onChange={setToken} placeholder="cole a chave aqui" autoFocus onEnter={onSubmit} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: C.textSubtle, fontSize: 12.5 }}>
        <KeyRound size={12} /> A chave fica disponível nas configurações de integração do {source.name}.
      </div>
      <FlowActions onNext={onSubmit} nextLabel="Conectar" disabled={token.trim().length < 4} />
    </>
  )
}

// ── 2. Como visualizar ──────────────────────────────────────────────────────

function VisualizeChoice() {
  const { flow, updateFlow, closeFlow, go } = useAtlas()
  const source = sourceById(flow?.sourceId)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div className="check-pop" style={{ width: 34, height: 34, borderRadius: 11, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={17} color={C.green} />
        </div>
        <div>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 650, letterSpacing: '-0.015em' }}>Seus dados estão conectados</div>
          <div style={{ color: C.textMuted, fontSize: 13.5, marginTop: 3 }}>
            {source ? `${source.name} sincronizado.` : 'Fonte sincronizada.'} Como você quer visualizá-los?
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        <ChoiceCard
          icon={<LayoutDashboard size={19} />}
          title="Usar uma ferramenta de visualização"
          desc="Já tem painéis no Power BI, Looker Studio ou Tableau? Traga-os para o Atlas."
          cta="Conectar ferramenta"
          onClick={() => updateFlow({ step: 'tool-pick' })}
        />
        <ChoiceCard
          icon={<PanelsTopLeft size={19} />}
          title="Criar painel no Atlas"
          desc="Monte a visualização aqui mesmo, escolhendo métricas e gráficos."
          cta="Construir painel"
          onClick={() => { closeFlow(); go('builder') }}
        />
      </div>

      <div style={{ marginTop: 18, textAlign: 'center' }}>
        <button onClick={closeFlow} style={{ background: 'none', border: 'none', color: C.textSubtle, fontSize: 13, cursor: 'pointer' }}>
          Decidir depois
        </button>
      </div>
    </>
  )
}

function ChoiceCard({ icon, title, desc, cta, onClick }: {
  icon: React.ReactNode; title: string; desc: string; cta: string; onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 19px', borderRadius: 15, cursor: 'pointer',
        background: hover ? 'rgba(139,92,246,0.09)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hover ? 'rgba(139,92,246,0.36)' : C.borderSubtle}`,
        transition: 'all 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(139,92,246,0.13)', border: `1px solid ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight }}>
        {icon}
      </div>
      <div style={{ color: C.text, fontSize: 14.5, fontWeight: 600 }}>{title}</div>
      <div style={{ color: C.textSubtle, fontSize: 13, lineHeight: 1.6, flex: 1 }}>{desc}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.purpleLight, fontSize: 13, fontWeight: 600, marginTop: 2 }}>
        {cta} <ArrowRight size={14} />
      </div>
    </button>
  )
}

// ── 3. Escolher a ferramenta ────────────────────────────────────────────────

function ToolPick() {
  const { flow, updateFlow, closeFlow, isConnected } = useAtlas()
  const tools = SOURCE_CATALOG.filter(s => s.visualization)

  return (
    <>
      <ModalHeader icon={<LayoutDashboard size={18} />} title="Ferramentas de visualização"
        description="Conecte a ferramenta que sua empresa já usa e traga os painéis existentes." onClose={closeFlow} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tools.map(tool => {
          const connected = isConnected(tool.id)
          return (
            <button key={tool.id} className="row-hover"
              onClick={() => updateFlow(connected
                ? { step: 'dashboards', toolId: tool.id }
                : { step: 'tool-connect', toolId: tool.id })}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 13, background: 'rgba(255,255,255,0.025)', border: `1px solid ${C.borderSubtle}`, cursor: 'pointer', textAlign: 'left' }}>
              <SourceAvatar source={tool} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{tool.name}</div>
                <div style={{ color: C.textSubtle, fontSize: 12.5 }}>{tool.desc}</div>
              </div>
              {connected
                ? <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<Check size={10} />}>Conectado</Pill>
                : <ArrowRight size={15} color={C.textSubtle} />}
            </button>
          )
        })}
      </div>
      <div style={{ marginTop: 18 }}>
        <GhostButton icon={<ArrowLeft size={14} />} onClick={() => updateFlow({ step: 'visualize' })}>Voltar</GhostButton>
      </div>
    </>
  )
}

function ToolConnect() {
  const { flow, updateFlow, connectSource, toast } = useAtlas()
  const tool = sourceById(flow?.toolId)!
  const [phase, setPhase] = useState<'form' | 'running'>('form')

  const finish = () => {
    connectSource(tool.id, recordsFor(tool.id))
    toast(`${tool.name} conectado`, 'Seus painéis estão disponíveis para importação.')
    updateFlow({ step: 'dashboards' })
  }

  if (phase === 'running') {
    return (
      <>
        <ModalHeader icon={<SourceAvatar source={tool} size={38} />} title={`Conectando ao ${tool.name}`}
          description="Autorizando o acesso e listando os painéis disponíveis." />
        <ProgressSteps steps={progressFor(tool)} onDone={finish} />
      </>
    )
  }

  return (
    <>
      <ModalHeader icon={<SourceAvatar source={tool} size={38} />} title={`Conectar ${tool.name}`}
        description={descriptionFor(tool)} onClose={() => updateFlow({ step: 'tool-pick' })} />
      {tool.method === 'powerbi' && <MicrosoftForm onSubmit={() => setPhase('running')} />}
      {tool.method === 'google' && <GoogleForm source={tool} onSubmit={() => setPhase('running')} />}
      {tool.method === 'login' && <LoginForm source={tool} onSubmit={() => setPhase('running')} />}
      {tool.method === 'token' && <TokenForm source={tool} onSubmit={() => setPhase('running')} />}
    </>
  )
}

// ── 4. Escolher o painel existente ──────────────────────────────────────────

function DashboardPick() {
  const { flow, updateFlow, closeFlow } = useAtlas()
  const tool = sourceById(flow?.toolId)!
  const dashboards: ExternalDashboard[] = EXTERNAL_DASHBOARDS[tool.id] ?? []
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <ModalHeader icon={<SourceAvatar source={tool} size={38} />} title={`Painéis no ${tool.name}`}
        description="Escolha qual painel você quer trazer para o Atlas. A leitura é somente de dados." onClose={closeFlow} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {dashboards.map(d => {
          const active = selected === d.id
          return (
            <button key={d.id} onClick={() => setSelected(d.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', background: active ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.025)', border: `1px solid ${active ? 'rgba(139,92,246,0.4)' : C.borderSubtle}`, transition: 'all 0.18s' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
                <LayoutDashboard size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: C.text, fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{d.name}</div>
                <div style={{ color: C.textSubtle, fontSize: 12 }}>{d.detail}</div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${active ? C.purple : C.borderSubtle}`, background: active ? C.purple : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {active && <Check size={11} color="white" />}
              </div>
            </button>
          )
        })}
      </div>

      <FlowActions
        onBack={() => updateFlow({ step: 'tool-pick' })}
        onNext={() => selected && updateFlow({ step: 'save', dashboardId: selected })}
        nextLabel="Continuar"
        disabled={!selected}
      />
    </>
  )
}

// ── 5. Nome do painel e projeto ─────────────────────────────────────────────

function SavePanel() {
  const { flow, updateFlow, projects } = useAtlas()
  const tool = sourceById(flow?.toolId)!
  const dashboard = (EXTERNAL_DASHBOARDS[tool.id] ?? []).find(d => d.id === flow?.dashboardId)!
  const [name, setName] = useState(dashboard?.name ?? '')
  const [projectId, setProjectId] = useState<string>(projects[0]?.id ?? '__new__')
  const [newProject, setNewProject] = useState('')

  const creatingProject = projectId === '__new__'
  const ready = name.trim().length > 1 && (!creatingProject || newProject.trim().length > 1)

  const proceed = () => {
    if (!ready) return
    updateFlow({ step: 'importing' })
    // Os dados do formulário viajam pelo sessionStorage do fluxo em memória.
    pendingImport = {
      name: name.trim(),
      projectName: creatingProject ? newProject.trim() : null,
      projectId: creatingProject ? null : projectId,
      templateId: dashboard.templateId,
      originLabel: tool.name,
    }
  }

  return (
    <>
      <ModalHeader icon={<LayoutDashboard size={18} />} title="Salvar painel no Atlas"
        description="Defina como este painel será identificado e em qual projeto ele vai ficar." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Nome do painel" value={name} onChange={setName} placeholder="Ex.: Performance Comercial" autoFocus />

        <div>
          <Select
            label="Projeto"
            value={projectId}
            onChange={setProjectId}
            options={[
              ...projects.map(p => ({ value: p.id, label: p.name })),
              { value: '__new__', label: '+ Criar novo projeto' },
            ]}
          />
          {creatingProject && (
            <div style={{ marginTop: 12 }} className="flow-step">
              <Field label="Nome do novo projeto" value={newProject} onChange={setNewProject} placeholder="Ex.: Comercial" autoFocus />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, background: 'rgba(139,92,246,0.06)', border: `1px solid ${C.border}`, borderRadius: 11, padding: '12px 14px' }}>
          <FolderPlus size={14} color={C.purpleLight} style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ color: C.textMuted, fontSize: 12.5, lineHeight: 1.6 }}>
            Projetos agrupam painéis e insights de um mesmo contexto do negócio.
          </span>
        </div>
      </div>

      <FlowActions
        onBack={() => updateFlow({ step: 'dashboards' })}
        onNext={proceed}
        nextLabel="Importar painel"
        disabled={!ready}
      />
    </>
  )
}

// Dados do painel em importação, preenchidos no passo anterior.
let pendingImport: {
  name: string
  projectName: string | null
  projectId: string | null
  templateId: keyof typeof TEMPLATES
  originLabel: string
} | null = null

// ── 6. Importação + primeira análise ────────────────────────────────────────

function ImportProgress() {
  const { createPanel, createProject, closeFlow, go } = useAtlas()
  const ran = useRef(false)

  const finish = () => {
    if (ran.current || !pendingImport) return
    ran.current = true
    const data = pendingImport
    const projectId = data.projectId ?? createProject(data.projectName ?? 'Meu projeto').id
    const panel = createPanel({
      name: data.name,
      projectId,
      templateId: data.templateId,
      origin: 'importado',
      originLabel: data.originLabel,
    })
    pendingImport = null
    closeFlow()
    go('panels', { projectId, panelId: panel.id })
  }

  return (
    <>
      <ModalHeader icon={<Sparkles size={18} />} title="Importando painel"
        description="O Atlas está trazendo as visualizações e fazendo a primeira leitura dos dados." />
      <ProgressSteps
        steps={['Importando visualizações...', 'Lendo indicadores do painel...', 'Atlas IA analisando os dados...']}
        onDone={finish}
        interval={850}
      />
    </>
  )
}

// ── Ações do rodapé ─────────────────────────────────────────────────────────

function FlowActions({ onNext, onBack, nextLabel, disabled }: {
  onNext: () => void; onBack?: () => void; nextLabel: string; disabled?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
      {onBack && <GhostButton icon={<ArrowLeft size={14} />} onClick={onBack}>Voltar</GhostButton>}
      <div style={{ flex: 1 }} />
      <PrimaryButton onClick={onNext} disabled={disabled} icon={<ArrowRight size={15} />}>{nextLabel}</PrimaryButton>
    </div>
  )
}
