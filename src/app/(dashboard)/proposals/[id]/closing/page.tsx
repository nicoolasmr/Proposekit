import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { markDepositPaid, createChangeRequest } from '@/app/actions/closing'
import { Check, Copy, ExternalLink, MessageCircle, DollarSign, FilePlus } from 'lucide-react'

// Simple helper to copy text (client component needed ideally, or just raw JS)
// Using server component for structure. Actions handled via form/buttons.

export default async function ClosingDashboard({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: proposal } = await supabase
        .from('proposals')
        .select(`
            *,
            proposal_events(*),
            change_requests(*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!proposal) notFound()

    const events = proposal.proposal_events || []
    // sorting events
    events.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const changeRequests = proposal.change_requests || []

    const status = proposal.status_v2 || 'draft'

    // WhatsApp Templates Logic
    // Based on status:
    let whatsappMessage = ''
    if (status === 'viewed') whatsappMessage = `Olá ${proposal.client_name}, vi que acessou a proposta. Ficou com alguma dúvida? Segue o link: https://proposekit.com/p/${proposal.share_id}`
    else if (status === 'approved' || status === 'awaiting_deposit') whatsappMessage = `Olá ${proposal.client_name}, parabéns pela decisão! Para iniciarmos, segue o link para pagamento da entrada: https://proposekit.com/p/${proposal.share_id}/deposit`
    else if (status === 'paid') whatsappMessage = `Olá ${proposal.client_name}, pagamento confirmado! Vamos agendar nosso Kickoff?`
    else whatsappMessage = `Olá ${proposal.client_name}, segue nossa proposta comercial: https://proposekit.com/p/${proposal.share_id}`

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

    return (
        <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12">
            <header className="flex justify-between items-center">
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Closing Kit</p>
                    <h1 className="text-4xl font-serif italic">{proposal.client_name}</h1>
                </div>
                <div className="flex gap-4">
                    <Link href={`/p/${proposal.share_id}`} target="_blank" className="text-sm border border-black/10 px-4 py-2 hover:bg-black hover:text-white transition-colors">
                        Ver Link Público
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Status Column */}
                <div className="space-y-8">
                    <div className="bg-white border border-black/10 p-8 space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Status Atual</p>
                        <p className="text-3xl font-serif italic">{status.toUpperCase().replace('_', ' ')}</p>
                        {status === 'awaiting_deposit' && (
                            <form action={async () => {
                                'use server'
                                await markDepositPaid(proposal.id)
                            }}>
                                <button className="w-full bg-green-700 text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-green-800">
                                    Marcar Pago (Manual)
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="bg-white border border-black/10 p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Follow-up Sugerido</p>
                        </div>
                        <p className="text-sm font-serif italic opacity-70 border-l-2 border-black/10 pl-4">
                            "{whatsappMessage}"
                        </p>
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center border border-black/10 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                            Abrir WhatsApp
                        </a>
                    </div>
                </div>

                {/* Timeline / Events */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white border border-black/10 p-8">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold mb-8">Histórico de Eventos</h3>
                        <div className="space-y-6 relative">
                            {/* Line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-black/5"></div>

                            {events.map((evt: any) => (
                                <div key={evt.id} className="flex gap-6 items-start">
                                    <div className="w-4 h-4 rounded-full bg-black/10 mt-1 relative z-10"></div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold uppercase tracking-widest">{evt.event.replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(evt.created_at).toLocaleString()}</p>
                                        {evt.meta && (
                                            <p className="text-xs font-mono opacity-50">{JSON.stringify(evt.meta)}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && <p className="text-sm italic opacity-40 pl-8">Nenhum evento registrado.</p>}
                        </div>
                    </div>

                    {/* Change Requests */}
                    <div className="bg-white border border-black/10 p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Change Requests (Aditivos)</h3>
                            {/* Create CR Button Placeholder (needs client modal) */}
                            {/* For MVP we can link to a new page or just show 'Coming Soon' if complex */}
                            {/* Or use a simple form action for 'Quick CR' */}
                            <form action={async (formData) => {
                                'use server'
                                const title = formData.get('title') as string
                                const reason = formData.get('reason') as string
                                const total = formData.get('total') as string

                                if (!title || !total) return

                                await createChangeRequest(proposal.id, {
                                    title,
                                    reason,
                                    added_total: parseFloat(total),
                                    added_scope: { description: 'Aditivo rápido' }
                                })
                            }} className="flex gap-2 items-end">
                                <div className="space-y-1">
                                    <input name="title" placeholder="Título Aditivo" className="border-b border-black/10 text-xs p-1" required />
                                    <input name="reason" placeholder="Motivo" className="border-b border-black/10 text-xs p-1" />
                                    <input name="total" placeholder="Valor" type="number" className="border-b border-black/10 text-xs p-1 w-20" required />
                                </div>
                                <button className="bg-black text-white p-2 text-xs">
                                    <FilePlus className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {changeRequests.map((cr: any) => (
                                <div key={cr.id} className="flex justify-between items-center border border-black/5 p-4 hover:bg-gray-50">
                                    <div>
                                        <p className="font-serif font-bold">{cr.title}</p>
                                        <p className="text-xs text-muted-foreground">Status: {cr.status}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-xs mb-2">R$ {cr.added_total}</p>
                                        <Link href={`/cr/${cr.share_id}`} target="_blank" className="text-[10px] uppercase underline">
                                            Link Público
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {changeRequests.length === 0 && <p className="text-sm italic opacity-40">Nenhum aditivo criado.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
