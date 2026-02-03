import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus, Eye, Download, Share2, MoreHorizontal, Settings, CreditCard, ChevronRight } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

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

    const userInitials = user.email?.charAt(0).toUpperCase() || 'U'

    return (
        <div className="min-h-screen bg-background flex flex-col selection:bg-black selection:text-white">
            {/* Dashboard Header */}
            <header className="py-6 px-8 md:px-16 border-b border-border flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40">
                <Link href="/" className="font-serif text-2xl tracking-tighter flex items-center gap-2">
                    PROPOSE<span className="font-sans font-bold italic tracking-tight">KIT</span>
                </Link>

                <div className="flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold opacity-60">
                            {credits?.balance || 0} Créditos
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-border">
                                <Avatar className="h-full w-full rounded-full">
                                    <AvatarFallback className="bg-black text-white font-bold text-xs">{userInitials}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-none p-2 border-border shadow-2xl" align="end" forceMount>
                            <DropdownMenuLabel className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground p-2">Sua Conta</DropdownMenuLabel>
                            <DropdownMenuItem className="p-3 font-serif cursor-pointer">
                                <CreditCard className="mr-3 h-4 w-4" /> Comprar Créditos
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-3 font-serif cursor-pointer">
                                <Settings className="mr-3 h-4 w-4" /> Configurações
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <div className="p-1">
                                <LogoutButton />
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <main className="flex-grow p-8 md:p-16 max-w-7xl mx-auto w-full">
                {/* TOP BAR */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
                    <div className="space-y-4">
                        <div className="inline-block border border-black/10 px-3 py-1">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold">Resumo da Conta</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif tracking-tighter leading-none">
                            Bem-vindo, <br /> {user.email?.split('@')[0]}.
                        </h1>
                        <p className="text-xl text-muted-foreground font-serif italic opacity-60">
                            Gerencie suas propostas e acompanhe o status dos seus contratos.
                        </p>
                    </div>
                    <Link href="/">
                        <Button size="lg" className="premium-button h-16 group">
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" /> Nova Proposta
                        </Button>
                    </Link>
                </div>

                {/* STATS (Optional visual flair) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    <div className="border border-border p-8 bg-white space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-muted-foreground">Total Gerado</p>
                        <p className="text-3xl font-serif tracking-tight">{proposals?.length || 0}</p>
                    </div>
                    <div className="border border-border p-8 bg-white space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-muted-foreground">Visualizações</p>
                        <p className="text-3xl font-serif tracking-tight">0</p>
                    </div>
                    <div className="border border-border p-8 bg-white space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-muted-foreground">Aprovadas</p>
                        <p className="text-3xl font-serif tracking-tight">0</p>
                    </div>
                    <div className="border border-border p-8 bg-black text-white space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-white/40">Créditos</p>
                        <p className="text-3xl font-serif tracking-tight">{credits?.balance || 0}</p>
                    </div>
                </div>

                <Separator className="bg-border/50 mb-12" />

                {/* LIST */}
                <div className="space-y-12">
                    {!proposals || proposals.length === 0 ? (
                        <div className="py-40 text-center border-2 border-dashed border-border flex flex-col items-center">
                            <FileText className="w-16 h-16 mb-8 opacity-5" />
                            <h3 className="text-2xl mb-4 font-serif italic">Nenhuma proposta enviada ainda.</h3>
                            <p className="text-muted-foreground mb-12 max-w-sm mx-auto">Sua próxima grande vitória começa com o primeiro passo no chat.</p>
                            <Link href="/">
                                <Button variant="outline" className="premium-button-outline">Começar agora</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-1">
                            {proposals.map((proposal) => (
                                <div key={proposal.id} className="group bg-white border border-border mt-[-1px] transition-[background-color] hover:bg-secondary/50 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden content-auto">
                                    <div className="flex gap-10 items-center w-full md:w-auto">
                                        <div className="w-16 h-16 bg-secondary flex items-center justify-center text-muted-foreground shrink-0 border border-border group-hover:scale-110 transition-transform">
                                            <FileText className="w-8 h-8 opacity-20" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl md:text-3xl font-serif tracking-tight text-foreground/90 group-hover:underline underline-offset-8 transition-all">{proposal.service_description}</h3>
                                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Cliente: {proposal.client_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-12">
                                        <div className="text-right border-r border-border pr-12 hidden lg:block">
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-muted-foreground mb-1">Investimento</p>
                                            <p className="text-2xl font-serif tracking-tight">R$ {proposal.project_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Link href={`/p/${proposal.share_id}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none hover:bg-black hover:text-white transition-all border border-transparent hover:border-black">
                                                    <Eye className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <a href={`/api/proposals/${proposal.id}/pdf`}>
                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none hover:bg-black hover:text-white transition-all border border-transparent hover:border-black">
                                                    <Download className="w-5 h-5" />
                                                </Button>
                                            </a>
                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none border border-black group-hover:bg-black group-hover:text-white transition-all">
                                                <Share2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-20 border-t border-border mt-20">
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center text-[10px] font-sans uppercase tracking-[0.4em] text-muted-foreground font-bold">
                    <p>PROPOSEKIT PREMIUM LICENSE</p>
                    <p className="opacity-30 tracking-[1em]">MDXXVI</p>
                    <p>&copy; 2026</p>
                </div>
            </footer>
        </div>
    )
}
