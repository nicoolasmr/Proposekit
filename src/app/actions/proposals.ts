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
            client_name: formData.client || 'Cliente não identificado',
            service_description: formData.service || 'Serviço não identificado',
            project_value: typeof formData.value === 'string'
                ? parseFloat(formData.value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0
                : formData.value,
            deadline: formData.deadline,
            payment_conditions: formData.payment,
            status: 'draft' // Initial state
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
