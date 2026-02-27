# 📊 Code Quality Evaluator – Frontend

Frontend da plataforma **Code Quality Evaluator**, responsável pela interface estratégica de análise e visualização de métricas de qualidade de projetos de software.

Aplicação construída com foco em:

- Experiência moderna (UI/UX)
- Governança técnica orientada a dados
- Visualização estratégica
- Arquitetura organizada e escalável

---

## 🚀 Tecnologias Utilizadas

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Context API para autenticação
- Consumo de API REST (Spring Boot backend)

---

## 🎯 Objetivo da Aplicação

Permitir que usuários:

- Criem avaliações técnicas de projetos
- Recebam score automático baseado em regras de negócio
- Visualizem histórico completo
- Apliquem filtros avançados
- Exportem dados em CSV
- Acompanhem indicadores estratégicos em dashboard interativo

---

## 🏗️ Estrutura do Projeto

```css
app/
├── auth/
│ ├── login/
│ └── register/
├── evaluations/
│ ├── new/
│ ├── historic/
│ ├── dashboard/
│ └── export/
├── components/
│ ├── Header
│ ├── Footer
│ ├── EvaluationForm
│ └── FilterComponent
└── context/
└── AuthContext
```

---

## 🔐 Autenticação

- Sistema baseado em JWT
- Token armazenado via Context API
- Rotas protegidas com redirecionamento automático
- Controle de sessão persistente

---

## 📈 Funcionalidades Principais

### 📝 Nova Avaliação

Formulário estruturado para inserção de:

- Linguagem
- Complexidade
- Linhas de código
- Uso de testes
- Uso de Git

Score calculado automaticamente pelo backend.

---

### 📊 Histórico de Avaliações

- Cards estilizados por classificação
- Filtros por data, score e classificação
- Ordenação e paginação
- Atualização e exclusão de registros

---

### 📈 Dashboard Estratégico

- Média geral de score
- Indicadores consolidados
- Visualização orientada à tomada de decisão

---

### 📁 Exportação CSV

- Geração de relatórios profissionais
- Filtros aplicáveis antes da exportação

---

## 🎨 UI / Design System

- Tema Dark Tech (Slate + Purple + Blue)
- Gradientes estratégicos
- Animações suaves
- Componentização de botões e cards
- Feedback visual por classificação (cores dinâmicas)

Classificações visuais:

- 🟢 EXCELENTE
- 🔵 BOM
- 🟡 REGULAR
- 🔴 RUIM

---

## ⚙️ Como Executar o Projeto

```bash
# Instalar dependências
npm install
```

```bash
# Rodar em desenvolvimento
npm run dev
```

```arduino
# Aplicação disponível em:
http://localhost:3000
```

---

## 🔌 Integração com Backend

**O frontend consome a API REST desenvolvida em Spring Boot.**

Endpoints utilizados:

- /api/auth/login
- /api/auth/register
- /api/evaluations
- /api/evaluations/filter
- /api/evaluations/export/csv
- /api/evaluations/dashboard

---

## 🧠 Conceitos Aplicados

- Componentização
- Separação de responsabilidades
- Proteção de rotas
- Controle de estado global
- Design orientado à experiência
- Governança técnica baseada em métricas

---

## 👨‍💻 Autor

**Desenvolvedor:** Marcelo Scoleso

**GitHub:** https://github.com/marceloscoleso
