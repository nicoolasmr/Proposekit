'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createChatSession, saveChatMessage } from '@/app/actions/chat'
import { createClient } from '@/lib/supabase/client'

type ProposalData = {
    client_name: string
    title: string
    objective: string
    urgency_reason: string
    cost_of_inaction: string
    previous_attempts: string
    scope: string
    out_of_scope: string
    revisions: string
    decision_maker: string
    communication: string
    dependencies: string
    total_value: string
    payment_terms: string
    timeline: string
    // Closing Kit
    closing_opt_in?: string
    deposit_amount?: string
    pix_key?: string
}

type Step = {
    id: string
    question: string
    field: keyof ProposalData
    placeholder: string
    feedback: string
}

const STEPS: Step[] = [
    // BLOCO 1 — CONTEXTO
    {
        id: 'client_name',
        question: 'Para quem é essa proposta?',
        field: 'client_name',
        placeholder: 'Nome do cliente ou empresa',
        feedback: 'Certo.'
    },
    {
        id: 'title',
        question: 'Como você descreveria esse projeto ou serviço?',
        field: 'title',
        placeholder: 'Ex: Consultoria de Marketing Estratégico',
        feedback: 'Entendi.'
    },
    {
        id: 'objective',
        question: 'O que esse cliente espera resolver ou conquistar com esse projeto?',
        field: 'objective',
        placeholder: 'Qual o principal objetivo?',
        feedback: 'Ótimo.'
    },
    // BLOCO 2 — VALOR
    {
        id: 'urgency_reason',
        question: 'Por que esse projeto é importante agora?',
        field: 'urgency_reason',
        placeholder: 'Existe algum gatilho de urgência?',
        feedback: 'Compreendo.'
    },
    {
        id: 'cost_of_inaction',
        question: 'O que acontece se isso não for feito neste momento?',
        field: 'cost_of_inaction',
        placeholder: 'Riscos ou perdas envolvidas',
        feedback: 'Entendi.'
    },
    {
        id: 'previous_attempts',
        question: 'Eles já tentaram algo parecido antes?',
        field: 'previous_attempts',
        placeholder: 'Histórico de tentativas',
        feedback: 'Certo.'
    },
    // BLOCO 3 — ESCOPO
    {
        id: 'scope',
        question: 'O que exatamente você vai entregar nesse projeto?',
        field: 'scope',
        placeholder: 'Principais entregáveis',
        feedback: 'Perfeito.'
    },
    {
        id: 'out_of_scope',
        question: 'Existe algo que costuma gerar dúvida sobre o que está ou não incluso?',
        field: 'out_of_scope',
        placeholder: 'Limites do escopo',
        feedback: 'Anotado.'
    },
    {
        id: 'revisions',
        question: 'Haverá revisões ou ajustes durante o projeto?',
        field: 'revisions',
        placeholder: 'Política de revisões',
        feedback: 'Ok.'
    },
    // BLOCO 4 — OPERAÇÃO
    {
        id: 'decision_maker',
        question: 'Quem aprova esse projeto do lado do cliente?',
        field: 'decision_maker',
        placeholder: 'Tomador de decisão',
        feedback: 'Entendi.'
    },
    {
        id: 'communication',
        question: 'Como vocês vão se comunicar durante o projeto?',
        field: 'communication',
        placeholder: 'Reuniões semanais, WhatsApp, E-mail...',
        feedback: 'Certo.'
    },
    {
        id: 'dependencies',
        question: 'Existe alguma dependência do cliente para que tudo avance bem?',
        field: 'dependencies',
        placeholder: 'Materiais, acessos, aprovações...',
        feedback: 'Ótimo.'
    },
    // BLOCO 5 — COMERCIAL
    {
        id: 'total_value',
        question: 'Qual é o valor total do projeto?',
        field: 'total_value',
        placeholder: 'Ex: R$ 15.000,00',
        feedback: 'Confirmado.'
    },
    {
        id: 'payment_terms',
        question: 'Como será o pagamento?',
        field: 'payment_terms',
        placeholder: 'Ex: 50% entrada + 50% entrega',
        feedback: 'Ok.'
    },
    {
        id: 'timeline',
        question: 'Qual o prazo estimado de entrega?',
        field: 'timeline',
        placeholder: 'Ex: 45 dias',
        feedback: 'Excelente.'
    },
    // BLOCO 6 — FECHAMENTO (KIT)
    {
        id: 'closing_opt_in',
        question: 'Deseja ativar o Kit de Fechamento (Link de Aceite + Pagamento de Entrada)?',
        field: 'closing_opt_in',
        placeholder: 'Sim ou Não',
        feedback: 'Ok.'
    },
    {
        id: 'deposit_amount',
        question: 'Qual valor deve ser pago na entrada?',
        field: 'deposit_amount',
        placeholder: 'Ex: 30% ou R$ 2.000,00',
        feedback: 'Certo.'
    },
    {
        id: 'pix_key',
        question: 'Qual a Chave Pix para receber a entrada?',
        field: 'pix_key',
        placeholder: 'CPF, CNPJ, Email ou Aleatória',
        feedback: 'Anotado.'
    }
]

export default function ChatInterface() {
    const [currentStep, setCurrentStep] = useState(-1)
    const [data, setData] = useState<ProposalData>({
        client_name: '',
        title: '',
        objective: '',
        urgency_reason: '',
        cost_of_inaction: '',
        previous_attempts: '',
        scope: '',
        out_of_scope: '',
        revisions: '',
        decision_maker: '',
        communication: '',
        dependencies: '',
        total_value: '',
        payment_terms: '',
        timeline: '',
        closing_opt_in: '',
        deposit_amount: '',
        pix_key: ''
    })
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
        const content = data[step.field] || ''

        if (!content.trim()) return

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

        setFeedbackMessage(step.feedback)

        setTimeout(() => {
            setFeedbackMessage(null)
            if (currentStep < STEPS.length - 1) {
                // Skip Logic for Closing Kit
                const nextStepIndex = currentStep + 1
                const nextStep = STEPS[nextStepIndex]

                if (nextStep.id === 'deposit_amount' || nextStep.id === 'pix_key') {
                    // Check if user opted out
                    const optedIn = (data.closing_opt_in || '').toLowerCase().includes('sim')
                    if (!optedIn) {
                        // Skip closing details if not opted in
                        // If next step is deposit_amount, and we skip, we check next.
                        // Simple approach: Jump to end if opted out? 
                        // Or jump 2 steps.
                        // Since these are the last steps, we can just finish.
                        setIsTransitioning(true)
                        setTimeout(() => {
                            setIsTransitioning(false)
                            setShowPreview(true)
                        }, 2500)
                        return
                    }
                }

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
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Estrutura Finalizada</span>
                        <h2 className="text-5xl font-serif italic tracking-tighter">Sua proposta está pronta.</h2>
                        <p className="text-muted-foreground font-serif italic">Para liberar o PDF completo, confirme seus dados de pagamento.</p>
                    </div>

                    <Card className="p-16 border border-border/40 bg-white relative overflow-hidden">
                        {/* Fake Document Preview */}
                        <div className="space-y-12 opacity-40 select-none pointer-events-none">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-serif italic border-b border-border/40 pb-4">{data.title}</h3>
                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Proposta para: {data.client_name}</p>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-2">
                                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Investimento</p>
                                        <p className="font-serif text-xl italic">{data.total_value}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Prazo</p>
                                        <p className="font-serif text-xl italic">{data.timeline}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Objetivo</p>
                                    <p className="font-serif text-lg italic">{data.objective}</p>
                                </div>
                            </div>

                            <Separator className="bg-border/20" />
                            <div className="space-y-4">
                                <div className="h-4 bg-secondary w-3/4"></div>
                                <div className="h-4 bg-secondary w-full"></div>
                                <div className="h-4 bg-secondary w-1/2"></div>
                            </div>
                        </div>

                        {/* Lock Overlay */}
                        <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] flex items-center justify-center p-8">
                            <div className="max-w-sm w-full bg-white border border-border shadow-2xl p-12 text-center space-y-8">
                                <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto">
                                    <Lock className="text-white w-5 h-5" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl font-serif italic leading-tight">Proposta Gerada.</p>
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">Libere o download oficial.</p>
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
                    <p className="text-3xl font-serif italic text-muted-foreground">
                        Perfeito. Já tenho tudo o que preciso para organizar sua proposta.
                    </p>
                    <div className="flex justify-center">
                        <div className="w-1 px-8 space-y-1">
                            <motion.div
                                animate={{ scaleY: [1, 2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="h-4 bg-foreground/20 w-px mx-auto"
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (currentStep === -1) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-12 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl md:text-4xl font-serif tracking-tighter italic leading-none">
                        Vou te ajudar a organizar uma proposta clara e profissional.
                    </h2>
                    <p className="text-lg text-muted-foreground font-serif italic opacity-60">
                        Vamos conversar um pouco sobre o projeto.
                    </p>
                </motion.div>
                <Button variant="premium" onClick={handleNext} className="h-16 px-12 text-sm tracking-[0.3em]">
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
                <div className="space-y-8">
                    {STEPS.slice(0, currentStep).map((s) => (
                        <div key={s.id} className="group space-y-2 opacity-40 hover:opacity-100 transition-opacity duration-500 border-l border-border/30 pl-6">
                            <p className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground">{s.question}</p>
                            <p className="font-serif text-xl italic tracking-tight">{data[s.field]}</p>
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
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-8 opacity-10">
                                <div className="h-px bg-foreground flex-grow"></div>
                                <p className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">
                                    {currentStep + 1} / {STEPS.length}
                                </p>
                                <div className="h-px bg-foreground flex-grow"></div>
                            </div>

                            <h2 className="text-4xl md:text-6xl leading-tight text-center font-serif italic tracking-tighter py-4 text-balance">
                                {step.question}
                            </h2>

                            <div className="relative pt-8 max-w-lg mx-auto">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={step.placeholder}
                                    className="input-minimal !text-center placeholder:text-center italic text-3xl py-6"
                                    value={data[step.field]}
                                    onChange={(e) => setData({ ...data, [step.field]: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex justify-center mt-16">
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
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
