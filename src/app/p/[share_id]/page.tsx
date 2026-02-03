import { createClient } from '@/lib/supabase/server'
import ProposalPreview from '@/components/ProposalPreview'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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

    // 2. Security Check: Only 'released' proposals are visible publicly in high authority link
    if (proposal.status !== 'released') {
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

    const previewData = {
        service: proposal.service_description,
        client: proposal.client_name,
        value: `R$ ${proposal.project_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`,
        deadline: proposal.deadline,
        payment: proposal.payment_conditions
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-20 px-6 selection:bg-black selection:text-white">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex justify-between items-center mb-16">
                    <div className="font-serif text-xl tracking-tighter opacity-20">
                        PROPOSE<span className="font-sans font-bold italic">KIT</span>
                    </div>
                    <a
                        href={`/api/proposals/${proposal.id}/pdf`}
                        className="premium-button text-[10px] tracking-[0.2em]"
                    >
                        BAIXAR PDF (4K)
                    </a>
                </header>

                <ProposalPreview data={previewData} />

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
