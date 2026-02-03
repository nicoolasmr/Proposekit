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
            <div className="max-w-xl mx-auto text-center py-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Card className="p-20 border border-border/60 bg-white">
                        <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-12">
                            <Check className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-4xl mb-6 font-serif italic tracking-tighter">Sua proposta está pronta.</h2>
                        <p className="text-muted-foreground mb-16 font-serif text-lg italic opacity-60">
                            O PDF foi organizado com sucesso. <br /> Libere o acesso completo abaixo.
                        </p>
                        <Button
                            variant="premium"
                            size="lg"
                            className="w-full"
                            onClick={() => window.location.href = '/checkout'}
                        >
                            Liberar Proposta
                        </Button>
                    </Card>
                </motion.div>
            </div>
        )
    }

    if (isTransitioning) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-56 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-serif italic text-muted-foreground animate-pulse"
                >
                    Organizando sua proposta...
                </motion.p>
            </div>
        )
    }

    if (currentStep === -1) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-32 text-center space-y-16">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <h2 className="text-5xl md:text-6xl font-serif tracking-tighter italic">Inicie sua proposta.</h2>
                    <p className="text-xl text-muted-foreground font-serif italic opacity-60">Responda algumas perguntas rápidas para estruturar seu negócio.</p>
                </motion.div>
                <Button variant="premium" onClick={handleNext} className="h-16 px-16">
                    Começar
                </Button>
            </div>
        )
    }

    const step = STEPS[currentStep]

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="space-y-24">
                {/* Past entries - minimalist editorial list */}
                <div className="space-y-12">
                    {STEPS.slice(0, currentStep).map((s) => (
                        <div key={s.id} className="group space-y-2 opacity-20 hover:opacity-100 transition-opacity duration-500 border-l border-border/30 pl-8">
                            <p className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground">{s.question}</p>
                            <p className="font-serif text-2xl italic tracking-tight">{data[s.field]}</p>
                        </div>
                    ))}
                </div>

                {/* Current question - focused centered editorial */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-12"
                    >
                        <div className="flex items-center gap-8 opacity-20">
                            <div className="h-px bg-foreground flex-grow"></div>
                            <p className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">
                                {currentStep + 1} / {STEPS.length}
                            </p>
                            <div className="h-px bg-foreground flex-grow"></div>
                        </div>

                        <h2 className="text-5xl md:text-6xl leading-tight text-center font-serif italic tracking-tighter py-4">
                            {step.question}
                        </h2>

                        <div className="relative pt-8 max-w-lg mx-auto">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={step.placeholder}
                                className="input-minimal !text-center placeholder:text-center italic text-3xl"
                                value={data[step.field]}
                                onChange={(e) => setData({ ...data, [step.field]: e.target.value })}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex justify-center mt-20">
                                <Button
                                    variant="premium"
                                    onClick={handleNext}
                                    disabled={!data[step.field]}
                                    className="rounded-none w-20 h-20 p-0 flex items-center justify-center transition-all duration-300 disabled:opacity-5 disabled:grayscale"
                                >
                                    <ArrowRight className="w-8 h-8" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
