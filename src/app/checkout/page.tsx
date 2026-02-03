'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, CreditCard, ChevronRight, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createProposal } from '@/app/actions/proposals'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('temp-password-123')
    const [name, setName] = useState('')
    const supabase = createClient()

    const handleProcess = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            })

            if (authError) throw authError

            const pendingData = localStorage.getItem('pending_proposal')
            if (pendingData) {
                const parsedData = JSON.parse(pendingData)
                await createProposal(parsedData)
                localStorage.removeItem('pending_proposal')
            }

            setSuccess(true)
        } catch (err: any) {
            console.error(err)
            alert(err.message || 'Erro ao processar. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-background selection:bg-black selection:text-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-md w-full text-center space-y-12"
                >
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-12 h-12" />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute -right-2 -top-2 w-8 h-8 bg-black border-4 border-white rounded-full flex items-center justify-center"
                        >
                            <Zap className="w-4 h-4 text-white" />
                        </motion.div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-serif tracking-tighter">Autoridade concedida.</h1>
                        <p className="text-muted-foreground font-serif text-xl italic opacity-60">
                            "Sua proposta foi processada e está pronta para fechar o negócio."
                        </p>
                    </div>
                    <Link href="/dashboard" className="block">
                        <Button size="lg" className="premium-button w-full h-16 group">
                            Ir para o Dashboard <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background selection:bg-black selection:text-white">
            {/* Left Column: Context & Brand */}
            <div className="lg:w-1/2 p-12 md:p-24 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary rounded-full opacity-30 blur-[100px]"></div>

                <div className="relative z-10 space-y-24">
                    <Link href="/" className="font-serif text-3xl tracking-tighter hover:opacity-70 transition-opacity inline-block">
                        PROPOSE<span className="font-sans font-bold italic tracking-tight">KIT</span>
                    </Link>

                    <div className="space-y-12 max-w-lg">
                        <h2 className="text-6xl md:text-7xl font-serif tracking-tighter leading-tight">
                            A clareza gera confiança. <br /> A confiança gera <span className="italic">lucro</span>.
                        </h2>

                        <div className="space-y-8 py-12">
                            <div className="flex gap-6 items-start">
                                <CheckCircle2 className="w-6 h-6 mt-1 opacity-20" />
                                <div>
                                    <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Padrão Editorial</h3>
                                    <p className="font-serif text-lg text-muted-foreground italic">Sua proposta organizada em um layout de alto impacto visual.</p>
                                </div>
                            </div>
                            <Separator className="bg-black/5" />
                            <div className="flex gap-6 items-start">
                                <CheckCircle2 className="w-6 h-6 mt-1 opacity-20" />
                                <div>
                                    <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Crédito Aplicado</h3>
                                    <p className="font-serif text-lg text-muted-foreground italic">Você está usando 1 crédito de boas-vindas. Custo zero hoje.</p>
                                </div>
                            </div>
                            <Separator className="bg-black/5" />
                            <div className="flex gap-6 items-start">
                                <CheckCircle2 className="w-6 h-6 mt-1 opacity-20" />
                                <div>
                                    <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Status Premium</h3>
                                    <p className="font-serif text-lg text-muted-foreground italic">Acesso total ao editor e dashboard de acompanhamento.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-[10px] font-sans uppercase tracking-[0.4em] text-muted-foreground font-bold opacity-40">
                    <Lock className="w-3 h-3" /> Encrypted Transaction Node
                </div>
            </div>

            {/* Right Column: Checkout Form */}
            <div className="lg:w-1/2 bg-secondary/30 p-12 md:p-24 flex items-center justify-center relative">
                <div className="max-w-md w-full space-y-16">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Label className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Identidade</Label>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Seu Nome Completo"
                                    className="input-minimal"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                                <input
                                    type="email"
                                    placeholder="E-mail Profissional"
                                    className="input-minimal"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <Label className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Segurança & Pagamento</Label>
                            <Card className="p-10 border-black rounded-none shadow-2xl space-y-8 bg-white">
                                <div className="flex items-center gap-6 border-b border-border pb-6 focus-within:border-black transition-colors">
                                    <CreditCard className="w-6 h-6 opacity-20" />
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className="bg-transparent outline-none w-full font-mono text-lg tracking-widest placeholder:opacity-20"
                                        maxLength={19}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="border-b border-border pb-6 focus-within:border-black transition-colors">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="bg-transparent outline-none w-full font-mono text-lg tracking-widest placeholder:opacity-20"
                                        />
                                    </div>
                                    <div className="border-b border-border pb-6 focus-within:border-black transition-colors">
                                        <input
                                            type="text"
                                            placeholder="CVC"
                                            className="bg-transparent outline-none w-full font-mono text-lg tracking-widest placeholder:opacity-20"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                        Total: <span className="text-black font-bold">R$ 0,00</span> (Crédito Aplicado)
                                    </p>
                                </div>
                            </Card>
                            <p className="text-[10px] text-muted-foreground italic text-center max-w-xs mx-auto leading-relaxed">
                                * Para garantir a integridade da plataforma, solicitamos a validação de um meio de pagamento. Nenhuma cobrança será efetuada agora.
                            </p>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="premium-button w-full h-20 text-sm group relative overflow-hidden"
                        onClick={handleProcess}
                        disabled={loading || !email || !name}
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2 group-hover:tracking-[0.2em] transition-all duration-500">
                                Finalizar e Liberar Acesso <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </Button>

                    <div className="flex justify-center gap-8 opacity-20 grayscale">
                        {/* Minimalist trust badge icons */}
                        <div className="h-6 w-12 bg-black/10"></div>
                        <div className="h-6 w-12 bg-black/10"></div>
                        <div className="h-6 w-12 bg-black/10"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
