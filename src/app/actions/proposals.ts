'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProposal(formData: any) {
    const supabase = await createClient()

    // Support passing user_id explicitly during migration from local storage
    let userId = formData.user_id

    if (!userId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')
        userId = user.id
    }

    // Create proposal as 'draft'
    const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .insert({
            user_id: userId,
            status: 'draft', // Initial state
            // Superprompt 06 Fields
            client_name: formData.client_name || formData.client || 'Cliente não identificado', // Fallback for transition
            service_description: formData.title || formData.service || 'Serviço não identificado', // Title maps to service_description or new title column
            title: formData.title,
            objective: formData.objective,
            urgency_reason: formData.urgency_reason,
            cost_of_inaction: formData.cost_of_inaction,
            previous_attempts: formData.previous_attempts,
            scope: formData.scope,
            out_of_scope: formData.out_of_scope,
            revisions: formData.revisions,
            decision_maker: formData.decision_maker,
            communication: formData.communication,
            dependencies: formData.dependencies,
            project_value: typeof formData.value === 'string'
                ? parseFloat(formData.value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0
                : formData.value,
            payment_conditions: formData.payment_terms || formData.payment, // Map payment_terms to payment_conditions
            deadline: formData.timeline || formData.deadline, // Map timeline to deadline if needed, or separate columns

            // Closing Kit Fields
            mode: formData.mode || 'proposal',
            closing_enabled: formData.closing_enabled || false,
            deposit_required: formData.deposit_required || false,
            deposit_type: formData.deposit_type || 'percent',
            deposit_value: formData.deposit_value,
            pix_key: formData.pix_key,
            pix_receiver_name: formData.pix_receiver_name,
            pix_receiver_document: formData.pix_receiver_document,
            status_v2: 'draft',
            public_title: formData.public_title || formData.title
        })
        .select()
        .single()

    if (proposalError) {
        console.error('Proposal Error:', proposalError)
        throw proposalError
    }

    revalidatePath('/dashboard')
    return proposal
}
