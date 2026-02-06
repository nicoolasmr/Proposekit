'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, FileText, User, CreditCard, LogOut, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navigation = [
    { name: 'Chat AI', href: '/new', icon: MessageSquare },
    { name: 'Propostas', href: '/dashboard', icon: FileText },
    { name: 'Perfil', href: '/profile', icon: User },
    { name: 'Pagamento', href: '/billing', icon: CreditCard },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64">
            {/* Logo */}
            <div className="px-6 py-8 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">PROPOSEKIT</h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-slate-800 text-white shadow-lg'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }
                            `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all w-full"
                >
                    <LogOut className="w-5 h-5" />
                    Sair
                </button>
            </div>
        </div>
    )
}
