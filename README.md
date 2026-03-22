# 📊 Dashboard Pesquisa Eleitoral

SPA (Single Page Application) em **React + TypeScript + Vite** para executar o fluxo de pesquisa eleitoral integrado à API Java desenvolvida no teste para a empresa **Konatus**.

🔗 Backend:
https://github.com/DiegoRamos1012/teste_pesquisaeleitoral

---

## 👀 Visão Geral

O objetivo desta aplicação é permitir, em uma única interface:

1. 🔄 Sincronizar a base IBGE
2. 📥 Importar uma pesquisa eleitoral em CSV
3. 📈 Visualizar resultados consolidados e detalhados

---

## ⚙️ Funcionalidades

### 🔄 1) Sincronização da Base IBGE

* Disparo via `POST /api/ibge/sync?force=true`
* ⏳ Feedback de loading, sucesso e erro
* 📊 Exibição dos contadores:

  * `statesCreated`
  * `statesUpdated`
  * `municipalitiesCreated`
  * `forced`

---

### 📥 2) Importação de Pesquisa CSV

* 🖱️ Upload com drag-and-drop e seleção manual
* Envio via `POST /api/polls/import` (`multipart/form-data`)
* ✅ Validação de arquivo `.csv`
* 💬 Mensagens amigáveis para sucesso/erro

---

### 📊 3) Dashboard Analítico

#### 📌 Resumo da pesquisa

* `pollId`
* `pollDate`
* `weightedPopulation`

#### 🏆 Ranking geral nacional

* 📋 Tabela de candidatos
* 📈 Gráficos com opções:

  * Barras
  * Linha pontilhada
  * Pizza
* ➕ Soma total dos percentuais

#### 🗺️ Intenção de voto por estado

* Consolidação por UF
* 📊 Perspectiva por porte municipal (Grupos 1 a 4)
* 📉 Indicadores de amostra e cobertura

#### 🔍 Detalhamento por grupo (`GROUP_1..GROUP_4`)

* `stateAcronym`
* `groupPopulation`
* `sampledPopulation`
* 📐 Cobertura (`sampledPopulation / groupPopulation`)
* 📊 Gráfico por candidato

#### ⚠️ Qualidade da amostra

* Alerta quando cobertura < 5%
* Classificação:

  * 🔴 Baixa
  * 🟡 Média
  * 🟢 Alta

---

## 🛠️ Tecnologias Utilizadas

* ⚛️ React 19
* 🟦 TypeScript
* ⚡ Vite
* 🎨 Tailwind CSS
* 🧩 shadcn/ui
* 📊 Recharts
* 🌐 Axios
* ♿ Radix UI
* 🎯 Lucide React

---

## 🔌 Contrato de Integração (Backend)

📍 Base local:

```
http://localhost:8080
```

### Endpoints

1. `POST /api/ibge/sync?force=true|false`
2. `POST /api/polls/import`

💡 Observação:
Não há endpoint de histórico — o dashboard usa apenas o retorno da importação atual.

---

## 📋 Pré-requisitos

* Node.js 20+
* npm 10+
* Backend rodando em `http://localhost:8080`

---

## 🔐 Configuração de Ambiente

1. Crie o arquivo `.env`
2. Configure:

```env
VITE_API_BASE_URL=http://localhost:8080
```

🔁 Fallback padrão:
Caso não definido → `http://localhost:8080`

---

## ▶️ Instalação e Execução

```bash
npm install
npm run dev
```

🌐 Aplicação disponível em:

```
http://localhost:5173
```

---

## 📜 Scripts Disponíveis

* ▶️ `npm run dev` → servidor de desenvolvimento
* 🏗️ `npm run build` → build de produção
* 🧹 `npm run lint` → lint do projeto
* 👀 `npm run preview` → preview do build

---

## 🧪 Build e Validação

```bash
npm run lint
npm run build
```

---

## 🧱 Estrutura do Projeto

* 📡 `src/api/client.ts` → cliente Axios
* 🧾 `src/api/contracts.ts` → tipagens da API
* 🔗 `src/api/services.ts` → chamadas HTTP
* 🔄 `src/features/sync/*` → sincronização IBGE
* 📥 `src/features/import/*` → upload CSV
* 📊 `src/features/dashboard/*` → visualizações
* 🧩 `src/components/*` → componentes reutilizáveis
* 🛠️ `src/lib/*` → utilitários

---

## 🔄 Fluxo de Uso Recomendado

1. 🔄 Atualizar base IBGE
2. 📥 Importar CSV
3. 📊 Analisar:

   * Ranking nacional
   * Intenção por estado
   * Qualidade da amostra

---

## ⚠️ Tratamento de Erros

* ❌ Erros `400/500` exibidos de forma amigável
* 📩 Prioriza `error.message` do backend
* 🛡️ UI resiliente para `groupBreakdown` vazio

---
