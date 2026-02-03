import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProposalPDF } from '@/components/ProposalPDF'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: proposal, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !proposal) {
        return new Response('Not found', { status: 404 })
    }

    // Check if user has credits or if proposal is already "paid"
    // For now, allow download if it exists (assuming it was created after paywall)

    const data = {
        client_name: proposal.client_name,
        service_description: proposal.service_description,
        project_value: `R$ ${proposal.project_value?.toLocaleString('pt-BR') || '0,00'}`,
        deadline: proposal.deadline,
        payment_conditions: proposal.payment_conditions,
        date: new Date(proposal.created_at).toLocaleDateString('pt-BR')
    }

    const stream = await renderToStream(<ProposalPDF data={data} />)

    // Convert stream to Response
    return new Response(stream as any, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="proposta-${proposal.client_name}.pdf"`,
        },
    })
}
