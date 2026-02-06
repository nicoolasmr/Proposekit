import { createClient } from '@/lib/supabase/server'
import ProposalPreview from '@/components/ProposalPreview'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { generateProposalText } from '@/lib/proposal-engine'

export default async function PublicProposalPage({
    params
}: {
    params: Promise<{ share_id: string }>
}) {
    const { share_id } = await params
    const supabase = await createClient()

    // 1. Find by share_id
    const { data: proposal, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('share_id', share_id)
        .single()

    if (error || !proposal) {
        notFound()
    }

    // 2. Security Check & Visibility
    const isReleased = proposal.status === 'released'
    // Closing Mode: visible if sent, viewed, approved, etc. (anything but draft?)
    const isClosingMode = proposal.mode === 'closing' // Or feature flag check if strictly enforced
    const isClosingVisible = isClosingMode && proposal.status_v2 && proposal.status_v2 !== 'draft'

    if (!isReleased && !isClosingVisible) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-8">
                <div className="max-w-md text-center space-y-6">
                    <h1 className="text-4xl font-serif">Acesso Restrito.</h1>
                    <p className="text-muted-foreground italic font-serif text-lg">
                        "Esta proposta está em fase de processamento interno."
                    </p>
                    <Link href="/">
                        <button className="premium-button text-[10px]">Página Inicial</button>
                    </Link>
                </div>
            </div>
        )
    }

    // 3. Log "view" event
    await supabase.from('proposal_events').insert({
        proposal_id: proposal.id,
        event_type: 'view',
        metadata: { source: 'public_link' }
    })

    // 4. Generate Content via Engine
    // Casting as any until DB migration confirms types
    const content = await generateProposalText(proposal as any, supabase)

    const statusV2 = proposal.status_v2

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-20 px-6 selection:bg-black selection:text-white">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex justify-between items-center mb-16">
                    <div className="font-serif text-xl tracking-tighter opacity-20">
                        PROPOSE<span className="font-sans font-bold italic">KIT</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        {isClosingMode && (statusV2 === 'sent' || statusV2 === 'viewed') && (
                            <Link href={`/p/${share_id}/approve`}>
                                <button className="bg-green-700 text-white px-6 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-green-800 transition-colors">
                                    Aprovar Proposta
                                </button>
                            </Link>
                        )}
                        {isClosingMode && statusV2 === 'awaiting_deposit' && (
                            <Link href={`/p/${share_id}/deposit`}>
                                <button className="bg-blue-700 text-white px-6 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-blue-800 transition-colors">
                                    Realizar Pagamento
                                </button>
                            </Link>
                        )}
                        {isClosingMode && (statusV2 === 'approved' || statusV2 === 'paid' || statusV2 === 'kickoff') && (
                            <div className="text-green-800 bg-green-50 px-4 py-2 text-[10px] tracking-[0.2em] font-bold uppercase border border-green-200">
                                APROVADA
                            </div>
                        )}

                        <a
                            href={`/api/proposals/${proposal.id}/pdf`}
                            className="premium-button text-[10px] tracking-[0.2em]"
                        >
                            BAIXAR PDF (4K)
                        </a>
                    </div>
                </header>

                <ProposalPreview content={content} clientName={proposal.client_name} />

                <footer className="text-center pt-32 pb-20">
                    <p className="text-muted-foreground text-sm font-serif italic mb-8 opacity-50">
                        Documento oficial gerado via ProposeKit Cloud.
                    </p>
                    <div className="h-px bg-black/5 w-12 mx-auto mb-12"></div>
                    <Link href="/" className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold hover:opacity-100 transition-opacity opacity-40">
                        ESTABELEÇA SUA AUTORIDADE COM PROPOSE<span className="italic">KIT</span>
                    </Link>
                </footer>
            </div>
        </div>
    )
}
