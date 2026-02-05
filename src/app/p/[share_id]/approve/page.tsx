import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AcceptanceForm from '@/components/closing/AcceptanceForm'

export default async function ApprovePage({
    params
}: {
    params: Promise<{ share_id: string }>
}) {
    const { share_id } = await params
    const supabase = await createClient()

    const { data: proposal } = await supabase
        .from('proposals')
        .select('*')
        .eq('share_id', share_id)
        .single()

    if (!proposal) notFound()

    // Assuming we only allow status 'draft' or 'sent' or 'viewed' to be approved.
    // If already approved, show message?
    // Using status_v2 logic
    const isApproved = proposal.status_v2 === 'approved' || proposal.status_v2 === 'paid' || proposal.status_v2 === 'awaiting_deposit' || proposal.status_v2 === 'kickoff'

    if (isApproved) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-8">
                <div className="max-w-md text-center space-y-6">
                    <h1 className="text-4xl font-serif">Proposta já aprovada.</h1>
                    <p className="text-muted-foreground italic font-serif text-lg">
                        Esta proposta já recebeu o aceite digital em {new Date(proposal.approved_at).toLocaleDateString()}.
                    </p>
                    <Link href={`/p/${share_id}`}>
                        <button className="premium-button text-[10px]">Ver Proposta</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-20 px-6 flex items-center justify-center">
            <div className="w-full max-w-lg space-y-12">
                <header className="text-center space-y-4">
                    <div className="font-serif text-xl tracking-tighter opacity-20 mb-8">
                        PROPOSE<span className="font-sans font-bold italic">KIT</span>
                    </div>
                    <h1 className="text-3xl font-serif">Aprovação Formal</h1>
                    <p className="text-muted-foreground font-serif italic">
                        {proposal.client_name} • {proposal.title || 'Proposta Comercial'}
                    </p>
                    <div className="text-2xl font-bold font-sans">
                        R$ {proposal.project_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </header>

                <div className="bg-white p-8 border border-black/5 shadow-premium rounded-sm">
                    <AcceptanceForm proposalId={proposal.id} shareId={share_id} />
                </div>

                <div className="text-center">
                    <Link href={`/p/${share_id}`} className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                        ← Voltar para revisão
                    </Link>
                </div>
            </div>
        </div>
    )
}
