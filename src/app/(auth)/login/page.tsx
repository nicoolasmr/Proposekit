'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background selection:bg-black selection:text-white">
            {/* Branding Column */}
            <div className="lg:w-1/2 p-16 md:p-32 flex flex-col justify-between border-r border-border/40 bg-white">
                <div className="space-y-32">
                    <Link href="/" className="font-serif text-3xl tracking-tighter italic hover:opacity-70 transition-opacity">
                        PROPOSE<span className="font-sans font-bold not-italic">KIT</span>
                    </Link>
                    <div className="space-y-12">
                        <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-[0.9] italic">
                            Gestão de <br /> Autoridade.
                        </h1>
                        <p className="text-2xl text-muted-foreground font-serif italic opacity-40">
                            Acesse seu console de propostas.
                        </p>
                    </div>
                </div>
                <div className="text-[10px] uppercase tracking-[0.6em] text-muted-foreground font-bold opacity-30 pt-16">
                    PROPOSEKIT SECURE ACCESS PROTOCOL
                </div>
            </div>

            {/* Login Column */}
            <div className="lg:w-1/2 bg-secondary/20 p-16 md:p-32 flex items-center justify-center">
                <div className="max-w-md w-full space-y-20">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-serif italic tracking-tighter">Entrar no sistema.</h2>
                        <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-30">Controle total sobre suas negociações profissionais.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-16">
                        <div className="space-y-12">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">E-mail Corporativo</label>
                                <input
                                    type="email"
                                    placeholder="nome@empresa.com"
                                    className="input-minimal"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Senha</label>
                                    <Link href="#" className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-20 hover:opacity-100 transition-all">Recuperar</Link>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-minimal font-mono tracking-widest"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-12">
                            <Button variant="premium" className="w-full h-20 text-base" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Acessar Console'}
                            </Button>

                            <div className="text-center space-y-4">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-20">Ainda não possui acesso?</p>
                                <Link href="/" className="block">
                                    <Button variant="premium-outline" className="w-full h-16 text-xs">Criar Minha Primeira Proposta</Button>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
