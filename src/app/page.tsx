'use client'

import ChatInterface from '@/components/ChatInterface'
import { ArrowRight, Lock, Zap, FileText, CheckCircle, Quote } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-black selection:text-white">
      {/* Header */}
      <header className="py-8 px-8 md:px-16 flex justify-between items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b border-border/50">
        <Link href="/" className="font-serif text-2xl tracking-tighter hover:opacity-70 transition-opacity flex items-center gap-2">
          PROPOSE<span className="font-sans font-bold italic tracking-normal">KIT</span>
        </Link>
        <nav className="flex items-center gap-10">
          <Link href="/login" className="text-[10px] font-sans tracking-[0.2em] uppercase font-bold hover:opacity-50 transition-opacity">Entrar</Link>
          <Link href="/checkout">
            <Button variant="outline" className="rounded-none border-black text-[10px] uppercase tracking-widest h-10 px-6 font-bold hover:bg-black hover:text-white transition-all">
              Criar Proposta
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="pt-24 pb-40 px-8 md:px-16 text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl mb-8 leading-[1] font-serif tracking-tighter">
            Propostas claras fecham negócios mais rápido.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-serif mb-8 italic max-w-2xl mx-auto">
            Crie uma proposta profissional em minutos — direto no chat.
          </p>
          <p className="text-lg text-muted-foreground/60 font-serif mb-12 max-w-xl mx-auto">
            Sem modelos confusos. Sem improviso. Apenas uma proposta clara, organizada e pronta para ser enviada.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
            <Button size="lg" className="premium-button h-16 px-10" onClick={() => {
              const chat = document.getElementById('chat-start')
              chat?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Criar minha proposta agora
            </Button>
            <Button variant="ghost" className="text-[10px] uppercase tracking-[0.2em] font-bold">
              Ver como funciona
            </Button>
          </div>

          <div id="chat-start" className="mt-20 scroll-mt-32">
            <ChatInterface />
          </div>
        </section>

        {/* O PROBLEMA */}
        <section className="py-40 bg-secondary border-y border-border px-8 md:px-16">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif tracking-tighter leading-tight">
                O problema não é o serviço. <br /> É a proposta.
              </h2>
              <Separator className="w-12 bg-black" />
              <p className="text-xl text-muted-foreground font-serif italic">
                Propostas mal feitas criam dúvidas, atrasam decisões e fazem você parecer menos profissional do que realmente é.
              </p>
              <p className="text-xl text-muted-foreground font-serif italic">
                Quando a proposta não é clara, o cliente hesita. E quem hesita, não fecha.
              </p>
            </div>
            <div className="bg-white p-12 border border-border flex flex-col items-center justify-center space-y-6 opacity-40 grayscale pointer-events-none">
              <div className="h-4 bg-black/10 w-full rounded-full"></div>
              <div className="h-4 bg-black/10 w-2/3 rounded-full self-start"></div>
              <div className="h-40 bg-black/5 w-full"></div>
            </div>
          </div>
        </section>

        {/* A SOLUÇÃO */}
        <section className="py-40 px-8 md:px-16 bg-white text-black">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-5xl md:text-6xl font-serif tracking-tighter">
              Uma proposta simples, clara e profissional.
            </h2>
            <p className="text-2xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
              O ProposeKit organiza seu serviço, deixa as condições claras e apresenta o valor de forma profissional. Sem ruído. Sem retrabalho. Sem explicações extras.
            </p>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-40 px-8 md:px-16 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif tracking-tight mb-20 text-center uppercase tracking-[0.2em] opacity-40">Como Funciona</h2>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="space-y-6 text-center">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30">Passo 1</div>
                <h3 className="text-3xl font-serif tracking-tight">Você conversa.</h3>
                <p className="text-muted-foreground font-serif text-lg italic opacity-70">Responda algumas perguntas simples no chat.</p>
              </div>
              <div className="space-y-6 text-center">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30">Passo 2</div>
                <h3 className="text-3xl font-serif tracking-tight">A proposta é criada.</h3>
                <p className="text-muted-foreground font-serif text-lg italic opacity-70">O sistema organiza tudo automaticamente em uma proposta profissional.</p>
              </div>
              <div className="space-y-6 text-center">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30">Passo 3</div>
                <h3 className="text-3xl font-serif tracking-tight">Você envia e fecha.</h3>
                <p className="text-muted-foreground font-serif text-lg italic opacity-70">Envie o PDF e avance a negociação com clareza.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="py-24 bg-secondary/50 px-8 md:px-16">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-12 text-center">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] opacity-50 px-8 py-4 border border-border">Freelancers que querem parecer mais profissionais</div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] opacity-50 px-8 py-4 border border-border">Consultores que precisam de clareza para fechar</div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] opacity-50 px-8 py-4 border border-border">Agências pequenas que querem ganhar velocidade</div>
          </div>
        </section>

        {/* MODELO DE USO (PRICING) */}
        <section className="py-40 px-8 md:px-16 text-center bg-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/4"></div>
          <div className="max-w-3xl mx-auto relative z-10 space-y-12">
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter">Use uma proposta gratuitamente.</h2>
            <p className="text-2xl font-serif italic opacity-60">
              Você pode criar sua primeira proposta sem pagar. <br />
              Para liberar o PDF final, basta cadastrar seus dados de pagamento. Sem cobrança imediata.
            </p>

            <div className="pt-8">
              <Button size="lg" className="premium-button h-20 px-16 text-base bg-white text-black hover:bg-white/90">
                Criar minha proposta agora
              </Button>
              <p className="mt-6 text-[10px] font-sans uppercase tracking-[0.3em] opacity-40">
                Leva menos de 3 minutos.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 border-t border-border px-8 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <Link href="/" className="font-serif text-2xl tracking-tighter">
            PROPOSE<span className="font-sans font-bold italic">KIT</span>
          </Link>
          <div className="flex gap-12 text-[10px] font-sans uppercase tracking-[0.3em] font-bold text-muted-foreground">
            <Link href="/terms" className="hover:text-black transition-colors">Termos</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Privacidade</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contato</Link>
          </div>
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground opacity-50">
            &copy; 2026 PROPOSEKIT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
