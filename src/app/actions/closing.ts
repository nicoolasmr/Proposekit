'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Public action to accept a proposal.
 * Can be called without user session (verified by shareId logic typically, or if proposalId is known and valid).
 */
export async function acceptProposal(proposalId: string, data: { name: string; email: string; role?: string }) {
    const supabase = await createClient()

    // 1. Create Acceptance Record
    const { error: acceptanceError } = await supabase
        .from('proposal_acceptances')
        .insert({
            proposal_id: proposalId,
            accepted_by_name: data.name,
            accepted_by_email: data.email,
            accepted_by_role: data.role,
            acceptance_ip: '0.0.0.0', // Ideally capture from headers if possible or pass from client
            accepted_at: new Date().toISOString()
        })

    if (acceptanceError) {
        console.error('Acceptance Error:', acceptanceError)
        throw new Error('Failed to record acceptance')
    }

    // 2. Update Proposal Status
    const { data: proposal } = await supabase.from('proposals').select('deposit_required').eq('id', proposalId).single()
    const newStatus = proposal?.deposit_required ? 'awaiting_deposit' : 'approved'

    await supabase
        .from('proposals')
        .update({
            status_v2: newStatus,
            approved_at: new Date().toISOString()
        })
        .eq('id', proposalId)

    // 3. Log Event
    await supabase.from('proposal_events').insert({
        proposal_id: proposalId,
        event: 'approved',
        meta: { source: 'web_acceptance', signer: data.email }
    })

    revalidatePath(`/p/${proposalId}`) // Note: Public route uses shareId usually
    return { success: true, newStatus }
}

/**
 * Provider action to mark a deposit as paid.
 */
export async function markDepositPaid(proposalId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Verify ownership via RLS or explicit check? RLS handles it for update usually.
    // But we need to update proposals status too.

    // 1. Update Deposits (if any exist, create one if not?)
    // The prompt says "Prestar pode 'Marcar como pago' -> deposits.status='paid'"
    // We assume a deposit record might exist or we just create/update a virtual one?
    // Let's create a deposit record if it doesn't exist, or update existing pending one.

    // Check for existing pending deposit
    const { data: deposits } = await supabase
        .from('deposits')
        .select('id')
        .eq('proposal_id', proposalId)
        .eq('status', 'pending')
        .limit(1)

    if (deposits && deposits.length > 0) {
        await supabase
            .from('deposits')
            .update({ status: 'paid', paid_at: new Date().toISOString() })
            .eq('id', deposits[0].id)
    } else {
        // Create a 'paid' record for history
        await supabase.from('deposits').insert({
            proposal_id: proposalId,
            status: 'paid',
            amount: 0, // Unknown amount if manual
            type: 'manual_mark',
            method: 'manual',
            paid_at: new Date().toISOString()
        })
    }

    // 2. Update Proposal Status
    await supabase.from('proposals').update({
        status_v2: 'paid',
        paid_at: new Date().toISOString()
    }).eq('id', proposalId).eq('user_id', user.id)

    // 3. Log Event
    await supabase.from('proposal_events').insert({
        proposal_id: proposalId,
        event: 'marked_paid',
        meta: { by: user.id }
    })

    revalidatePath(`/app/proposals/${proposalId}`)
    return { success: true }
}

/**
 * Provider action to create a Change Request.
 */
export async function createChangeRequest(proposalId: string, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Generate specific share_id if needed, or let DB default (we removed default)
    // We should generate one.
    const shareId = Math.random().toString(36).substring(2, 15)

    const { data: cr, error } = await supabase.from('change_requests').insert({
        user_id: user.id,
        proposal_id: proposalId,
        title: data.title,
        reason: data.reason,
        added_scope: data.added_scope,
        added_pricing: data.added_pricing,
        added_total: data.added_total,
        status: 'draft',
        share_id: shareId
    }).select().single()

    if (error) throw error

    // Log Event
    await supabase.from('proposal_events').insert({
        proposal_id: proposalId,
        event: 'change_request_created',
        meta: { cr_id: cr.id }
    })

    revalidatePath(`/app/proposals/${proposalId}`)
    return cr
}


/**
 * Public action to Approve Change Request
 */
export async function approveChangeRequest(shareId: string, data: { name: string; email: string }) {
    // 1. Find CR by shareId
    const supabase = await createClient()
    const { data: cr } = await supabase.from('change_requests').select('id, proposal_id').eq('share_id', shareId).single()

    if (!cr) throw new Error('Change Request not found')

    // 2. Update CR status
    await supabase.from('change_requests').update({
        status: 'approved'
    }).eq('id', cr.id)

    // 3. Log Event
    await supabase.from('proposal_events').insert({
        proposal_id: cr.proposal_id,
        event: 'change_request_approved',
        meta: { cr_id: cr.id, signed_by: data.email }
    })

    revalidatePath(`/cr/${shareId}`)
    return { success: true }
}
