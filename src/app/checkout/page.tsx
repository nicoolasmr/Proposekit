'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ShieldCheck, Check } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createProposal } from '@/app/actions/proposals'
import { Button } from '@/components/ui/button'
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
                toast.success('PDF estruturado com sucesso.')
                setStep('success')
            } else {
                toast.error(data.error || 'Algo deu errado.')
            }
        } catch (err) {
            toast.error('Algo deu errado.')
        } finally {
            setLoading(false)
        }
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-background">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center space-y-16">
                    <div className="w-24 h-24 bg-black flex items-center justify-center mx-auto">
                        <Check className="text-white w-10 h-10" />
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-5xl font-serif italic tracking-tighter leading-tight">Autoridade concedida.</h1>
                        <p className="text-xl text-muted-foreground italic font-serif opacity-60">Sua proposta está pronta para envio.</p>
                    </div>
                    <Link href="/dashboard" className="block pt-8">
                        <Button variant="premium" className="w-full h-20 text-base">Acessar Dashboard</Button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background selection:bg-black selection:text-white">
            {/* Minimal Branding Column */}
            <div className="lg:w-1/2 p-16 md:p-32 flex flex-col justify-between border-r border-border/40 bg-white relative">
                <div className="space-y-32">
                    <Link href="/" className="font-serif text-3xl tracking-tighter italic">
                        PROPOSE<span className="font-sans font-bold not-italic">KIT</span>
                    </Link>
                    <div className="space-y-12">
                        <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-[0.9] italic">
                            O acesso <br /> profissional <br /> começa aqui.
                        </h2>
                        <p className="text-2xl text-muted-foreground font-serif italic opacity-40">
                            Estruture seu valor com precisão técnica.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Column */}
            <div className="lg:w-1/2 bg-secondary/20 p-16 md:p-32 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <AnimatePresence mode="wait">
                        {step === 'auth' ? (
                            <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-20">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-serif italic text-balance tracking-tighter">Crie seu acesso.</h3>
                                    <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-30">Identidade validada necessária para emissão oficial.</p>
                                </div>
                                <form onSubmit={handleAuth} className="space-y-12">
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Nome</label>
                                            <input type="text" placeholder="Seu nome completo" className="input-minimal" value={name} onChange={e => setName(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">E-mail Corporativo</label>
                                            <input type="email" placeholder="nome@empresa.com" className="input-minimal" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Senha</label>
                                            <input type="password" placeholder="••••••••" className="input-minimal font-mono tracking-widest" value={password} onChange={e => setPassword(e.target.value)} required />
                                        </div>
                                    </div>
                                    <Button variant="premium" className="w-full h-20 text-base" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Continuar'}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-20">
                                <div className="space-y-8 text-center md:text-left">
                                    <h3 className="text-4xl font-serif italic tracking-tighter leading-tight">Protocolo <br /> de Acesso.</h3>
                                    <p className="text-muted-foreground font-serif italic text-xl opacity-60 leading-relaxed">
                                        Para liberar sua proposta completa em PDF, confirme seus dados de pagamento. <br />
                                        Você tem 1 proposta gratuita. Nenhuma cobrança será feita agora.
                                    </p>
                                </div>

                                {clientSecret && (
                                    <div className="bg-white border border-border/60 p-12">
                                        <Elements stripe={stripePromise} options={{
                                            clientSecret,
                                            appearance: {
                                                variables: {
                                                    colorPrimary: '#000000',
                                                    colorBackground: '#ffffff',
                                                    colorText: '#1e1e1e',
                                                    colorDanger: '#df1b41',
                                                    fontFamily: 'var(--font-geist-sans)',
                                                    spacingGridRow: '24px',
                                                },
                                                rules: {
                                                    '.Input': {
                                                        border: 'none',
                                                        borderBottom: '1px solid #e5e5e5',
                                                        borderRadius: '0',
                                                        padding: '12px 0',
                                                        boxShadow: 'none',
                                                        transition: 'border-color 0.2s',
                                                    },
                                                    '.Input:focus': {
                                                        borderBottom: '1px solid #000000',
                                                        boxShadow: 'none',
                                                    },
                                                    '.Label': {
                                                        fontSize: '10px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.4em',
                                                        fontWeight: '700',
                                                        opacity: '0.3',
                                                        marginBottom: '4px',
                                                    }
                                                }
                                            }
                                        }}>
                                            <StripeForm onSuccess={handleRelease} />
                                        </Elements>
                                    </div>
                                ) || (
                                        <div className="h-60 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-muted-foreground opacity-20 w-8 h-8" />
                                        </div>
                                    )}

                                <div className="pt-12 border-t border-border/40 space-y-6">
                                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] font-bold opacity-20">
                                        <ShieldCheck className="w-5 h-5" />
                                        Protocolo Stripe 256-bit
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic leading-relaxed opacity-50 font-serif">
                                        Seus dados de pagamento são usados apenas para garantir a integridade do sistema e futuras liberações de crédito.
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
