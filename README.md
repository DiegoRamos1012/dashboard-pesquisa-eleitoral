# Dashboard Pesquisa Eleitoral

SPA em React + TypeScript + Vite para operar o fluxo de pesquisa eleitoral com o backend existente.

## Funcionalidades

- Atualizar base IBGE via `POST /api/ibge/sync?force=true`
- Importar CSV de pesquisa via `POST /api/polls/import` (multipart/form-data, campo `file`)
- Exibir:
  - Resumo da pesquisa (`pollId`, `pollDate`, `weightedPopulation`)
  - Ranking geral por candidato (tabela + grafico)
  - Detalhamento por grupo (`GROUP_1..GROUP_4`) com cobertura amostral
  - Qualidade da amostra com destaque para cobertura abaixo de 5%

## Stack

- React 19 + TypeScript + Vite
- Axios para HTTP
- Recharts para graficos
- shadcn/ui (componentes base) + Tailwind CSS

## Requisitos

- Node.js 20+
- Backend disponivel em `http://localhost:8080` (ou URL configurada via env)

## Configuracao de ambiente

1. Crie um arquivo `.env` na raiz (ou copie de `.env.example`).
2. Defina a URL da API:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Se a variavel nao for definida, o frontend usa `http://localhost:8080` como fallback.

## Instalar e rodar

```bash
npm install
npm run dev
```

Aplicacao de desenvolvimento: `http://localhost:5173` (padrao Vite)

## Build e validacao

```bash
npm run build
npm run lint
```

## Estrutura principal

- `src/api/client.ts`: cliente Axios e tratamento de erro amigavel
- `src/api/contracts.ts`: contratos TypeScript do backend
- `src/api/services.ts`: chamadas para sync e import
- `src/features/sync/*`: atualizacao da base IBGE
- `src/features/import/*`: upload e importacao de CSV
- `src/features/dashboard/*`: resumo, ranking, grupos e qualidade da amostra
- `src/components/*`: componentes compartilhados e UI base
