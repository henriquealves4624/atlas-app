/**
 * Percurso end-to-end da demonstração: autenticar → Home vazia → conectar
 * Power BI → importar painel → insights → backlog → kanban → concluir.
 * Roda com: npx vitest run --config vitest.config.ts
 */
import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Recharts precisa de dimensões para renderizar dentro do jsdom.
beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 })
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 })
  // jsdom não implementa rolagem de elementos
  Element.prototype.scrollIntoView = () => {}
  globalThis.ResizeObserver = class {
    observe() {} unobserve() {} disconnect() {}
  } as never
})

async function login(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Entrar no Atlas/i }))
  await waitFor(() => expect(screen.getByText(/Projetos recentes/i)).toBeTruthy(), { timeout: 4000 })
}

describe('jornada do Atlas', () => {
  it('entra em uma Home realmente vazia', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user)

    expect(screen.getByText(/Conecte sua primeira fonte de dados/i)).toBeTruthy()
    expect(screen.getByText(/O Atlas ainda não encontrou insights/i)).toBeTruthy()
    expect(screen.getByText(/Seus indicadores aparecerão aqui/i)).toBeTruthy()
    expect(screen.getByText(/Nenhuma análise ainda/i)).toBeTruthy()
    expect(screen.getByText(/Criar projeto/i)).toBeTruthy()
  })

  it('percorre conectar Power BI → importar painel → insight → backlog → concluir', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user)

    // Home → Integrações
    await user.click(screen.getAllByRole('button', { name: /^Conectar dados$/i })[0])
    await waitFor(() => expect(screen.getByText(/Já utiliza uma ferramenta de visualização\?/i)).toBeTruthy())

    // Banner → ferramentas de visualização → Power BI
    await user.click(screen.getByRole('button', { name: /Conectar ferramenta/i }))
    await waitFor(() => expect(screen.getByText(/Ferramentas de visualização/i)).toBeTruthy())
    await user.click(screen.getByText('Power BI'))

    // Autenticação simulada da Microsoft
    await waitFor(() => expect(screen.getByText(/Conectar Power BI/i)).toBeTruthy())
    await user.click(screen.getByRole('button', { name: /Entrar/i }))

    // Lista de painéis existentes
    await waitFor(() => expect(screen.getByText(/Painéis no Power BI/i)).toBeTruthy(), { timeout: 8000 })
    await user.click(screen.getByText('Performance Comercial'))
    await user.click(screen.getByRole('button', { name: /Continuar/i }))

    // Nome do painel + novo projeto
    await waitFor(() => expect(screen.getByText(/Salvar painel no Atlas/i)).toBeTruthy())
    const projectInput = await screen.findByPlaceholderText(/Ex.: Comercial/i)
    await user.type(projectInput, 'Comercial')
    await user.click(screen.getByRole('button', { name: /Importar painel/i }))

    // Importação + primeira análise da IA
    await waitFor(() => expect(screen.getByText(/Importando painel/i)).toBeTruthy())
    await waitFor(
      () => expect(screen.getByRole('heading', { name: 'Performance Comercial' })).toBeTruthy(),
      { timeout: 10000 },
    )

    // Insights aparecem no painel depois da análise
    await waitFor(
      () => expect(screen.getByText(/CAC subiu 15% nos últimos 15 dias/i)).toBeTruthy(),
      { timeout: 10000 },
    )

    // Adicionar aos Insights → backlog
    const addButtons = screen.getAllByRole('button', { name: /Adicionar aos Insights/i })
    await user.click(addButtons[0])
    await waitFor(() => expect(screen.getByText(/Defina prioridade e categoria/i)).toBeTruthy())
    await user.click(screen.getByRole('button', { name: /^Adicionar$/i }))

    // Central de Insights abre no Kanban, com o insight no backlog
    await user.click(screen.getByRole('button', { name: /Central de Insights/i }))
    await waitFor(() => expect(screen.getByRole('heading', { name: /Central de Insights/i })).toBeTruthy())
    expect(screen.queryByRole('button', { name: /^Cards$/i })).toBeNull()

    // Detalhe do insight → iniciar ação → em andamento
    await user.click(screen.getByText(/CAC subiu 15%/i))
    await user.click(await screen.findByRole('button', { name: /Iniciar ação/i }))
    await waitFor(() => expect(screen.getByText(/Ação iniciada/i)).toBeTruthy())

    // Concluir com registro do que foi feito
    await user.click(screen.getByRole('button', { name: /^Concluir$/i }))
    await waitFor(() => expect(screen.getByText(/Como essa ação foi concluída\?/i)).toBeTruthy())
    await user.type(
      screen.getByPlaceholderText(/Redistribuí o orçamento/i),
      'Pausei os anúncios com CPC acima de R$ 3,50.',
    )
    await user.click(screen.getByRole('button', { name: /Concluir insight/i }))

    await waitFor(() => expect(screen.getByText(/Insight concluído/i)).toBeTruthy())

    // Lista → Concluídos → detalhe com a ação registrada
    await user.click(screen.getByRole('button', { name: /^Lista$/i }))
    await user.click(screen.getByRole('button', { name: /Concluídos\s*1/i }))
    await user.click(within(screen.getByRole('table')).getByText(/CAC subiu 15%/i))
    expect(await screen.findByText(/Ação registrada/i)).toBeTruthy()
  }, 40000)

  it('alterna entre Kanban e Lista na Central', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user)

    // Caminho curto: cria painel pelo Excel + construtor do Atlas
    await user.click(screen.getAllByRole('button', { name: /^Conectar dados$/i })[0])
    await waitFor(() => expect(screen.getByText('Excel / CSV')).toBeTruthy())
    await user.click(screen.getAllByRole('button', { name: /^Conectar$/i })[0])
    await waitFor(() => expect(screen.getByText(/Selecionar arquivo/i)).toBeTruthy())
    await user.click(screen.getByText(/Selecionar arquivo/i))
    await user.click(screen.getByRole('button', { name: /Importar arquivo/i }))

    await waitFor(() => expect(screen.getByText(/Seus dados estão conectados/i)).toBeTruthy(), { timeout: 8000 })
    await user.click(screen.getByRole('button', { name: /Construir painel/i }))

    await waitFor(() => expect(screen.getByPlaceholderText(/Dê um nome ao painel/i)).toBeTruthy())
    await user.type(screen.getByPlaceholderText(/Dê um nome ao painel/i), 'Receita')
    await user.click(screen.getByRole('button', { name: /Gerar visualização/i }))
    await waitFor(() => expect(screen.getByDisplayValue(/Evolução da receita/i)).toBeTruthy(), { timeout: 8000 })

    await user.click(screen.getByRole('button', { name: /Publicar painel/i }))
    await waitFor(() => expect(screen.getByText(/Em qual projeto este painel ficará\?/i)).toBeTruthy())
    await user.type(screen.getByPlaceholderText(/Ex.: Financeiro/i), 'Financeiro')
    const publishButtons = screen.getAllByRole('button', { name: /Publicar painel/i })
    await user.click(publishButtons[publishButtons.length - 1])

    await waitFor(
      () => expect(screen.getByText(/Faturamento caiu 8% nas últimas 3 semanas/i)).toBeTruthy(),
      { timeout: 10000 },
    )

    // No painel, o card compacto mostra só o título descritivo, sem o resumo
    expect(screen.queryByText(/O restante do portfólio se manteve estável/i)).toBeNull()

    // Central abre no Kanban; a visão em cards não existe mais
    await user.click(screen.getByRole('button', { name: /Central de Insights/i }))
    expect(screen.queryByRole('button', { name: /^Cards$/i })).toBeNull()
    expect(screen.getAllByText(/Arraste um insight para cá/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Insights gerados/i).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /^Lista$/i }))
    expect(screen.getByRole('button', { name: /Exportar CSV/i })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /^Kanban$/i }))
    expect(screen.getAllByText(/Arraste um insight para cá/i).length).toBeGreaterThan(0)
  }, 40000)

  it('monta o painel Orçado X Realizado com insights, indicadores e resposta da IA coerentes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user)

    // Planilha de orçado x realizado
    await user.click(screen.getAllByRole('button', { name: /^Conectar dados$/i })[0])
    await waitFor(() => expect(screen.getByText('Excel / CSV')).toBeTruthy())
    await user.click(screen.getAllByRole('button', { name: /^Conectar$/i })[0])
    await user.click(await screen.findByText(/Selecionar arquivo/i))
    expect(screen.getByText(/orcado-x-realizado-2026\.xlsx/i)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /Importar arquivo/i }))
    await waitFor(() => expect(screen.getByText(/Seus dados estão conectados/i)).toBeTruthy(), { timeout: 8000 })
    await user.click(screen.getByRole('button', { name: /Construir painel/i }))

    // Painel com os três gráficos da demonstração
    await user.type(await screen.findByPlaceholderText(/Dê um nome ao painel/i), 'Orçado X Realizado')
    const addChart = async (button: RegExp, title: string) => {
      await user.click(screen.getByRole('button', { name: button }))
      const inputs = screen.getAllByDisplayValue(/^(Gráfico de|KPI \/ Card)/i)
      const input = inputs[inputs.length - 1]
      await user.clear(input)
      await user.type(input, title)
    }
    await addChart(/Gráfico de barras/i, 'Realizado por mês')
    await addChart(/Gráfico de pizza/i, 'Realizado por vendedor')
    await addChart(/KPI \/ Card/i, 'Realizado no mês')

    await user.click(screen.getByRole('button', { name: /Publicar painel/i }))
    await user.type(await screen.findByPlaceholderText(/Ex.: Financeiro/i), 'Financeiro')
    const publish = screen.getAllByRole('button', { name: /Publicar painel/i })
    await user.click(publish[publish.length - 1])

    // Insights e indicadores falam de orçamento, não de faturamento genérico
    await waitFor(
      () => expect(screen.getByText(/Realizado ficou 6,4% abaixo do orçado no mês/i)).toBeTruthy(),
      { timeout: 10000 },
    )
    expect(screen.queryByText(/Faturamento caiu 8%/i)).toBeNull()
    expect(screen.getByText('Atingimento do orçamento')).toBeTruthy()
    expect(screen.queryByText('Vendedores acima da meta')).toBeNull()

    // Menu de projetos e painéis ao lado do menu principal
    const explorer = screen.getByRole('complementary', { name: /Projetos e painéis/i })
    expect(within(explorer).getByText('Financeiro')).toBeTruthy()
    expect(within(explorer).getAllByText('Orçado X Realizado').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /^Ver mais$/i }))
    expect(screen.getByText('Vendedores acima da meta')).toBeTruthy()
    expect(screen.getByText('Projeção de fechamento do ano')).toBeTruthy()

    // Tag do painel na Central
    await user.click(screen.getByRole('button', { name: /Central de Insights/i }))
    await user.click(screen.getByRole('button', { name: /Kanban/i }))
    expect(screen.getAllByTitle('Orçado X Realizado').length).toBeGreaterThan(0)

    // Pergunta usada no vídeo
    await user.click(screen.getAllByRole('button', { name: /Perguntar ao Atlas/i })[0])
    const question = await screen.findByPlaceholderText(/Pergunte ao Atlas sobre seus dados/i)
    await user.type(question, 'Quero saber o que aconteceu com o faturamento da empresa no último mês{enter}')
    await waitFor(() => expect(screen.getByText(/O que aconteceu no último mês/i)).toBeTruthy(), { timeout: 6000 })
    expect(screen.getAllByText(/R\$ 412K/).length).toBeGreaterThan(0)
  }, 60000)
})
