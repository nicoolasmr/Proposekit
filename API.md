# API Documentation - ProposeKit

Documentação técnica das APIs e estruturas de dados do ProposeKit.

---

## 🤖 Chat API

### `POST /api/chat`

Endpoint de streaming de chat com IA para geração de propostas.

#### Request Body
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}
```

#### Response
Stream de eventos SSE (Server-Sent Events) com:
- Mensagens da IA
- Tool calls para estruturação de dados
- Conteúdo gerado

#### Exemplo de Uso
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
});

const reader = response.body.getReader();
// Processar stream...
```

#### Tool Calls Disponíveis
- `generate_proposal_content`: Gera conteúdo estruturado da proposta
- `suggest_upsells`: Sugere serviços adicionais
- `validate_scope`: Valida escopo do projeto

---

## 📄 Proposals API

### `POST /api/proposals/create`

Cria uma nova proposta e consome 1 crédito do usuário.

#### Request Body
```typescript
{
  title: string;
  client_name: string;
  client_email?: string;
  ai_content: {
    introduction: string;
    scope: string[];
    deliverables: string[];
    timeline: string;
    pricing: {
      items: Array<{ description: string; value: number }>;
      total: number;
    };
    terms: string[];
  };
  upsell_options?: Array<{
    title: string;
    description: string;
    value: number;
  }>;
  closing_enabled?: boolean;
  deposit_required?: boolean;
  deposit_type?: 'percent' | 'fixed';
  deposit_value?: number;
  pix_key?: string;
  pix_receiver_name?: string;
  pix_receiver_document?: string;
}
```

#### Response
```typescript
{
  id: string;
  share_id: string;
  public_url: string;
  created_at: string;
}
```

#### Erros
- `401`: Não autenticado
- `402`: Créditos insuficientes
- `400`: Dados inválidos

---

### `GET /api/proposals/[id]/pdf`

Gera e retorna PDF da proposta.

#### Query Parameters
- `id`: UUID da proposta

#### Response
- Content-Type: `application/pdf`
- Arquivo PDF para download

#### Erros
- `401`: Não autenticado
- `403`: Proposta não pertence ao usuário
- `404`: Proposta não encontrada

---

## 💳 Billing API

### `POST /api/billing/create-checkout`

Cria sessão de checkout no Stripe para compra de créditos.

#### Request Body
```typescript
{
  credits: number; // Quantidade de créditos a comprar
}
```

#### Response
```typescript
{
  checkout_url: string; // URL para redirecionar usuário
  session_id: string;
}
```

#### Webhooks
- `checkout.session.completed`: Adiciona créditos ao usuário

---

## 📊 Estruturas de Dados

### Proposal
```typescript
interface Proposal {
  id: string;
  user_id: string;
  title: string;
  client_name: string;
  client_email?: string;
  share_id: string;
  
  // AI Content
  ai_content: {
    introduction: string;
    scope: string[];
    deliverables: string[];
    timeline: string;
    pricing: {
      items: Array<{ description: string; value: number }>;
      total: number;
    };
    terms: string[];
  };
  
  // Upsells
  upsell_options?: Array<{
    title: string;
    description: string;
    value: number;
  }>;
  
  // Closing Kit
  closing_enabled: boolean;
  deposit_required: boolean;
  deposit_type?: 'percent' | 'fixed';
  deposit_value?: number;
  pix_key?: string;
  pix_receiver_name?: string;
  pix_receiver_document?: string;
  
  // Status
  status_v2: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid';
  approved_at?: string;
  paid_at?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}
```

### Proposal Acceptance
```typescript
interface ProposalAcceptance {
  id: string;
  proposal_id: string;
  accepted_by_name: string;
  accepted_by_email: string;
  accepted_by_role?: string;
  accepted_at: string;
  acceptance_ip?: string;
  acceptance_user_agent?: string;
}
```

### Deposit
```typescript
interface Deposit {
  id: string;
  proposal_id: string;
  type: 'percent' | 'fixed';
  amount: number;
  status: 'pending' | 'paid' | 'canceled';
  method: 'pix_manual' | 'pix_provider';
  pix_payload?: string;
  pix_qr_url?: string;
  created_at: string;
  paid_at?: string;
}
```

### Change Request
```typescript
interface ChangeRequest {
  id: string;
  user_id: string;
  proposal_id: string;
  title: string;
  reason?: string;
  
  added_scope?: {
    description: string;
    items: string[];
  };
  
  added_pricing?: {
    items: Array<{ description: string; value: number }>;
    total: number;
  };
  
  added_terms?: string[];
  added_total: number;
  
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  share_id: string;
  created_at: string;
}
```

---

## 🔐 Autenticação

Todas as rotas de API autenticadas requerem:

### Headers
```
Authorization: Bearer <supabase_access_token>
```

### Obtenção do Token
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## 🛡️ Rate Limiting

### Limites por Endpoint
- `/api/chat`: 20 requisições/minuto
- `/api/proposals/create`: 10 requisições/minuto
- `/api/proposals/[id]/pdf`: 30 requisições/minuto
- `/api/billing/*`: 5 requisições/minuto

### Headers de Rate Limit
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1675890000
```

---

## 🐛 Error Handling

### Formato de Erro Padrão
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

### Códigos de Erro Comuns
- `AUTH_REQUIRED`: Autenticação necessária
- `INSUFFICIENT_CREDITS`: Créditos insuficientes
- `INVALID_INPUT`: Dados de entrada inválidos
- `NOT_FOUND`: Recurso não encontrado
- `PERMISSION_DENIED`: Sem permissão para acessar recurso
- `RATE_LIMIT_EXCEEDED`: Limite de requisições excedido

---

## 📝 Exemplos de Integração

### Criar Proposta Completa
```typescript
// 1. Chat com IA
const chatResponse = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Quero criar uma proposta para um site institucional' }
    ]
  })
});

// 2. Processar stream e extrair ai_content
const aiContent = await processStream(chatResponse);

// 3. Criar proposta
const proposal = await fetch('/api/proposals/create', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Proposta - Site Institucional',
    client_name: 'Empresa XYZ',
    ai_content: aiContent,
    closing_enabled: true,
    deposit_required: true,
    deposit_type: 'percent',
    deposit_value: 30,
    pix_key: 'empresa@email.com'
  })
});

// 4. Compartilhar link público
const { public_url } = await proposal.json();
console.log('Compartilhe:', public_url);
```

### Aceite Digital (Cliente)
```typescript
// No preview público (/p/[shareId])
const acceptance = await fetch('/api/proposals/accept', {
  method: 'POST',
  body: JSON.stringify({
    proposal_id: proposalId,
    accepted_by_name: 'João Silva',
    accepted_by_email: 'joao@empresa.com',
    accepted_by_role: 'Diretor'
  })
});
```
