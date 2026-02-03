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
          <Button variant="outline" className="rounded-none border-black text-[10px] uppercase tracking-widest h-10 px-6 font-bold hover:bg-black hover:text-white transition-all">
            Criar Proposta
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="pt-24 pb-40 px-8 md:px-16 text-center max-w-5xl mx-auto">
          <div className="inline-block border border-black/10 px-4 py-1 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold italic">Edição Beta Premium</span>
          </div>
          <h1 className="text-6xl md:text-8xl mb-8 leading-[1] font-serif tracking-tighter text-balance">
            Propostas claras fecham negócios mais rápido.
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground font-serif mb-16 italic max-w-2xl mx-auto">
            "Transforme conversas informais em contratos profissionais em menos de 5 minutos."
          </p>

          <div className="mt-20">
            <ChatInterface />
          </div>
        </section>

        {/* O PROBLEMA (Social Proof / Pain) */}
        <section className="py-40 bg-secondary border-y border-border px-8 md:px-16">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <Quote className="w-16 h-16 mb-12 opacity-10" />
            <h2 className="text-4xl md:text-6xl mb-12 font-serif leading-tight tracking-tighter">
              A informalidade custa caro. Propostas mal feitas geram dúvidas, e dúvidas matam contratos.
            </h2>
            <div className="w-20 h-px bg-black opacity-20"></div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-40 px-8 md:px-16 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-12 gap-20 items-center">
              <div className="md:col-span-5 space-y-12">
                <h2 className="text-5xl md:text-6xl font-serif tracking-tighter leading-none">
                  Simplicidade <br /> como padrão.
                </h2>
                <div className="space-y-10">
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-muted-foreground mb-4 group-hover:text-black transition-colors">01. Abordagem</p>
                    <h3 className="text-2xl mb-2 font-serif">Converse com o sistema</h3>
                    <p className="text-muted-foreground font-serif italic text-lg opacity-70">Responda o que é essencial. Sem burocracia.</p>
                  </div>
                  <Separator className="bg-black/10" />
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-muted-foreground mb-4 group-hover:text-black transition-colors">02. Curadoria</p>
                    <h3 className="text-2xl mb-2 font-serif">Design Editorial Premium</h3>
                    <p className="text-muted-foreground font-serif italic text-lg opacity-70">Nossa IA organiza seus dados em um layout digno das grandes agências.</p>
                  </div>
                  <Separator className="bg-black/10" />
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-muted-foreground mb-4 group-hover:text-black transition-colors">03. Entrega</p>
                    <h3 className="text-2xl mb-1 font-serif">Link de Alta Autoridade</h3>
                    <p className="text-muted-foreground font-serif italic text-lg opacity-70">Envie um link que respira profissionalismo.</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 relative">
                <div className="aspect-[4/5] bg-white border border-black/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-12 relative overflow-hidden">
                  {/* Visual mockup of a proposal */}
                  <div className="h-px bg-black/10 w-full mb-8"></div>
                  <div className="h-8 bg-black/5 w-2/3 mb-4"></div>
                  <div className="h-40 bg-black/[0.02] w-full mb-12"></div>
                  <div className="h-4 bg-black/5 w-full mb-2"></div>
                  <div className="h-4 bg-black/5 w-full mb-2"></div>
                  <div className="h-4 bg-black/5 w-1/2 mb-12"></div>
                  <div className="mt-auto border-t border-black/10 pt-8 flex justify-between items-end">
                    <div className="h-12 bg-black/5 w-32"></div>
                    <div className="h-6 bg-black/5 w-20"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                    <Button className="premium-button shadow-2xl">Visualizar Exemplo</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING (Sleek) */}
        <section className="py-40 bg-black text-white px-8 md:px-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl mb-12 font-serif tracking-tighter text-white">Autoridade não tem preço. <br /> Mas tem um ponto de partida.</h2>

            <Card className="bg-white text-black border-none rounded-none p-16 md:p-24 shadow-[0_50px_120px_-20px_rgba(0,0,0,0.5)]">
              <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold mb-8">Experimente a clareza</p>
              <h3 className="text-4xl md:text-5xl mb-6 font-serif">Grátis</h3>
              <p className="font-serif italic text-xl text-muted-foreground mb-12">1 proposta inclusa para você fechar seu próximo grande contrato.</p>

              <ul className="text-left max-w-sm mx-auto space-y-6 mb-16">
                <li className="flex gap-4 items-center">
                  <CheckCircle className="w-5 h-5 opacity-20" />
                  <span className="font-serif text-lg italic">Layout Editorial Exclusivo</span>
                </li>
                <li className="flex gap-4 items-center">
                  <CheckCircle className="w-5 h-5 opacity-20" />
                  <span className="font-serif text-lg italic">Exportação em PDF 4K</span>
                </li>
                <li className="flex gap-4 items-center">
                  <CheckCircle className="w-5 h-5 opacity-20" />
                  <span className="font-serif text-lg italic">Dashboard de Performance</span>
                </li>
              </ul>

              <Button size="lg" className="premium-button w-full h-16 text-sm">
                Usar meu crédito gratuito
              </Button>
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mt-8">
                Requer cartão apenas para validação de identidade
              </p>
            </Card>

            <Link href="/pricing" className="inline-block mt-20 text-[10px] font-sans uppercase tracking-[0.4em] font-bold hover:opacity-50 transition-opacity">
              Ver todos os planos de agência <ArrowRight className="inline w-3 h-3 ml-2" aria-hidden="true" />
            </Link>
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
