# Rotas do ProposeKit

Documentação completa de todas as rotas da aplicação ProposeKit.

---

## 🌐 Rotas Públicas

### Landing Page
- **`/`** - Landing page com chat inicial
  - Permite criar proposta sem login
  - Chat interativo com IA
  - Redirecionamento para checkout após conclusão

### Preview Público
- **`/p/[shareId]`** - Preview público da proposta
  - Visualização da proposta compartilhável
  - Aceite digital (se `closing_enabled`)
  - Pagamento de entrada via Pix (se `deposit_required`)
  - Não requer autenticação

### Change Request Público
- **`/cr/[shareId]`** - Preview público de Change Request
  - Visualização do aditivo de contrato
  - Aprovação digital pelo cliente
  - Não requer autenticação

---

## 🔒 Rotas Autenticadas

Todas as rotas abaixo requerem autenticação via Supabase Auth.

### Dashboard Principal
- **`/dashboard`** - Console principal
  - Overview de propostas
  - Estatísticas de aceites e pagamentos
  - Acesso rápido a funcionalidades principais

### Propostas
- **`/dashboard/proposals`** - Lista de propostas
  - Todas as propostas do usuário
  - Filtros por status
  - Ações rápidas (editar, compartilhar, baixar PDF)

- **`/dashboard/new`** - Nova proposta
  - Chat completo com IA
  - Geração de conteúdo profissional
  - Upsells inteligentes
  - Preview antes do paywall

### Checkout
- **`/checkout`** - Fluxo de pagamento
  - Compra de créditos
  - Integração com Stripe
  - Validação de cartão

---

## 🔌 API Routes

### Chat AI
- **`POST /api/chat`**
  - Streaming de chat com Vercel AI SDK
  - Geração de conteúdo via OpenAI GPT-4
  - Tool calls para estruturação de dados
  - Retorna stream de mensagens

### Propostas

#### Criação
- **`POST /api/proposals/create`**
  - Cria nova proposta
  - Consome 1 crédito do usuário
  - Gera `share_id` único
  - Retorna proposta criada com link público

#### PDF
- **`GET /api/proposals/[id]/pdf`**
  - Gera PDF da proposta
  - Usa `@react-pdf/renderer`
  - Retorna arquivo PDF para download

#### Listagem
- **`GET /api/proposals`**
  - Lista propostas do usuário autenticado
  - Filtros opcionais por status
  - Paginação

### Billing
- **`POST /api/billing/create-checkout`**
  - Cria sessão de checkout no Stripe
  - Retorna URL de checkout
  - Webhook de confirmação de pagamento

---

## 🗂️ Estrutura de Pastas

```
src/app/
├── (auth)/              # Rotas de autenticação
│   └── login/
├── (dashboard)/         # Rotas autenticadas
│   ├── dashboard/
│   ├── new/
│   └── proposals/
├── api/                 # API Routes
│   ├── chat/
│   ├── proposals/
│   └── billing/
├── checkout/            # Checkout de créditos
├── cr/                  # Change Requests públicos
├── p/                   # Preview público de propostas
├── page.tsx             # Landing page
└── layout.tsx           # Layout raiz
```

---

## 🔐 Proteção de Rotas

### Middleware de Autenticação
Rotas em `(dashboard)` são protegidas por middleware que:
- Verifica sessão do Supabase
- Redireciona para `/login` se não autenticado
- Valida RLS policies no banco

### RLS Policies
Todas as queries ao banco respeitam Row Level Security:
- `proposals`: usuário só acessa suas próprias propostas
- `proposal_acceptances`: usuário só vê aceites de suas propostas
- `deposits`: usuário só vê pagamentos de suas propostas
- `change_requests`: usuário só vê seus próprios CRs

### Rotas Públicas com Validação
- `/p/[shareId]`: valida existência do `share_id`
- `/cr/[shareId]`: valida existência do `share_id`

---

## 📊 Fluxo de Navegação

### Novo Usuário
1. `/` (landing) → Chat inicial
2. `/checkout` → Compra de créditos
3. `/dashboard/new` → Criação completa da proposta
4. `/dashboard/proposals` → Gerenciamento

### Usuário Retornando
1. `/dashboard` → Overview
2. `/dashboard/new` → Nova proposta
3. `/dashboard/proposals` → Propostas existentes

### Cliente (Não Autenticado)
1. Recebe link `/p/[shareId]`
2. Visualiza proposta
3. Aceita digitalmente (se habilitado)
4. Paga entrada via Pix (se habilitado)
