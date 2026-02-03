'use client'

import ChatInterface from '@/components/ChatInterface'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-black selection:text-white bg-background">
      {/* Header - Minimalist & Silent */}
      <header className="py-12 px-8 md:px-16 flex justify-between items-center bg-background sticky top-0 z-50 border-b border-border/40">
        <Link href="/" className="font-serif text-2xl tracking-tighter hover:opacity-70 transition-opacity flex items-center gap-2 italic">
          PROPOSE<span className="font-sans font-bold not-italic tracking-normal">KIT</span>
        </Link>
        <nav className="flex items-center gap-12">
          <Link href="/login" className="text-[10px] font-sans tracking-[0.3em] uppercase font-bold hover:opacity-50 transition-opacity">Login</Link>
          <Link href="/checkout">
            <Button variant="premium-outline" size="sm">
              Criar Proposta
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION - Editorial & High Authority */}
        <section className="pt-32 pb-56 px-8 md:px-16 text-center max-w-5xl mx-auto space-y-16">
          <div className="space-y-8">
            <h1 className="text-7xl md:text-9xl font-serif tracking-tighter leading-[0.9]">
              Propostas que <br /> fecham negócios.
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-serif italic max-w-3xl mx-auto opacity-70">
              Transforme conversas em contratos profissionais com clareza editorial.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8">
            <Button variant="premium" className="h-20 px-16 text-base" onClick={() => {
              const chat = document.getElementById('chat-start')
              chat?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Iniciar Proposta
            </Button>
            <Button variant="link" className="text-[11px] uppercase tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-opacity">
              Ver Demonstração
            </Button>
          </div>

          <div id="chat-start" className="mt-32 scroll-mt-32 pt-16">
            <div className="max-w-3xl mx-auto border-t border-border/50 pt-32">
              <ChatInterface />
            </div>
          </div>
        </section>

        {/* O PROBLEMA - Minimalist & Direct */}
        <section className="py-56 bg-secondary/30 border-y border-border px-8 md:px-16 text-center">
          <div className="max-w-4xl mx-auto space-y-16">
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight italic">
              O silêncio visual <br /> gera autoridade.
            </h2>
            <div className="space-y-12 max-w-2xl mx-auto">
              <p className="text-2xl text-muted-foreground font-serif italic leading-relaxed">
                Propostas poluídas geram hesitação. <br /> Hesitação mata contratos.
              </p>
              <Separator className="w-16 bg-foreground/10 mx-auto" />
              <p className="text-xl text-muted-foreground font-serif italic opacity-60">
                O ProposeKit elimina o ruído e foca no que importa: <br /> o valor do seu trabalho apresentado com precisão.
              </p>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA - Editorial Centered Grid */}
        <section className="py-56 px-8 md:px-16 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-32">
              <div className="grid md:grid-cols-2 gap-24 items-center">
                <div className="space-y-6">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30">01 / Abordagem</span>
                  <h3 className="text-4xl font-serif italic tracking-tight">Você conversa.</h3>
                  <p className="text-muted-foreground font-serif text-xl italic opacity-70 border-l border-border pl-8">
                    Responda perguntas essenciais em uma interface focada, livre de distrações.
                  </p>
                </div>
                <div className="aspect-square bg-white border border-border/50 shadow-2xl opacity-50"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-24 items-center">
                <div className="aspect-square bg-white border border-border/50 shadow-2xl opacity-50 md:order-last"></div>
                <div className="space-y-6 text-right md:pr-12">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30">02 / Curadoria</span>
                  <h3 className="text-4xl font-serif italic tracking-tight">O sistema organiza.</h3>
                  <p className="text-muted-foreground font-serif text-xl italic opacity-70 border-r border-border pr-8">
                    Seus dados são estruturados automaticamente em um layout editorial de alta autoridade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODELO DE USO - Silent CTA */}
        <section className="py-56 px-8 md:px-16 text-center bg-black text-white selection:bg-white selection:text-black">
          <div className="max-w-3xl mx-auto space-y-16">
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter italic leading-none">
              Assine com <br /> confiança.
            </h2>
            <div className="space-y-8">
              <p className="text-2xl font-serif italic opacity-60">
                Experimente sua primeira proposta gratuitamente.
              </p>
              <div className="pt-12">
                <Button className="h-20 px-20 text-base bg-white text-black hover:bg-white/90 uppercase tracking-[0.3em]" onClick={() => {
                  const chat = document.getElementById('chat-start')
                  chat?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  Iniciar agora
                </Button>
                <p className="mt-12 text-[10px] uppercase font-sans tracking-[0.4em] opacity-30">
                  Acesso imediato. Sem taxas ocultas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Professional & Discreet */}
      <footer className="py-32 border-t border-border/30 px-8 md:px-16 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <Link href="/" className="font-serif text-2xl tracking-tighter italic">
            PROPOSE<span className="font-sans font-bold not-italic">KIT</span>
          </Link>
          <div className="flex gap-16 text-[10px] font-sans uppercase tracking-[0.4em] font-bold text-muted-foreground">
            <Link href="/terms" className="hover:text-black transition-colors">Termos</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Privacidade</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contato</Link>
          </div>
          <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-muted-foreground opacity-30">
            &copy; 2026 PROPOSEKIT. HIGH AUTHORITY SOFTWARE.
          </p>
        </div>
      </footer>
    </div>
  )
}
