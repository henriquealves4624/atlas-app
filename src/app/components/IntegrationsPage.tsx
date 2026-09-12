import { useMemo, useState } from 'react'
import { Plus, RefreshCw, Unplug, Check, LayoutDashboard, ArrowRight } from 'lucide-react'
import { C } from './atlas-tokens'
import { Reveal, Card, Segmented, PrimaryButton, GhostButton, EmptyState, Pill } from './atlas-ui'
import { useAtlas } from '../store'
import { SOURCE_CATALOG, type SourceCatalogItem } from './atlas-data'

type Mode = 'disponiveis' | 'conectadas'

export default function IntegrationsPage() {
  const { sources, isConnected, disconnectSource, startFlow, toast } = useAtlas()
  const [mode, setMode] = useState<Mode>(sources.length > 0 ? 'conectadas' : 'disponiveis')
  const [category, setCategory] = useState('Todas')
  const [syncing, setSyncing] = useState<string | null>(null)

  const connectedItems = SOURCE_CATALOG.filter(s => isConnected(s.id))
  // Ferramentas de visualização têm caminho próprio, pelo banner acima da lista.
  const availableItems = SOURCE_CATALOG.filter(s => !isConnected(s.id) && !s.visualization)

  const base = mode === 'conectadas' ? connectedItems : availableItems
  const categories = useMemo(
    () => ['Todas', ...Array.from(new Set(base.map(s => s.category)))],
    [base],
  )
  const visible = category === 'Todas' ? base : base.filter(s => s.category === category)

  const sync = (item: SourceCatalogItem) => {
    setSyncing(item.id)
    setTimeout(() => {
      setSyncing(null)
      toast(`${item.name} sincronizado`, 'Os painéis ligados a esta fonte foram atualizados.', 'info')
    }, 1400)
  }

  return (
    <div className="atlas-page" style={{ padding: '28px 32px 52px', maxWidth: 1180, margin: '0 auto' }}>
      <Reveal>
        <h1 style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.028em', marginBottom: 8 }}>Integrações</h1>
        <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.6, maxWidth: 620, marginBottom: 26 }}>
          Conecte as ferramentas que sua empresa já usa. O Atlas passa a ler esses dados para encontrar o que merece atenção.
        </p>
      </Reveal>

      {/* Dois números, sem ruído */}
      <Reveal delay={60}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 28 }}>
          <Card padding={19}>
            <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 8 }}>Fontes conectadas</div>
            <div style={{ color: connectedItems.length ? C.green : C.textSubtle, fontSize: 27, fontWeight: 700, letterSpacing: '-0.03em' }}>
              {connectedItems.length}
            </div>
          </Card>
          <Card padding={19}>
            <div style={{ color: C.textSubtle, fontSize: 12.5, marginBottom: 8 }}>Disponíveis para conectar</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ color: C.purpleLight, fontSize: 27, fontWeight: 700, letterSpacing: '-0.03em' }}>{availableItems.length}</span>
              <span style={{ color: C.textSubtle, fontSize: 12.5 }}>sem custo adicional</span>
            </div>
          </Card>
        </div>
      </Reveal>

      {/* Banner das ferramentas de visualização */}
      <Reveal delay={100}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', borderRadius: 16, border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.06)', padding: '20px 22px', marginBottom: 26 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(139,92,246,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purpleLight, flexShrink: 0 }}>
            <LayoutDashboard size={18} />
          </div>
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Já utiliza uma ferramenta de visualização?</div>
            <div style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>
              Conecte uma ferramenta que sua empresa já utiliza e aproveite seus painéis no Atlas.
            </div>
          </div>
          <PrimaryButton onClick={() => startFlow('tool-pick')} icon={<ArrowRight size={15} />}>Conectar ferramenta</PrimaryButton>
        </div>
      </Reveal>

      {/* Filtros: primeiro o que eu quero fazer, depois a categoria */}
      <Reveal delay={140}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <Segmented
            value={mode}
            onChange={(m: Mode) => { setMode(m); setCategory('Todas') }}
            options={[
              { value: 'disponiveis', label: `Fontes disponíveis` },
              { value: 'conectadas', label: `Fontes conectadas${connectedItems.length ? ` (${connectedItems.length})` : ''}` },
            ]}
          />
          {categories.length > 2 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ padding: '6px 13px', borderRadius: 9, cursor: 'pointer', fontSize: 12.5, fontWeight: category === cat ? 600 : 450, transition: 'all 0.18s', border: `1px solid ${category === cat ? C.borderMd : 'transparent'}`, background: category === cat ? 'rgba(139,92,246,0.1)' : 'transparent', color: category === cat ? C.purpleLight : C.textSubtle }}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={180}>
        {visible.length === 0 ? (
          <Card padding={0}>
            <EmptyState
              compact
              icon={<Plus size={18} />}
              title={mode === 'conectadas' ? 'Nenhuma fonte conectada ainda' : 'Nada disponível nesta categoria'}
              description={mode === 'conectadas'
                ? 'Conecte a primeira fonte para o Atlas começar a ler os dados da sua empresa.'
                : 'Todas as fontes desta categoria já estão conectadas.'}
              action={mode === 'conectadas'
                ? <GhostButton onClick={() => setMode('disponiveis')}>Ver fontes disponíveis</GhostButton>
                : undefined}
            />
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 13 }}>
            {visible.map(item => {
              const connection = sources.find(s => s.id === item.id)
              return (
                <Card key={item.id} padding={19} hover>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 13 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${item.color}22`, border: `1px solid ${item.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                      {item.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: C.text, fontSize: 14.5, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: C.textSubtle, fontSize: 12 }}>{item.category}</div>
                    </div>
                    {connection && <Pill color={C.green} background="rgba(52,211,153,0.1)" icon={<Check size={10} />}>Conectado</Pill>}
                  </div>

                  <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 16, minHeight: 42 }}>{item.desc}</p>

                  {connection ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textSubtle, fontSize: 12.5, marginBottom: 14 }}>
                        <span>{connection.records}</span>
                        <span>sincronizado {connection.lastSync}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <GhostButton
                          style={{ flex: 1, padding: '9px 0' }}
                          icon={<RefreshCw size={13} style={syncing === item.id ? { animation: 'spin-slow 0.8s linear infinite' } : undefined} />}
                          onClick={() => sync(item)}
                        >
                          {syncing === item.id ? 'Sincronizando' : 'Sincronizar'}
                        </GhostButton>
                        <GhostButton tone="danger" style={{ padding: '9px 12px' }}
                          onClick={() => { disconnectSource(item.id); toast(`${item.name} desconectado`, 'Os painéis ligados a essa fonte deixam de ser atualizados.', 'warn') }}>
                          <Unplug size={14} />
                        </GhostButton>
                      </div>
                    </>
                  ) : (
                    <PrimaryButton style={{ width: '100%' }} icon={<Plus size={14} />}
                      onClick={() => startFlow('source-connect', { sourceId: item.id })}>
                      Conectar
                    </PrimaryButton>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </Reveal>
    </div>
  )
}
