'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { acceptProposal } from '@/app/actions/closing'

export default function AcceptanceForm({
    proposalId,
    shareId
}: {
    proposalId: string
    shareId: string
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await acceptProposal(proposalId, { name, email, role })
            if (result.success) {
                // Determine redirect based on result or shared logic
                if (result.newStatus === 'awaiting_deposit') {
                    router.push(`/p/${shareId}/deposit`)
                } else {
                    router.push(`/p/${shareId}?success=true`) // Back to proposal with success message
                }
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao processar aceite. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Nome Completo</label>
                    <input
                        required
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-transparent border-b border-black/10 py-2 focus:outline-none focus:border-black transition-colors font-serif text-lg placeholder:text-black/20"
                        placeholder="Ex: João Silva"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Corporativo</label>
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-black/10 py-2 focus:outline-none focus:border-black transition-colors font-serif text-lg placeholder:text-black/20"
                        placeholder="joao@empresa.com"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Cargo (Opcional)</label>
                    <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-transparent border-b border-black/10 py-2 focus:outline-none focus:border-black transition-colors font-serif text-lg placeholder:text-black/20"
                        placeholder="CEO, Diretor..."
                    />
                </div>
            </div>

            <div className="pt-8">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] font-bold uppercase hover:bg-black/90 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Processando...' : 'Assinar e Aprovar Proposta'}
                </button>
                <p className="text-center text-[10px] text-muted-foreground mt-4 opacity-50">
                    Ao clicar, você concorda legalmente com os termos desta proposta.
                </p>
            </div>
        </form>
    )
}
