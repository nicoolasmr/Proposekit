import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProposalPDF } from '@/components/ProposalPDF'
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

        // 4. Generate new PDF
        const pdfData = {
            client_name: proposal.client_name,
            service_description: proposal.service_description,
            project_value: `R$ ${proposal.project_value?.toLocaleString('pt-BR') || '0,00'}`,
            deadline: proposal.deadline,
            payment_conditions: proposal.payment_conditions,
            date: new Date(proposal.created_at).toLocaleDateString('pt-BR')
        }

        const stream = await renderToStream(<ProposalPDF data={pdfData} />)

        // Note: For background upload, we might need to convert stream to buffer anyway
        // but for the response, stream is fine.

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
