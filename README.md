<p align="center">
  <img src="public/AlertaConectaLogo.svg" alt="Alerta Conecta" width="220" />
</p>

<h1 align="center">Alerta Conecta — Painel Web</h1>

<p align="center">
  Plataforma web de gestão de ocorrências para o Corpo de Bombeiros, com dashboard operacional,
  registro de chamados, geolocalização e trilha de auditoria.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-privado-lightgrey" />
</p>

---

## Sobre o projeto

O **Alerta Conecta** é o painel administrativo web utilizado por equipes de bombeiros e gestores
para acompanhar, registrar e auditar ocorrências em tempo real (incêndios, resgates, atendimentos
pré-hospitalares, ações de prevenção, entre outros). Este repositório contém a aplicação **web**
(construída em React + Vite), que consome a mesma API REST utilizada pelo [aplicativo mobile
Alerta Conecta](https://github.com/vinifvision/alerta-conecta-mobile).

O projeto foi construído sobre o boilerplate **Vite + React + shadcn/ui**, com foco em um painel
rápido, responsivo e com controle de acesso por perfil de usuário.

## Funcionalidades

- 🏠 **Feed de ocorrências** — lista em tempo real das ocorrências registradas, com status,
  prioridade e tipo, e busca por atualizações via API.
- 📋 **Registro de ocorrência** — formulário para abertura de novos chamados, com upload de
  evidência fotográfica, definição de prioridade (Baixa / Média / Alta) e tipo de atendimento.
- 🔍 **Detalhes da ocorrência** — visão completa de uma ocorrência, incluindo vítimas envolvidas,
  descrição, evidência fotográfica e localização em mapa incorporado (Google Maps).
- 📊 **Dashboard operacional** — indicadores (KPIs) de total de ocorrências, atendimentos,
  eficiência e efetivo em serviço, com gráfico de série histórica (Recharts) e filtros por tipo,
  turno, região, grupamento e período.
- 🧾 **Auditoria (Audit Logs)** — histórico de ações realizadas no sistema (login, criação, edição,
  exclusão), com filtros, busca textual, paginação e exportação para **CSV**.
- 👤 **Perfil de usuário** e controle de sessão.
- 🔐 **Rotas protegidas por perfil (RBAC)** — acesso segmentado entre os papéis `Gerente`,
  `Analista de Sistemas` e `Técnico de Suporte`, sendo Auditoria e Perfil exclusivos de `Gerente`.

> ℹ️ **Ambiente de demonstração:** o contexto de autenticação (`AuthContext`) está atualmente
> configurado em **modo de gravação/demo**, autenticando um usuário fixo (`Gerente`) automaticamente
> para facilitar apresentações. Veja [Autenticação](#autenticação-e-perfis) para reativar o fluxo real.

## Stack tecnológica

| Camada | Tecnologias |
| --- | --- |
| Build / Dev server | [Vite 7](https://vitejs.dev/) + `@vitejs/plugin-react-swc` |
| Linguagem | TypeScript 5.9 |
| UI | React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix UI), Tailwind CSS 3 |
| Formulários | React Hook Form + Zod |
| Dados assíncronos | TanStack React Query |
| Gráficos | Recharts |
| Mapas | Leaflet / React Leaflet, embed do Google Maps |
| Roteamento | React Router DOM 7 |
| Notificações | Sonner (toasts) |
| Qualidade | ESLint 9 + typescript-eslint |
| Gerenciador de pacotes | npm ou Bun (`bun.lockb` incluso) |

## Estrutura do projeto

```
alerta-conecta/
├── public/                  # Ativos estáticos (logos, favicon, ícones PWA)
├── src/
│   ├── components/
│   │   ├── dashboard/        # Sidebar, KPICards, gráficos e filtros do dashboard
│   │   └── ui/                # Componentes shadcn/ui (botões, dialogs, tabelas, etc.)
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexto de autenticação e sessão do usuário
│   ├── hooks/                 # Hooks utilitários (use-mobile, use-toast)
│   ├── lib/                   # Funções utilitárias (cn, formatação, etc.)
│   ├── pages/
│   │   ├── Home.tsx            # Feed de ocorrências
│   │   ├── Dashboard.tsx       # Indicadores e gráficos operacionais
│   │   ├── RegisterOccurrence.tsx  # Formulário de nova ocorrência
│   │   ├── OccurrenceDetails.tsx   # Detalhe de uma ocorrência (mapa + evidência)
│   │   ├── AuditLogs.tsx       # Logs de auditoria com filtros e exportação CSV
│   │   ├── UserProfile.tsx     # Perfil do usuário logado
│   │   ├── Login.tsx           # Tela de autenticação
│   │   └── NotFound.tsx        # Página 404
│   ├── App.tsx                 # Definição de rotas e providers globais
│   └── main.tsx                 # Ponto de entrada da aplicação
├── components.json            # Configuração do shadcn/ui
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (ou [Bun](https://bun.sh/), já que o projeto inclui `bun.lockb`)

## Como executar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/vinifvision/alerta-conecta.git
cd alerta-conecta

# 2. Instale as dependências
npm install
# ou, usando Bun:
bun install

# 3. Suba o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173` (porta padrão do Vite).

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run build:dev` | Gera um build usando o modo `development` |
| `npm run preview` | Serve o build de produção localmente para testes |
| `npm run lint` | Executa o ESLint em todo o projeto |

## Integração com a API

A aplicação consome uma API REST própria do Alerta Conecta (compartilhada com o app mobile), com
endpoints como:

- `GET /database/occurrence/occurrence/getall` — lista de ocorrências
- `GET /database/occurrence/:id` — detalhe de uma ocorrência
- `POST /database/occurrence/registry` — registro de nova ocorrência (multipart, com imagem)
- `POST /database/user/login` — autenticação

Atualmente a URL base da API está fixa no código-fonte (endpoint de túnel `ngrok`), diretamente em
cada página que faz requisições (`Home.tsx`, `RegisterOccurrence.tsx`, `OccurrenceDetails.tsx`).
Para um ambiente de produção, recomenda-se:

1. Extrair essas constantes para variáveis de ambiente (`import.meta.env.VITE_API_URL`);
2. Criar um cliente HTTP único em `src/lib` para centralizar chamadas e tratamento de erros.

Enquanto a API não responde (ou retorna lista vazia), as telas de **Home** e **Dashboard** fazem
*fallback* automático para dados fictícios (`MOCK_DATA`), garantindo que a interface nunca fique
quebrada durante demonstrações.

## Autenticação e perfis

O sistema define três perfis de usuário:

| Perfil | Acesso |
| --- | --- |
| `Gerente` | Acesso completo: Home, Dashboard, Registro, **Auditoria** e **Perfil** |
| `Analista de Sistemas` | Home, Dashboard, Registro e Detalhes de ocorrência |
| `Técnico de Suporte` | Home, Dashboard, Registro e Detalhes de ocorrência |

O controle é feito pelo componente [`ProtectedRoute`](src/components/ProtectedRoute.tsx), que
verifica `isAuthenticated` e o `role` do usuário armazenado no `AuthContext` antes de liberar cada
grupo de rotas.

> **Nota:** por padrão, o `AuthContext.tsx` está com o login real **desativado** (bypass automático
> com um usuário `Gerente` fake), usado para gravações e demonstrações. Para reativar a autenticação
> via API, remova o bloco `MOCK_USER` do `useEffect` e restaure a chamada a `LOGIN_API_URL` dentro da
> função `login`.

## Roadmap / pontos de atenção

- [ ] Mover a URL da API e demais segredos para variáveis de ambiente (`.env`)
- [ ] Reativar o fluxo de login real e remover o bypass de demonstração
- [ ] Centralizar chamadas HTTP em um client único com tratamento de erro consistente
- [ ] Conectar o Dashboard a dados reais da API (hoje os KPIs e o gráfico são mockados)
- [ ] Cobertura de testes automatizados

## Contribuindo

1. Crie uma branch a partir da `main`: `git checkout -b feature/minha-feature`
2. Faça commit das mudanças: `git commit -m 'feat: minha feature'`
3. Rode o lint antes de subir: `npm run lint`
4. Abra um Pull Request descrevendo a alteração

## Projetos relacionados

- 📱 [`alerta-conecta-mobile`](https://github.com/vinifvision/alerta-conecta-mobile) — aplicativo
  mobile (Expo/React Native) para registro de ocorrências em campo, com câmera e GPS.

## Licença

Projeto privado/acadêmico. Direitos reservados aos autores do Alerta Conecta.
