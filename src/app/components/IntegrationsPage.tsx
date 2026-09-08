import { useState } from 'react'
import { Plus, RefreshCw, CheckCircle2, AlertCircle, Unplug } from 'lucide-react'
import { C } from './atlas-tokens'

interface Integration {
  id: string
  name: string
  desc: string
  category: string
  color: string
  connected: boolean
  lastSync?: string
  records?: string
}

const INTEGRATIONS: Integration[] = [
  { id: 'powerbi', name: 'Power BI', desc: 'Importe dashboards e relatórios do Power BI diretamente para o Atlas.', category: 'Analytics', color: '#F2C811', connected: true, lastSync: '2 min atrás', records: '14 relatórios' },
  { id: 'sheets', name: 'Google Sheets', desc: 'Conecte planilhas do Google Sheets para sincronização automática de dados.', category: 'Planilhas', color: '#0F9D58', connected: true, lastSync: '5 min atrás', records: '3 planilhas' },
  { id: 'hubspot', name: 'HubSpot', desc: 'Sincronize leads, deals e atividades do seu CRM HubSpot.', category: 'CRM', color: '#FF7A59', connected: true, lastSync: '8 min atrás', records: '1.247 contatos' },
  { id: 'excel', name: 'Excel', desc: 'Importe arquivos .xlsx e .xls com atualização manual ou automática.', category: 'Planilhas', color: '#217346', connected: false },
  { id: 'pipedrive', name: 'Pipedrive', desc: 'Integre seu pipeline de vendas e acompanhe negócios em tempo real.', category: 'CRM', color: '#1A73E8', connected: false },
  { id: 'notion', name: 'Notion', desc: 'Conecte bancos de dados do Notion para centralizar informações operacionais.', category: 'Produtividade', color: '#e2e8f0', connected: false },
  { id: 'tiny', name: 'Tiny ERP', desc: 'Integre com o Tiny para trazer dados de vendas, estoque e financeiro.', category: 'ERP', color: '#6B48FF', connected: false },
  { id: 'looker', name: 'Looker Studio', desc: 'Importe relatórios do Looker Studio (Google Data Studio) automaticamente.', category: 'Analytics', color: '#4285F4', connected: false },
  { id: 'bling', name: 'Bling ERP', desc: 'Conecte o Bling para sincronizar vendas, NF-e e financeiro automaticamente.', category: 'ERP', color: '#0070f3', connected: false },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [filter, setFilter] = useState('Todos')

  const categories = ['Todos', 'Analytics', 'Planilhas', 'CRM', 'ERP', 'Produtividade']
  const filtered = filter === 'Todos' ? integrations : integrations.filter(i => i.category === filter)

  const connected = integrations.filter(i => i.connected)
  const available = integrations.filter(i => !i.connected)

  const handleConnect = (id: string) => {
    setConnecting(id)
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true, lastSync: 'Agora', records: 'Sincronizando...' } : i))
      setConnecting(null)
    }, 1800)
  }

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false, lastSync: undefined, records: undefined } : i))
  }

  return (
    <div style={{ padding: '28px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: C.text, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Integrações</h1>
          <p style={{ color: C.textMuted, fontSize: 14 }}>Conecte suas fontes de dados. Cada integração sincroniza automaticamente em segundo plano.</p>
        </div>
        <button className="atlas-btn-primary" style={{ padding: '9px 18px', borderRadius: 9, color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plus size={15} /> Conectar nova fonte
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Conectadas', val: connected.length, color: C.green, sub: 'Fontes ativas' },
          { label: 'Disponíveis', val: available.length, color: C.purpleLight, sub: 'Para conectar' },
          { label: 'Última Sync', val: '2min', color: C.blueLight, sub: 'Google Sheets' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(15,12,28,0.7)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ color: C.textSubtle, fontSize: 12, marginBottom: 8 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{s.val}</div>
            <div style={{ color: C.textSubtle, fontSize: 12 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3, border: `1px solid ${C.borderSubtle}`, marginBottom: 22, width: 'fit-content' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: filter === cat ? 'rgba(139,92,246,0.2)' : 'transparent', color: filter === cat ? C.purpleLight : C.textMuted, cursor: 'pointer', fontSize: 13, fontWeight: filter === cat ? 500 : 400, transition: 'all 0.18s' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Connected */}
      {filtered.some(i => i.connected) && (
        <>
          <div style={{ color: C.textSubtle, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Conectadas</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
            {filtered.filter(i => i.connected).map(intg => (
              <IntegrationCard key={intg.id} intg={intg} onDisconnect={handleDisconnect} onConnect={handleConnect} connecting={connecting === intg.id} />
            ))}
          </div>
        </>
      )}

      {/* Available */}
      {filtered.some(i => !i.connected) && (
        <>
          <div style={{ color: C.textSubtle, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Disponíveis</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {filtered.filter(i => !i.connected).map(intg => (
              <IntegrationCard key={intg.id} intg={intg} onDisconnect={handleDisconnect} onConnect={handleConnect} connecting={connecting === intg.id} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function IntegrationCard({ intg, onConnect, onDisconnect, connecting }: {
  intg: Integration
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
  connecting: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <div className="card-hover"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'rgba(15,12,28,0.75)', border: `1px solid ${intg.connected ? 'rgba(52,211,153,0.2)' : C.border}`, borderRadius: 14, padding: '22px', backdropFilter: 'blur(12px)', transition: 'all 0.25s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${intg.color}18`, border: `1px solid ${intg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: intg.color }} />
          </div>
          <div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>{intg.name}</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 5, padding: '2px 7px', color: C.textSubtle, fontSize: 11, display: 'inline-block', marginTop: 3 }}>{intg.category}</div>
          </div>
        </div>
        {intg.connected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 7, padding: '4px 9px' }}>
            <CheckCircle2 size={11} color={C.green} />
            <span style={{ color: C.green, fontSize: 11, fontWeight: 600 }}>Conectado</span>
          </div>
        )}
      </div>

      <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.62, marginBottom: 16 }}>{intg.desc}</p>

      {intg.connected && (
        <div style={{ marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ color: C.textSubtle, fontSize: 12 }}>Última sincronização</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>{intg.lastSync}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textSubtle, fontSize: 12 }}>Dados importados</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>{intg.records}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {intg.connected ? (
          <>
            <button style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted }}>
              <RefreshCw size={13} /> Sincronizar
            </button>
            <button onClick={() => onDisconnect(intg.id)}
              style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: C.red, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)' }}>
              <Unplug size={13} />
            </button>
          </>
        ) : (
          <button onClick={() => onConnect(intg.id)} className="atlas-btn-primary"
            style={{ flex: 1, padding: '9px 0', borderRadius: 8, color: 'white', border: 'none', cursor: connecting ? 'wait' : 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {connecting ? (
              <>
                <div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
                Conectando...
              </>
            ) : (
              <><Plus size={14} /> Conectar</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
