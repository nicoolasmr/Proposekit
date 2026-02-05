import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCard, Settings } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export async function DashboardHeader() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: credits } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single()

    const userInitials = user.email?.charAt(0).toUpperCase() || 'U'

    return (
        <header className="py-10 px-8 md:px-16 border-b border-border/40 flex justify-between items-center bg-background sticky top-0 z-40">
            <Link href="/dashboard" className="font-serif text-2xl tracking-tighter italic">
                PROPOSE<span className="font-sans font-bold not-italic">KIT</span>
            </Link>

            <div className="flex items-center gap-12">
                <div className="hidden md:flex items-center">
                    {credits?.balance && credits.balance > 0 ? (
                        <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold opacity-40">
                            {credits.balance === 1 ? '1 proposta gratuita disponível' : `${credits.balance} Propostas disponíveis`}
                        </span>
                    ) : (
                        <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold opacity-20">
                            Saldo de créditos esgotado
                        </span>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 p-0 border border-border/60">
                            <Avatar className="h-full w-full rounded-none">
                                <AvatarFallback className="bg-black text-white font-bold text-[10px] tracking-widest">{userInitials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 rounded-none p-4 border-border shadow-2xl" align="end">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 p-2">Sua Conta</DropdownMenuLabel>
                        <DropdownMenuItem className="p-3 font-serif italic cursor-pointer">
                            <CreditCard className="mr-3 h-4 w-4 opacity-40" /> Comprar Créditos
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-3 font-serif italic cursor-pointer">
                            <Settings className="mr-3 h-4 w-4 opacity-40" /> Configurações
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50 my-2" />
                        <div className="p-1">
                            <LogoutButton />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
