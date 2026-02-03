'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProposal(formData: any) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Check credits
    const { data: credits } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single()

    if (!credits || credits.balance < 1) {
        throw new Error('Insufficient credits')
    }

    // Create proposal
    const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .insert({
            user_id: user.id,
            client_name: formData.client,
            service_description: formData.service,
            project_value: parseFloat(formData.value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0,
            deadline: formData.deadline,
            payment_conditions: formData.payment,
            status: 'completed'
        })
        .select()
        .single()

    if (proposalError) throw proposalError

    // Deduct credit
    const { error: creditError } = await supabase
        .from('credits')
        .update({ balance: credits.balance - 1 })
        .eq('user_id', user.id)

    if (creditError) throw creditError

    revalidatePath('/dashboard')
    return proposal
}
