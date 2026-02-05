'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function FaqSection() {
    const faqs = [
        {
            question: "Preciso de cartão de crédito para testar?",
            answer: "Absolutamente não. Acreditamos que o valor deve ser provado antes da cobrança. Você tem acesso completo à criação de propostas iniciais sem compromisso financeiro."
        },
        {
            question: "Posso exportar em PDF?",
            answer: "Sim. Embora a experiência web seja superior para conversão, entendemos a necessidade de arquivos estáticos. O ProposeKit gera PDFs de alta resolução com um clique."
        },
        {
            question: "Meus dados e de meus clientes estão seguros?",
            answer: "Segurança de nível bancário. Utilizamos criptografia de ponta a ponta e não treinamos nossos modelos públicos com seus dados proprietários."
        },
        {
            question: "Funciona para agências e freelancers?",
            answer: "O ProposeKit foi desenhado especificamente para quem vende serviços intelectuais de alto valor, seja você um consultor solo ou uma agência de design."
        }
    ]

    return (
        <section className="py-32 px-8 md:px-16 bg-background border-t border-border/40">
            <div className="max-w-3xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-serif italic">Perguntas Frequentes</h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest">Clareza gera confiança</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <FaqItem key={idx} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-b border-border/40 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group hover:opacity-70 transition-opacity"
            >
                <span className="font-serif text-xl italic pr-8">{question}</span>
                <span className="text-muted-foreground/50 group-hover:text-primary transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-muted-foreground leading-relaxed pr-8 pl-4 border-l border-border/30">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
