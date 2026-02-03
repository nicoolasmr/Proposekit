import { createClient } from '@/lib/supabase/server'
import ProposalPreview from '@/components/ProposalPreview'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function PublicProposalPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Find by share_id (which is used in the URL)
    const { data: proposal } = await supabase
        .from('proposals')
        .select('*')
        .eq('share_id', id)
        .single()

    if (!proposal) {
        notFound()
    }

    // Log "viewed" event
    await supabase.from('proposal_events').insert({
        proposal_id: proposal.id,
        event_type: 'viewed',
        metadata: { user_agent: 'client-view' }
    })

    const previewData = {
        service: proposal.service_description,
        client: proposal.client_name,
        value: `R$ ${proposal.project_value?.toLocaleString('pt-BR') || '0,00'}`,
        deadline: proposal.deadline,
        payment: proposal.payment_conditions
    }

    return (
        <div className="min-h-screen bg-[#F7F7F7] py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex justify-between items-center mb-12">
                    <div className="font-serif text-xl tracking-tighter opacity-30">
                        PROPOSE<span className="font-sans font-bold italic">KIT</span>
                    </div>
                    <a
                        href={`/api/proposals/${proposal.id}/pdf`}
                        className="premium-button text-[10px]"
                    >
                        Baixar PDF Oficial
                    </a>
                </header>

                <ProposalPreview data={previewData} />

                <footer className="text-center pt-20">
                    <p className="text-muted text-sm font-serif italic mb-8">
                        Dúvidas sobre esta proposta? Entre em contato com {proposal.user_id ? 'o prestador' : 'suporte'}.
                    </p>
                    <div className="h-px bg-[#e5e5e5] w-24 mx-auto mb-8"></div>
                    <Link href="/" className="text-[10px] font-sans uppercase tracking-[0.2em] hover:underline">
                        Crie propostas como esta com ProposeKit
                    </Link>
                </footer>
            </div>
        </div>
    )
}
