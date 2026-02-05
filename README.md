# PROPOSEKIT

**"Propostas claras fecham negócios mais rápido."**

**"Propostas claras fecham negócios mais rápido."**

ProposeKit é um gerador de propostas comerciais premium com **Closing Kit integrado**, projetado para freelancers e agências que não querem apenas enviar PDFs, mas fechar contratos e receber pagamentos instantaneamente.

## 💎 A Proposta de Valor

Diferente de ferramentas tradicionais de formulários ou editores de texto genéricos, o ProposeKit utiliza uma interface de chat interativa para extrair o que é essencial e transformar em um layout editorial de alto impacto.

- **Interface Silenciosa e Confiante**: Design minimalista com foco total no conteúdo.
- **Fluxo Chat-First**: Crie sua proposta em minutos através de uma conversa fluida.
- **Design Editorial Premium**: Tipografia serifada de alto contraste (Playfair Display) e estética "sharp edge".
- **Sistema de Créditos & Paywall**: Modelo de acesso baseado em valor (1 crédito gratuito inicial).
- **Fluxo Chat-First**: Crie sua proposta em minutos através de uma conversa fluida.
- **Closing Kit (Novidade)**: Aceite digital e Pagamento de Entrada (Pix) integrados no link da proposta.
- **Design Editorial Premium**: Tipografia serifada de alto contraste (Playfair Display) e estética "sharp edge".
- **Controle de Escopo**: Gere aditivos de contrato (Change Requests) para aprovação rápida.
- **Geração de PDF Offline**: Documentos impecáveis prontos para impressão ou envio.

## 🚀 Tecnologias

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Postgres, RLS)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **PDF Engine**: [@react-pdf/renderer](https://react-pdf.org/)

## 🛠️ Funcionalidades Principais

1.  **Home Page Inteligente**: Um chat central que guia o usuário pela criação da proposta antes mesmo do login.
2.  **Checkout de Segurança**: Fluxo de captura de leads e validação de cartão para desbloqueio de créditos.
3.  **Dashboard de Controle**: Console central para gerenciar propostas, acompanhar visualizações e baixar documentos.
3.  **Dashboard de Controle**: Console central para gerenciar propostas, acompanhar visualizações e baixar documentos.
4.  **Closing Dashboard**: Gerencie aceites, pagamentos Pix e aditivos de escopo em um só lugar.
5.  **Public Preview**: Link público elegante para compartilhamento direto com o cliente final.
5.  **Multi-tenant & RLS**: Segurança total de dados garantida por Row Level Security no Supabase.

## 📦 Instalação e Execução

Para rodar o projeto localmente:

1.  **Clone o repositório**:
    ```bash
    git clone [repo-url]
    cd Proposekit
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente**:
    Crie um arquivo `.env.local` na raiz com suas credenciais do Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=seu_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key
    ```

4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

## 📜 Licença

Propriedade intelectual de ProposeKit. Edição Beta Premium © 2026.
