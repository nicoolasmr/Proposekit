import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Plus, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: proposals } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: credits } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single()

    return (
        <main className="flex-grow p-8 md:p-24 max-w-6xl mx-auto w-full">
            {/* Dashboard Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-32">
                <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Console de Gestão</span>
                    <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none italic">
                        Olá, {user.email?.split('@')[0]}.
                    </h1>
                    <p className="text-2xl text-muted-foreground font-serif italic opacity-60">
                        Acompanhe sua autoridade e o status das suas negociações.
                    </p>
                </div>
                <Link href="/new">
                    <Button variant="premium" size="lg" className="h-20 px-12">
                        <Plus className="w-5 h-5 mr-3" /> Nova Proposta
                    </Button>
                </Link>
            </div>

            {/* Editorial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-border/40 border border-border/40 mb-32">
                <div className="bg-background p-12 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Propostas Emitidas</p>
                    <p className="text-5xl font-serif italic tracking-tight">{proposals?.length || 0}</p>
                </div>
                <div className="bg-background p-12 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Interações</p>
                    <p className="text-5xl font-serif italic tracking-tight">0</p>
                </div>
                <div className="bg-black text-white p-12 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Saldo Disponível</p>
                    <p className="text-5xl font-serif italic tracking-tight">{credits?.balance || 0}</p>
                </div>
            </div>

            {/* Proposals List */}
            <div className="space-y-12">
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 mb-8 pb-4 border-b border-border/40">Recentes</h2>

                {!proposals || proposals.length === 0 ? (
                    <div className="py-40 text-center border border-dashed border-border/60 flex flex-col items-center">
                        <p className="text-2xl mb-12 font-serif italic opacity-30">Nenhuma proposta estruturada ainda.</p>
                        <Link href="/new">
                            <Button variant="premium-outline">Criar primeira proposta</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-0 border-t border-border/40">
                        {proposals.map((proposal) => (
                            <div key={proposal.id} className="group border-b border-border/40 hover:bg-secondary/20 p-12 flex flex-col md:flex-row justify-between items-center gap-12 transition-colors">
                                <div className="flex gap-12 items-center w-full md:w-auto">
                                    <div className="w-20 h-20 bg-white border border-border/60 flex items-center justify-center grayscale opacity-30 group-hover:opacity-100 transition-all">
                                        <FileText className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-serif italic tracking-tight group-hover:underline underline-offset-8 decoration-1">{proposal.service_description}</h3>
                                        <p className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40">Cliente: {proposal.client_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-16">
                                    <div className="text-right hidden lg:block border-l border-border/40 pl-16">
                                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-20 mb-2">Valor</p>
                                        <p className="text-3xl font-serif italic tracking-tighter opacity-80">R$ {proposal.project_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {proposal.status === 'released' ? (
                                            <div className="flex gap-2">
                                                <Link href={`/p/${proposal.share_id}`} target="_blank">
                                                    <Button variant="outline" size="icon" className="h-14 w-14">
                                                        <Eye className="w-5 h-5" />
                                                    </Button>
                                                </Link>
                                                <a href={`/api/proposals/${proposal.id}/pdf`}>
                                                    <Button variant="outline" size="icon" className="h-14 w-14">
                                                        <Download className="w-5 h-5" />
                                                    </Button>
                                                </a>
                                                <Link href={`/proposals/${proposal.id}/closing`}>
                                                    <Button variant="premium" className="h-14 px-8 text-[10px]">
                                                        Gerenciar (Closing)
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-8">
                                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 whitespace-nowrap">
                                                    {proposal.status === 'draft' ? 'Rascunho' : 'Bloqueado'}
                                                </span>
                                                {credits?.balance && credits.balance > 0 ? (
                                                    <Link href="/checkout">
                                                        <Button variant="premium" className="h-14 px-10">
                                                            Liberar
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Link href="/checkout">
                                                        <Button variant="premium-outline" className="h-14 px-10">
                                                            Adquirir
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
