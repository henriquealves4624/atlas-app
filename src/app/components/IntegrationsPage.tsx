import { useRef, useState } from 'react'
import { Plus, RefreshCw, CheckCircle2, Unplug, PanelTop, Sparkles } from 'lucide-react'
import { C } from './atlas-tokens'
import { Reveal, Pill, Card } from './atlas-ui'
import { useAtlas } from '../store'

const CATEGORIES = ['Todos', 'Analytics', 'Planilhas', 'CRM', 'ERP', 'Produtividade']

export default function IntegrationsPage() {
  const { sources, connectSource, disconnectSource, go, toast } = useAtlas()
  const [connecting, setConnecting] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [filter, setFilter] = useState('Todos')
  const availableRef = useRef<HTMLDivElement>(null)

  const visible = filter === 'Todos' ? sources : sources.filter(s => s.category === filter)
  const connected = visible.filter(s => s.connected)
  const available = visible.filter(s => !s.connected)
  const totalConnected = sources.filter(s => s.connected).length

  const handleConnect = (id: string, name: string) => {
    setConnecting(id)
    setTimeout(() => {
      connectSource(id)
      setConnecting(null)
      toast(`${name} conectado`, 'A Atlas IA já começou a ler esses dados em busca de insights.')
    }, 1700)
  }

  const handleSync = (id: string, name: string) => {
    setSyncing(id)
    setTimeout(() => {
      setSyncing(null)
      toast(`${name} sincronizado`, 'Os painéis conectados a esta fonte foram atualizados.', 'info')
    }, 1400)
  }

  return (
    <div className="atlas-page" style={{ padding: '26px 30px 44px', maxWidth: 1340, margin: '0 auto' }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22 }}>
          <div>
            <h1 style={{ color: C.text, fontSize: 24, fontWeight: 750, letterSpacing: '-0.025em', marginBottom: 7 }}>Integrações</h1>
            <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.6, maxWidth: 640 }}>
              O primeiro passo da jornada: conecte as ferramentas que sua empresa já usa. Cada fonte passa a ser lida
              automaticamente pela Atlas IA em segundo plano.
            </p>
          </div>
          <button onClick={() => availableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="atlas-btn-primary"
            style={{ padding: '10px 18px', borderRadius: 10, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <Plus size={15} /> Conectar nova fonte
          </button>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(268px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Fontes conectadas', val: `${totalConnected}`, sub: 'Lidas continuamente pela IA', color: C.green },
            { label: 'Disponíveis para conectar', val: `${sources.length - totalConnected}`, sub: 'Sem custo adicional no plano Pro', color: C.purpleLight },
            { label: 'Última sincronização', val: '2 min', sub: 'Power BI · automática', color: C.blueLight },
          ].map(s => (
            <Card key={s.label} padding={19}>
              <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 8 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 26, fontWeight: 750, letterSpacing: '-0.025em', marginBottom: 5 }}>{s.val}</div>
              <div style={{ color: C.textSubtle, fontSize: 12 }}>{s.sub}</div>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3, border: `1px solid ${C.borderSubtle}`, marginBottom: 24, width: 'fit-content' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '7px 15px', borderRadius: 8, border: 'none', background: filter === cat ? 'rgba(139,92,246,0.2)' : 'transparent', color: filter === cat ? C.purpleLight : C.textMuted, cursor: 'pointer', fontSize: 13, fontWeight: filter === cat ? 600 : 400, transition: 'all 0.18s' }}>
              {cat}
            </button>
          ))}
        </div>
      </Reveal>

      {connected.length > 0 && (
        <Reveal delay={140}>
          <div style={{ color: C.textSubtle, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 13 }}>Conectadas</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(268px, 1fr))', gap: 14, marginBottom: 30 }}>
            {connected.map(s => (
              <div key={s.id} className="card-hover" style={{ background: 'rgba(15,12,28,0.72)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.color}22`, border: `1px solid ${s.color}55`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: C.text, fontSize: 15, fontWeight: 650, marginBottom: 4 }}>{s.name}</div>
                    <Pill>{s.category}</Pill>
                  </div>
                  <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<CheckCircle2 size={11} />}>Conectado</Pill>
                </div>

                <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 15, minHeight: 42 }}>{s.desc}</p>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderSubtle}`, borderRadius: 11, padding: '11px 13px', marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: C.textSubtle, fontSize: 12 }}>Última sincronização</span>
                    <span style={{ color: C.textMuted, fontSize: 12 }}>{s.lastSync}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: C.textSubtle, fontSize: 12 }}>Dados importados</span>
                    <span style={{ color: C.textMuted, fontSize: 12 }}>{s.records}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleSync(s.id, s.name)} disabled={syncing === s.id} className="atlas-ghost"
                    style={{ flex: 1, padding: '9px 0', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <RefreshCw size={13} style={syncing === s.id ? { animation: 'spin-slow 0.8s linear infinite' } : undefined} />
                    {syncing === s.id ? 'Sincronizando...' : 'Sincronizar'}
                  </button>
                  <button onClick={() => { disconnectSource(s.id); toast(`${s.name} desconectado`, 'Os painéis que usavam essa fonte deixam de ser atualizados.', 'warn') }}
                    title="Desconectar"
                    style={{ width: 38, borderRadius: 9, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)', color: C.red, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Unplug size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <div ref={availableRef}>
        {available.length > 0 && (
          <Reveal delay={180}>
            <div style={{ color: C.textSubtle, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 13 }}>Disponíveis</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(268px, 1fr))', gap: 14 }}>
              {available.map(s => (
                <div key={s.id} className="card-hover" style={{ background: 'rgba(15,12,28,0.55)', border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.color}18`, border: `1px solid ${s.color}33`, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: C.text, fontSize: 15, fontWeight: 650, marginBottom: 4 }}>{s.name}</div>
                      <Pill>{s.category}</Pill>
                    </div>
                  </div>
                  <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 16, minHeight: 42 }}>{s.desc}</p>
                  <button onClick={() => handleConnect(s.id, s.name)} disabled={connecting === s.id} className="atlas-btn-primary"
                    style={{ width: '100%', padding: '10px 0', borderRadius: 10, color: 'white', border: 'none', cursor: connecting === s.id ? 'default' : 'pointer', fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    {connecting === s.id ? (
                      <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} /> Conectando...</>
                    ) : (
                      <><Plus size={14} /> Conectar</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <Reveal delay={220}>
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(139,92,246,0.06)', border: `1px solid ${C.border}`, borderRadius: 15, padding: '18px 20px', flexWrap: 'wrap' }}>
          <Sparkles size={17} color={C.purpleLight} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Não usa nenhuma ferramenta de BI?</div>
            <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>
              Você pode montar um painel direto no Atlas a partir de uma planilha e a IA analisa esses dados do mesmo jeito.
            </div>
          </div>
          <button onClick={() => go('builder')} className="atlas-btn-secondary"
            style={{ padding: '10px 17px', borderRadius: 10, color: C.text, cursor: 'pointer', fontSize: 13.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
            <PanelTop size={14} /> Criar painel no Atlas
          </button>
        </div>
      </Reveal>
    </div>
  )
}
