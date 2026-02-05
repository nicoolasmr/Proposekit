'use client'

import ChatInterface from '@/components/ChatInterface'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import { SocialProof } from '@/components/SocialProof'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { FaqSection } from '@/components/FaqSection'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  })

  // Paralax effect for some elements
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <div className="flex flex-col min-h-screen selection:bg-black selection:text-white bg-background overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION - Editorial & High Authority */}
        <section className="min-h-[90vh] flex flex-col justify-center pt-32 pb-24 px-8 md:px-16 text-center max-w-5xl mx-auto space-y-12 relative">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-7xl md:text-9xl font-serif tracking-tighter leading-[0.9] text-balance">
              Propostas que <br /> fecham negócios.
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-serif italic max-w-3xl mx-auto opacity-70 text-balance leading-tight">
              Transforme conversas simples em contratos assinados e pagamentos à vista. A única ferramenta de proposta com Closing Kit nativo.
            </p>
          </motion.div>

          <div className="pt-8 w-full max-w-2xl mx-auto">
            <div className="shadow-2xl border border-border/60 bg-background rounded-lg overflow-hidden relative z-20">
              <ChatInterface />
            </div>
          </div>

          {/* Background subtle elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-gradient-to-full from-secondary/30 to-transparent blur-3xl rounded-full opacity-50" />
        </section>

        <SocialProof />

        {/* O PROBLEMA - Minimalist & Direct */}
        <section className="py-40 bg-secondary/30 border-y border-border px-8 md:px-16 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-16 relative z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight italic text-balance"
            >
              O silêncio visual <br /> gera autoridade.
            </motion.h2>
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

        <FeaturesGrid />

        {/* COMO FUNCIONA - Editorial Centered Grid */}
        <section ref={targetRef} className="py-32 px-8 md:px-16 bg-background overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-40">
              <div className="grid md:grid-cols-2 gap-24 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30 border-b border-foreground/20 pb-2">01 / Diálogo</span>
                  <h3 className="text-5xl font-serif italic tracking-tight text-balance">Defina o escopo com fluidez.</h3>
                  <p className="text-muted-foreground font-serif text-xl italic opacity-70 border-l-2 border-primary/10 pl-8 text-balance">
                    Responda a perguntas estratégicas em uma interface imersiva, desenhada para extrair o melhor do seu projeto sem que você perceba o esforço.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  style={{ y }}
                  className="aspect-video bg-secondary/20 border border-border/50 shadow-2xl relative overflow-hidden group rounded-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src="/dialogue-interface.png"
                    alt="Interface de diálogo fluida"
                    fill
                    className="object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-24 items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  style={{ y }} // Applying same parallax
                  className="aspect-video bg-secondary/20 border border-border/50 shadow-2xl md:order-last relative overflow-hidden group rounded-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src="/editorial-curation.png"
                    alt="Curadoria editorial instantânea"
                    fill
                    className="object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8 text-right md:pr-12"
                >
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30 border-b border-foreground/20 pb-2">02 / Transformação</span>
                  <h3 className="text-5xl font-serif italic tracking-tight text-balance">Curadoria editorial instantânea.</h3>
                  <p className="text-muted-foreground font-serif text-xl italic opacity-70 border-r-2 border-primary/10 pr-8 text-balance">
                    Suas respostas são estruturadas automaticamente em um documento de alto impacto visual e argumentativo. Pronto para envio.
                  </p>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-24 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-30 border-b border-foreground/20 pb-2">03 / Fechamento</span>
                  <h3 className="text-5xl font-serif italic tracking-tight text-balance">O seu cliente assina e paga em um clique.</h3>
                  <p className="text-muted-foreground font-serif text-xl italic opacity-70 border-l-2 border-primary/10 pl-8 text-balance">
                    Transforme o "sim" verbal em contrato assinado e pix na conta instantaneamente. Sem fricção, sem burocracia, sem "vou ver e te aviso".
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  style={{ y }}
                  className="aspect-[4/5] bg-secondary/20 border border-border/50 shadow-2xl relative overflow-hidden group rounded-sm max-w-sm mx-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src="/closing-kit-mobile.png"
                    alt="Interface de pagamento Pix e aceite digital"
                    fill
                    className="object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>



        <FaqSection />

        {/* MODELO DE USO - Silent CTA */}
        <section className="py-40 px-8 md:px-16 text-center bg-black text-white selection:bg-white selection:text-black">
          <div className="max-w-3xl mx-auto space-y-16">
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter italic leading-none">
              Assine com <br /> confiança.
            </h2>
            <div className="space-y-8">
              <p className="text-2xl font-serif italic opacity-60 text-balance">
                Crie sua primeira proposta agora. Sem necessidade de cartão de crédito.
              </p>
              <div className="pt-12">
                <Button className="h-20 px-24 text-base bg-white text-black hover:bg-white/90 uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] rounded-none hover:round-sm" onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
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
      <footer className="py-24 border-t border-border/30 px-8 md:px-16 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
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

