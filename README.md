# Dashboard Pesquisa Eleitoral

SPA em React + TypeScript + Vite para executar o fluxo de pesquisa eleitoral integrado ao backend existente.

## Visão Geral

O objetivo desta aplicação é permitir, em uma única interface:

1. Sincronizar a base IBGE.
2. Importar uma pesquisa eleitoral em CSV.
3. Visualizar resultados consolidados e detalhados por estado e por porte municipal.

## Funcionalidades

### 1) Sincronização da Base IBGE

- Disparo da sincronização via `POST /api/ibge/sync?force=true`.
- Feedback de loading, sucesso e erro.
- Exibição dos contadores retornados pela API:
  - `statesCreated`
  - `statesUpdated`
  - `municipalitiesCreated`
  - `forced`

### 2) Importação de Pesquisa CSV

- Upload com área de arrastar e soltar (drag-and-drop) e seleção manual de arquivo.
- Envio do arquivo via `POST /api/polls/import` (`multipart/form-data`, campo `file`).
- Validação básica de extensão/tipo de arquivo (`.csv`).
- Mensagens amigáveis para sucesso e falhas de API.

### 3) Dashboard Analítico

- Resumo da pesquisa:
  - `pollId`
  - `pollDate`
  - `weightedPopulation`
- Ranking geral nacional:
  - Tabela de candidatos.
  - Gráfico com seletor de visualização:
    - Barras
    - Linha pontilhada
    - Pizza
  - Soma total dos percentuais exibida.
- Intenção de voto por estado:
  - Consolidação por UF.
  - Perspectiva por porte municipal (Grupos 1 a 4).
  - Indicadores de amostra e cobertura por grupo.
- Detalhamento por grupo (`GROUP_1..GROUP_4`):
  - `stateAcronym`
  - `groupPopulation`
  - `sampledPopulation`
  - Cobertura (`sampledPopulation / groupPopulation`)
  - Gráfico por candidato no grupo.
- Qualidade da amostra:
  - Alerta quando cobertura < 5%.
  - Classificação de cobertura: baixa, média e alta.

## Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (componentes base)
- Recharts (visualização de dados)
- Axios (cliente HTTP)
- Radix UI (primitivos de acessibilidade)
- Lucide React (ícones)

## Contrato de Integração (Backend)

Base local esperada:

- `http://localhost:8080`

Endpoints utilizados:

1. `POST /api/ibge/sync?force=true|false`
2. `POST /api/polls/import`

Observação:

- Não há endpoint de histórico de pesquisas. O dashboard renderiza a partir do retorno da importação atual.

## Pré-requisitos

- Node.js 20+
- npm 10+
- Backend disponível em `http://localhost:8080` (ou URL definida via variável de ambiente)

## Configuração de Ambiente

1. Crie o arquivo `.env` na raiz (ou copie de `.env.example`).
2. Configure a URL da API:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Fallback padrão:

- Se `VITE_API_BASE_URL` não for definida, o frontend usa `http://localhost:8080`.

## Instalação e Execução

```bash
npm install
npm run dev
```

Aplicação em desenvolvimento:

- `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: executa checagem TypeScript e gera build de produção.
- `npm run lint`: executa ESLint no projeto.
- `npm run preview`: serve localmente o build gerado.

## Build e Validação

```bash
npm run lint
npm run build
```

## Estrutura do Projeto

- `src/api/client.ts`: cliente Axios e normalização de mensagens de erro.
- `src/api/contracts.ts`: tipagens TypeScript dos contratos da API.
- `src/api/services.ts`: chamadas HTTP para sincronização e importação.
- `src/features/sync/*`: fluxo de atualização da base IBGE.
- `src/features/import/*`: fluxo de upload/importação do CSV.
- `src/features/dashboard/*`: componentes de análise e visualização dos resultados.
- `src/components/*`: componentes compartilhados e UI base.
- `src/lib/*`: utilitários e formatação.

## Fluxo de Uso Recomendado

1. Clique em Atualizar base IBGE.
2. Importe um arquivo CSV no formato esperado.
3. Analise:
   - Ranking geral nacional.
   - Intenção por estado.
   - Detalhamento por grupo e qualidade da amostra.

## Tratamento de Erros

- Erros de API (`400/500`) são exibidos com mensagem amigável.
- Quando disponível, o frontend prioriza o `error.message` retornado pelo backend.
- A UI é resiliente para cenários com `groupBreakdown` vazio.
