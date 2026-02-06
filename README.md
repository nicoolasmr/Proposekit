# PROPOSEKIT

**"Feche vendas mais rápido com Closing Kit integrado."**

ProposeKit é uma **plataforma completa de fechamento de vendas** que vai além de gerar propostas — permite aceite digital e pagamento de entrada, tudo em um único link compartilhável.

Projetado para freelancers e agências que não querem apenas enviar PDFs, mas **fechar contratos e receber pagamentos instantaneamente**.

---

## 💎 A Proposta de Valor

Diferente de ferramentas tradicionais de formulários ou editores de texto genéricos, o ProposeKit combina **IA conversacional**, **design editorial premium** e **Closing Kit integrado** para transformar a forma como você fecha negócios.

### Diferenciais Principais

- 🤝 **Closing Kit Completo**: Aceite digital + Pagamento de Entrada (Pix) integrados no link da proposta
- 🤖 **AI Content Generation**: Geração automática de conteúdo profissional via chat interativo
- 💰 **Upsells Inteligentes**: Sugestões de valor adicional durante a criação da proposta
- 📝 **Change Requests (Anti-Escopo)**: Sistema para aditivos de contrato com aprovação rápida
- 📊 **Dashboard de Closing**: Acompanhamento em tempo real de aceites e pagamentos
- 🎨 **Design Editorial Premium**: Tipografia serifada de alto contraste (Playfair Display) e estética "sharp edge"
- 🔒 **Sistema de Créditos & Paywall**: Modelo de acesso baseado em valor (1 crédito gratuito inicial)
- 📄 **Geração de PDF Offline**: Documentos impecáveis prontos para impressão ou envio

---

## 🚀 Tecnologias

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Postgres, RLS)
- **AI Engine**: [Vercel AI SDK](https://sdk.vercel.ai/) + [OpenAI GPT-4](https://openai.com/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **PDF Engine**: [@react-pdf/renderer](https://react-pdf.org/)
- **Pagamentos**: [Stripe](https://stripe.com/)

---

## 🛠️ Funcionalidades Principais

### Para o Vendedor

1. **Chat Interativo com IA**: Crie propostas profissionais conversando naturalmente — a IA extrai informações e estrutura o conteúdo
2. **Geração Automática de Conteúdo**: AI Content Generation transforma suas respostas em texto editorial de alto impacto
3. **Upsells Inteligentes**: Durante a criação, receba sugestões de serviços adicionais para maximizar o valor da proposta
4. **Dashboard de Controle**: Console central para gerenciar propostas, acompanhar visualizações e baixar documentos
5. **Dashboard de Closing**: Gerencie aceites digitais, pagamentos Pix e aditivos de escopo em um só lugar
6. **Change Requests**: Crie aditivos de contrato para mudanças de escopo com aprovação digital do cliente
7. **Sistema de Créditos**: Modelo de acesso baseado em créditos (1 gratuito, depois pague conforme usa)

### Para o Cliente

1. **Public Preview Elegante**: Link público com design premium para visualização da proposta
2. **Aceite Digital**: Assine a proposta digitalmente com nome, email e cargo
3. **Pagamento de Entrada**: Pague a entrada via Pix diretamente no link (QR Code + Pix Copia e Cola)
4. **Aprovação de Change Requests**: Visualize e aprove aditivos de contrato de forma simples

---

## 📊 Arquitetura de Dados

### Principais Tabelas

- **`proposals`**: Propostas com campos de AI content, upsells, closing config e status
- **`proposal_acceptances`**: Registro de aceites digitais com dados do signatário
- **`deposits`**: Pagamentos de entrada (Pix manual ou via provider)
- **`change_requests`**: Aditivos de contrato com escopo, pricing e termos adicionais
- **`followup_templates`**: Templates de follow-up automatizado por evento
- **`feature_flags`**: Controle de features por usuário

Todas as tabelas utilizam **Row Level Security (RLS)** para garantir isolamento total de dados entre usuários.

---

## 🔄 Fluxo de Uso

### Criação da Proposta (Vendedor)

1. **Chat Interativo**: Responda perguntas sobre o projeto em uma conversa fluida
2. **Geração AI**: A IA transforma suas respostas em conteúdo profissional estruturado
3. **Upsells**: Receba sugestões de serviços adicionais para incluir
4. **Preview**: Visualize a proposta com design editorial premium
5. **Paywall**: Use 1 crédito para desbloquear PDF + Link Público
6. **Compartilhamento**: Envie o link público para o cliente

### Fechamento (Cliente)

1. **Visualização**: Cliente acessa link público e lê a proposta
2. **Aceite Digital**: Preenche dados e assina digitalmente
3. **Pagamento de Entrada**: Paga a entrada via Pix (se configurado)
4. **Confirmação**: Vendedor recebe notificação de aceite/pagamento

### Gestão (Vendedor)

1. **Dashboard de Closing**: Acompanhe status de aceites e pagamentos
2. **Change Requests**: Crie aditivos para mudanças de escopo
3. **Follow-up**: Configure templates de follow-up automatizado

---

## 📦 Instalação e Execução

Para rodar o projeto localmente:

1. **Clone o repositório**:
   ```bash
   git clone [repo-url]
   cd Proposekit
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env.local` na raiz com suas credenciais:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=seu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key
   
   # OpenAI
   OPENAI_API_KEY=sua_api_key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_publishable_key
   STRIPE_SECRET_KEY=sua_secret_key
   ```

4. **Execute as migrações do Supabase**:
   ```bash
   # Se usando Supabase CLI
   supabase db push
   ```

5. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

6. **Acesse**: [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentação Adicional

- **[ROUTES.md](./ROUTES.md)**: Documentação completa de todas as rotas da aplicação
- **[API.md](./API.md)**: Documentação técnica das APIs e estruturas de dados
- **[CHANGELOG.md](./CHANGELOG.md)**: Histórico de versões e mudanças

---

## 📜 Licença

Propriedade intelectual de ProposeKit. Edição Beta Premium © 2026.

