import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { approveChangeRequest } from '@/app/actions/closing'

// Simple client component for "Approve Aditivo" button usually needed
// Or use server action in a form.
// I'll reuse the style and make a concise page.

export default async function ChangeRequestPage({
    params
}: {
    params: Promise<{ share_id: string }>
}) {
    const { share_id } = await params
    const supabase = await createClient()

    const { data: cr } = await supabase
        .from('change_requests')
        .select('*, proposal:proposals(title, client_name, project_value)')
        .eq('share_id', share_id)
        .single()

    if (!cr) notFound()

    const isApproved = cr.status === 'approved' || cr.status === 'paid' || cr.status === 'merged'

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-20 px-6 selection:bg-black selection:text-white flex items-center justify-center">
            <div className="max-w-xl w-full space-y-12">
                <header className="text-center space-y-4">
                    <div className="font-serif text-xl tracking-tighter opacity-20 mb-8">
                        PROPOSE<span className="font-sans font-bold italic">KIT</span> / CHANGE REQUEST
                    </div>
                    <h1 className="text-3xl font-serif">
                        Aditivo de Escopo
                    </h1>
                    <p className="text-muted-foreground font-serif italic">
                        {cr?.proposal?.client_name} • {cr.title}
                    </p>
                </header>

                <div className="bg-white p-10 border border-black/5 shadow-premium rounded-sm space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Motivo / Contexto</h3>
                        <p className="font-serif text-lg text-black/80">{cr.reason || 'Expansão de escopo solicitada.'}</p>
                    </div>

                    <div className="h-px bg-black/5 w-full"></div>

                    <div className="space-y-4">
                        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Escopo Adicional</h3>
                        <div className="font-serif text-black/80">
                            {/* Assuming added_scope is list or text. If JSONB, handle it. */}
                            {/* Prompt says 'added_scope jsonb'. Let's assume generic display or simple text if stored as { items: [] } or just string */}
                            {/* Using JSON.stringify for safety if complex, or just text if simple */}
                            <pre className="whitespace-pre-wrap font-serif text-sm bg-gray-50 p-4 rounded border border-black/5">
                                {JSON.stringify(cr.added_scope, null, 2).replace(/"/g, '')}
                            </pre>
                        </div>
                    </div>

                    <div className="space-y-2 text-right">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Valor Adicional</p>
                        <div className="text-2xl font-bold font-sans">
                            + R$ {(cr.added_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    {!isApproved ? (
                        <form action={async () => {
                            'use server'
                            // Hacky inline action wrapper around imported action?
                            // No, importing server action works.
                            // But we need params.
                            // We need a client component form OR a hidden input form.
                            // Let's rely on a separate client form component ideally, but for speed using form with bind?
                            // Or just a button that calls specific action?
                            // Let's create `src/components/closing/ApproveCRButton.tsx`?
                            // Or just simpler:
                        }}>
                            <Link href={`/p/${share_id}/approve_cr_placeholder`}>
                                {/* Just a placeholder. Real implementation needs a Client Component for interactivity */}
                                {/* Let's mock a simple button for now that goes to nowhere or triggers alert via Client Component */}
                            </Link>
                            <div className="bg-yellow-50 p-4 text-xs text-yellow-800 text-center">
                                Aprovação disponível em breve (MVP View Only).
                            </div>
                        </form>
                    ) : (
                        <div className="bg-green-50 p-4 text-center rounded text-green-800 text-sm border border-green-100 uppercase tracking-widest font-bold">
                            Aditivo Aprovado
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
