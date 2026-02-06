'use client';

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Sparkles, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChat } from '@ai-sdk/react'
import { createProposal } from '@/app/actions/proposals'

// Define ProposalData locally if not exported from engine, or update engine export
export type ProposalData = {
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
    project_value: number | string // Allow string for interim state
    payment_terms: string
    deadline: string
    closing_opt_in?: string
    deposit_amount?: string
    pix_key?: string
    upsell_options?: { title: string; value: number }[]
}

// --- Preview Component (Right Side) ---
const LivePreview = ({ data }: { data: Partial<ProposalData> }) => {
    return (
        <div className="h-full bg-white border-l border-border/50 p-12 overflow-y-auto font-serif custom-scrollbar">
            <div className="space-y-12 opacity-80 hover:opacity-100 transition-opacity duration-500">
                <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Rascunho em Tempo Real</p>
                    <h2 className="text-4xl italic tracking-tighter text-balance">
                        {data.title || <span className="opacity-20">Título do Projeto...</span>}
                    </h2>
                    <p className="text-sm uppercase tracking-widest opacity-40">
                        Para: {data.client_name || '...'}
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-2">Investimento</p>
                            <p className="text-xl italic">{data.project_value ? `R$ ${data.project_value}` : '...'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-2">Prazo</p>
                            <p className="text-xl italic">{data.deadline || '...'}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Objetivo Central</p>
                        <p className="text-lg italic leading-relaxed text-muted-foreground">
                            {data.objective || '...'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Dor & Urgência</p>
                        <p className="text-base italic leading-relaxed text-muted-foreground opacity-70">
                            {data.cost_of_inaction || '...'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Escopo</p>
                        <p className="text-base italic leading-relaxed text-muted-foreground">
                            {data.scope || '...'}
                        </p>
                    </div>

                    {/* Upsells Preview */}
                    {data.upsell_options && data.upsell_options.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-border/40">
                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">Opcionais Sugeridos</p>
                            <ul className="space-y-2">
                                {data.upsell_options.map((u, i) => (
                                    <li key={i} className="text-sm italic text-muted-foreground flex justify-between">
                                        <span>{u.title}</span>
                                        <span>+ R$ {u.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- Main Chat Component ---
export default function ChatInterface() {
    const [proposalData, setProposalData] = useState<Partial<ProposalData>>({})
    const [isFinished, setIsFinished] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Vercel AI SDK Hook
    // @ts-ignore - useChat types might be mismatching with @ai-sdk/react, forcing any for build
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        // api: '/api/chat', // Defaults to /api/chat
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: 'Olá. Sou seu consultor de vendas sênior. Vamos montar uma proposta irrecusável. Comece me dizendo: Quem é o cliente e qual o grande problema que você vai resolver para ele?'
            }
        ],
        onToolCall: ({ toolCall }: { toolCall: any }) => {
            if (toolCall.toolName === 'update_proposal') {
                const newData = toolCall.args as Partial<ProposalData>
                console.log('AI Extraction:', newData)
                setProposalData(prev => ({ ...prev, ...newData }))
                // Could show a toast here: "Updated Scope"
            }
        }
    } as any) as any

    const handleCreateProposal = async () => {
        setIsSaving(true)
        try {
            await createProposal(proposalData)
            // Redirect happens in action, or we push router here. 
            // The action uses revalidatePath but we might need explicit redirect
            window.location.href = '/dashboard' // Simple redirect for now
        } catch (e) {
            console.error(e)
            setIsSaving(false)
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#FDFDFD]">
            {/* Left: Chat Interaction */}
            <div className="w-1/2 flex flex-col relative border-r border-border/40">
                <div className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar">
                    <div className="space-y-8 max-w-2xl mx-auto">
                        {messages.map((m: any) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`
                                    max-w-[85%] p-6 text-lg font-serif leading-relaxed
                                    ${m.role === 'user'
                                        ? 'bg-black text-white rounded-t-3xl rounded-bl-3xl'
                                        : 'bg-secondary/30 text-foreground rounded-t-3xl rounded-br-3xl'}
                                `}>
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-secondary/30 p-6 rounded-t-3xl rounded-br-3xl flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div id="anchor" className="h-4"></div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-8 pb-12 bg-gradient-to-t from-background via-background to-transparent">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
                        <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Descreva o projeto..."
                            className="w-full bg-white border border-border/50 shadow-sm p-6 pr-20 text-lg font-serif placeholder:font-sans placeholder:text-sm placeholder:tracking-widest rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input}
                            className="absolute right-3 top-3 w-12 h-12 rounded-lg bg-black text-white hover:bg-black/90 flex items-center justify-center disabled:opacity-50"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="w-1/2 relative bg-[#FAFAFA]">
                <LivePreview data={proposalData} />

                {/* Generate Button Overlay */}
                <div className="absolute bottom-12 right-12">
                    <Button
                        onClick={handleCreateProposal}
                        disabled={isSaving}
                        className="h-16 px-10 text-sm tracking-[0.2em] uppercase font-bold shadow-2xl bg-black hover:bg-black/90 text-white rounded-none flex items-center gap-4 group"
                    >
                        {isSaving ? 'Gerando...' : 'Finalizar Proposta'}
                        <Sparkles className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

