import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProposalPDF } from '@/components/ProposalPDF'
import { generateProposalText } from '@/lib/proposal-engine'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // 1. Get proposal and check status
        const { data: proposal, error } = await supabase
            .from('proposals')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !proposal) {
            return new Response('Proposta não encontrada', { status: 404 })
        }

        // 2. Strict check: only 'released' proposals can generate/download PDF
        if (proposal.status !== 'released') {
            return new Response('Acesso negado. Esta proposta ainda não foi liberada.', { status: 403 })
        }

        // 3. Try to get from Storage first
        const storagePath = `${proposal.user_id}/${id}.pdf`
        const { data: existingFile } = await supabase.storage
            .from('proposals')
            .download(storagePath)

        if (existingFile) {
            return new Response(existingFile, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="proposta-${proposal.client_name}.pdf"`,
                },
            })
        }

        // 4. Generate formatted text using the Engine
        // Casting props to 'any' temporarily because typescript definitions of 'proposals' table 
        // might not be updated yet with the new columns, but we assume the data is there or null.
        const content = generateProposalText(proposal as any)

        // 5. Generate new PDF
        const stream = await renderToStream(
            <ProposalPDF
                content={content}
                clientName={proposal.client_name}
            />
        )

        return new Response(stream as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="proposta-${proposal.client_name}.pdf"`,
            },
        })
    } catch (err) {
        console.error('PDF Gen Error:', err)
        return new Response('Internal Server Error', { status: 500 })
    }
}
