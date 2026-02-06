# Changelog

Histórico de versões e mudanças do ProposeKit.

---

## [0.2.0] - 2026-02-06 - **Closing Kit Release** 🚀

### ✨ Added

#### Closing Kit Completo
- 🤝 **Aceite Digital**: Sistema completo de assinatura digital de propostas
  - Captura de nome, email e cargo do signatário
  - Registro de IP e user agent para auditoria
  - Tabela `proposal_acceptances` com RLS policies

- 💰 **Pagamento de Entrada (Pix)**: Integração de pagamento direto no link da proposta
  - Suporte para Pix manual (QR Code + Copia e Cola)
  - Configuração de entrada por percentual ou valor fixo
  - Tabela `deposits` para rastreamento de pagamentos
  - Campos de configuração Pix em `proposals`

- 📝 **Change Requests (Anti-Escopo)**: Sistema de aditivos de contrato
  - Criação de aditivos com escopo, pricing e termos adicionais
  - Link público para aprovação pelo cliente
  - Tabela `change_requests` com compartilhamento via `share_id`

- 📊 **Dashboard de Closing**: Painel de acompanhamento de fechamentos
  - Visualização de aceites digitais
  - Status de pagamentos de entrada
  - Gerenciamento de change requests

#### AI Content Generation
- 🤖 **Integração com Vercel AI SDK**: Streaming de chat com IA
  - Geração automática de conteúdo profissional
  - Tool calls para estruturação de dados
  - Campo `ai_content` (JSONB) em `proposals`

- 💬 **Chat Interativo Aprimorado**: Experiência conversacional fluida
  - Streaming de respostas em tempo real
  - Contexto mantido durante toda a conversa
  - API route `/api/chat` com OpenAI GPT-4

#### Upsells Inteligentes
- 💰 **Sistema de Upsells**: Sugestões de valor adicional
  - Campo `upsell_options` (JSONB) em `proposals`
  - Sugestões contextuais durante criação
  - Maximização de valor por proposta

#### Infraestrutura
- 🔐 **Feature Flags**: Sistema de controle de features por usuário
  - Tabela `feature_flags` para rollout gradual
  - Habilitação/desabilitação de funcionalidades

- 📧 **Follow-up Templates**: Automação de comunicação
  - Tabela `followup_templates` para mensagens por evento
  - Personalização por usuário

### 🔄 Changed

- **Posicionamento do Produto**: De "gerador de propostas" para "plataforma completa de fechamento de vendas"
- **Estrutura de Dados**: Expansão massiva do schema de `proposals`
  - Novos campos: `ai_content`, `upsell_options`, `closing_enabled`, `deposit_*`, `pix_*`, `status_v2`
- **Chat Flow**: Migração de chat simples para streaming AI com tool calls
- **README.md**: Documentação completamente reescrita refletindo novo posicionamento

### 🛡️ Security

- **RLS Policies**: Políticas de segurança para todas as novas tabelas
  - `proposal_acceptances`: Usuário só vê aceites de suas propostas
  - `deposits`: Usuário só vê pagamentos de suas propostas
  - `change_requests`: Usuário só vê seus próprios CRs
  - `feature_flags`: Usuário só vê suas próprias flags
  - `followup_templates`: Usuário só gerencia seus templates

- **Indexes de Performance**: Otimização de queries
  - Foreign keys indexadas
  - Campos de busca otimizados

### 📚 Documentation

- ✅ **ROUTES.md**: Documentação completa de rotas
- ✅ **API.md**: Documentação técnica de APIs e estruturas de dados
- ✅ **CHANGELOG.md**: Este arquivo
- ✅ **README.md**: Atualizado com novo posicionamento e funcionalidades

---

## [0.1.0] - 2026-01-XX - **MVP Release**

### ✨ Added

#### Core Features
- 💬 **Chat-First Proposal Creation**: Interface de chat para criação de propostas
- 📄 **PDF Generation**: Geração de PDFs profissionais com `@react-pdf/renderer`
- 🔗 **Public Preview Links**: Links públicos compartilháveis (`/p/[shareId]`)
- 💳 **Stripe Integration**: Sistema de pagamento para créditos
- 🎟️ **Credit System**: Modelo de acesso baseado em créditos (1 gratuito inicial)

#### Design System
- 🎨 **Editorial Premium Design**: Tipografia Playfair Display
- 🖼️ **Sharp Edge Aesthetic**: Design minimalista e confiante
- 🌓 **Dark Mode**: Suporte a tema escuro

#### Infrastructure
- 🔐 **Supabase Auth**: Autenticação completa
- 🗄️ **PostgreSQL + RLS**: Banco de dados com Row Level Security
- ⚡ **Next.js 15**: App Router com Server Components
- 🎨 **Tailwind CSS 4**: Estilização moderna

### 🛡️ Security

- **RLS Policies**: Isolamento total de dados entre usuários
- **Multi-tenant Architecture**: Segurança por design

### 📚 Documentation

- ✅ **README.md**: Documentação inicial do projeto

---

## Roadmap

### [0.3.0] - Em Planejamento

- 📊 **Analytics Avançado**: Métricas de conversão e engagement
- 🔔 **Notificações**: Sistema de notificações em tempo real
- 📱 **Mobile App**: Aplicativo nativo para iOS e Android
- 🌐 **Internacionalização**: Suporte multi-idioma
- 🤝 **Integrações**: Zapier, Make, webhooks customizados
- 💼 **Team Plans**: Planos para equipes e agências

---

## Convenções de Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):
- **MAJOR**: Mudanças incompatíveis de API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis
