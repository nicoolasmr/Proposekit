'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start font-serif p-3 h-auto cursor-pointer rounded-none hover:bg-black hover:text-white transition-all"
        >
            <LogOut className="mr-3 h-4 w-4" /> Sair do Console
        </Button>
    )
}
