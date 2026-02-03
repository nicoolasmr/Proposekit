'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-black selection:text-white">
            <header className="py-12 px-12 text-center md:text-left">
                <Link href="/" className="font-serif text-2xl tracking-tighter hover:opacity-70 transition-opacity">
                    PROPOSE<span className="font-sans font-bold italic tracking-tight">KIT</span>
                </Link>
            </header>

            <main className="flex-grow flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-16">
                    <div className="text-center space-y-6">
                        <div className="w-12 h-12 border border-black/10 flex items-center justify-center mx-auto">
                            <Shield className="w-5 h-5 opacity-20" />
                        </div>
                        <h1 className="text-5xl font-serif tracking-tighter">Retomar autoridade.</h1>
                        <p className="text-muted-foreground font-serif italic text-xl opacity-60">
                            Gerencie seus negócios com precisão.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-12">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-6 text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Acesso</Label>
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    className="input-minimal"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Senha</Label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-minimal font-mono tracking-widest"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="premium-button w-full h-20 flex items-center justify-center gap-4 group"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>Entrar no Console <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>
                            )}
                        </Button>
                    </form>

                    <footer className="text-center space-y-8">
                        <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground">
                            Novo por aqui?{' '}
                            <Link href="/" className="text-black font-bold hover:underline">Sua primeira proposta é por nossa conta</Link>
                        </p>
                        <div className="h-px bg-border max-w-[40px] mx-auto"></div>
                        <p className="text-[10px] text-muted-foreground opacity-30 tracking-[0.4em]">PROPOSEKIT CORE</p>
                    </footer>
                </div>
            </main>
        </div>
    )
}
