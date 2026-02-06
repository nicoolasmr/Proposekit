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
        <div className="h-full bg-gradient-to-br from-slate-50 to-white p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-3 pb-6 border-b border-slate-200">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-400">
                        Rascunho em Tempo Real
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {data.title || <span className="text-slate-300">Título do Projeto...</span>}
                    </h2>
                    <p className="text-sm font-medium text-slate-600">
                        Para: {data.client_name || <span className="text-slate-300">Nome do Cliente</span>}
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                            Investimento
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                            {data.project_value ? `R$ ${data.project_value}` : <span className="text-slate-300">---</span>}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                            Prazo
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                            {data.deadline || <span className="text-slate-300">---</span>}
                        </p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {/* Objective */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-3">
                            Objetivo Central
                        </p>
                        <p className="text-base leading-relaxed text-slate-700">
                            {data.objective || <span className="text-slate-300">Aguardando informações...</span>}
                        </p>
                    </div>

                    {/* Pain & Urgency */}
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-700 mb-3">
                            Dor & Urgência
                        </p>
                        <p className="text-base leading-relaxed text-amber-900">
                            {data.cost_of_inaction || <span className="text-amber-300">Aguardando informações...</span>}
                        </p>
                    </div>

                    {/* Scope */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-3">
                            Escopo
                        </p>
                        <p className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
                            {data.scope || <span className="text-slate-300">Aguardando informações...</span>}
                        </p>
                    </div>

                    {/* Upsells */}
                    {data.upsell_options && data.upsell_options.length > 0 && (
                        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 mb-4">
                                Opcionais Sugeridos
                            </p>
                            <ul className="space-y-3">
                                {data.upsell_options.map((u, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-emerald-900">{u.title}</span>
                                        <span className="font-bold text-emerald-700">+ R$ {u.value}</span>
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
            const proposal = await createProposal(proposalData)
            // Redirect to proposals list
            window.location.href = '/dashboard/proposals'
        } catch (e) {
            console.error('Error creating proposal:', e)
            alert('Erro ao criar proposta. Por favor, tente novamente.')
            setIsSaving(false)
        }
    }

    return (
        <div className="flex h-full overflow-hidden bg-slate-50">
            {/* Left: Chat Interaction */}
            <div className="w-1/2 flex flex-col relative bg-white border-r border-slate-200">
                {/* Chat Header */}
                <div className="px-8 py-6 border-b border-slate-100 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Consultor AI</h3>
                                <p className="text-xs text-slate-500">Modo Agressivo Ativado</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                            Alpha
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                    {messages.map((m: any) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[80%] px-5 py-4 rounded-2xl
                                ${m.role === 'user'
                                    ? 'bg-slate-900 text-white rounded-br-sm'
                                    : 'bg-slate-100 text-slate-900 rounded-bl-sm border border-slate-200'}
                            `}>
                                <p className="text-[15px] leading-relaxed">{m.content}</p>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 px-5 py-4 rounded-2xl rounded-bl-sm border border-slate-200 flex gap-1.5">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div id="anchor" className="h-1"></div>
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="px-8 py-6 bg-white border-t border-slate-100">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Digite sua resposta..."
                            className="w-full bg-slate-50 border border-slate-200 shadow-sm px-5 py-4 pr-14 text-[15px] placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input}
                            className="absolute right-2 top-2 w-10 h-10 rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="w-1/2 relative flex flex-col">
                <LivePreview data={proposalData} />

                {/* Generate Button - Fixed at bottom right */}
                <div className="absolute bottom-8 right-8">
                    <Button
                        onClick={handleCreateProposal}
                        disabled={isSaving}
                        className="h-14 px-8 text-sm tracking-wider uppercase font-bold shadow-xl bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-3 group transition-all hover:shadow-2xl"
                    >
                        {isSaving ? 'Gerando...' : 'Finalizar Proposta'}
                        <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

