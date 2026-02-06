'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, User, LogOut, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Proposal {
    id: string
    title: string
    client_name: string
    created_at: string
}

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [userEmail, setUserEmail] = useState('')
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient()

            // Get user
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email || '')
            }

            // Get recent proposals
            const { data } = await supabase
                .from('proposals')
                .select('id, title, client_name, created_at')
                .order('created_at', { ascending: false })
                .limit(10)

            if (data) {
                setProposals(data)
            }
        }

        loadData()
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="flex flex-col h-full bg-background border-r border-border/40 w-64">
            {/* Logo */}
            <div className="px-8 py-8 border-b border-border/40">
                <h1 className="text-xl font-serif italic tracking-tight">PROPOSEKIT</h1>
            </div>

            {/* New Proposal Button */}
            <div className="px-6 py-6 border-b border-border/40">
                <Link href="/new">
                    <button className="w-full h-12 bg-black text-white hover:bg-black/90 transition-all flex items-center justify-center gap-2 text-sm tracking-widest uppercase font-bold">
                        <Plus className="w-4 h-4" />
                        Nova Proposta
                    </button>
                </Link>
            </div>

            {/* Recents Section */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 mb-4">Recentes</p>
                <div className="space-y-1">
                    {proposals.length === 0 ? (
                        <p className="text-sm italic opacity-40 py-8 text-center">
                            Nenhuma proposta ainda
                        </p>
                    ) : (
                        proposals.map((proposal) => (
                            <Link
                                key={proposal.id}
                                href={`/dashboard`}
                                className="block px-4 py-3 hover:bg-secondary/20 transition-colors rounded group"
                            >
                                <p className="text-sm font-serif italic truncate group-hover:underline underline-offset-4 decoration-1">
                                    {proposal.title || proposal.client_name || 'Sem título'}
                                </p>
                                <p className="text-[9px] uppercase tracking-wider opacity-30 mt-1">
                                    {new Date(proposal.created_at).toLocaleDateString('pt-BR')}
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Profile Footer */}
            <div className="px-6 py-6 border-t border-border/40 relative">
                <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-full flex items-center gap-3 hover:bg-secondary/20 p-3 rounded transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif italic text-lg">
                        {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium truncate">{userEmail.split('@')[0]}</p>
                        <p className="text-[9px] uppercase tracking-wider opacity-30">Conta</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                    <div className="absolute bottom-full left-6 right-6 mb-2 bg-white border border-border/40 shadow-lg rounded overflow-hidden">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors text-sm"
                            onClick={() => setShowProfileMenu(false)}
                        >
                            <User className="w-4 h-4" />
                            Perfil
                        </Link>
                        <Link
                            href="/billing"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors text-sm border-t border-border/40"
                            onClick={() => setShowProfileMenu(false)}
                        >
                            <FileText className="w-4 h-4" />
                            Pagamento
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors text-sm border-t border-border/40 text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
