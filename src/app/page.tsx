'use client'

import ChatInterface from '@/components/ChatInterface'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Separator } from '@/components/ui/separator'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-black selection:text-white bg-background">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION - Editorial & High Authority */}
        <section className="pt-32 pb-56 px-8 md:px-16 text-center max-w-5xl mx-auto space-y-16">
          <div className="space-y-8">
            <h1 className="text-7xl md:text-9xl font-serif tracking-tighter leading-[0.9] text-balance">
              Propostas que <br /> fecham negócios.
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-serif italic max-w-3xl mx-auto opacity-70 text-balance">
              Transforme conversas simples em contratos de alta autoridade com precisão editorial.
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
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight italic text-balance">
              O silêncio visual <br /> gera autoridade.
            </h2>
            <div className="space-y-12 max-w-2xl mx-auto">
              <p className="text-2xl text-muted-foreground font-serif italic leading-relaxed text-balance">
                Propostas saturadas geram hesitação. <br /> A clareza elimina fricção e acelera a decisão.
              </p>
              <Separator className="w-16 bg-foreground/10 mx-auto" />
              <p className="text-xl text-muted-foreground font-serif italic opacity-60 text-balance">
                O ProposeKit remove o ruído desnecessário para que seu cliente foque <br /> no único elemento que importa: o valor do seu trabalho.
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
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30">01 / Diálogo</span>
                  <h3 className="text-4xl font-serif italic tracking-tight text-balance">Defina o escopo com fluidez.</h3>
                  <p className="text-muted-foreground font-serif text-xl italic opacity-70 border-l border-border pl-8 text-balance">
                    Responda a perguntas estratégicas em uma interface imersiva, desenhada para extrair o melhor do seu projeto.
                  </p>
                </div>
                <div className="aspect-video bg-secondary/20 border border-border/50 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src="/dialogue-interface.png"
                    alt="Interface de diálogo fluida"
                    fill
                    className="object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-24 items-center">
                <div className="aspect-video bg-secondary/20 border border-border/50 shadow-2xl md:order-last relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src="/editorial-curation.png"
                    alt="Curadoria editorial instantânea"
                    fill
                    className="object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-6 text-right md:pr-12">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30">02 / Transformação</span>
                  <h3 className="text-4xl font-serif italic tracking-tight text-balance">Curadoria editorial instantânea.</h3>
                  <p className="text-muted-foreground font-serif text-xl italic opacity-70 border-r border-border pr-8 text-balance">
                    Suas respostas são estruturadas automaticamente em um documento de alto impacto visual e argumentativo.
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
              <p className="text-2xl font-serif italic opacity-60 text-balance">
                Crie sua primeira proposta agora. Sem necessidade de cartão de crédito.
              </p>
              <div className="pt-12">
                <Button className="h-20 px-20 text-base bg-white text-black hover:bg-white/90 uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em]" onClick={() => {
                  const chat = document.getElementById('chat-start')
                  chat?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  Começar gratuitamente
                </Button>
                <p className="mt-12 text-[10px] uppercase font-sans tracking-[0.4em] opacity-30">
                  Acesso imediato à interface de curadoria.
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
