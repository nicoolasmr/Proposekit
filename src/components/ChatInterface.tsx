'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createChatSession, saveChatMessage } from '@/app/actions/chat'
import { createClient } from '@/lib/supabase/client'

type Step = {
    id: string
    question: string
    field: keyof ProposalData
    type: 'text' | 'number' | 'date'
    placeholder: string
}

type ProposalData = {
    service: string
    client: string
    value: string
    deadline: string
    payment: string
}

const STEPS: Step[] = [
    {
        id: 'service',
        question: 'Qual serviço você está oferecendo?',
        field: 'service',
        type: 'text',
        placeholder: 'Consultoria, Design, Desenvolvimento...'
    },
    {
        id: 'client',
        question: 'Para quem é essa proposta?',
        field: 'client',
        type: 'text',
        placeholder: 'Nome do cliente ou empresa'
    },
    {
        id: 'value',
        question: 'Qual o valor do projeto?',
        field: 'value',
        type: 'text',
        placeholder: 'Ex: R$ 5.000,00'
    },
    {
        id: 'deadline',
        question: 'Qual o prazo de entrega?',
        field: 'deadline',
        type: 'text',
        placeholder: 'Ex: 30 dias úteis'
    },
    {
        id: 'payment',
        question: 'Como será o pagamento?',
        field: 'payment',
        type: 'text',
        placeholder: 'Ex: 50% na entrada, 50% na entrega'
    }
]

export default function ChatInterface() {
    const [currentStep, setCurrentStep] = useState(-1) // -1 for initial message
    const [data, setData] = useState<ProposalData>({
        service: '',
        client: '',
        value: '',
        deadline: '',
        payment: ''
    })
    const [isFinished, setIsFinished] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })
    }, [])

    useEffect(() => {
        if (currentStep >= 0) {
            inputRef.current?.focus()
        }
    }, [currentStep])

    const handleNext = async () => {
        if (currentStep === -1) {
            setCurrentStep(0)
            return
        }

        const step = STEPS[currentStep]
        const content = data[step.field]

        // Persistence Logic
        if (user) {
            try {
                let sid = sessionId
                if (!sid) {
                    sid = await createChatSession()
                    setSessionId(sid)
                }
                if (sid) {
                    await saveChatMessage(sid, 'user', content)
                }
            } catch (e) {
                console.error('Error saving chat:', e)
            }
        }

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(s => s + 1)
        } else {
            setIsTransitioning(true)
            // Transition message: "Perfeito. Estou organizando sua proposta."
            setTimeout(() => {
                setIsFinished(true)
                setIsTransitioning(false)
            }, 2000)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentStep >= 0 && data[STEPS[currentStep].field]) {
            handleNext()
        }
    }

    if (isFinished) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pending_proposal', JSON.stringify(data))
        }

        return (
            <div className="max-w-xl mx-auto text-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-12 border border-border shadow-2xl rounded-none bg-white">
                        <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-8">
                            <Check className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-3xl mb-4 font-serif">Sua proposta está pronta.</h2>
                        <p className="text-muted-foreground mb-12 font-serif text-lg italic">
                            Libere sua proposta completa para acesso imediato ao PDF.
                        </p>
                        <Button
                            size="lg"
                            className="w-full premium-button h-16"
                            onClick={() => window.location.href = '/checkout'}
                        >
                            Liberar agora
                        </Button>
                    </Card>
                </motion.div>
            </div>
        )
    }

    if (isTransitioning) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-40 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-serif italic text-muted-foreground"
                >
                    Perfeito. Estou organizando sua proposta.
                </motion.p>
            </div>
        )
    }

    if (currentStep === -1) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Vamos criar sua proposta.</h2>
                    <p className="text-xl text-muted-foreground font-serif italic">Responda algumas perguntas rápidas.</p>
                </motion.div>
                <Button onClick={handleNext} className="premium-button h-14 px-12">
                    Começar
                </Button>
            </div>
        )
    }

    const step = STEPS[currentStep]

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="space-y-16">
                {/* Past messages */}
                <div className="space-y-12">
                    {STEPS.slice(0, currentStep).map((s) => (
                        <div key={s.id} className="space-y-2 opacity-30 border-l border-black/10 pl-6">
                            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.question}</p>
                            <p className="font-serif text-xl">{data[s.field]}</p>
                        </div>
                    ))}
                </div>

                {/* Current message */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-black flex-grow opacity-10"></div>
                            <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">
                                {currentStep + 1} de {STEPS.length}
                            </p>
                            <div className="h-px bg-black flex-grow opacity-10"></div>
                        </div>

                        <h2 className="text-4xl md:text-5xl leading-tight text-center font-serif py-4">
                            {step.question}
                        </h2>

                        <div className="relative pt-4">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={step.placeholder}
                                className="input-minimal !text-center placeholder:text-center italic"
                                value={data[step.field]}
                                onChange={(e) => setData({ ...data, [step.field]: e.target.value })}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex justify-center mt-12">
                                <Button
                                    onClick={handleNext}
                                    disabled={!data[step.field]}
                                    className="rounded-full w-14 h-14 p-0 bg-black hover:bg-black/80 transition-all duration-300 disabled:opacity-5 disabled:scale-95"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
