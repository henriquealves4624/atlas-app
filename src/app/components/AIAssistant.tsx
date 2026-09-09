import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, RotateCcw, ThumbsUp, ThumbsDown, TrendingDown, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react'
import { C } from './atlas-tokens'
import { Pill } from './atlas-ui'
import { useAtlas } from '../store'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  timestamp: string
}

const SUGGESTED_QUESTIONS = [
  { icon: <TrendingDown size={15} />, text: 'Por que minhas vendas caíram?' },
  { icon: <BarChart3 size={15} />, text: 'Qual unidade performa melhor?' },
  { icon: <AlertCircle size={15} />, text: 'Onde estou perdendo clientes?' },
  { icon: <TrendingUp size={15} />, text: 'Quais produtos devo priorizar?' },
  { icon: <Sparkles size={15} />, text: 'Como melhorar meu CAC?' },
  { icon: <TrendingUp size={15} />, text: 'Qual canal traz mais receita?' },
]

const AI_RESPONSES: Record<string, string> = {
  'vendas caíram': `📊 **Análise das Quedas de Vendas**\n\nCom base nos seus dados dos últimos 30 dias, identifiquei **3 fatores principais** que explicam a queda:\n\n1. **Produto B (-15%)** — O produto B apresentou queda significativa após a mudança de precificação em outubro. O preço atual está 18% acima da faixa de percepção de valor dos seus clientes recorrentes.\n\n2. **Canal de mídia paga (-22%)** — Seu CPC aumentou de R$2,10 para R$3,50 nas últimas 2 semanas, reduzindo o volume de leads qualificados gerados por esse canal.\n\n3. **Sazonalidade** — Historicamente, seu negócio tem queda de 8-12% em novembro. O comportamento atual está dentro do padrão dos anos anteriores.\n\n💡 **Recomendação imediata:** Pause os grupos de anúncio com CPC acima de R$3 e crie uma oferta especial para o Produto B com validade de 7 dias para testar a elasticidade de preço.`,

  'unidade performa': `📍 **Comparativo de Performance por Unidade**\n\nAnalisando os dados consolidados de todas as unidades:\n\n**🏆 Unidade Centro — Melhor Performance**\n- Receita: R$38K/mês (+12% vs meta)\n- Ticket médio: R$210 (maior da rede)\n- NPS: 78 pontos\n- Churn: 3,1%\n\n**📊 Unidade Norte — Performance Mediana**\n- Receita: R$24K/mês (-3% vs meta)\n- Ticket médio: R$165\n- NPS: 65 pontos\n\n**⚠️ Unidade Sul — Abaixo da Meta**\n- Receita: R$18K/mês (-18% vs meta)\n- Alta rotatividade de equipe correlacionada com queda de NPS\n\n💡 **Insight:** O diferencial da Unidade Centro está na taxa de conversão de up-sell (34% vs 18% da média). Implementar o playbook de vendas da Unidade Centro nas demais pode gerar +R$12K/mês.`,

  'perdendo clientes': `👥 **Análise de Churn — Onde Você Está Perdendo Clientes**\n\nIdentifiquei **3 momentos críticos** onde você perde mais clientes:\n\n**1. Primeiros 30 dias (35% do churn)**\nClientes que não completam o onboarding na primeira semana têm 4x mais chance de cancelar. O problema está na etapa de configuração inicial.\n\n**2. Mês 3-4 (28% do churn)**\nQueda no engajamento após o "honeymoon period". Clientes que não recebem check-in proativo tendem a desativar o serviço.\n\n**3. Reajuste de preço (22% do churn)**\nO churn spike após reajustes é evitável. Clientes informados com antecedência têm 60% menos chance de cancelar.\n\n💡 **Ação prioritária:** Crie um fluxo de onboarding guiado para os primeiros 7 dias. Com base nos dados, isso pode reduzir seu churn de 4,2% para aproximadamente 2,8% em 90 dias.`,

  'priorizar': `🎯 **Produtos para Priorizar — Análise de Portfólio**\n\nCom base na análise combinada de margem, crescimento e demanda:\n\n**⭐ Alta Prioridade — Escalar Agora**\n- **Produto A**: Margem 52%, crescimento +24% MoM, baixo CAC. Aumente estoque e budget de mídia.\n- **Produto D (Premium)**: Volume baixo mas margem de 68%. Criar bundle com Produto A pode aumentar ticket médio.\n\n**⚡ Média Prioridade — Otimizar**\n- **Produto C**: Boa tração mas margens comprimidas (-8% últimos 3 meses). Revisar precificação ou reduzir custo operacional.\n\n**🔴 Baixa Prioridade — Avaliar**\n- **Produto B**: Queda consistente, baixa margem, alto custo de suporte. Considere descontinuar ou reposicionar.\n\n💡 **Recomendação:** Concentre 70% do seu esforço de marketing nos Produtos A e D nos próximos 30 dias.`,

  'melhorar meu cac': `📉 **Como Reduzir seu CAC — Análise Completa**\n\nSeu CAC atual é de R$143, que está 15% acima do benchmark do setor. Veja como otimizar:\n\n**Canal com melhor CAC:**\n- Indicação: R$28 (🏆 melhor)\n- Orgânico/SEO: R$62\n- Social Media: R$118\n- Google Ads: R$165 (mais alto)\n\n**Oportunidades identificadas:**\n1. Criar programa de indicação estruturado pode triplicar o volume deste canal\n2. Seu blog tem 3.400 visitas/mês mas taxa de conversão de apenas 0,8% — landing page precisa de melhorias\n3. Google Ads tem CPC 40% acima do setor — otimização de palavras-chave negativas pode reduzir 25%\n\n💡 **Meta realista:** Com essas ações, seu CAC pode chegar a R$95-110 em 60 dias, liberando R$4.000+/mês em orçamento de crescimento.`,

  'canal traz mais': `📡 **Análise de Canais de Aquisição**\n\nBaseado nos últimos 90 dias de dados:\n\n| Canal | Clientes | Receita | LTV | CAC |\n|-------|----------|---------|-----|-----|\n| Indicação | 28 | R$8.4K | R$1.8K | R$28 |\n| Orgânico | 45 | R$9.2K | R$1.4K | R$62 |\n| Instagram | 38 | R$7.1K | R$890 | R$118 |\n| Google Ads | 31 | R$5.8K | R$760 | R$165 |\n\n**🏆 Indicação é o canal com melhor ROI**, mas representa apenas 18% do volume total — grande oportunidade de expansão.\n\n**O canal orgânico** tem a maior receita total e boa relação CAC/LTV. Investir em conteúdo pode multiplicar este canal sem aumento proporcional de custo.\n\n💡 **Ação:** Crie um programa de indicação com incentivo para referrer e indicado. Empresas similares conseguiram 3x de volume de indicações com essa estratégia.`,

  'margem e custos': `💰 **Margem e Estrutura de Custos**\n\nSua margem bruta está em **42%**, quatro pontos acima da média do setor (38%). Ela oscilou entre 37% e 47% no ano, com o melhor resultado em setembro.\n\n**Como seus custos estão distribuídos:**\n- Custo fixo: 40% (benchmark do porte: 35%)\n- Custo variável: 35%\n- Investimento: 25%\n\n**O ponto de atenção** é o custo fixo. Os 5 pontos percentuais acima do benchmark equivalem a cerca de **R$ 2.400 por mês** que poderiam ir para crescimento.\n\n💡 **Recomendação:** levante os contratos recorrentes com vencimento neste trimestre — normalmente é onde está a maior folga de negociação sem impacto na operação.`,

  'funil de vendas': `🎯 **Diagnóstico do Funil de Vendas**\n\nSeu funil hoje:\n\n| Etapa | Volume | Conversão |\n|-------|--------|-----------|\n| Visitantes | 12.400 | — |\n| Leads | 3.800 | 31% |\n| Propostas | 1.200 | 32% |\n| Fechados | 420 | 35% |\n\n**A entrada do funil está saudável.** A conversão de visitante para lead (31%) está acima da média do setor, de 25%.\n\n**O gargalo está no fechamento.** 35% contra um benchmark de 42% — e há **28 propostas paradas há mais de 7 dias** sem contato registrado, o equivalente a R$ 12,4K em negociações estagnadas.\n\n💡 **Ação imediata:** ative uma sequência de follow-up de 3 toques para propostas sem contato há mais de 5 dias. Recuperar só um terço dessas propostas já representa R$ 4K no mês.`,
}

function getResponse(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('cac') || q.includes('aquisição') || q.includes('anúncio')) return AI_RESPONSES['melhorar meu cac']
  if ((q.includes('vend') || q.includes('faturamento') || q.includes('receita')) && (q.includes('caiu') || q.includes('queda') || q.includes('cair') || q.includes('baixa'))) return AI_RESPONSES['vendas caíram']
  if (q.includes('unidade') || q.includes('performa') || q.includes('loja')) return AI_RESPONSES['unidade performa']
  if (q.includes('churn') || q.includes('perdendo') || q.includes('recompra') || q.includes('retenção') || q.includes('cliente')) return AI_RESPONSES['perdendo clientes']
  if (q.includes('priorizar') || q.includes('produto') || q.includes('portfólio')) return AI_RESPONSES['priorizar']
  if (q.includes('canal') || q.includes('indicação') || q.includes('receita')) return AI_RESPONSES['canal traz mais']
  if (q.includes('margem') || q.includes('custo') || q.includes('despesa')) return AI_RESPONSES['margem e custos']
  if (q.includes('proposta') || q.includes('conversão') || q.includes('funil')) return AI_RESPONSES['funil de vendas']
  return `🔍 **Analisando seus dados...**\n\nCruzei sua pergunta — **"${question}"** — com os três painéis conectados (Financeiro, Comercial e Clientes) e com o histórico dos últimos 12 meses.\n\nEncontrei sinais relevantes em mais de um painel, o que indica fatores inter-relacionados. Para uma leitura mais precisa sobre esse ponto específico, vale conectar a fonte de dados relacionada em Integrações.\n\n💡 **Sugestão:** reformule citando a métrica que você quer entender (faturamento, margem, CAC, churn, conversão) — assim consigo trazer números e uma recomendação direta.`
}

// Converte o texto da resposta em elementos: negrito, listas, tabelas e títulos.
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ color: C.text, fontWeight: 600 }}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  )
}

function formatMessage(text: string) {
  return text.split('\n').map((line, i) => {
    const bare = line.replace(/^[^\w*]*\s*/, '')

    // Linha inteira em negrito (com ou sem emoji na frente) vira título.
    if (/^\*\*[^*]+\*\*$/.test(bare.trim())) {
      const prefix = line.slice(0, line.indexOf('**'))
      return (
        <div key={i} style={{ color: C.text, fontSize: 14.5, fontWeight: 650, marginTop: i === 0 ? 0 : 12, marginBottom: 5 }}>
          {prefix}{bare.trim().slice(2, -2)}
        </div>
      )
    }
    if (line.startsWith('- ')) {
      return <div key={i} style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, paddingLeft: 12, marginBottom: 2 }}>• {inline(line.slice(2))}</div>
    }
    if (/^\d+\./.test(line)) {
      return <div key={i} style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, paddingLeft: 4, marginBottom: 4 }}>{inline(line)}</div>
    }
    if (line.startsWith('|')) {
      if (/^\|[\s|:-]+\|$/.test(line)) return null
      const cells = line.split('|').slice(1, -1)
      return (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: 8, padding: '5px 0', borderBottom: `1px solid ${C.borderSubtle}` }}>
          {cells.map((c, j) => (
            <span key={j} style={{ color: j === 0 ? C.textMuted : C.text, fontSize: 12.5, fontWeight: j === 0 ? 400 : 500 }}>{c.trim()}</span>
          ))}
        </div>
      )
    }
    if (line === '') return <div key={i} style={{ height: 6 }} />
    return <p key={i} style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65 }}>{inline(line)}</p>
  })
}

const WELCOME = 'Olá, João. Eu leio continuamente as suas fontes conectadas e consigo responder sobre o seu negócio em linguagem natural — sem fórmula, sem consulta técnica.\n\nO que você quer entender hoje?'

export default function AIAssistant() {
  const { pendingQuestion, clearPendingQuestion, sources, insights } = useAtlas()
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', timestamp: 'Agora', text: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const connected = sources.filter(s => s.connected).length
  const novos = insights.filter(i => i.status === 'novo').length

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text?: string) => {
    const q = text || input.trim()
    if (!q) return
    setInput('')
    const userMsg: Message = { id: Date.now(), role: 'user', text: q, timestamp: 'Agora' }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const reply: Message = { id: Date.now() + 1, role: 'assistant', text: getResponse(q), timestamp: 'Agora' }
      setMessages(prev => [...prev, reply])
    }, 1500 + Math.random() * 700)
  }

  // Perguntas abertas a partir de um insight ou da tela inicial chegam por aqui.
  useEffect(() => {
    if (!pendingQuestion) return
    sendMessage(pendingQuestion)
    clearPendingQuestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion])

  return (
    <div className="atlas-page" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      {/* Header */}
      <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.borderSubtle}`, background: C.bg2, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(139,92,246,0.35)' }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Atlas IA</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="atlas-glow" style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
                <span style={{ color: C.textSubtle, fontSize: 12 }}>Lendo {connected} fontes conectadas</span>
              </div>
              <Pill color={C.purpleLight} background="rgba(139,92,246,0.12)">{novos} insights no radar</Pill>
            </div>
          </div>
          <button onClick={() => setMessages([{ id: 0, role: 'assistant', timestamp: 'Agora', text: 'Conversa reiniciada. O que você quer entender agora?' }])}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, background: 'none', border: `1px solid ${C.borderSubtle}`, color: C.textMuted, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted }}>
            <RotateCcw size={13} /> Nova conversa
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }} className="atlas-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 12 }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end', boxShadow: '0 0 16px rgba(139,92,246,0.3)' }}>
                <Sparkles size={15} color="white" />
              </div>
            )}
            <div style={{ maxWidth: '74%' }}>
              <div style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(15,12,28,0.8)',
                border: msg.role === 'assistant' ? `1px solid rgba(139,92,246,0.18)` : 'none',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                padding: '14px 18px',
                backdropFilter: 'blur(12px)',
                boxShadow: msg.role === 'assistant' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(124,58,237,0.4)',
              }}>
                {msg.role === 'user' ? (
                  <p style={{ color: 'white', fontSize: 14, lineHeight: 1.6 }}>{msg.text}</p>
                ) : (
                  <div>{formatMessage(msg.text)}</div>
                )}
              </div>
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', gap: 6, marginTop: 6, paddingLeft: 4 }}>
                  {[<ThumbsUp size={13} />, <ThumbsDown size={13} />].map((icon, i) => (
                    <button key={i} style={{ background: 'none', border: `1px solid ${C.borderSubtle}`, borderRadius: 6, width: 26, height: 26, cursor: 'pointer', color: C.textSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textSubtle }}>
                      {icon}
                    </button>
                  ))}
                  <span style={{ color: C.textSubtle, fontSize: 11, alignSelf: 'center', marginLeft: 4 }}>{msg.timestamp}</span>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end' }}>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>J</span>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(139,92,246,0.3)' }}>
              <Sparkles size={15} color="white" />
            </div>
            <div style={{ background: 'rgba(15,12,28,0.8)', border: `1px solid rgba(139,92,246,0.18)`, borderRadius: '4px 16px 16px 16px', padding: '16px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} className="typing-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: C.purpleLight }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 28px 16px', flexShrink: 0 }}>
          <div style={{ color: C.textSubtle, fontSize: 12, fontWeight: 500, marginBottom: 10 }}>Sugestões de perguntas:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q.text)} className="atlas-btn-secondary"
                style={{ padding: '7px 14px', borderRadius: 8, color: C.textMuted, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: C.purpleLight }}>{q.icon}</span>
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '16px 28px 20px', borderTop: `1px solid ${C.borderSubtle}`, background: C.bg2, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: '12px 16px', transition: 'border-color 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}
            onFocus={() => {}} onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
            <Sparkles size={15} color={C.textSubtle} style={{ flexShrink: 0 }} />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Pergunte ao Atlas sobre seus dados..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, caretColor: C.purpleLight }}
              onFocus={e => { (e.currentTarget.closest('div') as HTMLDivElement).style.borderColor = C.borderMd }}
              onBlur={e => { (e.currentTarget.closest('div') as HTMLDivElement).style.borderColor = C.borderSubtle }}
            />
          </div>
          <button onClick={() => sendMessage()} disabled={!input.trim() || typing}
            className="atlas-btn-primary"
            style={{ width: 44, height: 44, borderRadius: 12, border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', opacity: input.trim() && !typing ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Send size={17} color="white" />
          </button>
        </div>
        <p style={{ color: C.textSubtle, fontSize: 11, marginTop: 8, textAlign: 'center' }}>Atlas IA analisa seus dados em tempo real · Respostas baseadas nos seus painéis conectados</p>
      </div>
    </div>
  )
}
