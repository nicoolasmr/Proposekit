import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DepositPage({
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

    // Only show if deposit is required and status is valid
    if (!proposal.deposit_required) {
        redirect(`/p/${share_id}`)
    }

    // Logic for deposit amount
    let depositAmount = 0
    if (proposal.deposit_type === 'percent') {
        depositAmount = (proposal.project_value || 0) * ((proposal.deposit_value || 0) / 100)
    } else {
        depositAmount = proposal.deposit_value || 0
    }

    const isPaid = proposal.status_v2 === 'paid' || proposal.status_v2 === 'kickoff'

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-20 px-6 flex items-center justify-center">
            <div className="w-full max-w-lg space-y-12">
                <header className="text-center space-y-4">
                    <div className="font-serif text-xl tracking-tighter opacity-20 mb-8">
                        PROPOSE<span className="font-sans font-bold italic">KIT</span> / FINANCIAL
                    </div>
                    <h1 className="text-3xl font-serif">
                        {isPaid ? 'Pagamento Confirmado' : 'Entrada do Projeto'}
                    </h1>
                    <p className="text-muted-foreground font-serif italic">
                        {isPaid
                            ? 'Obrigado! O pagamento da entrada foi registrado.'
                            : 'Para oficializar o início, realize o pagamento da entrada via Pix.'}
                    </p>
                </header>

                <div className="bg-white p-10 border border-black/5 shadow-premium rounded-sm space-y-8 text-center">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Valor da Entrada</p>
                        <div className="text-4xl font-bold font-sans">
                            R$ {depositAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    {!isPaid && (
                        <>
                            <div className="h-px bg-black/5 w-full"></div>

                            <div className="space-y-4">
                                <p className="text-sm font-serif italic text-black/60">
                                    Chave Pix ({proposal.pix_receiver_name || 'Beneficiário'})
                                </p>
                                <div className="bg-gray-50 p-4 rounded text-sm break-all font-mono select-all border border-black/5">
                                    {proposal.pix_key || 'Chave Pix não cadastrada'}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Copie a chave acima e realize o pagamento no seu banco.
                                </p>
                            </div>

                            {/* MVP: No automatic validation yet */}
                            <div className="bg-blue-50/50 p-4 rounded text-xs text-blue-800 border border-blue-100">
                                O comprovante deve ser enviado diretamente ao prestador para liberação do Kickoff.
                            </div>
                        </>
                    )}

                    {isPaid && (
                        <div className="bg-green-50 p-4 rounded text-green-800 text-sm border border-green-100">
                            Status: Pago • Aguardando Kickoff
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <Link href={`/p/${share_id}`} className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                        ← Voltar para a proposta
                    </Link>
                </div>
            </div>
        </div>
    )
}
