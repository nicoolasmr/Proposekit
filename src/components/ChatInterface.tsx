'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createChatSession, saveChatMessage } from '@/app/actions/chat'
import { createClient } from '@/lib/supabase/client'

type Step = {
    id: string
    question: string
    field: keyof ProposalData
    type: 'text' | 'number' | 'date'
    placeholder: string
    feedback: string
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
        placeholder: 'Consultoria, Design, Desenvolvimento...',
        feedback: 'Entendi.'
    },
    {
        id: 'client',
        question: 'Para quem é essa proposta?',
        field: 'client',
        type: 'text',
        placeholder: 'Nome do cliente ou empresa',
        feedback: 'Perfeito.'
    },
    {
        id: 'value',
        question: 'Qual o valor do projeto?',
        field: 'value',
        type: 'text',
        placeholder: 'Ex: R$ 5.000,00',
        feedback: 'Ótimo.'
    },
    {
        id: 'deadline',
        question: 'Qual o prazo de entrega?',
        field: 'deadline',
        type: 'text',
        placeholder: 'Ex: 30 dias úteis',
        feedback: 'Entendido.'
    },
    {
        id: 'payment',
        question: 'Como será o pagamento?',
        field: 'payment',
        type: 'text',
        placeholder: 'Ex: 50% na entrada, 50% na entrega',
        feedback: 'Excelente.'
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
    const [showPreview, setShowPreview] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
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
        if (currentStep >= 0 && !feedbackMessage) {
            inputRef.current?.focus()
        }
    }, [currentStep, feedbackMessage])

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

        // Show feedback message before moving to next step
        setFeedbackMessage(step.feedback)

        setTimeout(() => {
            setFeedbackMessage(null)
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(s => s + 1)
            } else {
                setIsTransitioning(true)
                setTimeout(() => {
                    setIsTransitioning(false)
                    setShowPreview(true)
                }, 2500)
            }
        }, 800)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentStep >= 0 && data[STEPS[currentStep].field] && !feedbackMessage) {
            handleNext()
        }
    }

    // Partial Preview State
    if (showPreview) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pending_proposal', JSON.stringify(data))
        }

        return (
            <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Estrutura Finalizada</span>
                        <h2 className="text-5xl font-serif italic tracking-tighter">Sua proposta está pronta.</h2>
                    </div>

                    <Card className="p-16 border border-border/40 bg-white relative overflow-hidden">
                        {/* Fake Document Preview with Overlays */}
                        <div className="space-y-12 opacity-40 select-none pointer-events-none">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-serif italic border-b border-border/40 pb-4">{data.service}</h3>
                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Proposta para: {data.client}</p>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-2">
                                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Investimento</p>
                                        <p className="font-serif text-xl italic">{data.value}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Prazo</p>
                                        <p className="font-serif text-xl italic">{data.deadline}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Condições de Pagamento</p>
                                    <p className="font-serif text-xl italic">{data.payment}</p>
                                </div>
                            </div>

                            <Separator className="bg-border/20" />

                            <div className="space-y-4">
                                <div className="h-4 bg-secondary w-3/4"></div>
                                <div className="h-4 bg-secondary w-full"></div>
                                <div className="h-4 bg-secondary w-1/2"></div>
                            </div>
                        </div>

                        {/* Lock Overlay - The "Silent" Paywall */}
                        <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] flex items-center justify-center p-8">
                            <div className="max-w-sm w-full bg-white border border-border shadow-2xl p-12 text-center space-y-8">
                                <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto">
                                    <Lock className="text-white w-5 h-5" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl font-serif italic leading-tight">Para acessar o PDF completo e oficial, confirme seus dados.</p>
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">Você tem 1 proposta gratuita. Nenhuma cobrança agora.</p>
                                </div>
                                <Button
                                    variant="premium"
                                    className="w-full h-16"
                                    onClick={() => window.location.href = '/checkout'}
                                >
                                    Liberar Proposta
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        )
    }

    if (isTransitioning) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-56 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="flex justify-center">
                        <div className="w-1 px-8 space-y-1">
                            <motion.div
                                animate={{ scaleY: [1, 2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="h-4 bg-foreground/20 w-px mx-auto"
                            ></motion.div>
                        </div>
                    </div>
                    <p className="text-3xl font-serif italic text-muted-foreground">
                        Estou organizando sua proposta.
                    </p>
                </motion.div>
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
                    <h2 className="text-5xl md:text-6xl font-serif tracking-tighter italic leading-none">Vamos organizar <br /> sua proposta.</h2>
                    <p className="text-xl text-muted-foreground font-serif italic opacity-60">Responda algumas perguntas rápidas.</p>
                </motion.div>
                <Button variant="premium" onClick={handleNext} className="h-20 px-16 text-base tracking-[0.3em]">
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

                {/* Feedback or Question */}
                <AnimatePresence mode="wait">
                    {feedbackMessage ? (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="py-12 text-center"
                        >
                            <p className="text-3xl font-serif italic opacity-40">{feedbackMessage}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-12"
                        >
                            <div className="flex items-center gap-8 opacity-10">
                                <div className="h-px bg-foreground flex-grow"></div>
                                <p className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">
                                    {currentStep + 1} / {STEPS.length}
                                </p>
                                <div className="h-px bg-foreground flex-grow"></div>
                            </div>

                            <h2 className="text-5xl md:text-7xl leading-tight text-center font-serif italic tracking-tighter py-4">
                                {step.question}
                            </h2>

                            <div className="relative pt-8 max-w-lg mx-auto">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={step.placeholder}
                                    className="input-minimal !text-center placeholder:text-center italic text-4xl py-8"
                                    value={data[step.field]}
                                    onChange={(e) => setData({ ...data, [step.field]: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex justify-center mt-24">
                                    <Button
                                        variant="premium"
                                        onClick={handleNext}
                                        disabled={!data[step.field]}
                                        className="rounded-none w-24 h-24 p-0 flex items-center justify-center transition-all duration-300 disabled:opacity-5 disabled:grayscale"
                                    >
                                        <ArrowRight className="w-10 h-10" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
