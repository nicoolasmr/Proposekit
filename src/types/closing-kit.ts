export type ClosingMode = 'proposal' | 'closing'
export type ProposalStatusV2 =
    | 'draft'
    | 'sent'
    | 'viewed'
    | 'approved'
    | 'awaiting_deposit'
    | 'paid'
    | 'kickoff'
    | 'canceled'

export type DepositType = 'percent' | 'fixed'
export type DepositMethod = 'pix_manual' | 'pix_provider'
export type DepositStatus = 'pending' | 'paid' | 'canceled'

export interface FeatureFlag {
    id: string
    user_id: string
    key: string
    enabled: boolean
    created_at: string
}

export interface ProposalAcceptance {
    id: string
    proposal_id: string
    accepted_by_name: string
    accepted_by_email: string
    accepted_by_role?: string
    accepted_at: string
    acceptance_ip?: string
    acceptance_user_agent?: string
}

export interface Deposit {
    id: string
    proposal_id: string
    type: DepositType
    amount: number
    status: DepositStatus
    method: DepositMethod
    pix_payload?: string
    pix_qr_url?: string
    created_at: string
    paid_at?: string
}

export interface ChangeRequest {
    id: string
    user_id: string
    proposal_id: string
    title: string
    reason?: string
    added_scope: any // jsonb
    added_pricing: any // jsonb
    added_terms: any // jsonb
    added_total: number
    status: string
    share_id?: string
    created_at: string
}

export interface FollowupTemplate {
    id: string
    user_id: string
    event_key: string
    message: string
    created_at: string
}
