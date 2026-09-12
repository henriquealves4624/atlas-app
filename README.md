# Atlas

Plataforma de dados e inteligência para pequenas e médias empresas.
O Atlas conecta as ferramentas que a empresa já usa, lê esses dados com a Atlas IA
e transforma o que encontra em decisões acompanhadas até a conclusão.

## A jornada do produto

```
dados → análise → insight → decisão → ação → aprendizado
```

1. **Conectar** — fontes de dados (planilhas, ERP, CRM) e ferramentas de visualização (Power BI, Looker Studio, Tableau).
2. **Visualizar** — importar um painel que já existe na ferramenta ou montar um novo no Atlas.
3. **Entender** — a Atlas IA lê cada painel e devolve insights com impacto estimado e recomendação.
4. **Decidir** — o usuário adiciona ao backlog, prioriza, categoriza ou descarta.
5. **Agir** — a Central de Insights acompanha a execução em cards, kanban ou lista.
6. **Aprender** — ao concluir, o usuário registra o que foi feito e essa decisão vira contexto do projeto.

Projetos agrupam painéis, e painéis geram insights — a mesma entidade atravessa Home, Painéis e Central de Insights.

## Rodando o projeto

```bash
npm install
npm run dev
```

Outros comandos:

```bash
npm run build      # build de produção
npm run test       # percurso end-to-end da jornada (vitest + testing-library)
npm run typecheck  # verificação de tipos
```

## Estrutura

```
src/app/
  store.tsx                  estado do sistema (projetos, painéis, insights, fontes, fluxo)
  components/
    atlas-data.ts            catálogos, templates de painel e insights por contexto
    atlas-ui.tsx             componentes e tokens de interface compartilhados
    LoginPage.tsx            autenticação (única porta de entrada)
    AppShell.tsx             navegação, barra superior e notificações
    HomePage.tsx             centro de comando: projetos, insights, indicadores
    ConnectFlow.tsx          fluxo de conexão, importação e escolha de visualização
    IntegrationsPage.tsx     fontes de dados e ferramentas de visualização
    PanelBuilder.tsx         criação de painel no Atlas (com sugestão da IA)
    PanelsPage.tsx           projetos → painéis → insights → indicadores → gráficos
    PanelCharts.tsx          visualizações por tipo de painel
    InsightsPage.tsx         Central de Insights (cards, kanban, lista)
    InsightCard.tsx          card de insight e suas ações
    InsightTriage.tsx        modais de priorização, conclusão e criação de projeto
    AIAssistant.tsx          Perguntar ao Atlas
    SettingsPage.tsx         conta, equipe, plano e segurança
```
