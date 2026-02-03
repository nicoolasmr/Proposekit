import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const resolvedParams = await params
        const { id } = resolvedParams

        const { data, error } = await supabase.rpc('release_proposal', {
            target_proposal_id: id
        })

        if (error || (data && data.error)) {
            return NextResponse.json({
                error: error?.message || data?.error,
                needsPurchase: data?.needsPurchase
            }, { status: 400 })
        }

        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Release Error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
