'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ChevronRight, Loader2, ShieldCheck, Zap, CreditCard, Mail, User, Check } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createProposal } from '@/app/actions/proposals'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import StripeForm from '@/components/StripeForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [proposalId, setProposalId] = useState<string | null>(null)
    const [step, setStep] = useState<'auth' | 'billing' | 'success'>('auth')

    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user)
                setStep('billing')
                prepareProposal(user.id)
            }
        })
    }, [])

    const prepareProposal = async (userId: string) => {
        const pendingData = localStorage.getItem('pending_proposal')
        if (pendingData) {
            try {
                const parsedData = JSON.parse(pendingData)
                const newProposal = await createProposal({ ...parsedData, user_id: userId })
                setProposalId(newProposal.id)
                localStorage.removeItem('pending_proposal')

                // Get Stripe SetupIntent after creating proposal
                fetchClientSecret()
            } catch (e) {
                console.error('Error migrating proposal:', e)
            }
        }
    }

    const fetchClientSecret = async () => {
        const res = await fetch('/api/billing/setup', { method: 'POST' })
        const data = await res.json()
        if (data.clientSecret) {
            setClientSecret(data.clientSecret)
        }
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
            })
            if (error) throw error
            setUser(authData.user)
            setStep('billing')
            await prepareProposal(authData.user!.id)
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRelease = async () => {
        if (!proposalId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/proposals/${proposalId}/release`, { method: 'POST' })
            const data = await res.json()
            if (data.success) {
                toast.success('PDF gerado com sucesso.')
                setStep('success')
            } else {
                toast.error(data.error || 'Algo deu errado. Tente novamente.')
            }
        } catch (err) {
            toast.error('Algo deu errado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-background">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full text-center space-y-8">
                    <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto">
                        <Check className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-serif">Sua proposta está pronta para envio.</h1>
                    <p className="text-muted-foreground italic font-serif">O PDF foi gerado e está disponível no seu dashboard.</p>
                    <Link href="/dashboard" className="block">
                        <Button className="premium-button w-full h-16">Ir para o Dashboard</Button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background selection:bg-black selection:text-white">
            {/* Branding Column */}
            <div className="lg:w-1/2 p-12 md:p-24 flex flex-col justify-between border-r border-border bg-white relative">
                <div className="space-y-24">
                    <Link href="/" className="font-serif text-3xl tracking-tighter">
                        PROPOSE<span className="font-sans font-bold italic">KIT</span>
                    </Link>
                    <div className="space-y-8">
                        <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight">
                            Transforme uma conversa em uma proposta pronta.
                        </h2>
                        <p className="text-xl text-muted-foreground font-serif italic opacity-60">
                            Faltam poucos passos para você ter seu PDF em mãos.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Column */}
            <div className="lg:w-1/2 bg-secondary/10 p-12 md:p-24 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <AnimatePresence mode="wait">
                        {step === 'auth' ? (
                            <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-serif italic text-balance">Crie sua conta para liberar a proposta.</h3>
                                    <p className="text-sm text-muted-foreground">O acesso oficial requer uma identidade validada.</p>
                                </div>
                                <form onSubmit={handleAuth} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input type="text" placeholder="Nome Completo" className="input-minimal" value={name} onChange={e => setName(e.target.value)} required />
                                        </div>
                                        <div className="relative">
                                            <input type="email" placeholder="E-mail" className="input-minimal" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="relative">
                                            <input type="password" placeholder="Senha" className="input-minimal" value={password} onChange={e => setPassword(e.target.value)} required />
                                        </div>
                                    </div>
                                    <Button className="w-full premium-button h-16" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : 'Continuar'}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                <div className="space-y-6 text-center">
                                    <h3 className="text-3xl font-serif">Libere sua proposta completa.</h3>
                                    <p className="text-muted-foreground font-serif italic">
                                        Para acessar o PDF final da sua proposta, confirme seus dados de pagamento.
                                        Você tem 1 proposta gratuita. Nenhuma cobrança será feita agora.
                                    </p>
                                </div>

                                {clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <StripeForm clientSecret={clientSecret} onSuccess={handleRelease} />
                                    </Elements>
                                ) || (
                                        <div className="h-60 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-muted-foreground opacity-20" />
                                        </div>
                                    )}

                                <div className="pt-6 border-t border-border space-y-4">
                                    <div className="flex items-center gap-3 justify-center text-[10px] uppercase tracking-widest font-bold opacity-40">
                                        <ShieldCheck className="w-4 h-4" />
                                        Seus dados estão protegidos.
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic text-center">
                                        Você só será cobrado se usar créditos adicionais. Nenhuma taxa de assinatura ou oculta.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
